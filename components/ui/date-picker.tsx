"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  date?: Date | null
  setDate: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  className?: string
  id?: string
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Pick a date",
  disabled = false,
  clearable = false,
  className,
  id,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            id={id}
            type="button"
            disabled={disabled}
            className={cn(
              "flex h-9 w-full items-center justify-between rounded-4xl border border-input bg-input/30 px-3 py-1 text-xs outline-none cursor-pointer transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-input/50",
              !date && "text-muted-foreground",
              className
            )}
          >
            <span className="flex items-center gap-2 truncate">
              <CalendarIcon className="size-3.5 shrink-0 text-muted-foreground" />
              <span>{date ? format(date, "PPP") : placeholder}</span>
            </span>
            {clearable && date && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation()
                  setDate(undefined)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation()
                    setDate(undefined)
                  }
                }}
                className="ml-1 flex size-4 items-center justify-center rounded-full text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                title="Clear date"
              >
                ×
              </span>
            )}
          </button>
        }
      />
      <PopoverContent className="w-auto p-0 border-border/80 shadow-xl" align="start">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(selectedDate) => {
            setDate(selectedDate)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}
