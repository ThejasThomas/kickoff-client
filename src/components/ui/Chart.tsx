"use client"

import * as React from "react"
import { Tooltip, ResponsiveContainer } from "recharts"
import type { TooltipProps } from "recharts"
import { cn } from "@/lib/utils"

/* ---------------- Chart Context ---------------- */

type ChartConfig = {
  [key: string]: {
    label: string
    color: string
  }
}

const ChartContext = React.createContext<ChartConfig | null>(null)

export function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

/* ---------------- ChartContainer ---------------- */

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

export function ChartContainer({
  config,
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div
        className={cn("w-full rounded-lg border bg-background p-2", className)}
        {...props}
      >
        {children}
      </div>
    </ChartContext.Provider>
  )
}

/* ---------------- ChartTooltip ---------------- */

export function ChartTooltip(props: TooltipProps<number, string>) {
  return (
    <Tooltip
      cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
      {...props}
    />
  )
}

/* ---------------- ChartTooltipContent ---------------- */

/** Minimal payload shape based on Recharts runtime */
type ChartTooltipItem = {
  dataKey?: string | number
  value?: number | string
}

type ChartTooltipContentProps = {
  active?: boolean
  payload?: ChartTooltipItem[]
  label?: string
}

export function ChartTooltipContent({
  active,
  payload,
  label,
}: ChartTooltipContentProps) {
  const chartConfig = useChart()

  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{label}</p>

      <div className="mt-1 space-y-1">
        {payload.map((item, index) => {
          const key = String(item.dataKey ?? index)
          const config = chartConfig[item.dataKey as string]

          return (
            <div key={key} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: config?.color }}
              />
              <span className="text-muted-foreground">
                {config?.label}
              </span>
              <span className="ml-auto font-medium">
                ₹{item.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- Re-export ---------------- */

export { ResponsiveContainer }
