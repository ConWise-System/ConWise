import React from 'react';
import { 
  Droplets, HardHat, Sun, Maximize2, 
  MoreHorizontal, Construction, AlertOctagon,
  TrendingUp, Calendar, Map as MapIcon
} from 'lucide-react';

export default function SiteEngineerDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      {/* 1. ARCHITECTURAL HEADER */}
      <header className="flex justify-between items-start mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Active Project</span>
            <p className="text-slate-500 text-xs font-medium tracking-widest uppercase">Sector 4 • Structural Phase II</p>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Overview</h1>
        </div>
        
        {/* Weather/Status Molecule */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
          <div className="bg-orange-50 p-2 rounded-lg">
            <Sun className="text-orange-500" size={24} />
          </div>
          <div className="border-l border-slate-100 pl-5">
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter">Current Weather</p>
            <p className="text-xl font-bold text-slate-800">24°C Clear</p>
          </div>
        </div>
      </header>

      {/* 2. OPERATIONAL KPI GRID (Atoms & Molecules) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Construction />} label="Steel" value="84.2" unit="tn" trend="Stock: Nominal" />
        <StatCard icon={<Droplets />} label="Concrete" value="12" unit="m³" trend="ETA: 14:30" />
        <StatCard icon={<HardHat />} label="Labor" value="142" unit="PA" trend="+12 vs Yesterday" />
        
        {/* Interactive Map Organism */}
        <div className="bg-slate-900 rounded-2xl overflow-hidden relative group h-40 shadow-xl shadow-slate-200">
          <div className="absolute top-4 right-4 z-10 text-white/40 hover:text-white cursor-pointer transition-colors">
            <Maximize2 size={18} />
          </div>
          <div className="p-6 absolute bottom-0 left-0 w-full z-10">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <MapIcon size={16} className="text-blue-400" /> Site Map View
            </h3>
            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">Live Feed • Sector 4</p>
          </div>
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* 3. PRIORITY DIRECTIVES (Task Scheduling Engine) */}
        <div className="lg:col-span-2">
          <SectionHeader title="Priority Directives" count="6 Remaining" />
          <div className="space-y-4">
            <DirectiveItem title="Foundation Pour - Zone B" time="08:00 — 12:00" status="In Progress" color="bg-blue-600" />
            <DirectiveItem title="MEP Rough-in Inspection" time="13:30 — 15:00" status="Scheduled" color="bg-slate-900" />
            <DirectiveItem title="Steel Truss Installation" time="15:00 — 18:00" status="Pending" color="bg-slate-400" />
          </div>
        </div>

        {/* 4. CRITICAL ISSUES (Observer Pattern Interface) */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-red-500">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50/30">
            <h2 className="text-xs font-bold uppercase tracking-widest text-red-600 flex items-center gap-2">
              <AlertOctagon size={14} /> Critical Issues
            </h2>
            <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">2 ALERTS</span>
          </div>
          <div className="p-6 space-y-6">
            <IssueItem title="Water Main Pressure Drop" desc="Zone C-4 Sector • Reported 24m ago" />
            <IssueItem title="Tower Crane 2 Sensor Fault" desc="Mechanical Warning • Maintenance Required" />
          </div>
        </div>
      </div>

      {/* 5. PROGRESS VELOCITY (Real-time Metrics) */}
      <div className="mt-10 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-end mb-8">
           <div>
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp size={20} className="text-green-500" /> Progress Velocity
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Comparative build efficiency vs. baseline</p>
           </div>
           <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
              <button className="text-slate-900 border-b-2 border-slate-900 pb-1">Weekly</button>
              <button className="text-slate-400 hover:text-slate-600">Monthly</button>
           </div>
        </div>
        <div className="flex items-end gap-3 h-32">
          {[40, 65, 45, 90, 55, 70, 85].map((height, i) => (
            <div key={i} className="flex-1 group relative">
              <div 
                style={{ height: `${height}%` }} 
                className={`w-full rounded-t-lg transition-all duration-500 ${i === 6 ? 'bg-slate-900' : 'bg-slate-200 group-hover:bg-blue-200'}`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ADVANCED COMPONENT ARCHITECTURE (Reusable Units)
function StatCard({ icon, label, value, unit, trend }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center mb-4">
        <div className="text-slate-400 bg-slate-50 p-2 rounded-lg">{icon}</div>
        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-black text-slate-900 leading-none">{value}</span>
        <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{unit}</span>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{trend}</p>
      </div>
    </div>
  );
}

function DirectiveItem({ title, time, status, color }) {
  return (
    <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all cursor-pointer">
      <div className="flex items-center gap-5">
        <div className={`w-1.5 h-10 ${color} rounded-full`}></div>
        <div>
          <h4 className="font-bold text-slate-800 text-lg leading-tight">{title}</h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs text-slate-400 font-bold">
              <Calendar size={12} /> {time}
            </span>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">• {status}</span>
          </div>
        </div>
      </div>
      <MoreHorizontal size={20} className="text-slate-300 group-hover:text-slate-600 transition-colors" />
    </div>
  );
}

function IssueItem({ title, desc }) {
  return (
    <div className="flex gap-5 group">
      <div className="w-1 bg-red-100 group-hover:bg-red-500 rounded-full h-14 shrink-0 transition-colors"></div>
      <div>
        <h4 className="font-bold text-slate-800 text-sm leading-tight group-hover:text-red-600 transition-colors">{title}</h4>
        <p className="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, count }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{title}</h2>
      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
        {count}
      </span>
    </div>
  );
}