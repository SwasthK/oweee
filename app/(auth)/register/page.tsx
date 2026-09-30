import { redirect } from "next/navigation"

// Registration is handled automatically via Google SSO.
// Redirect any old /register links to the login page.
export default function RegisterPage() {
  redirect("/login")
}
