"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Sun, Command, MoreHorizontal, 
  Maximize2, HardHat, Pickaxe, Truck, AlertCircle 
} from 'lucide-react';

// Path kanaan duraa '@components/sidebar' irraa gara kanaatti jijjiiri:
import EngineerSidebar from './EngineerSidebar'; 

export default function SiteEngineerDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <EngineerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* MAIN CONTENT AREA */}
      <motion.main 
        layout
        className="flex-1 h-screen overflow-y-auto no-scrollbar pb-12 px-6 md:px-10"
      >
        <div className="max-w-full mx-auto">
          
          {/* HEADER SECTION */}
          <header className="flex justify-between items-center py-6 sticky top-0 z-40 bg-[#F8F9FB]/80 backdrop-blur-md mb-6">
            <div className="flex-1 max-w-xl">
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10">
                <Search className="text-slate-400 mr-2" size={18} />
                <input 
                  type="text" 
                  placeholder="Search projects, files, or teams..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium" 
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black text-slate-300 bg-slate-50 border rounded-lg">
                  <Command size={10} /> K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <Sun size={16} className="text-orange-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">24°C Clear Sky</span>
              </div>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900">Alexander</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase">Site Engineer</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5">
                  <div className="w-full h-full rounded-[10px] bg-white overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="avatar" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}
          <div className="space-y-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Central Node: Site A-12</h1>
              <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-[0.2em]">
                Sector 4 • Structural Phase II • Day 142
              </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="STEEL STOCK" value="84.2" unit="tn" icon={<Pickaxe size={18} />} color="blue" subtitle="Rebar Stock Levels" />
                <StatCard label="CONCRETE" value="12" unit="m³" icon={<Truck size={18} />} color="emerald" subtitle="Arrival: 14:00" />
                <StatCard label="LABOR" value="142" unit="" icon={<HardHat size={18} />} color="indigo" subtitle="Active Personnel" />
              </div>

              {/* MAP VIEW CARD */}
              <div className="bg-[#0a0c18] rounded-[2.5rem] relative overflow-hidden shadow-2xl h-44 lg:h-auto group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80')] bg-cover opacity-20 grayscale group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative p-6 h-full flex flex-col justify-between z-10 text-white">
                  <Maximize2 size={16} className="ml-auto opacity-40 hover:opacity-100 cursor-pointer" />
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Site Map View</h4>
                    <p className="text-[8px] text-slate-500 font-black uppercase mt-1">Live Feed • Zone A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* LOWER CONTENT */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-4">
                <div className="flex justify-between items-end px-1">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Directives</h3>
                  <span className="text-[10px] text-blue-600 font-black uppercase">6 Remaining</span>
                </div>
                <DirectiveItem title="Foundation Pour - Zone B" time="08:00 — 12:00" active />
                <DirectiveItem title="MEP Rough-in Inspection" time="13:30 — 15:00" />
              </div>

              {/* ALERT CARD */}
              <div className="bg-white rounded-[2.5rem] border-l-[10px] border-rose-600 shadow-xl p-8 h-fit">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Critical Issues</h3>
                  <span className="bg-rose-50 text-rose-600 text-[8px] px-2 py-1 rounded-md font-black animate-pulse uppercase">2 Alert</span>
                </div>
                <div className="space-y-6">
                  <IssueItem title="Water Main Pressure Drop" meta="Zone C-4 Sector • 24m ago" />
                  <div className="h-px bg-slate-100" />
                  <IssueItem title="Tower Crane 2 Sensor Fault" meta="Mechanical Warning • Urgent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.main>

      {/* FAB */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 shadow-blue-500/30"
      >
        <Plus size={28} strokeWidth={3} />
      </motion.button>
    </div>
  );
}

// UI HELPER COMPONENTS
function StatCard({ label, value, unit, icon, color, subtitle }) {
  const colors = { blue: "bg-blue-50 text-blue-600", emerald: "bg-emerald-50 text-emerald-600", indigo: "bg-indigo-50 text-indigo-600" };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{value}<span className="text-lg font-bold text-slate-300 ml-1 uppercase">{unit}</span></h2>
        <p className="text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">{subtitle}</p>
      </div>
    </div>
  );
}

function DirectiveItem({ title, time, active }) {
  return (
    <div className="bg-white p-6 rounded-[1.8rem] border border-slate-100 flex justify-between items-center hover:border-blue-200 transition-all cursor-pointer group">
      <div className="flex items-center gap-6">
        <div className={`w-2 h-12 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-100'}`} />
        <div>
          <h5 className="text-sm font-black text-slate-900 uppercase group-hover:text-blue-600 transition-colors">{title}</h5>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{time}</p>
        </div>
      </div>
      <MoreHorizontal size={20} className="text-slate-300" />
    </div>
  );
}

function IssueItem({ title, meta }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-1.5">
        <AlertCircle size={14} className="text-rose-500" />
        <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight">{title}</h5>
      </div>
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter ml-6">{meta}</p>
    </div>
  );
}