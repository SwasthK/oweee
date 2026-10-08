import { headers } from "next/headers"
import { auth } from "@/lib/auth"

export async function getAuthUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    throw new Error("You must be logged in to perform this action.")
  }

  return session.user
}
