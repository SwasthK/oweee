"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export type StatusFilter = "all" | "open" | "partial" | "closed"

interface FilterBarProps {
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  search: string
  onSearchChange: (search: string) => void
  counts: {
    all: number
    open: number
    partial: number
    closed: number
  }
}

export function FilterBar({
  status,
  onStatusChange,
  search,
  onSearchChange,
  counts,
}: FilterBarProps) {
  const filterOptions: { label: string; value: StatusFilter; count: number }[] =
    [
      { label: "All", value: "all", count: counts.all },
      { label: "Open", value: "open", count: counts.open },
      { label: "Partial", value: "partial", count: counts.partial },
      { label: "Settled", value: "closed", count: counts.closed },
    ]

  return (
    <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
      {/* Search Input */}
      <div className="relative max-w-sm flex-1">
        <Input
          placeholder="Search by friend or notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8.5 rounded-lg border-border/70 bg-input/20 pl-8 text-xs"
        />
        <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1 self-start overflow-x-auto rounded-lg border border-border/50 bg-muted/40 p-1 sm:self-auto">
        {filterOptions.map((opt) => {
          const isActive = status === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-all select-none",
                isActive
                  ? "border border-border/60 bg-background text-foreground shadow-2xs"
                  : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
              )}
            >
              <span>{opt.label}</span>
              <span
                className={cn(
                  "py-0.2 rounded-full px-1 text-[10px]",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground/80"
                )}
              >
                {opt.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
