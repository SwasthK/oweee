import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ShareLoading() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-8">
        <Card className="w-full border-border/70 bg-card/60 p-6 shadow-sm">
          <CardHeader className="space-y-2 p-0 pb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-4 p-0 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
