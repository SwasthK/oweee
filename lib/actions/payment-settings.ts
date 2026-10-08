"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/db"
import { paymentSettings } from "@/db/schema"
import { getAuthUser } from "@/lib/auth-user"
import {
  upsertPaymentSettingsSchema,
  type UpsertPaymentSettingsInput,
} from "@/lib/validations/payment.schema"
import { eq } from "drizzle-orm"

export async function getPaymentSettings() {
  const user = await getAuthUser()

  const [settings] = await db
    .select()
    .from(paymentSettings)
    .where(eq(paymentSettings.userId, user.id))

  return settings ?? null
}

export async function upsertPaymentSettingsAction(
  rawInput: UpsertPaymentSettingsInput
) {
  const user = await getAuthUser()
  const data = upsertPaymentSettingsSchema.parse(rawInput)

  const values = {
    upiId: data.upiId,
    upiName: data.upiName || null,
    updatedAt: new Date(),
  }

  const [settings] = await db
    .insert(paymentSettings)
    .values({ userId: user.id, ...values })
    .onConflictDoUpdate({ target: paymentSettings.userId, set: values })
    .returning()

  revalidatePath("/settings")
  return { success: true, settings }
}

export async function deletePaymentSettingsAction() {
  const user = await getAuthUser()

  await db.delete(paymentSettings).where(eq(paymentSettings.userId, user.id))

  revalidatePath("/settings")
  return { success: true }
}
