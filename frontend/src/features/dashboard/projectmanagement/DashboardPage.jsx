"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, ChevronRight, Info, 
  Droplets, HardHat, Construction, 
  AlertOctagon, TrendingUp, Sun, Map
} from 'lucide-react';

// Animation Variants for staggering children
const containerVars = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const SiteEngineerDashboard = () => {
  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] selection:bg-[#111827] selection:text-white">
      <motion.main 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="max-w-[1300px] mx-auto px-6 pb-8 w-full mt-4 space-y-6"
      >
        
        {/* 1. HEADER */}
        <motion.div variants={itemVars} className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">
              Site Operations Hub
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">
              Sector 4 • Structural Phase II • Day 142
            </p>
          </div>

          <div className="flex gap-3">
            <motion.div whileHover={{ y: -2 }} className="bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-3 cursor-default">
               <Sun size={14} className="text-orange-400" />
               <span className="text-[9px] font-black uppercase tracking-tighter">24°C Clear</span>
            </motion.div>
            <motion.button 
              whileHover={{ scale: 1.03, backgroundColor: "#1f2937" }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#111827] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.15em] shadow-lg transition-colors"
            >
              <Plus size={14} /> New Log
            </motion.button>
          </div>
        </motion.div>

        {/* 2. METRICS GRID */}
        <motion.div variants={containerVars} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Steel Rebar" value="84.2" unit="tn" badge="Nominal" color="bg-slate-100 text-slate-600" />
          <MetricCard title="Concrete" value="12" unit="m³" badge="ETA 14:00" color="bg-blue-100 text-blue-600" />
          <MetricCard title="Active Labor" value="142" unit="PA" badge="+12" color="bg-emerald-100 text-emerald-600" />
          <MetricCard title="Safety Index" value="98%" unit="" badge="Optimal" color="bg-orange-100 text-orange-600" />
        </motion.div>

        {/* 3. MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            <motion.section variants={itemVars} className="bg-white rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Priority Directives</h3>
                <span className="text-[9px] font-black text-slate-400 uppercase">6 Tasks Remaining</span>
              </div>
              <div className="space-y-4">
                <DirectiveRow label="Zone B" task="Foundation Pour" progress={70} />
                <DirectiveRow label="Sector 4" task="MEP Inspection" progress={45} color="bg-blue-500" />
                <DirectiveRow label="Roof" task="Truss Installation" progress={15} color="bg-slate-300" />
              </div>
            </motion.section>

            <motion.section variants={itemVars} className="bg-white rounded-[1.5rem] p-6 border border-slate-200/60 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-widest">Build Velocity</h3>
                <span className="text-[8px] font-black text-emerald-600 uppercase tracking-tighter">Efficiency +4.2%</span>
              </div>
              <div className="h-28 flex items-end justify-between px-4">
                {[40, 70, 30, 90, 60, 80, 95].map((h, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 group">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ delay: 0.5 + (idx * 0.05), duration: 0.8, ease: "circOut" }}
                      className={`w-10 rounded-t-md transition-all cursor-pointer ${idx === 6 ? 'bg-[#111827]' : 'bg-slate-100 group-hover:bg-slate-300'}`}
                    />
                    <span className="text-[8px] font-black text-slate-400">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][idx]}</span>
                  </div>
                ))}
              </div>
            </motion.section>
          </div>

          <div className="space-y-6">
            <motion.section variants={itemVars} className="bg-[#111827] rounded-[1.5rem] p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">Critical Alerts</h3>
                  <AlertOctagon size={14} className="text-rose-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <IssueItem title="Water Main Pressure" sub="Zone C-4 Sector" isUrgent />
                  <IssueItem title="Crane 2 Sensor" sub="Mechanical Warning" dark />
                </div>
                <motion.button 
                  whileHover={{ x: 3 }}
                  className="w-full mt-4 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  Open Emergency Protocol <ChevronRight size={10} />
                </motion.button>
              </div>
            </motion.section>

            <motion.div variants={itemVars} className="bg-white rounded-[1.5rem] p-4 border border-slate-200/60 shadow-sm group cursor-crosshair">
               <div className="flex items-center justify-between mb-4">
                 <h3 className="font-black text-slate-900 text-[9px] uppercase tracking-[0.2em]">Site Map View</h3>
                 <Map size={12} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
               </div>
               <div className="h-32 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:10px_10px]" />
                  <motion.span 
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-[8px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    Live Sector Feed
                  </motion.span>
               </div>
            </motion.div>

            <motion.div variants={containerVars} className="space-y-3 pt-2">
              <ReportItem icon={<Construction size={14} className="text-blue-500" />} title="Logistics Update" time="14m" />
              <ReportItem icon={<TrendingUp size={14} className="text-emerald-500" />} title="Structural Sign-off" time="2h" />
            </motion.div>
          </div>

        </div>
      </motion.main>
    </div>
  );
};

// --- OPTIMIZED COMPONENTS ---

const MetricCard = ({ title, value, unit, badge, color }) => (
  <motion.div 
    variants={itemVars}
    whileHover={{ y: -3, transition: { duration: 0.2 } }} 
    className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm cursor-default"
  >
    <div className="flex justify-between items-start mb-2">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <Info size={12} className="text-slate-200 hover:text-slate-400 transition-colors" />
    </div>
    <div className="flex items-baseline justify-between">
      <div className="flex items-baseline gap-1">
        <h3 className="text-2xl font-black text-[#111827] tracking-tighter italic">{value}</h3>
        <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
      </div>
      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${color} uppercase`}>
        {badge}
      </span>
    </div>
  </motion.div>
);

const DirectiveRow = ({ label, task, progress, color = "bg-[#111827]" }) => (
  <div className="flex items-center gap-3 group">
    <span className="text-[9px] font-black text-slate-400 uppercase w-16 truncate group-hover:text-slate-900 transition-colors">{label}</span>
    <div className="flex-1 relative h-8 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.2, ease: "circOut", delay: 0.4 }}
        className={`absolute h-full ${color} flex items-center px-3 transition-all`}
      >
        <span className="text-[8px] text-white font-black uppercase tracking-widest whitespace-nowrap">
          {task}
        </span>
      </motion.div>
    </div>
    <span className="text-[8px] font-bold text-slate-300 w-6 text-right">{progress}%</span>
  </div>
);

const IssueItem = ({ title, sub, isUrgent, dark }) => (
  <motion.div 
    whileHover={{ x: 4 }}
    className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer 
    ${isUrgent ? 'border-rose-500/30 bg-rose-500/10' : 
      dark ? 'border-white/5 bg-white/5 hover:bg-white/10' : 'border-slate-100 bg-slate-50 hover:bg-white'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-1 h-6 rounded-full transition-all ${isUrgent ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-slate-600 group-hover:bg-blue-400'}`} />
      <div>
        <h4 className={`text-[10px] font-black ${dark || isUrgent ? 'text-white' : 'text-slate-800'}`}>{title}</h4>
        <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter">{sub}</p>
      </div>
    </div>
    <ChevronRight size={12} className="text-slate-500 group-hover:text-white transform group-hover:translate-x-1 transition-all" />
  </motion.div>
);

const ReportItem = ({ icon, title, time }) => (
  <motion.div 
    variants={itemVars}
    whileHover={{ scale: 1.01, x: 4 }}
    className="flex gap-3 items-center p-3 bg-white rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all group cursor-pointer"
  >
    <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-blue-50 transition-all">{icon}</div>
    <div className="flex-1">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{title}</h4>
        <span className="text-[8px] font-bold text-slate-400">{time}</span>
      </div>
    </div>
  </motion.div>
); 

export default SiteEngineerDashboard;