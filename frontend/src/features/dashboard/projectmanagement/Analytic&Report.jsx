'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileDown, Sparkles, TrendingUp, ShieldCheck, 
  ChevronRight, BarChart3, PieChart, Layout, Plus
} from 'lucide-react';

// Animation Variants
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
};

export default function PerformanceIntelligence() {
  return (
    <div className="w-full">
      <motion.div 
        variants={containerVars} 
        initial="hidden" 
        animate="visible"
        className="max-w-[1400px] mx-auto p-10 w-full space-y-10"
      >
        {/* --- Header Section --- */}
        <div className="flex justify-between items-end mb-10">
          <motion.div variants={itemVars}>
            <h1 className="text-4xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">
              Performance Intelligence
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-4 max-w-xl leading-relaxed">
              A comprehensive fiscal and operational audit across all sovereign projects for the current quarter.
            </p>
          </motion.div>

          <motion.div variants={itemVars} className="flex gap-3">
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
              <FileDown size={16} /> Export PDF
            </button>
            <button className="bg-[#111827] text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all">
              <Sparkles size={16} /> Generate Intelligence
            </button>
          </motion.div>
        </div>

        {/* --- Top Metrics Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Portfolio Health Score */}
          <motion.div variants={itemVars} className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Portfolio Health Score</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-7xl font-black text-[#111827] tracking-tighter italic">94.8</h2>
                  <span className="text-xl font-bold text-slate-300">/100</span>
                </div>
                <div className="flex items-center gap-2 mt-4 text-emerald-500 font-black text-[10px] uppercase">
                  <TrendingUp size={14} /> +12.4% Project Velocity
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                <BarChart3 className="text-slate-400 group-hover:text-blue-500" />
              </div>
            </div>
            
            {/* Simple Bar Chart Placeholder */}
            <div className="mt-8 flex items-end gap-2 h-24">
              {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                <div 
                  key={i} 
                  className="flex-1 bg-[#111827] rounded-t-lg transition-all duration-500 group-hover:bg-blue-600" 
                  style={{ height: `${h}%`, opacity: 0.1 + (i * 0.15) }} 
                />
              ))}
            </div>
          </motion.div>

          {/* Cumulative Savings & Risk */}
          <div className="space-y-6">
            <motion.div variants={itemVars} className="bg-[#111827] p-8 rounded-[2.5rem] text-white shadow-xl h-1/2 flex flex-col justify-between">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Cumulative Savings</p>
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-black italic tracking-tighter">$1.24M</h3>
                <span className="text-[10px] font-black bg-white/10 px-2 py-1 rounded">+4.2%</span>
              </div>
            </motion.div>
            
            <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-1/2 flex flex-col justify-between group">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Risk Exposure</p>
              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-1">
                  <h3 className="text-3xl font-black text-[#111827] tracking-tighter italic group-hover:text-rose-600 transition-colors">Low</h3>
                  <span className="text-xs font-bold text-slate-400">(04)</span>
                </div>
                <ShieldCheck className="text-rose-500" size={24} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* --- Middle Section: Allocation & Reporting --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Fiscal Allocation */}
          <motion.div variants={itemVars} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#111827]">Fiscal Allocation vs. Actuals</h3>
              <div className="flex gap-4 text-[9px] font-black uppercase text-slate-400">
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200" /> Budget</span>
                <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#111827]" /> Actual</span>
              </div>
            </div>
            <div className="space-y-8">
              <AllocationRow label="Quantum Cloud Migration" budget={500} actual={420} percent={84} />
              <AllocationRow label="Global Supply Chain Audit" budget={1100} actual={1200} percent={109} isOver />
              <AllocationRow label="AI Ethics Framework" budget={150} actual={85} percent={56} />
            </div>
          </motion.div>

          {/* Automated Reporting */}
          <motion.div variants={itemVars} className="space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#111827] mb-6 px-2">Automated Reporting</h3>
            <ReportCard icon={<Layout size={18} />} title="Executive Quarterly Brief" sub="High-level KPIs for board review" />
            <ReportCard icon={<PieChart size={18} />} title="Financial Variance Audit" sub="Detailed breakdown of cost overruns" />
            <ReportCard icon={<BarChart3 size={18} />} title="Operational Throughput" sub="Team velocity and task completion rates" />
            <div className="p-6 border-2 border-dashed border-slate-100 rounded-[2rem] flex flex-col items-center justify-center text-slate-300 hover:border-blue-100 hover:text-blue-400 transition-all cursor-pointer group">
               <Plus size={24} className="mb-2 group-hover:scale-110 transition-transform" />
               <p className="text-[10px] font-black uppercase tracking-widest">Create Custom Report Template</p>
            </div>
          </motion.div>
        </div>

        {/* --- Bottom Table: Lifecycle Analysis --- */}
        <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-slate-50">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#111827]">Active Project Lifecycle Analysis</h3>
            <button className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1 hover:text-[#111827] transition-colors">
              View Detailed Ledger <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-10 py-4">Project Identity</th>
                  <th className="px-10 py-4">Current Phase</th>
                  <th className="px-10 py-4">Budget Health</th>
                  <th className="px-10 py-4">Timeline</th>
                  <th className="px-10 py-4 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <LifecycleRow 
                  name="Project Neon Genesis" sub="Strategic R&D" 
                  phase="Optimization" health="92% Utilized" timeline="Nov 12, 2024" risk="02" 
                />
                <LifecycleRow 
                  name="Echelon Logistics" sub="Infrastructure Update" 
                  phase="Execution" health="104% Over" timeline="Jan 05, 2025" risk="08" isHighRisk 
                />
                <LifecycleRow 
                  name="Apex Data Core" sub="Security Systems" 
                  phase="Discovery" health="12% Allocated" timeline="Mar 18, 2025" risk="01" 
                />
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// --- Helper Components ---

function AllocationRow({ label, budget, actual, percent, isOver }) {
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-3">
        <h4 className="text-[11px] font-black text-[#111827] uppercase tracking-tight">{label}</h4>
        <p className="text-[10px] font-bold text-slate-400">
          <span className={isOver ? 'text-rose-500' : 'text-[#111827]'}>${actual}k</span> / ${budget}k 
          <span className="ml-2 opacity-50 font-medium">{percent}%</span>
        </p>
      </div>
      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: `${Math.min(percent, 100)}%` }}
          className={`h-full rounded-full ${isOver ? 'bg-rose-500' : 'bg-[#111827]'}`} 
        />
      </div>
    </div>
  );
}

function ReportCard({ icon, title, sub }) {
  return (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 flex items-center gap-5 hover:border-blue-100 transition-all cursor-pointer group shadow-sm hover:shadow-md">
      <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
        {icon}
      </div>
      <div>
        <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-tight mb-1">{title}</h4>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}

function LifecycleRow({ name, sub, phase, health, timeline, risk, isHighRisk }) {
  return (
    <tr className="hover:bg-slate-50/50 transition-all cursor-pointer group">
      <td className="px-10 py-6">
        <div className="flex items-center gap-4">
          <div className="w-1.5 h-10 bg-[#111827] rounded-full opacity-10 group-hover:opacity-100 transition-opacity" />
          <div>
            <h4 className="text-[11px] font-black text-[#111827] uppercase tracking-tight leading-none mb-1.5">{name}</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
          </div>
        </div>
      </td>
      <td className="px-10 py-6">
        <span className="text-[9px] font-black px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-slate-600 uppercase tracking-tighter">
          {phase}
        </span>
      </td>
      <td className="px-10 py-6">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-rose-500' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-bold text-slate-700">{health}</span>
        </div>
      </td>
      <td className="px-10 py-6">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{timeline}</p>
        <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">Final Review</p>
      </td>
      <td className="px-10 py-6 text-right">
        <span className={`text-xl font-black italic ${isHighRisk ? 'text-rose-500' : 'text-[#111827]'}`}>{risk}</span>
      </td>
    </tr>
  );
}