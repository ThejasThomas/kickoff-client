export interface OwnerWalletTransaction {
  _id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  transactionDate: string;

  turf: {
    _id: string;
    turfName: string;
  } | null;

  booking: {
    _id: string;
    user: {
      _id: string;
      fullName: string;
    } | null;
  } | null;
}
