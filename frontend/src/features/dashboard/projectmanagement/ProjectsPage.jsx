'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MoreVertical, Briefcase, Filter, ChevronRight, 
  Calendar, MapPin, User, DollarSign, CheckCircle2, 
  Users, ArrowLeft, Loader2, AlertCircle, TrendingUp
} from 'lucide-react';

// --- Animation Config ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } }
};

export default function ProjectPortfolio() {
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setView('list');
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F3F4F6] text-[#111827] font-sans antialiased p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          /* --- VIEW: PORTFOLIO LISTING --- */
          <motion.div 
            key="list" variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}
            className="max-w-[1300px] mx-auto space-y-6"
          >
            {/* Minimal Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black tracking-tight uppercase italic leading-none">Portfolio Management</h1>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">Industrial & Infrastructure Assets</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                  <Filter size={14} className="inline mr-2" /> Filter
                </button>
                <button 
                  onClick={() => setView('create')}
                  className="bg-[#111827] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all"
                >
                  <Plus size={14} className="inline mr-1" /> New Project
                </button>
              </div>
            </div>

            {/* Tight Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MiniMetric label="Total Valuation" value="$842.00M" grow="+2.4%" />
              <MiniMetric label="Active Sites" value="12" grow="Stable" />
              <MiniMetric label="Resource Load" value="94%" grow="+5.1%" />
              <div className="bg-blue-600 rounded-2xl p-4 text-white flex justify-between items-center relative overflow-hidden group">
                <div className="relative z-10">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-80">System Health</p>
                  <p className="text-sm font-bold italic">All Nodes Operational</p>
                </div>
                <Briefcase size={40} className="opacity-20 group-hover:scale-110 transition-transform" />
              </div>
            </div>

            {/* High-Density Table */}
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 overflow-hidden">
              <div className="grid grid-cols-6 px-6 py-4 border-b border-slate-100 bg-slate-50/50 text-[9px] font-black uppercase tracking-widest text-slate-400">
                <div className="col-span-2">Project Architecture</div>
                <div>Principal Client</div>
                <div>Budgetary Status</div>
                <div>Current Stage</div>
                <div className="text-right">Manage</div>
              </div>
              <div className="divide-y divide-slate-50">
                <CompactRow name="Meridian Heights" loc="Brussels, BE" client="Vanguard Group" budget="$12.4M" stage="Phase 03" status="blue" />
                <CompactRow name="Logistics Hub 09" loc="Hamburg, DE" client="Global Freight" budget="$8.9M" stage="Excavation" status="amber" />
                <CompactRow name="St. Jude Center" loc="Chicago, US" client="Health Alliance" budget="$21.2M" stage="Procurement" status="rose" />
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- VIEW: PROFESSIONAL CREATION FORM --- */
          <motion.div 
            key="create" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="max-w-[800px] mx-auto"
          >
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Return to Portfolio
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Project Initialization</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Fill in the technical specifications below</p>
              </div>

              <form onSubmit={handleCreate} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <InputGroup label="Project Identity" placeholder="e.g. Neo-Industrial Hub" icon={<Briefcase size={14}/>} />
                  <InputGroup label="Geographic Location" placeholder="City, Country" icon={<MapPin size={14}/>} />
                  <InputGroup label="Lead Client" placeholder="Corporation Name" icon={<User size={14}/>} />
                  <InputGroup label="Allocated Budget" placeholder="$0.00" icon={<DollarSign size={14}/>} />
                  <InputGroup label="Commencement" type="date" icon={<Calendar size={14}/>} />
                  <InputGroup label="Target Completion" type="date" icon={<Calendar size={14}/>} />
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><AlertCircle size={16}/></div>
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-tight">System will perform automatic fiscal risk assessment upon submission.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setView('list')} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50">Cancel</button>
                  <button 
                    type="submit" 
                    className="bg-[#111827] text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-blue-600 transition-all"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Initialize Site"}
                    <ChevronRight size={14} />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- High Density Components ---

function MiniMetric({ label, value, grow }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm">
      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h4 className="text-lg font-black italic tracking-tighter">{value}</h4>
        <span className="text-[8px] font-bold text-blue-600">{grow}</span>
      </div>
    </div>
  );
}

function CompactRow({ name, loc, client, budget, stage, status }) {
  const colors = { 
    blue: "text-blue-600 bg-blue-50 border-blue-100", 
    amber: "text-amber-600 bg-amber-50 border-amber-100", 
    rose: "text-rose-600 bg-rose-50 border-rose-100" 
  };
  return (
    <div className="grid grid-cols-6 px-6 py-4 items-center hover:bg-slate-50 transition-colors group cursor-pointer">
      <div className="col-span-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] border border-slate-200">{name[0]}</div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-tight">{name}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{loc}</p>
        </div>
      </div>
      <div className="text-[10px] font-bold text-slate-600 uppercase">{client}</div>
      <div className="text-[10px] font-black italic">{budget}</div>
      <div>
        <span className={`text-[8px] font-black px-2 py-1 rounded-md border uppercase tracking-tighter ${colors[status]}`}>{stage}</span>
      </div>
      <div className="text-right">
        <button className="text-slate-300 hover:text-black transition-colors"><MoreVertical size={14}/></button>
      </div>
    </div>
  );
}

function InputGroup({ label, placeholder, icon, type = "text" }) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">{icon}</div>
        <input 
          type={type} placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}