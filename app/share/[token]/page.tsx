import Link from "next/link"
import { Metadata } from "next"
import { getPublicLendByToken } from "@/lib/actions/public-lend"
import { PublicLendView } from "@/components/share/public-lend-view"
import { Button } from "@/components/ui/button"
import { CoinStack } from "@/components/ui/icons"

interface PageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { token } = await params
  const lend = await getPublicLendByToken(token)

  if (!lend) {
    return {
      title: "Shared Lend Not Found - Oweee",
      description:
        "The shared lend record could not be found or is no longer public.",
    }
  }

  const remaining = Math.max(0, Number(lend.amount) - Number(lend.paidAmount))

  return {
    title: `Loan to ${lend.borrowerName} ($${remaining.toFixed(2)} remaining) - Oweee`,
    description: `Transparent lending record tracked on Oweee. Total: $${Number(lend.amount).toFixed(2)}`,
  }
}

export default async function PublicSharePage({ params }: PageProps) {
  const { token } = await params
  const lend = await getPublicLendByToken(token)

  if (!lend) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 text-center">
        <div className="w-full max-w-sm space-y-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border bg-muted">
            <CoinStack className="size-6 text-muted-foreground" />
          </div>

          <div className="space-y-1">
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Link Not Found
            </h1>
            <p className="text-xs leading-relaxed text-muted-foreground">
              This lend record does not exist, has been deleted, or public
              sharing has been disabled by the owner.
            </p>
          </div>

          <div className="pt-2">
            <Button size="sm" render={<Link href="/" />} className="text-xs">
              Go to Oweee Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <main className="flex flex-1 flex-col items-center">
        <PublicLendView lend={lend} />
      </main>
    </div>
  )
}
