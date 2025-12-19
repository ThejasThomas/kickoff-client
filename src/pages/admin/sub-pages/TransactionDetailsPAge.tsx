import { useEffect, useState } from "react";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
  Calendar,
  Wallet,
} from "lucide-react";
import type { IAllOwnerWalletTransaction } from "@/types/owner_wallet_transaction_type";
import { adminService } from "@/services/admin/adminService";
import { useNavigate } from "react-router-dom";

type TransactionType = "all" | "CREDIT" | "DEBIT";
type TransactionStatus = "SUCCESS" | "FAILED" | "PENDING" | "all";

const AdminOwnerWalletTransactions = () => {
  const [transactions, setTransactions] = useState<
    IAllOwnerWalletTransaction[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    IAllOwnerWalletTransaction[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  useEffect(() => {
    filterTransactions();
  }, [transactions, typeFilter, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllOwnerTransactions(page, 10);
      if (res.success) {
        setTransactions(res.transactions);
        setTotalPages(res.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    if (typeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((tx) => tx.status === statusFilter);
    }

    setFilteredTransactions(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/30";
      case "cancelled":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "credit" ? (
      <ArrowDownCircle className="w-5 h-5 text-green-400" />
    ) : (
      <ArrowUpCircle className="w-5 h-5 text-red-400" />
    );
  };

  const calculateStats = () => {
    const totalCredit = transactions
      .filter((tx) => tx.type === "CREDIT" && tx.status === "SUCCESS")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const totalDebit = transactions
      .filter((tx) => tx.type === "DEBIT" && tx.status === "SUCCESS")
      .reduce((sum, tx) => sum + tx.amount, 0);
    const pending = transactions.filter((tx) => tx.status === "PENDING").length;

    return { totalCredit, totalDebit, pending };
  };

  const stats = calculateStats();

  const exportToCSV = () => {
    const headers = ["Date", "Turf", "Type", "Amount", "Reason", "Status"];
    const csvData = filteredTransactions.map((tx) => [
      new Date(tx.transactionDate).toLocaleString(),
      tx.turfId?.turfName || "-",
      tx.type,
      tx.amount,
      tx.reason,
      tx.status,
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString()}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 mt-4 text-lg">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
            <Wallet className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Transactions
            </h1>
            <p className="text-slate-400 mt-1">
              Manage and monitor all wallet transactions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 p-6 rounded-2xl border border-green-500/30 shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <ArrowDownCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Credits</p>
          <p className="text-3xl font-bold text-green-400">
            ₹ {stats.totalCredit.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 p-6 rounded-2xl border border-red-500/30 shadow-xl hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="w-6 h-6 text-red-400" />
            </div>
            <ArrowUpCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Total Debits</p>
          <p className="text-3xl font-bold text-red-400">
            ₹ {stats.totalDebit.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TransactionType)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="CREDIT">Credit</option>
              <option value="DEBIT">Debit</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-800/50 border-b border-slate-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Turf
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-300">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Wallet className="w-12 h-12 text-slate-600" />
                      <p className="text-slate-400 text-lg">
                        No transactions found
                      </p>
                      <p className="text-slate-500 text-sm">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, index) => (
                  <tr
                    key={tx._id}
                    onClick={() =>
                      navigate(`/admin/transaction-view-detail/${tx._id}`)
                    }
                    className="border-b border-slate-700/50 hover:bg-slate-800/70 transition-all group cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-700 rounded-lg group-hover:bg-slate-600 transition-all">
                          <Calendar className="w-4 h-4 text-slate-300" />
                        </div>
                        <span className="font-medium text-white">
                          {tx.turfId?.turfName || "-"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(tx.type)}
                        <span
                          className={`font-semibold capitalize ${
                            tx.type === "CREDIT"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-lg font-bold ${
                          tx.type === "CREDIT"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.type === "CREDIT" ? "+" : "-"}₹{" "}
                        {tx.amount.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{tx.reason}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-medium text-sm ${getStatusColor(
                          tx.status
                        )}`}
                      >
                        <span className="capitalize">{tx.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-400 text-sm">
                        {new Date(tx.transactionDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                        <br />
                        <span className="text-slate-500 text-xs">
                          {new Date(tx.transactionDate).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-slate-400 text-sm">
          Showing{" "}
          <span className="font-semibold text-white">
            {filteredTransactions.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-white">
            {transactions.length}
          </span>{" "}
          transactions
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800 border border-slate-700"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from(
              { length: Math.min(totalPages, 5) },
              (_, i) => i + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`w-10 h-10 rounded-xl font-medium transition-all border ${
                  page === pageNum
                    ? "bg-blue-600 text-white border-blue-500"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700"
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800 border border-slate-700"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOwnerWalletTransactions;
