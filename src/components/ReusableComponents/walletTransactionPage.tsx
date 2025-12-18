import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  _id: string
  booking: {
    user: {
      fullName: string
    } | null
  } | null
  type: "CREDIT" | "DEBIT"
  turf: {
    turfName: string
  } | null
  amount: number
  transactionDate: string
}

interface WalletTransactionsProps {
  transactions: Transaction[]
  onViewAll?: () => void
}

export const WalletTransactions = ({ transactions, onViewAll }: WalletTransactionsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest wallet activity</CardDescription>
          </div>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx) => (
                <TableRow key={tx._id}>
                  <TableCell className="font-medium">
                    {tx.booking?.user?.fullName || "—"}
                  </TableCell>

                  <TableCell>
                    <Badge variant={tx.type === "CREDIT" ? "default" : "secondary"}>
                      {tx.type}
                    </Badge>
                  </TableCell>

                  

                  <TableCell className="text-right font-semibold">
                    {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                  </TableCell>

                  <TableCell className="text-right text-muted-foreground">
                    {new Date(tx.transactionDate).toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
