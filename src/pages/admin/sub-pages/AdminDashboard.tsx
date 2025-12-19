
import {
  getUsersChartData,
  getTurfsChartData,
  getOwnersChartData,
  getBookingsChartData,
} from "@/lib/dashboardChartData"
import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Users, Building2, UserCog, Calendar, DollarSign } from "lucide-react"
import { AnalyticsCard } from "@/components/ui/AnalyticsCard"
import { OverviewCard } from "@/components/ui/OverViewCard"
import { renderCustomLabel } from "@/components/ui/renderCustomLabel";
import type { AdminDashboardEntity, RevenuePeriod } from "@/types/adminDashboard_type"
import { adminService } from "@/services/admin/adminService"


const PERIODS: RevenuePeriod[] = ["daily", "weekly", "monthly", "yearly"]



const AdminDashboard = () => {
  const [data, setData] = useState<AdminDashboardEntity | null>(null)
  const [period, setPeriod] = useState<RevenuePeriod>("monthly")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [period])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const res = await adminService.getDashboard(period)
      console.log("Dashboard data:", res)
      setData(res.data)
    } catch (err) {
      console.error("Dashboard fetch failed", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-slate-400 mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!data) return null
  const usersChartData = getUsersChartData(data)
const turfsChartData = getTurfsChartData(data)
const ownersChartData = getOwnersChartData(data)
const bookingsChartData = getBookingsChartData(data)


  

 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-2">Monitor your platform's performance and analytics</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-slate-400 text-sm font-medium">Revenue Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as RevenuePeriod)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-slate-700"
            >
              {PERIODS.map((p) => (
                <option key={p} value={p}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <OverviewCard
          title="Total Users"
          value={data.users.total}
          icon={<Users className="w-8 h-8" />}
          gradient="from-blue-500 to-blue-600"
          stats={[
            { label: "Active", value: data.users.active, color: "text-green-400" },
            { label: "Blocked", value: data.users.blocked, color: "text-red-400" },
            // { label: "Pending", value: data.users.pending, color: "text-yellow-400" },
          ]}
        />

        <OverviewCard
          title="Total Turfs"
          value={data.turfs.total}
          icon={<Building2 className="w-8 h-8" />}
          gradient="from-emerald-500 to-emerald-600"
          stats={[
            { label: "Approved", value: data.turfs.approved, color: "text-green-400" },
            { label: "Pending", value: data.turfs.pending, color: "text-yellow-400" },
            { label: "Rejected", value: data.turfs.rejected, color: "text-red-400" },
          ]}
        />

        <OverviewCard
          title="Total Owners"
          value={data.owners.total}
          icon={<UserCog className="w-8 h-8" />}
          gradient="from-purple-500 to-purple-600"
          stats={[
            { label: "Active", value: data.owners.active, color: "text-green-400" },
            { label: "Blocked", value: data.owners.blocked, color: "text-red-400" },
            { label: "Pending", value: data.owners.pending, color: "text-yellow-400" },
          ]}
        />

        <OverviewCard
          title="Total Bookings"
          value={data.bookings.total}
          icon={<Calendar className="w-8 h-8" />}
          gradient="from-cyan-500 to-cyan-600"
          stats={[
            { label: "Completed", value: data.bookings.completed, color: "text-green-400" },
            { label: "Confirmed", value: data.bookings.confirmed, color: "text-blue-400" },
          ]}
        />
      </div>

      {/* Revenue Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <div className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Revenue Overview</h2>
              <p className="text-slate-400 text-sm">
                {period.charAt(0).toUpperCase() + period.slice(1)} earnings breakdown
              </p>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-slate-400 mb-2">Total Balance</p>
            <p className="text-4xl font-bold text-green-400">₹ {data.revenue.totalBalance.toLocaleString("en-IN")}</p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data.revenue.data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#f1f5f9" }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ fill: "#10b981", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Analytics */}
        <AnalyticsCard title="Users Distribution" icon={<Users className="w-5 h-5" />}>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usersChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {usersChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {usersChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-300">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Turfs Analytics */}
        <AnalyticsCard title="Turfs Distribution" icon={<Building2 className="w-5 h-5" />}>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={turfsChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {turfsChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {turfsChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-slate-300">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </AnalyticsCard>

        {/* Owners Analytics */}
        <AnalyticsCard title="Owners Distribution" icon={<UserCog className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ownersChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {ownersChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* Bookings Analytics */}
        <AnalyticsCard title="Bookings Analytics" icon={<Calendar className="w-5 h-5" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>
    </div>
  )
}
export default AdminDashboard