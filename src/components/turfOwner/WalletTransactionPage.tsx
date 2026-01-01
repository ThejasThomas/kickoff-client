import { useEffect, useState } from "react"
import { getOwnerWalletTransactions } from "@/services/TurfOwner/turfOwnerService"
import type { OwnerWalletTransaction } from "@/types/ownerWallet_transactions"
import { WalletTransactions } from "@/components/ReusableComponents/walletTransactionPage"

const WalletTransactionsPage = () => {
  const [transactions, setTransactions] = useState<OwnerWalletTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const res = await getOwnerWalletTransactions(1, 20)
      console.log('responsee',res)
      setTransactions(res.transactions)
    } catch (err) {
      console.error("Failed to load transactions", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground">
        Loading transactions...
      </div>
    )
  }

  return <WalletTransactions transactions={transactions} />
}

export default WalletTransactionsPage
