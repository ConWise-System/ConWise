// app/(dashboard)/projectmanagement/page.jsx
"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, ChevronRight, Info, 
  CheckCircle2, AlertCircle, TrendingUp 
} from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="w-full">
      {/* Layout keessatti ml-[280px] waan jiruuf, asitti max-w qofaan hinfisna */}
      <main className="max-w-[1400px] mx-auto px-8 pb-12 w-full mt-4">
        
        {/* 1. Welcome Header */}
        <div className="flex justify-between items-end mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-[#111827] tracking-tighter">Good morning, Alexander</h1>
            <p className="text-slate-500 font-medium mt-1">
              Reviewing your current operational landscape for Thursday, Oct 24.
            </p>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#111827] text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-xl"
          >
            <Plus size={18} /> New Project Initiative
          </motion.button>
        </div>

        {/* 2. Operational Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard title="Active Projects" value="08" badge="+2 this month" color="bg-orange-100 text-orange-600" />
          <MetricCard title="Pending Task Approvals" value="12" badge="High Priority" color="bg-rose-100 text-rose-600" />
          <MetricCard title="Open Issues" value="05" badge="3 Critical" color="bg-blue-100 text-blue-600" />
          <MetricCard title="Budget Efficiency" value="94%" badge="Optimized" color="bg-emerald-100 text-emerald-600" />
        </div>

        {/* 3. Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: Master Schedule & Operational Health */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm tracking-[0.1em]">Master Schedule</h3>
                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <button className="hover:text-slate-900"><ChevronRight size={16} className="rotate-180" /></button>
                  <span>October 2024</span>
                  <button className="hover:text-slate-900"><ChevronRight size={16} /></button>
                </div>
              </div>
              <div className="space-y-8">
                <TimelineRow label="Skyline Tower" task="Foundation Completion" progress={70} />
                <TimelineRow label="Bridge Exp." task="Structural Integrity Scan" progress={45} color="bg-blue-400" />
                <TimelineRow label="Metro North" task="Soil Grading" progress={25} color="bg-slate-200" />
              </div>
            </section>

            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm min-h-[350px]">
              <div className="flex justify-between items-center mb-12">
                <h3 className="font-black text-slate-900 tracking-tight uppercase text-sm tracking-[0.1em]">Operational Health</h3>
                <span className="text-[9px] font-black bg-slate-50 px-3 py-1.5 rounded-lg text-slate-500 uppercase tracking-widest">Weekly Delta +4%</span>
              </div>
              <div className="h-48 flex items-end justify-between px-6">
                {['ST', 'BR', 'MN', 'WC', 'HP', 'AZ'].map((label, idx) => (
                  <div key={label} className="flex flex-col items-center gap-4 group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: [40, 120, 80, 100][idx % 4] }}
                      className="w-10 bg-slate-50 rounded-xl group-hover:bg-[#111827] transition-all cursor-pointer relative"
                    />
                    <span className="text-[10px] font-black text-slate-300">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Task Queue & Reports */}
          <div className="space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900 tracking-tight text-sm uppercase">Task Approval Queue</h3>
                <span className="bg-[#111827] text-white text-[9px] px-2 py-0.5 rounded-full font-black">12 NEW</span>
              </div>
              <div className="space-y-4">
                <QueueItem title="HVAC System Refactor" sub="Sub: Marcus Holloway" isUrgent />
                <QueueItem title="Grid Tie-In Verification" sub="Sub: Sara Chen" />
                <QueueItem title="Exterior Hardscaping" sub="Sub: Leon Vance" />
              </div>
              <button className="w-full mt-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-t border-slate-50 hover:text-blue-600 transition-all">
                View All Tasks
              </button>
            </section>

            <div className="space-y-4">
              <h3 className="font-black text-slate-900 tracking-tight text-sm uppercase px-2">Recent Site Reports</h3>
              <ReportItem icon={<CheckCircle2 className="text-emerald-500" size={18} />} title="Structural Integrity Milestone" time="14m ago" />
              <ReportItem icon={<AlertCircle className="text-orange-500" size={18} />} title="Logistics Blockage Alert" time="2h ago" />
              <ReportItem icon={<TrendingUp className="text-blue-500" size={18} />} title="Environmental Compliance" time="5h ago" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS (Keep these as they are) ---
const MetricCard = ({ title, value, badge, color }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white p-7 rounded-[2rem] border border-slate-100 shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{title}</p>
      <Info size={14} className="text-slate-200" />
    </div>
    <div className="flex items-baseline justify-between">
      <h3 className="text-4xl font-black text-[#111827] tracking-tighter">{value}</h3>
      <span className={`text-[9px] font-bold px-2.5 py-1 rounded-lg ${color} uppercase tracking-tighter`}>
        {badge}
      </span>
    </div>
  </motion.div>
);

const TimelineRow = ({ label, task, progress, color = "bg-[#111827]" }) => (
  <div className="grid grid-cols-4 items-center gap-4">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
    <div className="col-span-3 relative h-11 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`absolute h-full ${color} flex items-center px-4 transition-all duration-1000 shadow-lg`}
      >
        <span className="text-[9px] text-white font-black uppercase tracking-widest whitespace-nowrap">{task}</span>
      </motion.div>
    </div>
  </div>
);

const QueueItem = ({ title, sub, isUrgent }) => (
  <div className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${isUrgent ? 'border-rose-100 bg-rose-50/20' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200 hover:bg-white'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-1 h-8 rounded-full ${isUrgent ? 'bg-rose-500' : 'bg-slate-200'}`} />
      <div>
        <h4 className="text-[11px] font-bold text-slate-800">{title}</h4>
        <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{sub}</p>
      </div>
    </div>
    <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
  </div>
);

const ReportItem = ({ icon, title, time }) => (
  <div className="flex gap-4 items-start p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
    <div className="p-2.5 bg-slate-50 rounded-xl group-hover:bg-white group-hover:scale-110 transition-all">{icon}</div>
    <div className="flex-1">
      <h4 className="text-[11px] font-bold text-slate-800">{title}</h4>
      <div className="flex justify-between items-center mt-1.5">
        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">River Crossing</span>
        <span className="text-[9px] font-bold text-slate-400">{time}</span>
      </div>
    </div>
  </div>
);

export default DashboardPage;