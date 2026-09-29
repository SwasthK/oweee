import { LoginForm } from "@/components/auth/login-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In - Oweee",
  description: "Sign in to track your money lent to friends",
}

export default function LoginPage() {
  return <LoginForm />
}
