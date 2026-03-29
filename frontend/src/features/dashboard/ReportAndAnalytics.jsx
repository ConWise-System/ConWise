"use client";
import React, { useState, useMemo } from 'react';
import { 
  Download, FileText, Share2, TrendingUp, 
  ChevronLeft, ChevronRight, Filter, Star 
} from 'lucide-react';

// --- PROFESSIONAL DATA SCHEMA ---
const PROGRESS_DATA = [
  { month: 'JAN', value: 35 }, { month: 'FEB', value: 48 },
  { month: 'MAR', value: 92 }, { month: 'APR', value: 65 },
  { month: 'MAY', value: 42 }, { month: 'JUN', value: 98 },
  { month: 'JUL', value: 75 }
];

const REVENUE_STREAMS = [
  { label: 'Enterprise Solutions', value: '45%', color: 'stroke-[#0F172A]' },
  { label: 'SaaS Subscriptions', value: '30%', color: 'stroke-slate-400' },
  { label: 'Consulting Services', value: '25%', color: 'stroke-blue-100' },
];

const DEPARTMENT_MATRIX = [
  { id: 1, name: 'Product Engineering', velocity: 88, completion: '94.1%', trend: 'Peak' },
  { id: 2, name: 'Strategic Marketing', velocity: 65, completion: '81.5%', trend: 'Stable' },
  { id: 3, name: 'Customer Success', velocity: 96, completion: '99.8%', trend: 'High' },
];

export default function ReportsAnalytics() {
  const [activeTimeframe, setActiveTimeframe] = useState('Monthly');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Logic: Calculate average department velocity
  const avgVelocity = useMemo(() => {
    return (DEPARTMENT_MATRIX.reduce((acc, curr) => acc + curr.velocity, 0) / DEPARTMENT_MATRIX.length).toFixed(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* --- HEADER --- */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Executive Intelligence</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mt-1">Reports & Analytics</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['Monthly', 'Quarterly', 'Yearly'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTimeframe(t)}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTimeframe === t ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button className="bg-[#0F172A] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-all font-bold text-sm shadow-xl shadow-slate-200">
            <Download size={18} /> Download Report
          </button>
        </div>
      </header>

      {/* --- ANALYTICS ENGINE (THE GRAPHS) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. PROJECT PROGRESS (SVG BAR CHART) */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h3 className="text-xl font-black text-slate-900">Project Progress Analytics</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Real-time throughput velocity across departments.</p>
            </div>
            <button className="text-slate-300 hover:text-slate-900 transition-colors">•••</button>
          </div>
          
          <div className="relative h-64 w-full flex items-end justify-between gap-4 px-4">
            {/* SVG Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[100, 75, 50, 25, 0].map(level => (
                <div key={level} className="w-full border-t border-slate-50 relative">
                  <span className="absolute -left-10 top-0 -translate-y-1/2 text-[9px] font-black text-slate-300">{level}%</span>
                </div>
              ))}
            </div>

            {PROGRESS_DATA.map((item, index) => (
              <div 
                key={item.month} 
                className="relative flex-1 flex flex-col items-center group"
                onMouseEnter={() => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {/* Tooltip */}
                {hoveredBarIndex === index && (
                  <div className="absolute -top-12 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-md font-bold animate-in zoom-in-95 shadow-xl">
                    {item.value}% Velocity
                  </div>
                )}
                <div 
                  className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out cursor-pointer ${index === 2 ? 'bg-[#0F172A]' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                  style={{ height: `${item.value}%` }}
                />
                <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. REVENUE SOURCE (SVG DONUT CHART) */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">Revenue Source</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Sector distribution.</p>
          </div>
          
          <div className="relative flex justify-center py-6">
            <svg viewBox="0 0 100 100" className="w-52 h-52 -rotate-90">
              {/* Sector 1: Enterprise (45%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0F172A" strokeWidth="14" strokeDasharray="125.6 251.2" className="transition-all duration-1000" />
              {/* Sector 2: SaaS (30%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#94A3B8" strokeWidth="14" strokeDasharray="84 251.2" strokeDashoffset="-125.6" className="transition-all duration-1000" />
              {/* Sector 3: Consulting (25%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="14" strokeDasharray="70 251.2" strokeDashoffset="-209.6" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900 leading-none">100%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Total</span>
            </div>
          </div>

          <div className="space-y-3.5">
            {REVENUE_STREAMS.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.color.replace('stroke-','bg-')}`} />
                  <span className="text-xs font-bold text-slate-500">{item.label}</span>
                </div>
                <span className="text-xs font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- DEPARTMENT DATA TABLE --- */}
      <section className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="p-8 flex justify-between items-center border-b border-slate-50">
          <h3 className="text-lg font-black text-slate-900">Department Performance Matrix</h3>
          <div className="flex items-center gap-4">
             <span className="text-sm font-bold text-slate-400 italic">Global Avg Velocity: {avgVelocity}%</span>
             <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                <Filter size={14} /> Filter Table
             </button>
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="px-8 py-5">Department Name</th>
              <th className="px-8 py-5">Task Velocity</th>
              <th className="px-8 py-5">Completion Rate</th>
              <th className="px-8 py-5 text-right">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {DEPARTMENT_MATRIX.map((dept) => (
              <tr key={dept.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-base">{dept.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors cursor-pointer">{dept.name}</p>
                      <p className="text-xs text-slate-400 font-medium">Internal Audits Complete</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-slate-800 transition-all duration-1000" style={{ width: `${dept.velocity}%` }} />
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-black text-slate-700">{dept.completion}</td>
                <td className="px-8 py-6 text-right">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${dept.trend === 'Peak' ? 'text-emerald-500' : 'text-slate-400'}`}>
                    ↗ {dept.trend}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}