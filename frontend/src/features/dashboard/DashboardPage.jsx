'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, FileText, Bug, Zap, Share2, 
  ArrowUpRight, TrendingUp 
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25 } }
};

export default function DashboardHome() {
  return (
    <motion.div 
      variants={containerVars} 
      initial="hidden" 
      animate="visible"
      className="space-y-8 font-sans antialiased text-slate-900"
    >
      
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">System Telemetry Data</p>
        </div>
        <div className="flex gap-2">
          <div className="h-1 w-12 bg-blue-600 rounded-full mb-2" />
        </div>
      </header>

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="TOTAL USERS" value="12,842" trend="+8.2%" icon={<Users size={16} />} color="blue" />
        <StatCard label="ACTIVE NODES" value="148" trend="+12.5%" icon={<Zap size={16} />} color="emerald" />
        <StatCard label="DOCUMENTS" value="3,204" trend="+2.4%" icon={<FileText size={16} />} color="indigo" />
        <StatCard label="SECURITY" value="24" badge="Urgent" icon={<Bug size={16} />} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        <motion.div 
          variants={itemVars}
          className="lg:col-span-2 bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Annual Node Growth</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">12-Month Analytics</p>
            </div>
            <TrendingUp className="text-slate-200" size={20} />
          </div>
          
          <div className="h-48 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 },
                { name: 'Mar', value: 600 }, { name: 'Apr', value: 500 },
                { name: 'May', value: 450 }, { name: 'Jun', value: 800 },
              ]}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} />
                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 4, 4]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

       
        <motion.div 
          variants={itemVars}
          className="bg-[#0a0c18] p-6 rounded-[2rem] text-white shadow-xl relative flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-bold tracking-tight">Task Velocity</h3>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mt-1">Optimization: High</p>
          </div>

          <div className="relative flex justify-center my-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="54" stroke="#1e293b" strokeWidth="10" fill="transparent" />
              <motion.circle 
                cx="64" cy="64" r="54" stroke="#2563eb" strokeWidth="10" fill="transparent"
                strokeDasharray="339" initial={{ strokeDashoffset: 339 }}
                animate={{ strokeDashoffset: 339 - (339 * 0.82) }}
                transition={{ duration: 1.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">82%</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Sync</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
            <span>Status</span>
            <span className="text-white">Active</span>
          </div>
        </motion.div>
      </div>

     
      <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">System Activity</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Real-time Telemetry</p>
          </div>
          <ArrowUpRight size={18} className="text-slate-300" />
        </div>
        
        <div className="space-y-6">
          <ActivityRow title="Alpha Node Encryption" time="2h ago" />
          <ActivityRow title="Neural Network Training" time="5h ago" isUrgent />
        </div>
      </motion.div>
    </motion.div>
  );
}



function StatCard({ label, value, trend, icon, color, badge }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
    rose: "text-rose-600 bg-rose-50"
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold text-slate-900">{value}</p>
          <span className="text-[8px] font-black text-emerald-500">{trend}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ title, time, isUrgent }) {
  return (
    <div className="flex items-center justify-between group border-b border-slate-50 pb-4 last:border-none">
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'}`} />
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-tight">{title}</h4>
      </div>
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
    </div>
  );
}