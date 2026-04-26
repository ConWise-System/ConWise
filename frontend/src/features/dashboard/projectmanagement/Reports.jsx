'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileDown, Sparkles, TrendingUp, ShieldCheck, 
  ChevronRight, BarChart3, PieChart, Layout, Plus,
  Calendar, Zap, ArrowLeft, Loader2, CheckCircle2, Download
} from 'lucide-react';

export default function PerformanceIntelligence() {
  const [view, setView] = useState('dashboard'); // dashboard | generator
  const [genStep, setGenStep] = useState(0); // 0: Config, 1: Processing, 2: Final
  const [selectedType, setSelectedType] = useState('Operational');

  // Logic to simulate the 'System Generates Report' event from your flow
  const triggerGeneration = () => {
    setGenStep(1);
    setTimeout(() => setGenStep(2), 2500); // Simulate system synthesis delay
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased p-4 md:p-10">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          /* --- STAGE 1: EXECUTIVE OVERSIGHT (Precondition Check) --- */
          <motion.div 
            key="dash" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-[1400px] mx-auto space-y-10"
          >
            <header className="flex justify-between items-end">
              <div>
                <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none text-[#111827]">
                  Intel<span className="text-blue-600">.</span>Core
                </h1>
                <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.3em]">Sovereign Project Analysis — Q2 2026</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setView('generator')}
                  className="bg-[#111827] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95"
                >
                  <Sparkles size={16} /> Generate Intelligence
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <HealthCard />
              <div className="space-y-6">
                <MetricBox label="Cumulative Savings" value="$1.24M" trend="+4.2%" dark />
                <MetricBox label="Risk Exposure" value="Low" subValue="(04)" icon={<ShieldCheck className="text-rose-500" />} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black uppercase tracking-widest mb-10 text-[#111827]">Fiscal Allocation vs. Actuals</h3>
                <div className="space-y-8">
                  <AllocationRow label="Quantum Cloud Migration" percent={84} />
                  <AllocationRow label="Global Supply Chain Audit" percent={109} isOver />
                  <AllocationRow label="AI Ethics Framework" percent={56} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <ReportAccessCard icon={<Layout size={20}/>} title="Exec Quarterly Brief" sub="Board-level visibility" />
                <ReportAccessCard icon={<PieChart size={20}/>} title="Financial Variance" sub="Audit overrun analysis" />
              </div>
            </div>
          </motion.div>
        ) : (
          /* --- STAGE 2: ADVANCED REPORT GENERATOR (The Scenario Flow) --- */
          <motion.div 
            key="gen" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
            className="max-w-3xl mx-auto pt-10"
          >
            <button onClick={() => {setView('dashboard'); setGenStep(0);}} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 mb-10 hover:text-black transition-colors">
              <ArrowLeft size={14} /> Return to Oversight
            </button>

            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-12 bg-[#111827] text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-3 py-1 bg-blue-500 text-[8px] font-black uppercase rounded-full tracking-widest">Active Scenario</span>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter mt-4">Project Report Creation</h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2">Actor: Project Manager</p>
                  </div>
                  <Zap className="text-blue-500" size={32} />
                </div>
              </div>

              <div className="p-12 min-h-[450px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {genStep === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">1. Select Intelligence Type</label>
                        <div className="grid grid-cols-2 gap-4">
                          <TypeOption 
                            active={selectedType === 'Operational'} 
                            onClick={() => setSelectedType('Operational')} 
                            icon={<BarChart3 />} label="Tasks & Progress" 
                          />
                          <TypeOption 
                            active={selectedType === 'Fiscal'} 
                            onClick={() => setSelectedType('Fiscal')} 
                            icon={<PieChart />} label="Costs & Materials" 
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-blue-600">2. Temporal Parameters</label>
                        <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          <Calendar className="text-slate-400" />
                          <span className="text-xs font-black uppercase tracking-tighter">Apr 01, 2026 — Jun 30, 2026</span>
                        </div>
                      </div>

                      <button 
                        onClick={triggerGeneration}
                        className="w-full bg-[#111827] text-white py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                      >
                        Initialize Generation
                      </button>
                    </motion.div>
                  )}

                  {genStep === 1 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center text-center">
                      <Loader2 size={48} className="text-blue-600 animate-spin mb-6" />
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-[#111827]">Synthesizing Datasets</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Aggregating tasks, materials, and cost variances...</p>
                    </motion.div>
                  )}

                  {genStep === 2 && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                      <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[2.5rem] flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                          <CheckCircle2 size={32} />
                        </div>
                        <div>
                          <h3 className="text-emerald-900 font-black uppercase italic tracking-tight">Intelligence Ready</h3>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Postcondition: Available for review</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <button className="flex-1 bg-[#111827] text-white py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                          <Layout size={16} /> View Online
                        </button>
                        <button className="flex-1 border-2 border-slate-100 py-6 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                          <Download size={16} /> Download PDF
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function HealthCard() {
  return (
    <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Portfolio Health Score</p>
          <h2 className="text-8xl font-black text-[#111827] tracking-tighter italic">94.8<span className="text-xl text-slate-200 ml-2">/100</span></h2>
          <div className="flex items-center gap-2 mt-6 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
            <TrendingUp size={14} /> +12.4% Project Velocity
          </div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[40, 70, 45, 90, 60, 85, 100].map((h, i) => (
            <div key={i} className="w-3 bg-[#111827] rounded-full transition-all group-hover:bg-blue-600" style={{ height: `${h}%`, opacity: 0.1 + (i * 0.15) }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricBox({ label, value, subValue, icon, trend, dark }) {
  return (
    <div className={`p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between h-[calc(50%-12px)] ${dark ? 'bg-[#111827] text-white' : 'bg-white border border-slate-100'}`}>
      <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${dark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-black italic tracking-tighter">{value}</h3>
          {subValue && <span className="text-xs font-bold opacity-30">{subValue}</span>}
        </div>
        {icon ? icon : trend && <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full">{trend}</span>}
      </div>
    </div>
  );
}

function AllocationRow({ label, percent, isOver }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase">
        <span className="text-slate-500">{label}</span>
        <span className={isOver ? 'text-rose-500' : 'text-[#111827]'}>{percent}%</span>
      </div>
      <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }} animate={{ width: `${Math.min(percent, 100)}%` }}
          className={`h-full ${isOver ? 'bg-rose-500' : 'bg-[#111827]'}`} 
        />
      </div>
    </div>
  );
}

function ReportAccessCard({ icon, title, sub }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 flex items-center gap-6 hover:shadow-xl hover:border-blue-100 transition-all cursor-pointer group">
      <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</div>
      <div>
        <h4 className="text-[11px] font-black uppercase tracking-tight text-[#111827]">{title}</h4>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}

function TypeOption({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${active ? 'bg-[#111827] border-[#111827] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
    >
      {React.cloneElement(icon, { size: 24 })}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}