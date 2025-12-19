import { TrendingUp } from "lucide-react"

interface OverviewCardProps {
  title: string
  value: number
  icon: React.ReactNode
  gradient: string
  stats: { label: string; value: number; color: string }[]
}

 export const OverviewCard = ({ title, value, icon, gradient, stats }: OverviewCardProps) => (
  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl shadow-lg`}>{icon}</div>
      <TrendingUp className="w-5 h-5 text-green-400" />
    </div>

    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-3xl font-bold mb-4">{value.toLocaleString()}</p>

    <div className="space-y-2 pt-4 border-t border-slate-700">
      {stats.map((stat) => (
        <div key={stat.label} className="flex items-center justify-between text-sm">
          <span className="text-slate-400">{stat.label}</span>
          <span className={`font-semibold ${stat.color}`}>{stat.value}</span>
        </div>
      ))}
    </div>
  </div>
)