"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "@/lib/auth-client"
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
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/ui/icons"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await signIn.email({
        email: email.trim(),
        password,
      })

      if (res.error) {
        setError(res.error.message || "Invalid email or password.")
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
          Sign In
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Enter your email and password to access your account.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-50 duration-200">
              <AlertCircle className="size-4 shrink-0 text-destructive" />
              <span>{error}</span>
            </div>
          )}

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
                placeholder="name@example.com"
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
            </div>
            <div className="relative">
              <LockIcon className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
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
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </Button>

          <div className="mt-1 w-full pt-2 text-center">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
