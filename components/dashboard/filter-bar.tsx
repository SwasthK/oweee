"use client"

import { Input } from "@/components/ui/input"
import { SearchIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { getCurrencySymbol } from "@/lib/currency"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type StatusFilter = "open" | "closed" | "all"

interface FilterBarProps {
  status: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  search: string
  onSearchChange: (search: string) => void
  counts: {
    open: number
    closed: number
    all: number
  }
  currency?: string
  onCurrencyChange?: (currency: string) => void
  availableCurrencies?: string[]
}

export function FilterBar({
  status,
  onStatusChange,
  search,
  onSearchChange,
  counts,
  currency = "all",
  onCurrencyChange,
  availableCurrencies,
}: FilterBarProps) {
  const filterOptions: { label: string; value: StatusFilter; count: number }[] =
    [
      { label: "Open", value: "open", count: counts.open },
      { label: "Settled", value: "closed", count: counts.closed },
      { label: "All", value: "all", count: counts.all },
    ]

  const hasMultipleCurrencies =
    availableCurrencies && availableCurrencies.length > 1

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative max-w-xs min-w-0 flex-1">
        <Input
          placeholder="Search by friend or notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "h-8.5 rounded-lg border-border/70 bg-input/20 pl-8 text-xs",
            search ? "pr-8" : ""
          )}
        />
        <SearchIcon className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute top-1/2 right-2 flex size-4.5 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {/* Currency Filter Dropdown (compact, never grows horizontally) */}
        {hasMultipleCurrencies && (
          <Select
            value={currency}
            onValueChange={(val) => val && onCurrencyChange?.(val)}
          >
            <SelectTrigger
              size="sm"
              className="h-8.5 rounded-lg border-border/60 bg-muted/40 px-2.5 text-xs font-medium text-foreground hover:bg-muted/60"
            >
              <SelectValue placeholder="All Currencies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Currencies</SelectItem>
              {availableCurrencies.map((c) => (
                <SelectItem key={c} value={c}>
                  {getCurrencySymbol(c)} {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Status Filter Pills with stable sizing and persistent borders */}
        <div className="flex shrink-0 items-center gap-1 overflow-x-auto rounded-lg border border-border/50 bg-muted/40 p-1">
          {filterOptions.map((opt) => {
            const isActive = status === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onStatusChange(opt.value)}
                className={cn(
                  "flex h-7 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium whitespace-nowrap transition-colors select-none",
                  isActive
                    ? "border-border/60 bg-background text-foreground shadow-2xs"
                    : "border-transparent text-muted-foreground hover:bg-background/40 hover:text-foreground"
                )}
              >
                <span>{opt.label}</span>
                <span
                  className={cn(
                    "rounded-full px-1 text-[10px]",
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
    </div>
  )
}
