import { RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Create Account - Oweee",
  description: "Create an account to start tracking lent money",
}

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user) {
    redirect("/")
  }

  return <RegisterForm />
}
