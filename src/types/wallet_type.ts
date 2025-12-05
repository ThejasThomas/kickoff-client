export interface  IWalletTransaction {
  id?:string;
  userId:string;
  type:"credit"| "debit";
  amount:number;
  reason:string;
  status:"success"|"failed"|"pending";
  transaction_date:string;
}
