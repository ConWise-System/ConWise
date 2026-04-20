'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, MoreHorizontal, Filter, ListFilter, 
  Clock, AlertCircle, Rocket, ArrowUpRight, CheckSquare 
} from 'lucide-react';

// Animation Variants - Dashboard kee wajjin wal-simu
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
};

export default function TaskCenter() {
  return (
    <div className="w-full">
      {/* Content Body - Max-width 1400px dashboard kaan wajjin tokko */}
      <motion.div 
        variants={containerVars} 
        initial="hidden" 
        animate="visible"
        className="max-w-[1400px] mx-auto p-10 w-full space-y-10"
      >
        {/* --- Page Header --- */}
        <div className="flex justify-between items-end mb-10">
          <motion.div variants={itemVars}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Mission Critical</p>
            <h1 className="text-4xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">
              Task Center
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-4 max-w-xl leading-relaxed">
              Coordinate high-level project execution, monitor engineer deployment, and validate technical milestones.
            </p>
          </motion.div>

          <motion.button 
            variants={itemVars} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="bg-[#111827] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-2xl"
          >
            <Plus size={16} strokeWidth={3} /> Create New Task
          </motion.button>
        </div>

        {/* --- Metric Row --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard label="Active Sprints" value="12" sub="+2 from last week" />
          <MetricCard label="Pending Approval" value="08" badge="URGENT" />
          <MetricCard label="Resource Load" value="94%" progress={94} />
          <MetricCard label="Completion Rate" value="82" sub="/100 avg" />
        </div>

        {/* --- Task Table Section --- */}
        <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-slate-50">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#111827]">Ongoing Assignments</h3>
            <div className="flex gap-2">
              <TableButton icon={<Filter size={14} />} label="Filter" />
              <TableButton icon={<ListFilter size={14} />} label="Sort" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-8 py-4">Task Details</th>
                  <th className="px-8 py-4">Assigned Engineers</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Deadline</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <TaskRow 
                  title="Cloud Infrastructure Hardening" project="Sovereign One / Core"
                  engineers={3} status="In Development" statusColor="blue"
                  date="Oct 24, 2026" subDate="2 DAYS REMAINING" isUrgent
                />
                <TaskRow 
                  title="OAuth 2.0 Integration Audit" project="Enterprise Auth"
                  engineers={1} status="Pending Approval" statusColor="amber"
                  date="Oct 28, 2026" subDate="ON SCHEDULE" hasAction
                />
                <TaskRow 
                  title="Legacy Database Migration" project="Data Sovereign"
                  engineers={2} status="In Review" statusColor="indigo"
                  date="Nov 02, 2026" subDate="MILESTONE 2"
                />
                <TaskRow 
                  title="API Rate Limiter Implementation" project="Gateway Pro"
                  engineers={1} status="Completed" statusColor="emerald"
                  date="Oct 18, 2026" subDate="FINALIZED"
                />
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-slate-50/30 flex justify-between items-center border-t border-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Showing 4 of 48 total tasks</p>
            <div className="flex gap-1">
              <PaginationBtn label="1" active />
              <PaginationBtn label="2" />
              <PaginationBtn label="3" />
            </div>
          </div>
        </motion.div>

        {/* --- Footer Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-[#111827]">Team Velocity</h3>
              <ArrowUpRight size={18} className="text-slate-300" />
            </div>
            <div className="space-y-4">
              <VelocityItem icon={<Rocket size={16} />} title="Deployment Ready" sub="8 items cleared for launch" />
              <VelocityItem icon={<Clock size={16} />} title="Maintenance Buffer" sub="Current capacity: 22%" />
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="bg-[#111827] p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <h3 className="text-2xl font-black italic tracking-tighter">Executive Overview</h3>
              <p className="text-[11px] text-slate-400 max-w-xs leading-relaxed">
                System intelligence indicates a potential resource bottleneck in the "Sovereign One" core module. Consider reassignment.
              </p>
              <button className="bg-white text-[#111827] px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-50 transition-colors">
                View Intelligence Report
              </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5 group-hover:opacity-10 transition-opacity">
              <CheckSquare size={200} />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Helper Components ---

function MetricCard({ label, value, sub, progress, badge }) {
  return (
    <motion.div variants={itemVars} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-44 group hover:border-blue-100 transition-colors">
      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className="space-y-2">
        <h3 className="text-4xl font-black text-[#111827] tracking-tighter italic leading-none group-hover:text-blue-600 transition-colors">{value}</h3>
        {progress ? (
           <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
             <div className="h-full bg-[#111827]" style={{ width: `${progress}%` }} />
           </div>
        ) : badge ? (
           <span className="inline-block text-[8px] font-black bg-rose-50 text-rose-600 px-2 py-1 rounded border border-rose-100 uppercase tracking-tighter mt-1">{badge}</span>
        ) : (
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-1">{sub}</p>
        )}
      </div>
    </motion.div>
  );
}

function TaskRow({ title, project, engineers, status, statusColor, date, subDate, isUrgent, hasAction }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-all group">
      <td className="px-8 py-6">
        <h4 className="text-[11px] font-black text-[#111827] uppercase tracking-tight leading-none mb-2">{title}</h4>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Project: {project}</p>
      </td>
      <td className="px-8 py-6">
        <div className="flex -space-x-2">
          {[...Array(engineers)].map((_, i) => (
            <div key={i} className="w-8 h-8 rounded-lg bg-slate-100 border-2 border-white overflow-hidden ring-1 ring-slate-100 shadow-sm">
               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + title}`} alt="Engineer" />
            </div>
          ))}
          {engineers > 2 && (
             <div className="w-8 h-8 rounded-lg bg-[#111827] border-2 border-white flex items-center justify-center text-[8px] font-black text-white">+2</div>
          )}
        </div>
      </td>
      <td className="px-8 py-6">
        <span className={`text-[8px] font-black px-3 py-1.5 rounded-full border uppercase tracking-tighter ${colors[statusColor]}`}>
          • {status}
        </span>
      </td>
      <td className="px-8 py-6">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-tighter leading-none mb-1">{date}</p>
        <p className={`text-[8px] font-black uppercase tracking-[0.1em] ${isUrgent ? 'text-rose-500' : 'text-slate-300'}`}>{subDate}</p>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex items-center justify-end gap-3">
          {hasAction && <button className="bg-[#111827] text-white text-[8px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest shadow-lg">Approve</button>}
          <MoreHorizontal size={16} className="text-slate-300 cursor-pointer hover:text-[#111827] transition-colors" />
        </div>
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

function PaginationBtn({ label, active }) {
  return (
    <button className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${active ? 'bg-[#111827] text-white shadow-md' : 'text-slate-400 hover:bg-white border border-transparent hover:border-slate-100'}`}>
      {label}
    </button>
  );
}

function VelocityItem({ icon, title, sub }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:bg-white hover:border-blue-100 transition-all cursor-pointer">
      <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform">{icon}</div>
      <div>
        <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-tight leading-none mb-1.5">{title}</h4>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}