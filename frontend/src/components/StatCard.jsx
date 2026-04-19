export default function StatCard({ title, value, trend, trendUp, icon, badge }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{title}</p>
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
          {icon}
        </div>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-1">{value}</h2>
      <div className="flex items-center gap-2">
        {badge ? (
          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{badge}</span>
        ) : (
          <span className={`text-[11px] font-bold ${trendUp ? 'text-emerald-500' : 'text-amber-500'}`}>
            {trendUp ? '↗' : '↘'} {trend}
          </span>
        )}
        <span className="text-[10px] text-slate-400 uppercase tracking-tighter">vs last period</span>
      </div>
    </div>
  );
} 