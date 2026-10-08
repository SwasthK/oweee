"use client"

import * as React from "react"
import { signIn } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AlertCircle } from "@/components/ui/alert-circle"
import { Spinner } from "@/components/ui/spinner"
import { GoogleIcon } from "@/components/ui/icons"

export function LoginForm() {
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleGoogleSignIn = async () => {
    setError(null)
    setLoading(true)

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/",
      })
    } catch {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full rounded-2xl border-0 bg-card shadow-none ring-0 ring-transparent">
      <CardHeader className="space-y-1 pb-4 text-center">
        <CardTitle className="font-heading text-xl font-bold tracking-tight text-foreground">
          Welcome to Oweee
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Sign in with your Google account to continue.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="flex animate-in items-center gap-2.5 rounded-xl border border-destructive/25 bg-destructive/10 p-3 text-xs text-destructive duration-200 fade-in-50">
            <AlertCircle className="size-4 shrink-0 text-destructive" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="h-10 w-full cursor-pointer gap-2.5 text-xs font-semibold shadow-xs"
          disabled={loading}
          onClick={handleGoogleSignIn}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Spinner size="xs" />
              <span>Redirecting...</span>
            </span>
          ) : (
            <>
              <GoogleIcon className="size-4" />
              Continue with Google
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
