import { useEffect, useState } from "react";
import { Wallet, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { adminService } from "@/services/admin/adminService";
import type { AdminWalletTransaction } from "@/types/admin_wallet_type";

const AdminWalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<AdminWalletTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [page]);

  const fetchWallet = async () => {
    const res = await adminService.getAdminWallet();
    if (res.success) {
      setBalance(res.wallet.balance);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    const res = await adminService.getAdminwalletTransactions(page, 10);
    if (res.success) {
      setTransactions(res.transactions);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Wallet Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
              <Wallet className="text-indigo-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Admin Wallet Balance</p>
              <h2 className="text-3xl font-bold text-white">
                ₹ {balance.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Transaction History
          </h3>

          {loading ? (
            <p className="text-slate-400">Loading transactions...</p>
          ) : transactions.length === 0 ? (
            <p className="text-slate-400">No transactions found</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx._id}
                  className="flex items-center justify-between bg-slate-800/50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    {tx.type === "CREDIT" ? (
                      <ArrowDownLeft className="text-green-400" />
                    ) : (
                      <ArrowUpRight className="text-red-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {tx.reason}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(tx.createdAt).toLocaleString()}
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
                    {tx.type === "CREDIT" ? "+" : "-"}₹{tx.amount}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-40"
              >
                Prev
              </button>
              <span className="text-slate-400 px-4 py-2">
                Page {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg disabled:opacity-40"
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

export default AdminWalletPage;
