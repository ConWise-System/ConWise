'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MoreHorizontal, Filter, ListFilter, 
  Clock, AlertCircle, Rocket, ArrowUpRight, CheckSquare,
  ArrowLeft, User, DollarSign, Box, Loader2, ChevronRight
} from 'lucide-react';

export default function TaskCenter() {
  const [view, setView] = useState('list'); // 'list' | 'create' | 'engineer-view'
  const [activeTask, setActiveTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation Config
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const handleTaskSubmission = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setView('list');
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] p-4 md:p-10">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          /* --- MINIMIZED DASHBOARD VIEW --- */
          <motion.div 
            key="list" variants={containerVars} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}
            className="max-w-[1300px] mx-auto space-y-6"
          >
            <div className="flex justify-between items-end">
              <motion.div>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Operational Hub</p>
                <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">Task Center</h1>
              </motion.div>
              <button 
                onClick={() => setView('create')}
                className="bg-[#111827] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all"
              >
                <Plus size={14} strokeWidth={3} /> New Assignment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MiniMetric label="Active Sprints" value="12" sub="+2 Week" />
              <MiniMetric label="Pending" value="08" badge="Urgent" />
              <MiniMetric label="Resource Load" value="94%" progress={94} />
              <div className="bg-[#111827] rounded-2xl p-5 text-white flex justify-between items-center shadow-lg">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">System Engine</p>
                  <p className="text-[11px] font-bold italic">Node-Delta Active</p>
                </div>
                <Rocket size={20} className="text-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-5 flex justify-between items-center border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Ongoing Assignments</h3>
                <div className="flex gap-2">
                  <TableButton icon={<Filter size={12} />} label="Filter" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-3">Task Details</th>
                      <th className="px-6 py-3 text-center">Engineers</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <TaskRow 
                      title="Cloud Infrastructure" project="Sovereign One" status="In Dev" 
                      color="blue" onClick={() => { setActiveTask("Cloud Infrastructure Hardening"); setView('engineer-view'); }} 
                    />
                    <TaskRow title="OAuth 2.0 Integration" project="Enterprise Auth" status="Pending" color="amber" />
                    <TaskRow title="API Rate Limiter" project="Gateway Pro" status="Closed" color="emerald" />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : view === 'create' ? (
          /* --- MANAGER: CREATE TASK PAGE --- */
          <motion.div key="create" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-[750px] mx-auto">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-8 hover:text-black transition-colors">
              <ArrowLeft size={14} /> Return to Center
            </button>
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#111827]">Create Task</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Assign deployment parameters & estimate logistics</p>
              </div>
              <form onSubmit={handleTaskSubmission} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <FormInput label="Task Title" placeholder="e.g. Infrastructure Hardening" colSpan="col-span-2" />
                  <FormInput label="Assigned Engineer" placeholder="Select Lead Engineer" icon={<User size={12}/>} />
                  <FormInput label="Deadline" type="date" icon={<Clock size={12}/>} />
                  <FormInput label="Estimated Cost" placeholder="$0.00" icon={<DollarSign size={12}/>} />
                  <FormInput label="Required Material" placeholder="e.g. Server Racks, Cables" icon={<Box size={12}/>} />
                  <div className="col-span-2 space-y-2">
                    <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Task Description</label>
                    <textarea 
                      placeholder="Specify technical requirements..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] font-medium outline-none focus:border-blue-500 h-24 transition-all" 
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#111827] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-blue-600 transition-all">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Save & Notify Engineer"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          /* --- ENGINEER: EXECUTION VIEW --- */
          <motion.div key="eng" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[550px] mx-auto">
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <span className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-1 rounded-lg border border-blue-100 uppercase tracking-widest">Task Assigned</span>
                  <h2 className="text-2xl font-black italic tracking-tighter leading-tight">{activeTask}</h2>
                </div>
                <button onClick={() => setView('list')} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-black transition-all"><ArrowLeft size={18}/></button>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-50 pb-2">Logistics Overview</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Estimated Budget</p>
                    <p className="text-sm font-black text-emerald-600">$4,200.00</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase">Deadline</p>
                    <p className="text-sm font-black">Oct 24, 2026</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setView('list')}
                className="w-full bg-[#111827] text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-emerald-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center gap-3">
                   <CheckSquare size={16} strokeWidth={3} /> Start Task Execution
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS (Minimized) ---

function MiniMetric({ label, value, sub, progress, badge }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-100 transition-colors">
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <div className="mt-2">
        <h4 className="text-2xl font-black italic text-[#111827] tracking-tighter">{value}</h4>
        {progress ? (
          <div className="h-1 w-full bg-slate-50 rounded-full mt-2 overflow-hidden border border-slate-100">
            <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        ) : (
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{badge || sub}</p>
        )}
      </div>
    </div>
  );
}

function TaskRow({ title, project, status, color, onClick }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };
  return (
    <tr onClick={onClick} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
      <td className="px-6 py-4">
        <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-tight mb-1">{title}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Ref: {project}</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center -space-x-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="w-6 h-6 rounded-lg bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + title}`} alt="Eng" />
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[8px] font-black px-2.5 py-1 rounded-full border uppercase tracking-tighter ${themes[color]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <MoreHorizontal size={14} className="inline text-slate-300 group-hover:text-black transition-colors" />
      </td>
    </tr>
  );
}

function FormInput({ label, placeholder, icon, type = "text", colSpan = "" }) {
  return (
    <div className={`space-y-1.5 ${colSpan}`}>
      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        <input 
          type={type} placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${icon ? 'pl-10' : 'px-4'} py-3 text-[11px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all`}
        />
      </div>
    </div>
  );
}

function TableButton({ icon, label }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 hover:bg-white transition-all">
      {icon} {label}
    </button>
  );
}