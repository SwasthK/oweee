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

      {/* Metrics Stat Cards Skeleton */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-border/60 bg-card/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="size-4 rounded-full" />
            </div>
            <Skeleton className="h-7 w-28 rounded-md" />
            <Skeleton className="h-3 w-24 rounded" />
          </Card>
        ))}
      </div>

      {/* Filter Bar Skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <Skeleton className="h-7 w-16 rounded-full" />
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
