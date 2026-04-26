'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, MoreVertical, ChevronRight, 
  BarChart, AlertCircle, Zap, Briefcase, TrendingUp,
  ArrowLeft, ShieldCheck, Cpu, HardHat
} from 'lucide-react';

const pageTransition = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
const itemVars = { hidden: { y: 10, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export default function TeamIntel() {
  const [view, setView] = useState('roster'); // 'roster' | 'provision'

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10">
      <AnimatePresence mode="wait">
        {view === 'roster' ? (
          /* --- MINIMIZED ROSTER VIEW --- */
          <motion.div key="roster" {...pageTransition} className="max-w-[1300px] mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Human Capital</p>
                <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">Team Intel</h1>
              </div>
              <button 
                onClick={() => setView('provision')}
                className="bg-[#111827] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all"
              >
                <UserPlus size={14} /> Provision Resource
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MiniStat label="Deployment" value="84%" sub="16% Bench" bar={84} />
              <MiniStat label="Headcount" value="142" sub="Engineers" icon={<Users size={14}/>} />
              <MiniStat label="Ratio" value="1:12.5" sub="Supervisor/Eng" icon={<Briefcase size={14}/>} />
              <div className="bg-[#111827] rounded-2xl p-5 text-white flex flex-col justify-between shadow-sm relative overflow-hidden">
                <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">Top Sector</p>
                <p className="text-[11px] font-bold italic text-blue-400">North Hub A12</p>
                <TrendingUp size={40} className="absolute right-[-10%] bottom-[-10%] opacity-20" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Personnel Roster</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-3">Member</th>
                      <th className="px-6 py-3">Role / Specialty</th>
                      <th className="px-6 py-3">Assignment</th>
                      <th className="px-6 py-3">Load</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <TeamRow name="Marcus Thorne" role="Lead Supervisor" spec="Structural" loc="Project Horizon" load={90} color="rose" />
                    <TeamRow name="Elena Rodriguez" role="Site Engineer" spec="Electrical" loc="Metropolis Grid" load={45} color="blue" />
                    <TeamRow name="Julian Vance" role="Senior Lead" spec="Safety" loc="On Bench" load={0} color="slate" />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- PROVISION RESOURCE PAGE --- */
          <motion.div key="provision" {...pageTransition} className="max-w-[700px] mx-auto">
            <button onClick={() => setView('roster')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 hover:text-black transition-colors">
              <ArrowLeft size={14} /> Back to Roster
            </button>
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-8 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black uppercase italic tracking-tighter text-blue-600">Resource Provisioning</h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">New Resource Onboarding</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm"><UserPlus size={20} className="text-blue-500"/></div>
              </div>
              
              <form className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <ProvisionInput label="Full Identity Name" placeholder="e.g. Adrian Stone" />
                  <ProvisionInput label="Employee ID" placeholder="ENG-XXXX" />
                  <ProvisionSelect label="Operational Role">
                    <option>Field Engineer</option>
                    <option>Site Supervisor</option>
                    <option>Technical Specialist</option>
                  </ProvisionSelect>
                  <ProvisionSelect label="Primary Specialty">
                    <option>Structural</option>
                    <option>Electrical</option>
                    <option>Geotechnical</option>
                  </ProvisionSelect>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Access & Compliance</p>
                  <div className="flex gap-4">
                    <ComplianceToggle icon={<ShieldCheck size={14}/>} label="Safety Cert" active />
                    <ComplianceToggle icon={<Cpu size={14}/>} label="System Access" active />
                    <ComplianceToggle icon={<HardHat size={14}/>} label="Site Clearance" />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setView('roster')}
                  className="w-full bg-[#111827] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all"
                >
                  Confirm Provisioning
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function MiniStat({ label, value, sub, icon, bar }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
        {icon && <div className="text-blue-600 opacity-30">{icon}</div>}
      </div>
      <h4 className="text-xl font-black italic tracking-tighter text-[#111827]">{value}</h4>
      {bar ? (
        <div className="h-1 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: `${bar}%` }} />
        </div>
      ) : (
        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{sub}</p>
      )}
    </div>
  );
}

function TeamRow({ name, role, spec, loc, load, color }) {
  const colors = {
    rose: "bg-rose-500",
    blue: "bg-blue-600",
    slate: "bg-slate-200"
  };
  return (
    <tr className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} className="w-7 h-7 rounded-lg bg-slate-100" />
          <h4 className="text-[10px] font-black text-[#111827] uppercase leading-none group-hover:text-blue-600 transition-colors">{name}</h4>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-[9px] font-black text-slate-700 uppercase">{role}</p>
        <p className="text-[8px] font-bold text-blue-500 uppercase tracking-widest">{spec}</p>
      </td>
      <td className="px-6 py-4 text-[9px] font-bold text-slate-500 uppercase italic">{loc}</td>
      <td className="px-6 py-4">
        <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full ${colors[color]}`} style={{ width: `${load || 10}%` }} />
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <MoreVertical size={14} className="inline text-slate-300" />
      </td>
    </tr>
  );
}

function ProvisionInput({ label, placeholder }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-black uppercase text-slate-400 ml-1">{label}</label>
      <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500" placeholder={placeholder} />
    </div>
  );
}

function ProvisionSelect({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-[8px] font-black uppercase text-slate-400 ml-1">{label}</label>
      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none focus:border-blue-500 appearance-none">
        {children}
      </select>
    </div>
  );
}

function ComplianceToggle({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${active ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-white border-slate-100 text-slate-300'}`}>
      {icon}
      <span className="text-[8px] font-black uppercase">{label}</span>
    </div>
  );
}