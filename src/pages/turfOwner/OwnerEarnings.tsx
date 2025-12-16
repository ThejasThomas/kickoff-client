import { getOwnerWalletTransactions } from "@/services/TurfOwner/turfOwnerService";
import type { OwnerWalletTransaction } from "@/types/ownerWallet_transactions";
import { useEffect, useState } from "react";

const OwnerWalletTransactionsPage = () => {
  const [transactions, setTransactions] = useState<OwnerWalletTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [page]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await getOwnerWalletTransactions(page, 10);
      console.log('res',res)
      setTransactions(res.transactions);
      setTotalPages(res.totalPages);
    } catch (error) {
      console.error("Failed to fetch wallet transactions", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Wallet Transactions</h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">User</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Turf</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx._id} className="border-t">
                  <td className="p-3">
                    {tx.booking?.user?.fullName || "—"}
                  </td>

                  <td
                    className={`p-3 font-medium ${
                      tx.type === "CREDIT"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {tx.type}
                  </td>

                  <td className="p-3">
                    {tx.turf?.turfName || "—"}
                  </td>

                  <td className="p-3">₹{tx.amount}</td>

                  <td className="p-3">
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default OwnerWalletTransactionsPage;
