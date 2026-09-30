import { Geist_Mono, Figtree } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import { Metadata } from "next"

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Oweee - Personal Lending Tracker",
  description: "Track money lent to friends with immutable activity logs, partial payments, and public links.",
  icons: {
    icon: "/logo/oweee-1.png",
    shortcut: "/logo/oweee-1.png",
    apple: "/logo/oweee-1.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <body>
        <ThemeProvider>
          <TooltipProvider delay={150}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
