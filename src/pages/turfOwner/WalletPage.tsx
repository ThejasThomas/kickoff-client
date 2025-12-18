import { useEffect, useState } from "react";
import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { getOwnerWallet, getOwnerWalletTransactions } from "@/services/TurfOwner/turfOwnerService";
import type { OwnerWalletTransaction } from "@/types/ownerWallet_transactions";

const OwnerWalletPage = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState<OwnerWalletTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [txLoading, setTxLoading] = useState(false);

  useEffect(() => {
    fetchWallet();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchWallet = async () => {
    try {
      const res = await getOwnerWallet();
      setBalance(res.wallet.balance);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTxLoading(true);
      const res = await getOwnerWalletTransactions(page, 10);

      if (res.success) {
        setTransactions(res.transactions);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ===== WALLET BALANCE ===== */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <Wallet className="text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Owner Wallet</h1>
          </div>

          {loading ? (
            <p className="text-slate-400">Loading wallet...</p>
          ) : (
            <div className="mt-4">
              <p className="text-slate-400 text-sm">Available Balance</p>
              <h2 className="text-4xl font-bold text-green-400 mt-2">
                ₹ {balance.toLocaleString()}
              </h2>
            </div>
          )}
        </div>

        {/* ===== TRANSACTION HISTORY ===== */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-lg font-semibold text-white mb-4">
            Transaction History
          </h2>

          {txLoading ? (
            <p className="text-slate-400 text-center py-8">
              Loading transactions...
            </p>
          ) : transactions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No transactions found
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between bg-slate-800/60 border border-slate-700 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        tx.type === "CREDIT"
                          ? "bg-green-500/10"
                          : "bg-red-500/10"
                      }`}
                    >
                      {tx.type === "CREDIT" ? (
                        <ArrowDownLeft className="text-green-400" size={18} />
                      ) : (
                        <ArrowUpRight className="text-red-400" size={18} />
                      )}
                    </div>

                    <div>
                      <p className="text-white font-medium">
                        {tx.type === "CREDIT"
                          ? "Booking Payment Received"
                          : "Amount Deducted"}
                      </p>

                      {tx.booking?.user && (
                        <p className="text-xs text-slate-400">
                          User: {tx.booking.user.fullName}
                        </p>
                      )}

                      <p className="text-xs text-slate-500">
                        {new Date(tx.transactionDate).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <p
                    className={`font-semibold ${
                      tx.type === "CREDIT"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {tx.type === "CREDIT" ? "+" : "-"}₹ {tx.amount}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-slate-400 text-sm">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OwnerWalletPage;
