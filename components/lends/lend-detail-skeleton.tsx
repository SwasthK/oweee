import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export function LendDetailSkeleton() {
  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28 rounded-md" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      </div>

      {/* Title & Status */}
      <Card className="border-border/70 bg-card/60 p-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-11 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 rounded" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Summary */}
        <div className="space-y-4 md:col-span-1">
          <Card className="border-border/70 bg-card/60 p-4 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-8 w-32 rounded" />
            </div>
            <div className="space-y-2 border-t border-border/50 pt-3">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-20 rounded" />
                <Skeleton className="h-3.5 w-16 rounded" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </Card>
        </div>

        {/* Right Column: Activity Trail */}
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
          </div>
          <Card className="border-border/70 bg-card/60 p-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="size-6 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-32 rounded" />
                    <Skeleton className="h-3 w-20 rounded" />
                  </div>
                  <Skeleton className="h-3 w-48 rounded" />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
