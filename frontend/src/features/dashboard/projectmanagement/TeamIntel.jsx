'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, UserPlus, MoreVertical, 
  ChevronRight, BarChart, AlertCircle,
  Zap, Briefcase, TrendingUp
} from 'lucide-react';

// Animation Variants
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVars = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25 } }
};

export default function TeamIntel() {
  return (
    <div className="w-full">
      <motion.div 
        variants={containerVars} 
        initial="hidden" 
        animate="visible"
        className="max-w-[1400px] mx-auto p-10 w-full space-y-10"
      >
        {/* --- Header Section --- */}
        <div className="flex justify-between items-end mb-10">
          <motion.div variants={itemVars}>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-2">Enterprise Resource Management</p>
            <h1 className="text-4xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">
              Team Intel
            </h1>
            <p className="text-xs font-bold text-slate-400 mt-4 max-w-xl leading-relaxed">
              Deep visibility into engineering availability, site assignments, and supervisory performance across all active sectors.
            </p>
          </motion.div>

          <motion.button 
            variants={itemVars} 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="bg-[#111827] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-2xl"
          >
            <UserPlus size={16} strokeWidth={3} /> Provision Resource
          </motion.button>
        </div>

        {/* --- Stats Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-44">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Active Site Deployment</p>
            <div>
              <h3 className="text-4xl font-black text-[#111827] italic tracking-tighter">84%</h3>
              <div className="h-1.5 w-full bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-[#111827]" style={{ width: '84%' }} />
              </div>
              <p className="text-[8px] font-bold text-slate-400 uppercase mt-2">16% Bench</p>
            </div>
          </motion.div>

          <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-44 group hover:border-blue-100 transition-colors">
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Headcount</p>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Users size={16} /></div>
            </div>
            <h3 className="text-3xl font-black text-[#111827] tracking-tighter italic">142 Engineers</h3>
          </motion.div>

          <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-44">
            <div className="flex justify-between items-start">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Supervision Ratio</p>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Briefcase size={16} /></div>
            </div>
            <h3 className="text-3xl font-black text-[#111827] tracking-tighter italic">1 : 12.5</h3>
          </motion.div>

          <motion.div variants={itemVars} className="bg-[#111827] p-8 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">Top Active Sector</p>
              <h3 className="text-xl font-black italic tracking-tighter">North Hub A12</h3>
              <p className="text-[9px] text-slate-400 mt-3 leading-tight opacity-70">High demand in electrical systems this quarter.</p>
            </div>
            <div className="absolute right-[-10%] bottom-[-10%] opacity-10 group-hover:scale-110 transition-transform">
              <TrendingUp size={120} />
            </div>
          </motion.div>
        </div>

        {/* --- Personnel Roster --- */}
        <motion.div variants={itemVars} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 flex justify-between items-center border-b border-slate-50">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#111827]">Personnel Roster</h3>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              Filter by: <span className="text-[#111827] cursor-pointer flex items-center gap-1">All Availability <ChevronRight size={14} className="rotate-90" /></span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                  <th className="px-10 py-4">Member</th>
                  <th className="px-10 py-4">Role / Specialty</th>
                  <th className="px-10 py-4">Current Assignment</th>
                  <th className="px-10 py-4">Load</th>
                  <th className="px-10 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <TeamRow 
                  name="Marcus Thorne" id="ENG-4829" role="Lead Supervisor" 
                  specialty="Structural Engineering" assignment="Project Horizon Peak"
                  load={90} loadStatus="Critical" 
                />
                <TeamRow 
                  name="Elena Rodriguez" id="ENG-7721" role="Site Engineer" 
                  specialty="Electrical Systems" assignment="Metropolis Grid Renewal"
                  load={45} loadStatus="Stable" 
                />
                <TeamRow 
                  name="Julian Vance" id="SUP-1082" role="Senior Supervisor" 
                  specialty="Safety & Compliance" assignment="On Bench (Upcoming)"
                  load={0} loadStatus="Available" 
                />
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* --- Staffing Trends & Alert --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div variants={itemVars} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-[#111827] mb-8">Staffing Trends</h3>
            <div className="flex items-end gap-3 h-48 px-4">
              {[30, 50, 40, 70, 90, 80, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 rounded-t-xl relative group cursor-pointer overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }} animate={{ height: `${h}%` }}
                    className={`absolute bottom-0 w-full transition-colors ${i === 4 ? 'bg-[#111827]' : 'bg-slate-300 group-hover:bg-blue-400'}`} 
                  />
                </div>
              ))}
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase italic mt-6 text-center">
              Projected peak resource requirement expected in Week 42 for Phase II groundworks.
            </p>
          </motion.div>

          <motion.div variants={itemVars} className="bg-blue-50 p-10 rounded-[2.5rem] border border-blue-100 flex flex-col justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-blue-600 mb-6">
                <AlertCircle size={24} />
                <h3 className="text-2xl font-black italic tracking-tighter">Intel Alert</h3>
              </div>
              <p className="text-sm font-bold text-blue-900/70 leading-relaxed max-w-sm">
                4 Senior Engineers are approaching burnout limits in the West Sector. Redistribution recommended within 72 hours.
              </p>
            </div>
            <button className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:gap-4 transition-all">
              View Redistribution Analysis <ChevronRight size={16} />
            </button>
            <Zap className="absolute right-[-5%] top-[-5%] text-blue-100/50" size={180} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Helper Components ---

function TeamRow({ name, id, role, specialty, assignment, load, loadStatus }) {
  return (
    <tr className="hover:bg-slate-50/50 transition-all group cursor-pointer">
      <td className="px-10 py-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shadow-sm">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} />
          </div>
          <div>
            <h4 className="text-[11px] font-black text-[#111827] uppercase leading-none mb-1">{name}</h4>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">ID: {id}</p>
          </div>
        </div>
      </td>
      <td className="px-10 py-6">
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{role}</p>
        <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mt-1 opacity-70">{specialty}</p>
      </td>
      <td className="px-10 py-6">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${load === 0 ? 'bg-slate-300' : 'bg-emerald-500'}`} />
          <span className="text-[10px] font-bold text-slate-600 uppercase italic">{assignment}</span>
        </div>
      </td>
      <td className="px-10 py-6">
        <div className="w-24">
          <div className="flex justify-between text-[8px] font-black uppercase mb-1">
            <span className={load > 80 ? 'text-rose-500' : 'text-slate-400'}>{load}% Capacity</span>
          </div>
          <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${load > 80 ? 'bg-rose-500' : load === 0 ? 'bg-slate-200' : 'bg-[#111827]'}`} 
              style={{ width: `${load || 10}%` }} 
            />
          </div>
        </div>
      </td>
      <td className="px-10 py-6 text-right">
        <button className="text-slate-300 hover:text-[#111827] transition-colors">
          <MoreVertical size={18} />
        </button>
      </td>
    </tr>
  );
}