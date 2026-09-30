import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getLendById } from "@/lib/actions/lends"
import { Navbar } from "@/components/layout/navbar"
import { LendDetailView } from "@/components/lends/lend-detail-view"
import { formatMoney } from "@/lib/currency"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return {
      title: "Lend Details",
      description: "Sign in to view this lending record.",
    }
  }

  const lend = await getLendById(id)
  return {
    title: lend
      ? `${lend.borrowerName} (${formatMoney(lend.amount, lend.currency)})`
      : "Lend Details",
    description: lend
      ? `Lending record for ${lend.borrowerName} — ${formatMoney(lend.amount, lend.currency)} tracked on Oweee.`
      : "View and manage a lending record on Oweee.",
  }
}

export default async function LendPage({ params }: PageProps) {
  const { id } = await params

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/login")
  }

  const lend = await getLendById(id)

  if (!lend) {
    notFound()
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <LendDetailView lend={lend} />
      </main>
    </div>
  )
}
