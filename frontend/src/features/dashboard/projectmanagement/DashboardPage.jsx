"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, ChevronRight, Info, 
  CheckCircle2, AlertCircle, TrendingUp 
} from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FA]">
      <main className="max-w-[1300px] mx-auto px-6 pb-8 w-full mt-2 space-y-6">
        
        {/* 1. Compact Header */}
        <div className="flex justify-between items-end">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">
              Operational Landscape
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">
              Thursday, Oct 24 • Good Morning, Alexander
            </p>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#111827] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.15em] shadow-lg"
          >
            <Plus size={14} /> Initiative
          </motion.button>
        </div>

        {/* 2. Minimized Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard title="Active Projects" value="08" badge="+2" color="bg-orange-100 text-orange-600" />
          <MetricCard title="Pending Approvals" value="12" badge="High" color="bg-rose-100 text-rose-600" />
          <MetricCard title="Open Issues" value="05" badge="3 Crit" color="bg-blue-100 text-blue-600" />
          <MetricCard title="Efficiency" value="94%" badge="Opt" color="bg-emerald-100 text-emerald-600" />
        </div>

        {/* 3. Main Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT: Schedules */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Master Schedule</h3>
                <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  <button className="hover:text-black"><ChevronRight size={14} className="rotate-180" /></button>
                  <span className="bg-slate-50 px-2 py-1 rounded text-black">Oct 2024</span>
                  <button className="hover:text-black"><ChevronRight size={14} /></button>
                </div>
              </div>
              <div className="space-y-4">
                <TimelineRow label="Skyline Tower" task="Foundation Completion" progress={70} />
                <TimelineRow label="Bridge Exp." task="Structural Scan" progress={45} color="bg-blue-500" />
                <TimelineRow label="Metro North" task="Soil Grading" progress={25} color="bg-slate-300" />
              </div>
            </section>

            <section className="bg-white rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Operational Health</h3>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Delta +4.2%</span>
              </div>
              <div className="h-32 flex items-end justify-between px-4">
                {['ST', 'BR', 'MN', 'WC', 'HP', 'AZ'].map((label, idx) => (
                  <div key={label} className="flex flex-col items-center gap-2 group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: [30, 90, 60, 80][idx % 4] }}
                      className="w-8 bg-slate-100 rounded-lg group-hover:bg-[#111827] transition-all cursor-pointer relative"
                    />
                    <span className="text-[8px] font-black text-slate-400">{label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT: Queue & Logs */}
          <div className="space-y-6">
            <section className="bg-[#111827] rounded-[1.5rem] p-6 text-white shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-[10px] uppercase tracking-widest">Approval Queue</h3>
                <span className="text-[8px] bg-blue-600 px-1.5 py-0.5 rounded font-black">12 NEW</span>
              </div>
              <div className="space-y-2">
                <QueueItem title="HVAC System Refactor" sub="Marcus Holloway" isUrgent />
                <QueueItem title="Grid Tie-In Verify" sub="Sara Chen" dark />
                <QueueItem title="Exterior Hardscape" sub="Leon Vance" dark />
              </div>
              <button className="w-full mt-4 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
                View Repository
              </button>
            </section>

            <div className="space-y-3">
              <h3 className="font-black text-slate-900 text-[9px] uppercase tracking-[0.2em] px-2">Live Reports</h3>
              <ReportItem icon={<CheckCircle2 className="text-emerald-500" size={14} />} title="Structural Milestone" time="14m" />
              <ReportItem icon={<AlertCircle className="text-orange-500" size={14} />} title="Logistics Block" time="2h" />
              <ReportItem icon={<TrendingUp className="text-blue-500" size={14} />} title="Env. Compliance" time="5h" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

// --- MINI HELPER COMPONENTS ---

const MetricCard = ({ title, value, badge, color }) => (
  <motion.div whileHover={{ y: -2 }} className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <Info size={12} className="text-slate-200" />
    </div>
    <div className="flex items-baseline justify-between">
      <h3 className="text-2xl font-black text-[#111827] tracking-tighter italic">{value}</h3>
      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${color} uppercase`}>
        {badge}
      </span>
    </div>
  </motion.div>
);

const TimelineRow = ({ label, task, progress, color = "bg-[#111827]" }) => (
  <div className="flex items-center gap-3">
    <span className="text-[9px] font-black text-slate-400 uppercase w-20 truncate">{label}</span>
    <div className="flex-1 relative h-7 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        className={`absolute h-full ${color} flex items-center px-3 transition-all duration-1000`}
      >
        <span className="text-[8px] text-white font-black uppercase tracking-widest whitespace-nowrap overflow-hidden">
          {task}
        </span>
      </motion.div>
    </div>
    <span className="text-[8px] font-bold text-slate-300 w-6 text-right">{progress}%</span>
  </div>
);

const QueueItem = ({ title, sub, isUrgent, dark }) => (
  <div className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer 
    ${isUrgent ? 'border-rose-500/30 bg-rose-500/10' : 
      dark ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-slate-100 bg-slate-50 hover:bg-white'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-0.5 h-6 rounded-full ${isUrgent ? 'bg-rose-500' : 'bg-slate-600'}`} />
      <div>
        <h4 className={`text-[10px] font-black ${dark || isUrgent ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{sub}</p>
      </div>
    </div>
    <ChevronRight size={12} className="text-slate-500 group-hover:text-white transition-colors" />
  </div>
);

const ReportItem = ({ icon, title, time }) => (
  <div className="flex gap-3 items-center p-3 bg-white rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all group cursor-pointer">
    <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 group-hover:scale-105 transition-all">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{title}</h4>
        <span className="text-[8px] font-bold text-slate-400">{time}</span>
      </div>
    </div>
  </div>
); 

export default DashboardPage;