"use client"

import * as React from "react"
import * as DuoIcons from "@duo-icons/react"

// Client-safe re-exports for DuoIcons
export const CoinStack = (props: React.ComponentProps<"svg">) => <DuoIcons.CoinStack {...(props as any)} />
export const Bank = (props: React.ComponentProps<"svg">) => <DuoIcons.Bank {...(props as any)} />
export const CheckCircle = (props: React.ComponentProps<"svg">) => <DuoIcons.CheckCircle {...(props as any)} />
export const Clock = (props: React.ComponentProps<"svg">) => <DuoIcons.Clock {...(props as any)} />
export const AlertTriangle = (props: React.ComponentProps<"svg">) => <DuoIcons.AlertTriangle {...(props as any)} />
export const Sun = (props: React.ComponentProps<"svg">) => <DuoIcons.Sun {...(props as any)} />
export const Moon2 = (props: React.ComponentProps<"svg">) => <DuoIcons.Moon2 {...(props as any)} />
export const User = (props: React.ComponentProps<"svg">) => <DuoIcons.User {...(props as any)} />
export const AddCircle = (props: React.ComponentProps<"svg">) => <DuoIcons.AddCircle {...(props as any)} />
export const CreditCard = (props: React.ComponentProps<"svg">) => <DuoIcons.CreditCard {...(props as any)} />
export const Clipboard = (props: React.ComponentProps<"svg">) => <DuoIcons.Clipboard {...(props as any)} />
export const Calendar = (props: React.ComponentProps<"svg">) => <DuoIcons.Calendar {...(props as any)} />
export const UploadFile = (props: React.ComponentProps<"svg">) => <DuoIcons.UploadFile {...(props as any)} />
export const Info = (props: React.ComponentProps<"svg">) => <DuoIcons.Info {...(props as any)} />
export const Settings = (props: React.ComponentProps<"svg">) => <DuoIcons.Settings {...(props as any)} />

// Additional clean SVG icons for actions
export function SearchIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function TrashIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  )
}

export function ShareIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  )
}

export function CopyIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

export function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function ExternalLinkIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}
