import { RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account - Oweee",
  description: "Create an account to start tracking lent money",
}

export default function RegisterPage() {
  return <RegisterForm />
}
