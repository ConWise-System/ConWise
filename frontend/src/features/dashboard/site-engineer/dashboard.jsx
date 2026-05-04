"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Sun, Bell, Command, MoreHorizontal, 
  Maximize2, HardHat, Pickaxe, Truck, AlertCircle 
} from 'lucide-react';

import EngineerSidebar from "../../../components/dashboard/engineer/EngineerSidebar.jsx";

export default function SiteEngineerDashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] overflow-hidden font-sans">
      {/* 1. SIDEBAR NAVIGATION */}
      <EngineerSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* 2. MAIN CONTENT AREA */}
      <motion.main 
        layout
        className="flex-1 h-screen overflow-y-auto no-scrollbar pb-12 px-6 md:px-10"
      >
        <div className="max-w-full mx-auto">
          
          {/* INTEGRATED NAVBAR */}
          <header className="flex justify-between items-center py-6 sticky top-0 z-40 bg-[#F8F9FB]/80 backdrop-blur-md mb-6">
            <div className="flex-1 max-w-xl">
              <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <Search className="text-slate-400 mr-2" size={18} />
                <input 
                  type="text" 
                  placeholder="Search projects, blueprints, or tasks..." 
                  className="bg-transparent border-none outline-none text-sm w-full font-medium" 
                />
                <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-[10px] font-black text-slate-300 bg-slate-50 border rounded-lg">
                  <Command size={10} /> K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-6">
              <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3">
                <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500"><Sun size={16} /></div>
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Weather</p>
                  <p className="text-[10px] font-black text-slate-900 mt-0.5">24°C Clear Sky</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-black text-slate-900">Alexander</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">Site Engineer</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-[10px] bg-white overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="avatar" />
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* DASHBOARD CONTENT */}
          <div className="space-y-10">
            {/* Page Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Central Node: Site A-12</h1>
                <p className="text-[10px] text-slate-400 font-black mt-1 uppercase tracking-[0.2em]">Sector 4 • Structural Phase II • Day 142</p>
              </div>
              <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10">
                Generate Report
              </button>
            </div>

            {/* Stats & Map View */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="STEEL STOCK" value="84.2" unit="tn" icon={<Pickaxe size={18} />} color="blue" subtitle="Rebar Stock Levels" />
                <StatCard label="CONCRETE" value="12" unit="m³" icon={<Truck size={18} />} color="emerald" subtitle="Arrival: 14:00" />
                <StatCard label="LABOR" value="142" unit="" icon={<HardHat size={18} />} color="indigo" subtitle="Active Personnel" />
              </div>

              <div className="bg-[#0a0c18] rounded-[2.5rem] relative overflow-hidden shadow-2xl h-44 lg:h-auto group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80')] bg-cover opacity-20 grayscale mix-blend-overlay group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative p-6 h-full flex flex-col justify-between z-10">
                  <div className="flex justify-end"><Maximize2 size={16} className="text-white/40 cursor-pointer hover:text-white transition-colors" /></div>
                  <div>
                    <h4 className="text-white text-[10px] font-black uppercase tracking-widest">Site Map View</h4>
                    <p className="text-[8px] text-slate-500 font-black uppercase mt-1">Live Feed • Zone A</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lower Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
              <div className="xl:col-span-2 space-y-4">
                <div className="flex justify-between items-end px-1 mb-2">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Priority Directives</h3>
                  <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest">6 Remaining</span>
                </div>
                <DirectiveItem title="Foundation Pour - Zone B" time="08:00 — 12:00" active />
                <DirectiveItem title="MEP Rough-in Inspection" time="13:30 — 15:00" />
                <DirectiveItem title="Steel Truss Installation" time="15:00 — 18:00" />
              </div>

              {/* Critical Issues Section */}
              <div className="bg-white rounded-[2.5rem] border-l-[10px] border-rose-600 shadow-xl shadow-rose-900/5 p-8 h-fit">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Critical Issues</h3>
                  <span className="bg-rose-50 text-rose-600 text-[8px] px-2.5 py-1 rounded-md font-black animate-pulse uppercase">2 Alert</span>
                </div>
                <div className="space-y-8">
                  <IssueItem title="Water Main Pressure Drop" meta="Zone C-4 Sector • 24m ago" />
                  <div className="h-px bg-slate-100" />
                  <IssueItem title="Tower Crane 2 Sensor Fault" meta="Mechanical Warning • Urgent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.main>

      {/* Floating Action Button */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 shadow-blue-500/30"
      >
        <Plus size={28} strokeWidth={3} />
      </motion.button>
    </div>
  );
}

// Sub-components
function StatCard({ label, value, unit, icon, color, subtitle }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600"
  };
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
    <div className="bg-white p-6 rounded-[1.8rem] border border-slate-100 flex justify-between items-center hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 transition-all cursor-pointer group">
      <div className="flex items-center gap-6">
        <div className={`w-2 h-12 rounded-full ${active ? 'bg-blue-600' : 'bg-slate-100'}`} />
        <div>
          <h5 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{title}</h5>
          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">{time}</p>
        </div>
      </div>
      <MoreHorizontal size={20} className="text-slate-300" />
    </div>
  );
}

function IssueItem({ title, meta }) {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center gap-3 mb-1.5">
        <AlertCircle size={16} className="text-rose-500" />
        <h5 className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-rose-600 transition-colors">{title}</h5>
      </div>
      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter ml-7">{meta}</p>
    </div>
  );
}