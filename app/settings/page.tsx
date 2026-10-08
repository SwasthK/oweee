import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { Metadata } from "next"
import { auth } from "@/lib/auth"
import { getPaymentSettings } from "@/lib/actions/payment-settings"
import { Navbar } from "@/components/layout/navbar"
import { PaymentSettingsForm } from "@/components/settings/payment-settings-form"

export const metadata: Metadata = {
  title: "Payment Methods",
  description:
    "Add payment methods, like UPI, so friends can repay you straight from shared lend links.",
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/login")
  }

  const settings = await getPaymentSettings()

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <PaymentSettingsForm
          initialUpiId={settings?.upiId ?? ""}
          initialUpiName={settings?.upiName ?? ""}
          defaultName={session.user.name}
        />
      </main>
    </div>
  )
}
