export type RevenuePeriod = "daily" | "weekly" | "monthly" | "yearly";

export interface RevenuePoint {
  label: string;
  amount: number;
}

export interface AdminDashboardEntity {
  users: {
    total: number;
    active: number;
    blocked: number;
    pending: number;
  };

  turfs: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };

  owners: {
    total: number;
    active: number;
    blocked: number;
    pending: number;
  };

  bookings: {
    total: number;
    completed: number;
    confirmed: number;
  };

  revenue: {
    totalBalance: number;
    period: RevenuePeriod;
    data: RevenuePoint[];
  };
}
