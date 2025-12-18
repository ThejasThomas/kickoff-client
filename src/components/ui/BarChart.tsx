"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"



import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./Chart"

interface BookingData {
  date: string
  bookings: number
}

interface BookingsBarChartProps {
  data: BookingData[]
}

export function BookingsBarChart({ data }: BookingsBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Trend</CardTitle>
        <CardDescription>Daily bookings overview</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer
          config={{
            bookings: {
              label: "Bookings",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted"
              />

              <XAxis
                dataKey="date"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />

              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
              />

              <ChartTooltip content={<ChartTooltipContent />} />

              <Bar
                dataKey="bookings"
                fill="hsl(var(--chart-2))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
