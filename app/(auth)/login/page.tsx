import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Sign In - Oweee",
  description: "Sign in to track your money lent to friends",
}

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session?.user) {
    redirect("/")
  }

  return <LoginForm />
}
