export interface TransactionDetailsEntity {
  transaction: {
    id: string;
    type: "CREDIT" | "DEBIT";
    amount: number;
    reason: string;
    status: string;
    transactionDate: Date;
  };

  turf: {
    id: string;
    turfName: string;
    location: {
      city: string;
      state: string;
    };
  };

  booking: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    price: number;
  };

  user: {
    id: string;
    fullName: string;
    email: string;
  };
}
