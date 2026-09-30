"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({
  className,
  showText = true,
  size = "md",
}: {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}) {
  const sizeMap = {
    sm: { box: "size-7", img: 24, text: "text-xs" },
    md: { box: "size-8.5", img: 30, text: "text-sm" },
    lg: { box: "size-11", img: 40, text: "text-base" },
  }
  const current = sizeMap[size]

  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 select-none transition-opacity hover:opacity-90",
        className
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden p-0.5 transition-all group-hover:scale-105 group-hover:ring-emerald-500/30 hover:rotate-6 hover:cursor-pointer",
          current.box
        )}
      >
        <Image
          src="/logo/oweee.png"
          alt="Oweee"
          width={current.img}
          height={current.img}
          style={{ width: "auto", height: "auto" }}
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <span
          className={cn(
            "font-heading font-bold tracking-tight text-foreground",
            current.text
          )}
        >
          Oweee
        </span>
      )}
    </Link>
  )
}
