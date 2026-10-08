import { z } from "zod"

export const UPI_ID_REGEX =
  /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9.-]{1,64}$/

export const upsertPaymentSettingsSchema = z.object({
  upiId: z
    .string()
    .trim()
    .regex(UPI_ID_REGEX, "Enter a valid UPI ID (e.g. name@okbank)"),
  upiName: z
    .string()
    .trim()
    .max(50, "Payee name must be 50 characters or less")
    .optional(),
})

export type UpsertPaymentSettingsInput = z.infer<
  typeof upsertPaymentSettingsSchema
>
