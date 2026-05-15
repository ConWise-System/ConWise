"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, X, Plus, Send, Camera, History,
  ChevronRight, ShieldAlert, ListTodo, ClipboardCheck,
  LayoutGrid, Search, Filter
} from 'lucide-react';

export default function SupervisorIssueCenter() {
  // Locked to Supervisor role as per requirements
  const [issues, setIssues] = useState([
    { 
      id: "ISS-942", 
      relatedTaskId: "TSK-101",
      title: "Rebar Misalignment", 
      description: "Ground floor reinforcement misalignment detected in Sector B. Vertical bars out of tolerance by 15mm.",
      priority: "Critical", 
      status: "Open", 
      date: "2026-05-15",
      history: ["Initial site report filed"]
    },
    { 
      id: "ISS-938", 
      relatedTaskId: "TSK-105",
      title: "HVAC Clash", 
      description: "Piping clash at Pillar 42C preventing duct installation. Requires engineering review.",
      priority: "High", 
      status: "Investigating", 
      date: "2026-05-14",
      history: ["Reported by Field Team", "Assigned to Mech Engineer"]
    }
  ]);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newIssue, setNewIssue] = useState({ title: '', desc: '', priority: 'Routine' });

  const handleLogIssue = (e) => {
    e.preventDefault();
    const entry = {
      id: `ISS-${Math.floor(100 + Math.random() * 900)}`,
      relatedTaskId: "TSK-GEN", 
      title: newIssue.title,
      description: newIssue.desc,
      priority: newIssue.priority,
      status: "Open",
      date: new Date().toISOString().split('T')[0],
      history: ["Issue logged via Supervisor Dashboard"]
    };
    setIssues([entry, ...issues]);
    setShowLogModal(false);
    setNewIssue({ title: '', desc: '', priority: 'Routine' });
  };

  return (
    <div className="w-full min-h-screen bg-[#F1F5F9] text-slate-900 p-6 md:p-10 font-sans">
      
      {/* PROFESSIONAL COMPACT HEADER */}
      <div className="max-w-[1400px] mx-auto mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-slate-900 p-1 rounded-sm text-white"><ShieldAlert size={12}/></div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Terminal / Issue Management</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Supervisor Console</h1>
        </div>

        <button 
          onClick={() => setShowLogModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={14} strokeWidth={3}/> New Report
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        
        {/* LEFT: COMPACT FEED */}
        <div className="col-span-12 lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ListTodo size={12}/> Site Impediments <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm">{issues.length}</span>
            </h2>
          </div>

          <div className="space-y-2">
            {issues.map((iss) => (
              <motion.div 
                key={iss.id}
                layout
                onClick={() => setSelectedIssue(iss)}
                className={`group bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-blue-400 ${selectedIssue?.id === iss.id ? 'ring-1 ring-blue-500 shadow-sm' : 'hover:shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-1 h-8 rounded-full ${iss.priority === 'Critical' ? 'bg-red-500' : 'bg-slate-200'}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[8px] font-bold text-slate-400 uppercase">ID: {iss.id}</span>
                      <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm uppercase italic tracking-tighter">Task Ref: {iss.relatedTaskId}</span>
                    </div>
                    <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{iss.title}</h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Status</span>
                    <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase ${iss.status === 'Open' ? 'text-red-500 border-red-100 bg-red-50' : 'text-blue-500 border-blue-100 bg-blue-50'}`}>
                      {iss.status}
                    </div>
                  </div>
                  <ChevronRight className="text-slate-200 group-hover:text-blue-500 transition-colors" size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: INSPECTION SIDEBAR */}
        <aside className="col-span-12 lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedIssue ? (
              <motion.div 
                key={selectedIssue.id}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issue Context</h2>
                  <button onClick={() => setSelectedIssue(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><X size={14}/></button>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5">
                      <LayoutGrid size={10}/> Technical Summary
                    </h4>
                    <p className="text-[11px] font-medium leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                      "{selectedIssue.description}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                     <DataPoint label="Criticality" value={selectedIssue.priority} />
                     <DataPoint label="Logged On" value={selectedIssue.date} />
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[9px] font-black uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                      <History size={10}/> Chain of Custody
                    </h4>
                    <div className="space-y-3">
                      {selectedIssue.history.map((log, i) => (
                        <div key={i} className="flex gap-3 text-[10px] text-slate-500 font-medium">
                          <div className="w-0.5 bg-slate-100" />
                          <p>{log}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-2">
                <ClipboardCheck size={32} strokeWidth={1} />
                <p className="text-[8px] font-black uppercase tracking-widest">Awaiting Selection</p>
              </div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* PROFESSIONAL FIX: High Z-index isolated layout containment layout layer */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.97, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
              className="bg-white rounded-[24px] w-full max-w-[540px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.2)] border border-slate-100 relative overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col"
            >
              {/* Top Header Row with Close Icon Button */}
              <div className="flex items-center justify-between px-8 pt-8 pb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Manual Entry: Site Issue</span>
                <button 
                  type="button"
                  onClick={() => setShowLogModal(false)} 
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <X size={18} strokeWidth={2.5}/>
                </button>
              </div>

              {/* Form container with targeted scroll optimization fallback */}
              <form onSubmit={handleLogIssue} className="px-8 pb-8 pt-2 sm:px-10 sm:pb-10 space-y-6 overflow-y-auto">
                
                {/* ISSUE TITLE */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Issue Title</label>
                  <input 
                    required
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 text-[12px] font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300"
                    placeholder="Short summary of the problem"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  />
                </div>

                {/* FULL DESCRIPTION */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Full Description</label>
                  <textarea 
                    required
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 text-[12px] font-medium text-slate-800 outline-none h-32 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300"
                    placeholder="Detail the technical specifications or site conditions..."
                    value={newIssue.desc}
                    onChange={(e) => setNewIssue({...newIssue, desc: e.target.value})}
                  />
                </div>

                {/* PRIORITY SELECTION */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Priority Level</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {['Routine', 'High', 'Critical'].map(lvl => (
                      <button 
                        key={lvl} type="button"
                        onClick={() => setNewIssue({...newIssue, priority: lvl})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                          newIssue.priority === lvl 
                            ? 'bg-[#0B132B] border-[#0B132B] text-white shadow-sm' 
                            : 'bg-white border-slate-200/70 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 pt-2">
                   <button 
                    type="button" 
                    className="flex-1 bg-[#F1F5F9] hover:bg-slate-200 text-slate-600 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                   >
                    <Camera size={15} strokeWidth={2.5}/> Add Media
                   </button>
                   <button 
                    type="submit" 
                    className="flex-[1.8] bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                   >
                    <Send size={15} strokeWidth={2.5}/> Log to Registry
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataPoint({ label, value }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{label}</p>
      <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{value}</p>
    </div>
  );
}