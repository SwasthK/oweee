"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle } from "@/components/ui/alert-circle"
import { Spinner } from "@/components/ui/spinner"
import {
  User,
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
} from "@/components/ui/icons"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const isPasswordLongEnough = password.length >= 6
  const doPasswordsMatch =
    confirmPassword.length > 0 && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError("Please enter your name.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)

    try {
      const res = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      })

      if (res.error) {
        setError(res.error.message || "Failed to create account.")
        setLoading(false)
        return
      }

      router.push("/")
      router.refresh()
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full border-0 ring-0 ring-transparent shadow-none bg-card rounded-2xl">
      <CardHeader className="space-y-1 pb-4 text-center sm:text-left">
        <CardTitle className="font-heading text-xl font-bold tracking-tight text-foreground">
          Create Account
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your details to create an account.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-3.5">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50 duration-200">
              <AlertCircle className="size-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium text-foreground">
              Your Name
            </Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="name"
                type="text"
                placeholder="Alex Morgan"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
                }}
                disabled={loading}
                className="pl-9.5 text-xs h-9.5"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-foreground">
              Email Address
            </Label>
            <div className="relative">
              <MailIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="email"
                type="email"
                placeholder="alex@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError(null)
                }}
                disabled={loading}
                className="pl-9.5 text-xs h-9.5"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-foreground"
              >
                Password
              </Label>
              {password.length > 0 && (
                <span
                  className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
                    isPasswordLongEnough
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {isPasswordLongEnough && <CheckIcon className="size-3" />}
                  {isPasswordLongEnough ? "6+ characters" : "Min 6 characters"}
                </span>
              )}
            </div>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (error) setError(null)
                }}
                disabled={loading}
                className="pl-9.5 pr-10 text-xs h-9.5"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-3.5" />
                ) : (
                  <EyeIcon className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-medium text-foreground"
              >
                Confirm Password
              </Label>
              {confirmPassword.length > 0 && (
                <span
                  className={`flex items-center gap-1 text-[10px] font-medium transition-colors ${
                    doPasswordsMatch
                      ? "text-emerald-500"
                      : "text-amber-500 dark:text-amber-400"
                  }`}
                >
                  {doPasswordsMatch && <CheckIcon className="size-3" />}
                  {doPasswordsMatch ? "Passwords match" : "Must match"}
                </span>
              )}
            </div>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  if (error) setError(null)
                }}
                disabled={loading}
                className="pl-9.5 pr-10 text-xs h-9.5"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-2.5 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted hover:text-foreground cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="size-3.5" />
                ) : (
                  <EyeIcon className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-3">
          <Button
            type="submit"
            className="w-full h-10 text-xs font-semibold shadow-xs cursor-pointer"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner size="xs" />
                <span>Creating account...</span>
              </span>
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="mt-1 w-full pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
