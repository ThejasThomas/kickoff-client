export interface IAllOwnerWalletTransaction {
  _id: string;
  ownerId: string;
  turfId: {
    _id: string;
    turfName: string;
  };
  bookingId: {
    _id: string;
  };
  type: "CREDIT" | "DEBIT";
  amount: number;
  reason: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  transactionDate: string;
}

export interface AllOwnerWalletTransactionResponse {
  success: boolean;
  transactions: IAllOwnerWalletTransaction[];
  total: number;
  page: number;
  totalPages: number;
}
