'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Bug, Zap, Share2, 
  ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Sample Chart Data
const chartData = [
  { name: 'Jan', value: 400, top: 100 },
  { name: 'Feb', value: 300, top: 150 },
  { name: 'Mar', value: 600, top: 80 },
  { name: 'Apr', value: 500, top: 120 },
  { name: 'May', value: 450, top: 90 },
  { name: 'Jun', value: 800, top: 110 },
];

const containerVars = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25 } }
};

export default function DashboardHome() {
  return (
    <motion.div 
      variants={containerVars} 
      initial="hidden" 
      animate="visible"
      className="space-y-10"
    >
      {/* Page Title */}
      <header className="relative inline-block">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Overview</h1>
        <motion.div 
          initial={{ width: 0 }} animate={{ width: "100%" }}
          className="h-1.5 bg-blue-600 rounded-full mt-1"
        />
      </header>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="TOTAL USERS" value="12,842" trend="+8.2%" icon={<Users size={20} />} color="blue" />
        <StatCard title="ACTIVE NODES" value="148" trend="+12.5%" icon={<Zap size={20} />} color="emerald" />
        <StatCard title="DOCUMENTATION" value="3,204" trend="+2.4%" icon={<FileText size={20} />} color="indigo" />
        <StatCard title="SECURITY ALERTS" value="24" badge="Urgent" icon={<Bug size={20} />} color="rose" />
      </div>

      {/* Middle Section: Chart & Task Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Annual Node Growth (Light Card) */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-12">
            <div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Annual Node Growth</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Full 12-Month Telemetry</p>
            </div>
            <Share2 className="text-slate-100 absolute -right-4 -top-4" size={120} />
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <Tooltip cursor={{fill: '#f8fafc', radius: 10}} contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 800, fill: '#cbd5e1'}} />
                <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 6, 6]} barSize={15} />
                <Bar dataKey="top" fill="#e2e8f0" radius={[6, 6, 6, 6]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Task Velocity (Dark Card) */}
        <motion.div 
          variants={itemVars}
          className="bg-[#0a0c18] p-10 rounded-[3rem] text-white shadow-2xl relative flex flex-col justify-between"
        >
          <div>
            <h3 className="text-xl font-black tracking-tight">Task Velocity</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Optimization: High</p>
          </div>

          <div className="relative flex justify-center my-8">
            <svg className="w-44 h-44 transform -rotate-90">
              <circle cx="88" cy="88" r="75" stroke="#1e293b" strokeWidth="14" fill="transparent" />
              <motion.circle 
                cx="88" cy="88" r="75" stroke="#3b82f6" strokeWidth="14" fill="transparent"
                strokeDasharray="471"
                initial={{ strokeDashoffset: 471 }}
                animate={{ strokeDashoffset: 471 - (471 * 0.82) }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black">82%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Sync</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Deploying</span>
              </div>
              <span className="text-sm font-black">1,240</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Standby</span>
              </div>
              <span className="text-sm font-black">842</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Activity */}
      <motion.div 
        variants={itemVars}
        className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm"
      >
        <div className="flex justify-between items-center mb-10">
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">System Activity</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Telemetry Data</p>
          </div>
          <button className="p-4 bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowUpRight size={24} />
          </button>
        </div>
        
        <div className="space-y-8">
          <ActivityRow title="Alpha Node Encryption" desc="Quantum-resistant layers applied to all core databases." time="2h ago" />
          <ActivityRow title="Neural Network Training" desc="Phase 4 of customer behavior model completed." time="5h ago" isUrgent />
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Internal Helper Components ---

function StatCard({ title, value, trend, icon, color, badge }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
    rose: "bg-rose-50 text-rose-600"
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${colorMap[color]}`}>{icon}</div>
        {badge ? (
          <span className="bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full">{badge}</span>
        ) : (
          <span className="text-[11px] font-black text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-lg">{trend}</span>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
      <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h2>
    </motion.div>
  );
}

function ActivityRow({ title, desc, time, isUrgent }) {
  return (
    <div className="flex gap-8 group">
      <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
        <div className={`w-3 h-3 rounded-full ${isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
      </div>
      <div className="flex-1 border-b border-slate-50 pb-8 last:border-none">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-black text-slate-900">{title}</h4>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-sm text-slate-500 font-medium mt-1">{desc}</p>
      </div>
    </div>
  );
}