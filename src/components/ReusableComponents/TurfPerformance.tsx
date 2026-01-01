import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table } from "lucide-react"
import { TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { TableHeader } from "../ui/table"

interface TurfPerformance {
  turfId: string
  turfName: string
  totalBookings: number
  totalRevenue: number
}

interface TurfPerformanceTableProps {
  data: TurfPerformance[]
}

export const TurfPerformanceTable = ({ data }: TurfPerformanceTableProps) => {
  const sortedData = [...data].sort((a, b) => b.totalRevenue - a.totalRevenue)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Turf Performance</CardTitle>
        <CardDescription>Revenue breakdown by turf location</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Turf Name</TableHead>
              <TableHead className="text-right">Bookings</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Avg per Booking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((turf, index) => (
              <TableRow key={turf.turfId}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {index === 0 && <Badge variant="secondary">Top</Badge>}
                    {turf.turfName}
                  </div>
                </TableCell>
                <TableCell className="text-right">{turf.totalBookings}</TableCell>
                <TableCell className="text-right font-semibold">₹{turf.totalRevenue.toLocaleString()}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  ₹{Math.round(turf.totalRevenue / turf.totalBookings).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
