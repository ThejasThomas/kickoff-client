import React, { useEffect, useState } from "react";

import { PlusCircle, AlertCircle, ChevronLeft } from "lucide-react";
import {
  addMoney,
  getTransactionHistory,
  getWalletBalance,
} from "@/services/client/clientService";
import WalletStripeModal from "@/components/Payments/WalletStripeModal";
import { useNavigate } from "react-router-dom";

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [triggerStripe, setTriggerStripe] = useState(false);
  const [transactionPayload, setTransactionPayload] = useState<any>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadWalletData();
  }, [page]);

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
    setError('');
    const parsedAmount = parseFloat(amount.toString());
    if (!amount || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }
    setTransactionPayload({ amount: parsedAmount });
    setTriggerStripe(true);
    setShowAddMoneyModal(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const parsed = parseFloat(value) || 0;
    setAmount(parsed);
    if (error) setError('');
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
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/home")}
              className="inline-flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              <ChevronLeft size={20} />
              Back to Home
            </button>
          </div>
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
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8 w-full max-w-md space-y-6 shadow-2xl backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Add Funds</h2>
              <p className="text-sm text-gray-600">Securely top up your wallet balance</p>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-lg">₹</span>
              </div>
              <input
                type="text"
                className="w-full pl-8 pr-4 py-4 rounded-xl bg-white border-2 border-gray-200 focus:border-primary focus:outline-none transition-all duration-200 text-lg font-medium text-gray-900 placeholder-gray-400 shadow-sm hover:shadow-md"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowAddMoneyModal(false);
                  setAmount(0);
                  setError('');
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMoney}
                disabled={!amount || parseFloat(amount.toString()) <= 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-semibold hover:from-primary/90 hover:to-purple-500 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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