"use client"

import { Component, type ErrorInfo, type ReactNode, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Bug, RefreshCw, Copy, ChevronDown, ChevronRight, Home } from "lucide-react"
import { Alert, AlertTitle } from "@mui/material"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { AlertDescription } from "@/components/ui/alert "

// Types
type FallbackRenderer = (error: Error, reset: () => void) => ReactNode

export type ErrorBoundaryProps = {
  children: ReactNode
  /**
   * Custom fallback UI. If a function, it's called with (error, reset).
   */
  fallback?: ReactNode | FallbackRenderer
  /**
   * Optional callback when an error is caught.
   */
  onError?: (error: Error, info: ErrorInfo) => void
  /**
   * Optional callback when user clicks "Try again".
   */
  onReset?: () => void
}

type ErrorBoundaryState = {
  hasError: boolean
  error?: Error
  info?: ErrorInfo
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (this.props.onError) this.props.onError(error, info)
    console.error("[ErrorBoundary] Caught error:", error, info)
    this.setState({ info })
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, info: undefined })
    if (this.props.onReset) this.props.onReset()
  }

  render() {
    const { hasError, error, info } = this.state
    const { children, fallback } = this.props

    if (!hasError || !error) return children

    if (typeof fallback === "function") {
      return (fallback as FallbackRenderer)(error, this.reset)
    }

    if (fallback) {
      return fallback
    }

    return <DefaultErrorFallback error={error} info={info} onReset={this.reset} />
  }
}

function DefaultErrorFallback({
  error,
  info,
  onReset,
}: {
  error: Error
  info?: ErrorInfo
  onReset: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)
  const [copied, setCopied] = useState(false)

  const details = useMemo(() => {
    const componentStack = info?.componentStack || ""
    const stack = error.stack || error.message || String(error)
    return `Message: ${error.message}\n\nStack:\n${stack}\n\nComponent stack:\n${componentStack}`
  }, [error, info])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(details)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // eslint-disable-next-line no-console
      console.warn("[ErrorBoundary] Failed to copy error details")
    }
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-muted p-2">
              <Bug className="size-5 text-foreground" aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-pretty">Something went wrong</CardTitle>
              <CardDescription className="text-pretty">
                An unexpected error occurred while rendering this section.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert role="alert" aria-live="polite">
            <AlertTitle className="flex items-center gap-2">
              Error
              <span className="truncate font-normal text-muted-foreground max-w-[22ch]" title={error.message}>
                {error.message}
              </span>
            </AlertTitle>
            <AlertDescription className="text-muted-foreground">
              You can try again. If the problem persists, copy the details and share them with support.
            </AlertDescription>
          </Alert>

          <div>
            <button
              type="button"
              className="flex w-full items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setShowDetails((s) => !s)}
              aria-expanded={showDetails}
              aria-controls="error-details"
            >
              {showDetails ? (
                <ChevronDown className="size-4" aria-hidden="true" />
              ) : (
                <ChevronRight className="size-4" aria-hidden="true" />
              )}
              Technical details
            </button>
            {showDetails && (
              <>
                <Separator className="my-3" />
                <pre
                  id="error-details"
                  className="max-h-56 overflow-auto rounded-md bg-muted p-3 text-xs leading-5 text-muted-foreground"
                >
                  {details}
                </pre>
              </>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={onReset} className="gap-2">
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </Button>
            <Button variant="secondary" onClick={copy} className="gap-2">
              <Copy className="size-4" aria-hidden="true" />
              {copied ? "Copied" : "Copy details"}
            </Button>
            <Button variant="ghost" asChild className="gap-2">
              <a href="/" aria-label="Go to homepage">
                <Home className="size-4" aria-hidden="true" />
                Home
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

// // Optional HOC helper
// export function withErrorBoundary<P>(
//   ComponentToWrap: React.ComponentType<P>,
//   boundaryProps?: Omit<ErrorBoundaryProps, "children">,
// ) {
//   return function WrappedWithBoundary(props: P) {
//     return (
//       <ErrorBoundary {...boundaryProps}>
//         <ComponentToWrap {...props} />
//       </ErrorBoundary>
//     )
//   }
// }
