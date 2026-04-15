'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FolderOpen, CheckCircle2, AlertTriangle, 
  TrendingUp, Plus, Search, Bell, Settings,
  ArrowUpRight, Clock, FileText, ChevronRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';

// Data mock for the chart
const chartData = [
  { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 }, { name: 'Apr', value: 500 },
  { name: 'May', value: 700 }, { name: 'Jun', value: 850 },
];

const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

export default function DashboardPage() {
  return (
    <motion.div 
      variants={containerVars} 
      initial="hidden" 
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* --- TOP ACTION BAR --- */}
      <div className="flex justify-between items-end">
        <motion.div variants={itemVars}>
          <h1 className="text-4xl font-black tracking-tight text-[#111827]">Good morning, Alexander</h1>
          <p className="text-slate-500 font-medium mt-1 uppercase text-[10px] tracking-[0.2em]">Operational Overview • Oct 24, 2026</p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#111827] text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-xl"
        >
          <Plus size={18} /> New Project Initiative
        </motion.button>
      </div>

      {/* --- STATISTICAL TELEMETRY --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Projects" value="08" trend="+2 New" color="orange" />
        <StatCard label="Pending Approvals" value="12" trend="Urgent" color="red" />
        <StatCard label="Open Issues" value="05" trend="3 Critical" color="slate" />
        <StatCard label="Budget Efficiency" value="94%" trend="Optimized" color="emerald" />
      </div>

      {/* --- ANALYTICS & APPROVALS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Master Schedule Visualization */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm"
        >
          <div className="flex justify-between items-start mb-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Master Schedule</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Real-time Progress Tracking</p>
            </div>
            <div className="flex gap-2">
              <div className="h-1 w-8 bg-blue-600 rounded-full" />
              <div className="h-1 w-2 bg-slate-100 rounded-full" />
            </div>
          </div>
          
          <div className="space-y-6">
             <ScheduleRow label="Skyline Tower" progress="85%" task="Foundation Completion" />
             <ScheduleRow label="Bridge Expansion" progress="45%" task="Structural Scan" color="bg-blue-300" />
             <ScheduleRow label="Metro North" progress="20%" task="Soil Grading" color="bg-slate-200" />
          </div>
        </motion.div>

        {/* Task Approval Queue */}
        <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Approval Queue</h3>
            <span className="bg-slate-900 text-white text-[9px] px-2 py-0.5 rounded-full font-black">12 NEW</span>
          </div>
          <div className="space-y-4 flex-grow">
            <ApprovalItem title="HVAC System Refactor" sub="Sub: Marcus Holloway" isUrgent />
            <ApprovalItem title="Grid Tie-In Verification" sub="Sub: Sara Chen" />
            <ApprovalItem title="Exterior Hardscaping" sub="Sub: Leon Vance" />
          </div>
          <button className="mt-8 w-full py-4 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">
            View All Pending
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}

// --- HELPER COMPONENTS ---

function StatCard({ label, value, trend, color }) {
  const colorStyles = {
    orange: "text-orange-600 bg-orange-50",
    red: "text-red-600 bg-red-50",
    emerald: "text-emerald-600 bg-emerald-50",
    slate: "text-slate-600 bg-slate-50"
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-4">{label}</p>
      <div className="flex items-baseline justify-between">
        <h3 className="text-4xl font-black text-[#111827] tracking-tighter">{value}</h3>
        <span className={`text-[9px] font-bold px-3 py-1 rounded-full ${colorStyles[color]}`}>{trend}</span>
      </div>
    </motion.div>
  );
}

function ScheduleRow({ label, progress, task, color = "bg-[#111827]" }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
        <span>{label}</span>
      </div>
      <div className="relative h-11 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: progress }} 
          className={`absolute left-0 top-0 h-full ${color} flex items-center px-4 transition-all duration-1000`}
        >
          <span className="text-[9px] text-white font-black uppercase tracking-widest whitespace-nowrap">{task}</span>
        </motion.div>
      </div>
    </div>
  );
}

function ApprovalItem({ title, sub, isUrgent }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 transition-all cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className={`w-1 h-8 rounded-full ${isUrgent ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`} />
        <div>
          <h4 className="text-[11px] font-bold text-slate-800">{title}</h4>
          <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{sub}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900" />
    </div>
  );
}