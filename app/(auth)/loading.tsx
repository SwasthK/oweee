import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function AuthLoading() {
  return (
    <Card className="w-full rounded-2xl border-0 bg-card shadow-none ring-0 ring-transparent">
      <CardHeader className="space-y-1.5 pb-4">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="h-3.5 w-60" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-9.5 w-full rounded-4xl" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-9.5 w-full rounded-4xl" />
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-4xl" />
        <div className="flex justify-center pt-2">
          <Skeleton className="h-3.5 w-44" />
        </div>
      </CardContent>
    </Card>
  )
}
