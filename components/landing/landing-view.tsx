"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, type Variants } from "motion/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CoinStack, CheckCircle, Clock, Bank, CheckIcon, ShareIcon } from "@/components/ui/icons"
import { BuyMeCoffee } from "@/components/ui/buy-me-coffee"
import { Footer } from "@/components/layout/footer"

const easeCurve = [0.16, 1, 0.3, 1] as const

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const itemFadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: easeCurve,
    },
  },
}

const featureContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const featureItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeCurve,
    },
  },
}

export function LandingView() {
  return (
    <div className="relative isolate my-auto flex w-full max-w-4xl flex-col items-center pt-2 pb-10 text-center sm:pt-6">
      {/* Background elements: clean technical grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="landing-grid mask-radial-fade absolute inset-0 text-foreground/[0.04] dark:text-foreground/[0.07]" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex w-full flex-col items-center"
      >
        {/* Mascot + Status Pill */}
        <motion.div variants={itemFadeUp} className="flex flex-col items-center gap-3">
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.12,
              rotate: [0, -6, 6, 0],
              transition: { duration: 0.35, ease: easeCurve },
            }}
            whileTap={{ scale: 0.95 }}
            className="flex size-20 items-center justify-center p-1 cursor-pointer select-none"
          >
            <Image
              src="/logo/oweee-1.png"
              alt="Oweee mascot"
              width={72}
              height={72}
              style={{ width: "auto", height: "auto" }}
              className="object-contain"
              priority
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-3.5 py-1 text-xs font-medium text-foreground shadow-2xs backdrop-blur-xs transition-colors hover:border-border"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>Personal lending, tracked simply</span>
          </motion.div>
        </motion.div>

        {/* Hero Heading & Subtitle */}
        <motion.div variants={itemFadeUp} className="mt-5 max-w-2xl space-y-3">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Never lose track of{" "}
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              what friends owe you.
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Log loans, record partial repayments, maintain an immutable
            audit trail, and share single-item links without requiring
            anyone to register.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemFadeUp}
          className="mt-6 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            transition={{ ease: easeCurve, duration: 0.2 }}
          >
            <Button
              size="lg"
              render={<Link href="/login" />}
              className="h-10 px-5 text-sm font-medium shadow-xs"
            >
              Get started for free
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            transition={{ ease: easeCurve, duration: 0.2 }}
          >
            <BuyMeCoffee className="h-10" />
          </motion.div>
        </motion.div>

        {/* Reassurance Badges */}
        <motion.div
          variants={itemFadeUp}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <CheckIcon className="size-3 text-emerald-500" /> No credit card needed
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="size-3 text-emerald-500" /> Public sharing without sign-up
          </span>
          <span className="hidden sm:inline text-border">•</span>
          <span className="flex items-center gap-1.5">
            <CheckIcon className="size-3 text-emerald-500" /> Free & Open source
          </span>
        </motion.div>

        {/* Aesthetic App Window Mockup */}
        <motion.div
          variants={itemFadeUp}
          className="mt-6 w-full max-w-lg"
        >
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.3, ease: easeCurve }}
            className="overflow-hidden rounded-2xl border border-border/80 bg-card/75 shadow-xl backdrop-blur-md transition-shadow hover:shadow-2xl"
          >
            {/* Window chrome header */}
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-3.5 py-2">
              <div className="flex w-14 items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-500/80 transition-opacity hover:opacity-100" />
                <span className="size-2.5 rounded-full bg-amber-500/80 transition-opacity hover:opacity-100" />
                <span className="size-2.5 rounded-full bg-emerald-500/80 transition-opacity hover:opacity-100" />
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-background/70 px-3 py-0.5 text-[10px] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono">oweee.app/dashboard</span>
              </div>
              <div className="w-14" />
            </div>

            {/* Window inner content */}
            <div className="space-y-3 p-4 text-left">
              {/* Item 1: Active loan with animated partial payment progress */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-border/80 bg-card/90 p-3.5 shadow-2xs transition-colors hover:border-border"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-primary/10 bg-primary/5 text-primary">
                      <Bank className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Weekend Trip Airbnb
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Dave Miller • Due in 5 days
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-foreground">
                      ₹120
                    </div>
                    <Badge
                      variant="outline"
                      className="mt-0.5 h-4.5 px-1.5 text-[10px] text-amber-600 border-amber-500/30 bg-amber-500/10 dark:text-amber-400"
                    >
                      <Clock className="mr-1 size-2.5" /> ₹50 left
                    </Badge>
                  </div>
                </div>

                {/* Partial payment progress bar with smooth animated fill */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Repayment Progress</span>
                    <span className="font-medium text-foreground">₹70 of ₹120 (58%)</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: "58%" }}
                      transition={{ delay: 0.7, duration: 1.1, ease: easeCurve }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Item 2: Settled loan */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl border border-border/80 bg-card/90 p-3.5 shadow-2xs transition-colors hover:border-border"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Concert Tickets
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Sarah Jenkins • Settled in full
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-muted-foreground line-through">
                      ₹65
                    </div>
                    <Badge
                      variant="secondary"
                      className="mt-0.5 h-4.5 px-1.5 text-[10px] text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 border-emerald-500/20"
                    >
                      Settled
                    </Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature Highlights Grid */}
        <motion.div
          variants={featureContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-3.5 sm:grid-cols-3 text-left"
        >
          <motion.div
            variants={featureItemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: easeCurve } }}
            className="group rounded-2xl border border-border/70 bg-card/60 p-4 shadow-2xs backdrop-blur-xs transition-colors hover:border-border hover:bg-card/90"
          >
            <div className="flex size-8 items-center justify-center rounded-lg border border-primary/15 bg-primary/5 text-primary mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]">
              <ShareIcon className="size-4" />
            </div>
            <h3 className="text-xs font-semibold text-foreground">
              Instant Public Links
            </h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Share a dedicated read-only link for any lend. Your friend can see outstanding balance and history without signing up.
            </p>
          </motion.div>

          <motion.div
            variants={featureItemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: easeCurve } }}
            className="group rounded-2xl border border-border/70 bg-card/60 p-4 shadow-2xs backdrop-blur-xs transition-colors hover:border-border hover:bg-card/90"
          >
            <div className="flex size-8 items-center justify-center rounded-lg border border-primary/15 bg-primary/5 text-primary mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[4deg]">
              <Clock className="size-4" />
            </div>
            <h3 className="text-xs font-semibold text-foreground">
              Partial Repayment Log
            </h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Record installments as they happen with dates, amounts, and notes. Maintain an immutable audit timeline for clarity.
            </p>
          </motion.div>

          <motion.div
            variants={featureItemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: easeCurve } }}
            className="group rounded-2xl border border-border/70 bg-card/60 p-4 shadow-2xs backdrop-blur-xs transition-colors hover:border-border hover:bg-card/90"
          >
            <div className="flex size-8 items-center justify-center rounded-lg border border-primary/15 bg-primary/5 text-primary mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]">
              <CoinStack className="size-4" />
            </div>
            <h3 className="text-xs font-semibold text-foreground">
              Multi-Currency Support
            </h3>
            <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
              Seamlessly track in ₹ INR, $ USD, € EUR, £ GBP, and more with instant switching and auto-saved preferences.
            </p>
          </motion.div>
        </motion.div>

        {/* Front Screen Footer */}
        <motion.div
          variants={itemFadeUp}
          className="w-full mt-14"
        >
          <Footer />
        </motion.div>
      </motion.div>
    </div>
  )
}
