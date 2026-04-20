'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle2, FileText, 
  Filter, Download, MoreHorizontal, 
  ArrowUpRight, Zap, ShieldAlert
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

export default function IssueTracking() {
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
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600 mb-2">Operational Integrity</p>
            <h1 className="text-4xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">
              Issue Tracking
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-4 max-w-xl leading-relaxed">
              Centralized monitoring of site-wide technical debt, architectural anomalies, and critical failures.
            </p>
          </motion.div>

          <motion.button 
            variants={itemVars} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="bg-[#111827] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-2xl"
          >
            <AlertTriangle size={16} strokeWidth={3} /> Report New Issue
          </motion.button>
        </div>

        {/* --- Metric Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard 
            icon={<ShieldAlert className="text-rose-500" />} 
            label="Critical Exceptions" value="24" sub="+12% vs last week" color="rose" 
          />
          <MetricCard 
            icon={<Zap className="text-amber-500" />} 
            label="Active Resolutions" value="158" sub="Avg 4.2h response" color="amber" 
          />
          <MetricCard 
            icon={<FileText className="text-blue-500" />} 
            label="Documentation Assets" value="2.4k" sub="89% Coverage" color="blue" 
          />
        </div>

        {/* --- Active Issue Ledger --- */}
        <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-slate-50">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#111827]">Active Issue Ledger</h3>
            <div className="flex gap-2">
              <TableButton icon={<Download size={14} />} label="Export CSV" />
              <TableButton icon={<Filter size={14} />} label="Filter" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-8 py-4">Issue Descriptor</th>
                  <th className="px-8 py-4">Priority</th>
                  <th className="px-8 py-4">Assigned Lead</th>
                  <th className="px-8 py-4">Photo Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <IssueRow 
                  title="HVAC Compression Failure - Sector B" desc="Detected 4h ago by automated sensor net"
                  priority="CRITICAL" priorityColor="rose" lead="Marcus Thorne"
                  status="Verified (4)" hasStatus
                />
                <IssueRow 
                  title="Structural Integrity Anomaly - Lvl 4" desc="Visual inspection required for load-bearing joints"
                  priority="HIGH" priorityColor="amber" lead="Elena Rodriguez"
                  status="Missing Assets"
                />
                <IssueRow 
                  title="Fire Suppression Calibration" desc="Routine monthly adjustment of misting systems"
                  priority="STANDARD" priorityColor="blue" lead="Simon Chen"
                  status="Verified (12)" hasStatus
                />
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* --- Lower Section: Evidence & Insights --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVars} className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#111827] mb-8">Recent Field Evidence</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((img) => (
                <div key={img} className="aspect-square rounded-2xl bg-slate-100 overflow-hidden group cursor-pointer relative">
                  <img 
                    src={`https://api.dicebear.com/7.x/identicon/svg?seed=issue${img}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60 grayscale" 
                    alt="Evidence" 
                  />
                  <div className="absolute inset-0 bg-[#111827]/10 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="bg-[#111827] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group flex flex-col justify-between">
            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <Zap className="text-blue-400" size={32} />
                <ArrowUpRight className="text-slate-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black italic tracking-tighter">Predictive Insight</h3>
                <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
                  AI analysis suggests a 22% increase in cooling failure probability within Sector B over the next 48 hours based on current vibration logs.
                </p>
              </div>
              <button className="w-full bg-white text-[#111827] py-4 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 transition-colors">
                View Maintenance Strategy
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Helper Components ---

function MetricCard({ icon, label, value, sub, color }) {
  const colorMap = {
    rose: "group-hover:text-rose-500",
    amber: "group-hover:text-amber-500",
    blue: "group-hover:text-blue-500"
  };

  return (
    <motion.div variants={itemVars} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-44 group hover:border-slate-200 transition-all">
      <div className="flex justify-between items-start">
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white transition-colors">
          {icon}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className={`text-4xl font-black text-[#111827] tracking-tighter italic leading-none transition-colors ${colorMap[color]}`}>
          {value}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-2">{sub}</p>
      </div>
    </motion.div>
  );
}

function IssueRow({ title, desc, priority, priorityColor, lead, status, hasStatus }) {
  const pColors = {
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    blue: "text-blue-600 bg-blue-50 border-blue-100"
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-all group cursor-pointer">
      <td className="px-8 py-6">
        <h4 className="text-[11px] font-black text-[#111827] uppercase tracking-tight leading-none mb-2">{title}</h4>
        <p className="text-[9px] font-medium text-slate-400 italic">{desc}</p>
      </td>
      <td className="px-8 py-6">
        <span className={`text-[8px] font-black px-3 py-1 rounded border uppercase tracking-tighter ${pColors[priorityColor]}`}>
          • {priority}
        </span>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-slate-100 overflow-hidden ring-1 ring-slate-100">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead}`} alt="Lead" />
          </div>
          <span className="text-[10px] font-bold text-slate-700">{lead}</span>
        </div>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-2">
          {hasStatus ? <CheckCircle2 size={14} className="text-emerald-500" /> : <div className="w-3.5 h-3.5 border-2 border-slate-200 rounded-full" />}
          <span className={`text-[10px] font-bold ${hasStatus ? 'text-slate-600' : 'text-slate-300 uppercase tracking-tighter text-[9px]'}`}>
            {status}
          </span>
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        <button className="text-slate-300 hover:text-[#111827] transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </td>
    </tr>
  );
}

function TableButton({ icon, label }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
      {icon} {label}
    </button>
  );
}