export interface AdminWallet {
  balance: number;
}

export interface AdminWalletTransaction {
  _id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  reason: string;
  ownerId?: string;
  createdAt: string;
}