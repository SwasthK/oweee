import { z } from "zod"

export const createLendSchema = z.object({
  borrowerName: z.string().trim().min(1, "Friend's name is required"),
  borrowerContact: z.string().trim().optional(),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  currency: z.string().default("USD"),
  lentAt: z.coerce.date().default(() => new Date()),
  dueDate: z.coerce.date().optional().nullable(),
  notes: z.string().trim().optional(),
  isPublic: z.boolean().default(false),
})

export type CreateLendInput = z.infer<typeof createLendSchema>

export const updateLendSchema = z.object({
  id: z.string().min(1),
  borrowerName: z.string().trim().min(1, "Friend's name is required").optional(),
  borrowerContact: z.string().trim().optional().nullable(),
  amount: z.coerce.number().positive("Amount must be greater than zero").optional(),
  currency: z.string().optional(),
  dueDate: z.coerce.date().optional().nullable(),
  notes: z.string().trim().optional().nullable(),
  isPublic: z.boolean().optional(),
})

export type UpdateLendInput = z.infer<typeof updateLendSchema>

export const recordPaymentSchema = z.object({
  lendId: z.string().min(1, "Lend ID is required"),
  amount: z.coerce.number().positive("Payment amount must be greater than zero"),
  note: z.string().trim().optional(),
})

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>

export const updateStatusSchema = z.object({
  lendId: z.string().min(1, "Lend ID is required"),
  status: z.enum(["open", "partial", "closed"]),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>

export const toggleShareSchema = z.object({
  lendId: z.string().min(1, "Lend ID is required"),
  isPublic: z.boolean(),
})

export type ToggleShareInput = z.infer<typeof toggleShareSchema>
