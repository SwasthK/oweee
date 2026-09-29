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
  const filterOptions: { label: string; value: StatusFilter; count: number }[] = [
    { label: "All", value: "all", count: counts.all },
    { label: "Open", value: "open", count: counts.open },
    { label: "Partial", value: "partial", count: counts.partial },
    { label: "Settled", value: "closed", count: counts.closed },
  ]

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <Input
          placeholder="Search by friend or notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="text-xs pl-8 h-8.5 rounded-lg bg-input/20 border-border/70"
        />
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/40 border border-border/50 self-start sm:self-auto overflow-x-auto">
        {filterOptions.map((opt) => {
          const isActive = status === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all select-none whitespace-nowrap",
                isActive
                  ? "bg-background text-foreground shadow-2xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              <span>{opt.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1 py-0.2 rounded-full",
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
