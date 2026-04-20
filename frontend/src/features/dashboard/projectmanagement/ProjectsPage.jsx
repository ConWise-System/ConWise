'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, MoreVertical, Briefcase, Search, Filter 
} from 'lucide-react';

// Animation Variants (Dashboard kee wajjin kan wal-simu)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: 'spring', stiffness: 100 } 
  }
};

export default function ProjectPortfolio() {
  return (
    <div className="w-full">
      {/* Content Area - Max-width dashboard kee wajjin tokko (1400px) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto px-8 pb-12 w-full mt-4 space-y-10"
      >
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-end mb-10">
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-black text-[#111827] tracking-tighter uppercase italic">
              Project Portfolio
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Overseeing 12 active construction sites and industrial developments.
            </p>
          </motion.div>

          <div className="flex gap-4">
            <motion.button 
               variants={itemVariants}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="bg-white text-slate-900 border border-slate-100 px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-sm"
            >
              <Filter size={16} /> Filter
            </motion.button>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#111827] text-white px-6 py-3.5 rounded-2xl flex items-center gap-2 font-bold text-xs uppercase tracking-widest shadow-xl"
            >
              <Plus size={18} /> New Project
            </motion.button>
          </div>
        </div>

        {/* --- Metrics Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricCard label="Active Budget" value="$42.8M" sub="+12.4% vs last month" color="amber" />
          <MetricCard label="Ongoing Phases" value="28" sub="14 Near Completion" color="blue" />
          
          <motion.div 
            variants={itemVariants}
            className="bg-[#111827] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl"
          >
            <div className="relative z-10 space-y-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">Quarterly Projection</p>
              <h3 className="text-2xl font-black italic tracking-tighter">Portfolio Expansion</h3>
              <p className="text-[11px] font-medium text-slate-400 max-w-[180px] leading-relaxed">
                Strategic infrastructure growth targeting Q4 completions.
              </p>
            </div>
            <div className="absolute right-[-20px] bottom-[-20px] opacity-10 group-hover:opacity-20 transition-opacity">
              <Briefcase size={140} />
            </div>
          </motion.div>
        </div>

        {/* --- Project Table Section --- */}
        <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-5 p-8 border-b border-slate-50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <div className="col-span-1">Project & Site</div>
            <div>Client Identity</div>
            <div>Fiscal Status</div>
            <div>Deployment</div>
            <div className="text-right pr-4">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-50">
            <ProjectRow 
              name="The Meridian Heights" site="Avenue des Arts, Brussels"
              client="Vanguard Real Estate" clientType="Industrial Commercial"
              budget="$12,450,000" phase="Phase 03: Framing" status="blue"
            />
            <ProjectRow 
              name="Orbital Logistics Hub" site="Sector 9, Hamburg Port"
              client="Global Freight Solutions" clientType="Government Infrastructure"
              budget="$8,900,000" phase="Phase 01: Excavation" status="amber"
            />
            <ProjectRow 
              name="Saint Jude Medical Center" site="Oak Park, Chicago"
              client="Healthcare Alliance" clientType="Public Sector"
              budget="$21,200,000" phase="Delayed: Supply Chain" status="rose"
            />
          </div>

          {/* Table Footer */}
          <div className="p-8 flex justify-between items-center bg-slate-50/50">
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest text-slate-500">
              <StatusIndicator color="bg-blue-500" label="On Track" />
              <StatusIndicator color="bg-amber-500" label="Initial Phase" />
              <StatusIndicator color="bg-rose-500" label="Attention Required" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              Showing 1-3 of 12 Projects
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

// --- Helper Components (Dashboard kee wajjin kan wal-fakkatu) ---

function MetricCard({ label, value, sub, color }) {
  return (
    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 group hover:border-blue-100 transition-colors">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className="space-y-1">
        <h3 className="text-5xl font-black text-[#111827] tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">
          {value}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-2">{sub}</p>
      </div>
    </motion.div>
  );
}

function ProjectRow({ name, site, client, clientType, budget, phase, status }) {
  const statusStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className="grid grid-cols-5 p-8 items-center hover:bg-slate-50/80 transition-all group cursor-pointer">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden shadow-inner ring-1 ring-slate-200">
          <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${name}`} alt="Project" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div>
          <h4 className="text-[12px] font-black text-[#111827] tracking-tight leading-none uppercase">{name}</h4>
          <p className="text-[10px] font-medium text-slate-400 mt-2">{site}</p>
        </div>
      </div>
      
      <div>
        <p className="text-[11px] font-black text-slate-700 tracking-tight leading-none">{client}</p>
        <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-2">{clientType}</p>
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-black text-[#111827] tracking-tight italic">{budget}</p>
        <div className="h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${status === 'rose' ? 'bg-rose-500' : 'bg-blue-500'} w-2/3`} />
        </div>
      </div>

      <div>
        <span className={`text-[9px] font-black px-4 py-2 rounded-full border uppercase tracking-tighter shadow-sm ${statusStyles[status]}`}>
          {phase}
        </span>
      </div>

      <div className="text-right pr-4">
        <button className="p-2 rounded-lg text-slate-300 hover:text-slate-900 hover:bg-white transition-all">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}

function StatusIndicator({ color, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${color} shadow-[0_0_8px_currentColor]`} />
      <span className="font-bold">{label}</span>
    </div>
  );
}