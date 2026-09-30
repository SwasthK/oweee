import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in with Google to start tracking money you've lent to friends. Free, private, and effortless.",
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
