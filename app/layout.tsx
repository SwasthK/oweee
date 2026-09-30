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

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://oweee.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Oweee — Track What Friends Owe You",
    template: "%s · Oweee",
  },
  description:
    "A free, open-source personal lending tracker. Log loans, record partial repayments, keep an immutable audit trail, and share transparent payment links — no sign-up required for viewers.",
  keywords: [
    "lending tracker",
    "loan tracker",
    "money tracker",
    "debt tracker",
    "split expenses",
    "track money lent",
    "personal finance",
    "IOU tracker",
    "friends owe me",
    "open source",
  ],
  authors: [{ name: "Swasthik", url: "https://swasthk.space" }],
  creator: "Swasthik",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Oweee",
    title: "Oweee — Track What Friends Owe You",
    description:
      "Free, open-source lending tracker with immutable audit trails and public share links.",
    images: [
      {
        url: "/logo/oweee-1.png",
        width: 512,
        height: 512,
        alt: "Oweee — Personal Lending Tracker",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Oweee — Track What Friends Owe You",
    description:
      "Free, open-source lending tracker with immutable audit trails and public share links.",
    images: ["/logo/oweee-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
