export interface OwnerDashboardOverview {
  totalBookings: number;
  totalRevenue: number;
  totalHostedGames: number;
  totalHostedRevenue: number;
  totalPlayers: number;
}

export interface PerTurfStat {
  turfId: string;
  turfName: string;
  totalBookings: number;
  totalRevenue: number;
}

export interface TimeSeriesStat {
  date?: string;   // daily
  month?: string;  // monthly
  year?: number;   // yearly
  bookings: number;
  revenue: number;
}

export interface OwnerDashboardResponse {
  overview: OwnerDashboardOverview;
  perTurf: PerTurfStat[];
  bookings: {
    daily: TimeSeriesStat[];
    monthly: TimeSeriesStat[];
    yearly: TimeSeriesStat[];
  };
  hostedGames: {
    overview: {
      totalGames: number;
      totalRevenue: number;
      totalPlayers: number;
    };
    daily: TimeSeriesStat[];
    monthly: TimeSeriesStat[];
    yearly: TimeSeriesStat[];
  };
}
