import { Navbar } from "@/components/layout/navbar"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 flex-col items-center px-4 py-8 sm:px-6 sm:py-10">
        <DashboardSkeleton />
      </main>
    </div>
  )
}
