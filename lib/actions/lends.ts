"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { lends } from "@/db/schema"
import { auth } from "@/lib/auth"
import { recordAuditLog, getAuditLogsForLend } from "./audit"
import {
  createLendSchema,
  updateLendSchema,
  recordPaymentSchema,
  updateStatusSchema,
  toggleShareSchema,
  type CreateLendInput,
  type UpdateLendInput,
  type RecordPaymentInput,
  type UpdateStatusInput,
  type ToggleShareInput,
} from "@/lib/validations/lend.schema"
import {
  type Lend,
  type LendMetrics,
  type CurrencyMetric,
  type LendWithAuditLogs,
} from "@/types/lend"
import { DEFAULT_CURRENCY } from "@/lib/currency"
import { and, desc, eq, ilike, isNull, or } from "drizzle-orm"

async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error("You must be logged in to perform this action.")
  }

  return session.user
}

export async function getLends(filters?: {
  status?: string
  search?: string
}): Promise<Lend[]> {
  const user = await getAuthUser()

  const conditions = [eq(lends.userId, user.id), isNull(lends.deletedAt)]

  if (filters?.status && filters.status !== "all") {
    conditions.push(
      eq(lends.status, filters.status as "open" | "partial" | "closed")
    )
  }

  if (filters?.search && filters.search.trim().length > 0) {
    const term = `%${filters.search.trim()}%`
    conditions.push(
      or(ilike(lends.borrowerName, term), ilike(lends.notes, term))!
    )
  }

  return await db
    .select()
    .from(lends)
    .where(and(...conditions))
    .orderBy(desc(lends.lentAt), desc(lends.createdAt))
}

export async function getLendMetrics(): Promise<LendMetrics> {
  const user = await getAuthUser()

  const allLends = await db
    .select()
    .from(lends)
    .where(and(eq(lends.userId, user.id), isNull(lends.deletedAt)))

  let activeCount = 0
  let closedCount = 0
  const byCurrency: Record<string, CurrencyMetric> = {}

  for (const item of allLends) {
    const amount = Number(item.amount) || 0
    const paid = Number(item.paidAmount) || 0
    const curr = (item.currency || DEFAULT_CURRENCY).toUpperCase()

    if (!byCurrency[curr]) {
      byCurrency[curr] = {
        currency: curr,
        totalLent: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        activeCount: 0,
        closedCount: 0,
      }
    }

    byCurrency[curr].totalLent += amount
    byCurrency[curr].totalPaid += paid
    byCurrency[curr].totalOutstanding = Math.max(
      0,
      byCurrency[curr].totalLent - byCurrency[curr].totalPaid
    )

    if (item.status === "closed") {
      byCurrency[curr].closedCount++
      closedCount++
    } else {
      byCurrency[curr].activeCount++
      activeCount++
    }
  }

  const currencies = Object.keys(byCurrency)
  const primaryCurrency = currencies[0] || DEFAULT_CURRENCY
  const primaryMetric = byCurrency[primaryCurrency] || {
    currency: primaryCurrency,
    totalLent: 0,
    totalPaid: 0,
    totalOutstanding: 0,
    activeCount: 0,
    closedCount: 0,
  }

  return {
    totalLent: primaryMetric.totalLent,
    totalPaid: primaryMetric.totalPaid,
    totalOutstanding: primaryMetric.totalOutstanding,
    activeCount,
    closedCount,
    byCurrency,
    currencies,
    primaryCurrency,
  }
}

export async function getLendById(
  id: string
): Promise<LendWithAuditLogs | null> {
  const user = await getAuthUser()

  const [lend] = await db
    .select()
    .from(lends)
    .where(
      and(eq(lends.id, id), eq(lends.userId, user.id), isNull(lends.deletedAt))
    )

  if (!lend) {
    return null
  }

  const auditLogs = await getAuditLogsForLend(lend.id)

  return {
    ...lend,
    auditLogs,
  }
}

export async function createLendAction(rawInput: CreateLendInput) {
  const user = await getAuthUser()
  const data = createLendSchema.parse(rawInput)

  const [newLend] = await db
    .insert(lends)
    .values({
      userId: user.id,
      borrowerName: data.borrowerName,
      borrowerContact: data.borrowerContact || null,
      amount: data.amount.toFixed(2),
      paidAmount: "0.00",
      currency: data.currency,
      status: "open",
      lentAt: data.lentAt,
      dueDate: data.dueDate || null,
      notes: data.notes || null,
      isPublic: data.isPublic,
    })
    .returning()

  await recordAuditLog({
    lendId: newLend.id,
    userId: user.id,
    action: "created",
    details: {
      amount: data.amount,
      borrowerName: data.borrowerName,
      currency: data.currency,
      status: "open",
    },
  })

  revalidatePath("/")
  return { success: true, lend: newLend }
}

export async function updateLendAction(rawInput: UpdateLendInput) {
  const user = await getAuthUser()
  const data = updateLendSchema.parse(rawInput)

  const [existing] = await db
    .select()
    .from(lends)
    .where(
      and(
        eq(lends.id, data.id),
        eq(lends.userId, user.id),
        isNull(lends.deletedAt)
      )
    )

  if (!existing) {
    throw new Error("Lend not found")
  }

  const updateValues: Record<string, unknown> = {
    updatedAt: new Date(),
  }

  if (data.borrowerName !== undefined)
    updateValues.borrowerName = data.borrowerName
  if (data.borrowerContact !== undefined)
    updateValues.borrowerContact = data.borrowerContact
  if (data.amount !== undefined) updateValues.amount = data.amount.toFixed(2)
  if (data.currency !== undefined) updateValues.currency = data.currency
  if (data.dueDate !== undefined) updateValues.dueDate = data.dueDate
  if (data.notes !== undefined) updateValues.notes = data.notes
  if (data.isPublic !== undefined) updateValues.isPublic = data.isPublic

  const [updated] = await db
    .update(lends)
    .set(updateValues)
    .where(eq(lends.id, data.id))
    .returning()

  await recordAuditLog({
    lendId: updated.id,
    userId: user.id,
    action: "updated",
    details: {
      changes: data,
    },
  })

  revalidatePath("/")
  return { success: true, lend: updated }
}

export async function recordPaymentAction(rawInput: RecordPaymentInput) {
  const user = await getAuthUser()
  const data = recordPaymentSchema.parse(rawInput)

  const [existing] = await db
    .select()
    .from(lends)
    .where(
      and(
        eq(lends.id, data.lendId),
        eq(lends.userId, user.id),
        isNull(lends.deletedAt)
      )
    )

  if (!existing) {
    throw new Error("Lend not found")
  }

  const currentPaid = Number(existing.paidAmount) || 0
  const totalAmount = Number(existing.amount) || 0
  const paymentAmount = Number(data.amount) || 0

  const newPaid = currentPaid + paymentAmount
  let newStatus = existing.status

  // Auto-transition status based on payments
  if (newPaid >= totalAmount) {
    newStatus = "closed"
  } else if (newPaid > 0) {
    newStatus = "partial"
  }

  const [updated] = await db
    .update(lends)
    .set({
      paidAmount: newPaid.toFixed(2),
      status: newStatus,
      updatedAt: new Date(),
    })
    .where(eq(lends.id, existing.id))
    .returning()

  await recordAuditLog({
    lendId: existing.id,
    userId: user.id,
    action: "payment_recorded",
    details: {
      paymentAmount,
      previousPaid: currentPaid,
      newPaid,
      totalAmount,
      previousStatus: existing.status,
      newStatus,
      note: data.note || null,
    },
  })

  revalidatePath("/")
  return { success: true, lend: updated }
}

export async function updateLendStatusAction(rawInput: UpdateStatusInput) {
  const user = await getAuthUser()
  const data = updateStatusSchema.parse(rawInput)

  const [existing] = await db
    .select()
    .from(lends)
    .where(
      and(
        eq(lends.id, data.lendId),
        eq(lends.userId, user.id),
        isNull(lends.deletedAt)
      )
    )

  if (!existing) {
    throw new Error("Lend not found")
  }

  const [updated] = await db
    .update(lends)
    .set({
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(lends.id, existing.id))
    .returning()

  await recordAuditLog({
    lendId: existing.id,
    userId: user.id,
    action: "status_changed",
    details: {
      previousStatus: existing.status,
      newStatus: data.status,
    },
  })

  revalidatePath("/")
  return { success: true, lend: updated }
}

export async function toggleShareAction(rawInput: ToggleShareInput) {
  const user = await getAuthUser()
  const data = toggleShareSchema.parse(rawInput)

  const [existing] = await db
    .select()
    .from(lends)
    .where(
      and(
        eq(lends.id, data.lendId),
        eq(lends.userId, user.id),
        isNull(lends.deletedAt)
      )
    )

  if (!existing) {
    throw new Error("Lend not found")
  }

  const [updated] = await db
    .update(lends)
    .set({
      isPublic: data.isPublic,
      updatedAt: new Date(),
    })
    .where(eq(lends.id, existing.id))
    .returning()

  await recordAuditLog({
    lendId: existing.id,
    userId: user.id,
    action: "share_toggled",
    details: {
      isPublic: data.isPublic,
      shareToken: existing.shareToken,
    },
  })

  revalidatePath("/")
  return { success: true, lend: updated }
}

export async function deleteLendAction(lendId: string) {
  const user = await getAuthUser()

  const [existing] = await db
    .select()
    .from(lends)
    .where(
      and(
        eq(lends.id, lendId),
        eq(lends.userId, user.id),
        isNull(lends.deletedAt)
      )
    )

  if (!existing) {
    throw new Error("Lend not found")
  }

  // Soft delete
  const [deleted] = await db
    .update(lends)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(lends.id, existing.id))
    .returning()

  await recordAuditLog({
    lendId: existing.id,
    userId: user.id,
    action: "deleted",
    details: {
      borrowerName: existing.borrowerName,
      amount: existing.amount,
      paidAmount: existing.paidAmount,
    },
  })

  revalidatePath("/")
  return { success: true, lend: deleted }
}
