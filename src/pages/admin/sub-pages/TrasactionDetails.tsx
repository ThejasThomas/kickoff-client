
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import {
  Receipt,
  Calendar,
  User,
  MapPin,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import type { TransactionDetailsEntity } from "@/types/transaction_datails_type"
import { adminService } from "@/services/admin/adminService"

const TransactionViewDetails = () => {
  const { transactionId } = useParams<{ transactionId: string }>()

  const [data, setData] = useState<TransactionDetailsEntity | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!transactionId) return

    const fetchDetails = async () => {
      try {
        const res = await adminService.getTransactionDetails(transactionId)
        console.log("Transaction details:", res)
        setData(res.data)
      } catch (error) {
        console.error("Failed to fetch transaction details", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [transactionId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20"
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      case "cancelled":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "failed":
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    return type === "credit"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-rose-500/10 text-rose-400 border-rose-500/20"
  }

  const getTypeIcon = (type: string) => {
    return type === "credit" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-400 text-lg font-medium">Loading transaction details...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-xl font-semibold">Transaction not found</p>
          <p className="text-slate-500 mt-2">The requested transaction could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction Details</h1>
            <p className="text-slate-400 mt-1">View complete transaction information</p>
          </div>
        </div>

        {/* Main Transaction Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <Receipt className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">₹{data.transaction.amount.toLocaleString("en-IN")}</h2>
                <p className="text-slate-400 text-sm">Transaction Amount</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${getTypeColor(
                  data.transaction.type,
                )}`}
              >
                {getTypeIcon(data.transaction.type)}
                <span className="capitalize">{data.transaction.type}</span>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium ${getStatusColor(
                  data.transaction.status,
                )}`}
              >
                {getStatusIcon(data.transaction.status)}
                <span className="capitalize">{data.transaction.status}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-700">
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Reason</p>
              <p className="text-white text-lg">{data.transaction.reason}</p>
            </div>
            <div className="space-y-2">
              <p className="text-slate-400 text-sm font-medium">Transaction Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-slate-400" />
                <p className="text-white text-lg">
                  {new Date(data.transaction.transactionDate).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Layout for Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Booking Details */}
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <Calendar className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Booking Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Booking Date</p>
                  <p className="text-white font-semibold text-lg">
                    {new Date(data.booking.date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <Clock className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Time Slot</p>
                  <p className="text-white font-semibold text-lg">
                    {data.booking.startTime} - {data.booking.endTime}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Booking Price</p>
                  <p className="text-emerald-400 font-bold text-xl">₹{data.booking.price.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Details */}
          <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <User className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white">User Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <User className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Full Name</p>
                  <p className="text-white font-semibold text-lg">{data.user.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-slate-400 text-sm">Email Address</p>
                  <p className="text-white font-semibold break-all">{data.user.email}</p>
                </div>
              </div>

              
            </div>
          </div>
        </div>

        {/* Turf Details */}
        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <MapPin className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Turf Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-slate-400 text-sm">Turf Name</p>
                <p className="text-white font-semibold text-lg">{data.turf.turfName}</p>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionViewDetails
