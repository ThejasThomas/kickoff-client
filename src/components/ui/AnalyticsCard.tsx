interface AnalyticsCardProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

 export const AnalyticsCard = ({ title, icon, children }: AnalyticsCardProps) => (
  <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
    <div className="flex items-center gap-2 mb-6">
      <div className="p-2 bg-blue-500/10 rounded-lg">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    {children}
  </div>
)