
import { useEffect, useState } from "react";
import {
  getOwnerDashboard,
  getOwnerWalletTransactions,
} from "@/services/TurfOwner/turfOwnerService";
import type { OwnerDashboardResponse, TimeSeriesStat } from "@/types/ownerDashboard_type";
import type { OwnerWalletTransaction } from "@/types/ownerWallet_transactions";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Users, Download } from "lucide-react";
import { TurfPerformanceTable } from "@/components/ReusableComponents/TurfPerformance";
import { BookingsChart } from "@/components/ReusableComponents/BookingsChartProps";
import { RevenueChart } from "@/components/ReusableComponents/RevenueChart";
import { StatCard } from "@/components/ReusableComponents/StatCard";
import { WalletTransactions } from "@/components/ReusableComponents/walletTransactionPage";
import { useNavigate } from "react-router-dom";

const OwnerDashboardPage = () => {
  const [data, setData] = useState<OwnerDashboardResponse | null>(null);
  const [transactions, setTransactions] = useState<OwnerWalletTransaction[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState(7);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDashboard();
    fetchTransactions();
  }, [days]);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getOwnerDashboard(days);
      console.log("ressss", res);
      setData(res.data);
    } catch (err) {
      console.error("[v0] Dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await getOwnerWalletTransactions(1, 5);
      setTransactions(res.transactions);
    } catch (err) {
      console.error("[v0] Failed to fetch wallet transactions", err);
    }
  };

  const getChartData = () => {
  if (!data) return [];

  let source: TimeSeriesStat[] = [];

  if (days === 7) {
    source = data.bookings.daily;
  } else if (days === 30 || days === 90) {
    source = data.bookings.monthly;
  }

  return source.map((item) => ({
    date: item.date
      ? new Date(item.date).toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        })
      : item.month || item.year?.toString() || "",
    revenue: item.revenue,
    bookings: item.bookings,
  }));
};


  const handleDownloadReport = () => {
    if (!data) {
      alert("Loading dashboard data first...");
      return;
    }
    const reportData = {
      type: "dashboard" as const,
      date: new Date().toLocaleDateString(),
      invoiceNumber: `OWNER-REPORT-${Date.now().toString().slice(-6)}`,
      overview: data.overview,
      perTurf: data.perTurf,
      transactions: transactions, 
      period: `${days} Days`,
    };
    const encodedData = encodeURIComponent(JSON.stringify(reportData));
    navigate(`/turfOwner/owner-invoice-download?data=${encodedData}`);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 rounded bg-muted" />
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg bg-muted" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { overview, perTurf } = data;
  const chartData = getChartData();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Owner Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor your turf booking performance
            </p>
          </div>

          {/* Time Period Filter & Download */}
          <div className="flex flex-col sm:flex-row gap-2 items-end">
            <div className="flex gap-2">
              {[
                { label: "7 Days", value: 7 },
                { label: "30 Days", value: 30 },
                { label: "90 Days", value: 90 },
              ].map((period) => (
                <Button
                  key={period.value}
                  variant={days === period.value ? "default" : "outline"}
                  onClick={() => setDays(period.value)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
            <Button
              onClick={handleDownloadReport}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Bookings"
            value={overview.totalBookings.toLocaleString()}
            trend="up"
            icon={<Calendar className="h-6 w-6" />}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${overview.totalRevenue.toLocaleString()}`}
            trend="up"
            icon={<span className="text-2xl font-bold">₹</span>}
          />
          <StatCard
            title="Hosted Games"
            value={overview.totalHostedGames.toLocaleString()}
            trend="down"
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Game Revenue"
            value={`₹${overview.totalHostedRevenue.toLocaleString()}`}
            trend="up"
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <RevenueChart data={chartData} />
          <BookingsChart data={chartData} />
        </div>

        {/* Turf Performance Table */}
        <TurfPerformanceTable data={perTurf} />

        {/* Recent Transactions */}
        <WalletTransactions
          transactions={transactions}
          onViewAll={() => navigate("/turfOwner/transactions")}
        />
      </div>
    </div>
  );
};

export default OwnerDashboardPage;