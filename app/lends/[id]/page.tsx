import { notFound, redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getLendById } from "@/lib/actions/lends"
import { Navbar } from "@/components/layout/navbar"
import { LendDetailView } from "@/components/lends/lend-detail-view"
import { Metadata } from "next"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return { title: "Lend Details - Oweee" }
  }

  const lend = await getLendById(id)
  return {
    title: lend ? `${lend.borrowerName} ($${Number(lend.amount).toFixed(2)}) - Oweee` : "Lend Details",
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
    <div className="min-h-svh bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <LendDetailView lend={lend} />
      </main>
    </div>
  )
}
