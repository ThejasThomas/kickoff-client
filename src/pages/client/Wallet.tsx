import React, { useEffect, useState } from "react";

import { PlusCircle } from "lucide-react";
import {
  addMoney,
  getTransactionHistory,
  getWalletBalance,
} from "@/services/client/clientService";
import WalletStripeModal from "@/components/Payments/WalletStripeModal";

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [triggerStripe, setTriggerStripe] = useState(false);
  const [transactionPayload, setTransactionPayload] = useState<any>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadWalletData();
  }, [page]);

  // Success redirect handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const amount = params.get("amount");

    if (success === "true" && amount) {
      handleWalletCredit(Number(amount));
      window.history.replaceState({}, "", "/wallet");
    }
  }, [window.location.search]);

  const loadWalletData = async () => {
    try {
      const balanceRes = await getWalletBalance();
      const historyRes = await getTransactionHistory(page, limit);

      setBalance(balanceRes.balance);
      setTransactions(historyRes.transactions);
      setTotal(historyRes.total);
    } catch (err) {
      console.error("Wallet load error:", err);
    }
  };

  const handleAddMoney = async () => {
    if (!amount || amount <= 0) return alert("Enter a valid amount");

    setTransactionPayload({ amount });
    setTriggerStripe(true);
    setShowAddMoneyModal(false);
  };

  const handleWalletCredit = async (amount: number) => {
    try {
      await addMoney(amount, "Wallet top-up");
      loadWalletData();
    } catch (err) {
      console.error("Failed to credit wallet:", err);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">Manage your balance & transactions</p>
        </div>

        {/* Balance Section */}
        <div className="bg-primary text-primary-foreground rounded-xl p-6 flex justify-between items-center shadow-md">
          <div>
            <p className="text-lg opacity-80">Available Balance</p>
            <h2 className="text-4xl font-bold mt-1">₹{balance}</h2>
          </div>
          <button
            onClick={() => setShowAddMoneyModal(true)}
            className="bg-white text-primary px-5 py-3 rounded-lg flex items-center gap-2 shadow hover:opacity-90"
          >
            <PlusCircle size={22} /> Add Money
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

          {transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions yet.</p>
          ) : (
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {transactions.map((tx, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-border pb-3"
                >
                  <div>
                    <p className="font-semibold">
                      {tx.type === "credit" ? (
                        <span className="text-green-600">+ ₹{tx.amount}</span>
                      ) : (
                        <span className="text-red-600">- ₹{tx.amount}</span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{tx.reason}</p>
                  </div>
                  <p className="text-sm">
                    {new Date(tx.transaction_date).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {total > limit && (
            <div className="flex justify-between items-center mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className={`px-4 py-2 rounded-lg border ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-muted"
                }`}
              >
                Previous
              </button>

              <p className="text-sm text-muted-foreground">
                Page {page} of {Math.ceil(total / limit)}
              </p>

              <button
                disabled={page * limit >= total}
                onClick={() => setPage((prev) => prev + 1)}
                className={`px-4 py-2 rounded-lg border ${
                  page * limit >= total
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-muted"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-sm space-y-4 shadow-xl">
            <h2 className="text-xl font-bold">Add Money</h2>

            <input
              type="number"
              className="w-full p-3 rounded-lg bg-input border border-border"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowAddMoneyModal(false)}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                Continue to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stripe Trigger */}
      {triggerStripe && transactionPayload && (
        <WalletStripeModal
          amount={transactionPayload.amount}
          onError={() => console.error("Wallet stripe error")}
        />
      )}
    </div>
  );
};

export default WalletPage;
