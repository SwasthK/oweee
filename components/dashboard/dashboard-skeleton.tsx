import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Header Row Skeleton */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-9 w-28 rounded-4xl" />
      </div>

      {/* Metrics Unified Overview Skeleton */}
      <Card className="border-border/60 bg-card/40 p-5">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          {/* Left: 3 stats + progress bar */}
          <div className="space-y-4 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="size-3.5 rounded-full" />
                    <Skeleton className="h-3.5 w-16 rounded" />
                  </div>
                  <Skeleton className="h-7 w-28 rounded-md" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-36 rounded" />
                <Skeleton className="h-3 w-20 rounded" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </div>

          {/* Right: Inset Chart Box */}
          <div className="flex flex-col items-center justify-center border-t border-border/50 pt-4 lg:col-span-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
            <div className="w-full rounded-xl border border-border/40 bg-muted/20 p-3.5 flex flex-col items-center justify-between space-y-3">
              <div className="w-full flex items-center justify-between">
                <Skeleton className="h-3.5 w-24 rounded" />
                <Skeleton className="size-3.5 rounded-full" />
              </div>
              <div className="size-[68px] rounded-full border-[7px] border-muted/40 animate-pulse" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          </div>
        </div>
      </Card>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-full sm:w-56 rounded-4xl" />
      </div>

      {/* Lend Cards Skeleton */}
      <div className="space-y-3 pt-1">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/60 bg-card/40 p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
              <div className="flex flex-col items-end space-y-1.5">
                <Skeleton className="h-5 w-20 rounded" />
                <Skeleton className="h-4 w-14 rounded-full" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-28 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <Skeleton className="h-3 w-36 rounded" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-20 rounded-md" />
                <Skeleton className="size-7 rounded-md" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
