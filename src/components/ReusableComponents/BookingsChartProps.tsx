import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ResponsiveContainer } from "../ui/Chart"
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

interface BookingsChartProps {
  data: Array<{ date: string; bookings: number }>
}

export const BookingsChart = ({ data }: BookingsChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings Trend</CardTitle>
        <CardDescription>Daily bookings over the selected period</CardDescription>
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
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
                domain={[0, "dataMax + 2"]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              />

              <Tooltip />

              <Bar
                dataKey="bookings"
                fill="hsl(var(--chart-2))"
                radius={[6, 6, 0, 0]}
                barSize={32}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
