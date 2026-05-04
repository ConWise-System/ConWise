"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, CheckCircle2, Clock, User, 
  Filter, X, Image as ImageIcon,
  ChevronRight, ShieldAlert, Lock
} from 'lucide-react';

export default function SiteIssueReport() {
  // 1. ROLE IDENTIFICATION
  // Engineer-ichi view qofa akka danda'uuf 'engineer' jennaan
  const userRole = 'engineer'; 

  // 2. STATE MANAGEMENT
  const [issues, setIssues] = useState([
    { 
      id: "ISS-942", title: "Structural Rebar Anomaly", description: "Ground floor reinforcement misalignment detected in Sector B.",
      priority: "Critical", reporter: "Alan E.", status: "Open", date: "2026-05-03",
      category: "Structural", image: "https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=200"
    },
    { 
      id: "ISS-938", title: "HVAC Ducting Obstruction", description: "Unforeseen piping clash at Pillar 42C preventing duct installation.",
      priority: "High", reporter: "Sarah L.", status: "Investigating", date: "2026-05-04",
      category: "Mechanical", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=200"
    }
  ]);

  const [selectedIssue, setSelectedIssue] = useState(null);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter italic">Engineer Insight</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Read-Only Site Monitoring</p>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
            <Lock size={14} className="text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Engineer Access</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-10 grid grid-cols-12 gap-8">
        
        {/* STATS OVERVIEW */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <StatCard label="Total Monitored" value={issues.length} color="text-slate-900" />
          <StatCard label="Critical Blockers" value={issues.filter(i => i.priority === 'Critical').length} color="text-rose-600" />
          <StatCard label="Access Level" value="View Only" color="text-blue-600" />
        </section>

        {/* MAIN ISSUE FEED */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Project Incident Log</h2>
            <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900"><Filter size={14}/></button>
          </div>

          <div className="space-y-3">
            {issues.map((issue) => (
              <motion.div 
                key={issue.id}
                layout
                whileHover={{ x: 4 }}
                onClick={() => setSelectedIssue(issue)}
                className={`bg-white border border-slate-200 rounded-3xl p-5 flex items-center gap-6 cursor-pointer hover:border-blue-400 hover:shadow-xl transition-all group ${selectedIssue?.id === issue.id ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
              >
                <div className="flex flex-col items-center gap-1 min-w-[80px]">
                  <span className="text-[10px] font-black text-slate-400">{issue.id}</span>
                  <PriorityBadge priority={issue.priority} />
                </div>

                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{issue.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{issue.description}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <MetaItem icon={<User size={10}/>} text={issue.reporter} />
                    <MetaItem icon={<Clock size={10}/>} text={issue.date} />
                    <StatusTag status={issue.status} />
                  </div>
                </div>

                <div className="hidden md:block w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                  {issue.image ? <img src={issue.image} alt="Site" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20}/></div>}
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-all" size={20} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* DETAILS SIDEBAR */}
        <aside className="col-span-12 lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedIssue ? (
              <motion.div 
                key={selectedIssue.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sticky top-28 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Forensic View</span>
                    <h2 className="text-2xl font-black tracking-tighter">#{selectedIssue.id}</h2>
                  </div>
                  <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20}/></button>
                </div>

                <div className="w-full aspect-video rounded-[2rem] bg-slate-100 mb-6 overflow-hidden border border-slate-200 shadow-inner">
                   {selectedIssue.image ? <img src={selectedIssue.image} alt="Report" className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 gap-2"><ImageIcon size={32}/><span className="text-[10px] font-bold uppercase">No Image</span></div>}
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Issue Statement</h4>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">{selectedIssue.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <DetailBlock label="Sector/Category" value={selectedIssue.category} />
                    <DetailBlock label="Severity" value={selectedIssue.priority} />
                  </div>

                  {/* Read Only Notice instead of Management Buttons */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-dashed border-slate-200">
                      <Lock size={16} className="text-slate-400" />
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight tracking-wider">
                        Management actions are restricted for Site Engineers. Contact Administrator for updates.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-400">
                <AlertCircle size={48} className="mb-4 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest">Select an incident to review<br/>technical specifications.</p>
              </div>
            )}
          </AnimatePresence>
        </aside>
      </main>
    </div>
  );
}

// UI COMPONENTS (SIMPLIFIED & CLEANED)
const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm">
    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
    <p className={`text-3xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

const PriorityBadge = ({ priority }) => {
  const colors = {
    Critical: "bg-rose-100 text-rose-600",
    High: "bg-orange-100 text-orange-600",
    Routine: "bg-blue-100 text-blue-600"
  };
  return (
    <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${colors[priority]}`}>
      {priority}
    </span>
  );
};

const StatusTag = ({ status }) => (
  <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
    <div className={`w-1.5 h-1.5 rounded-full ${status === 'Closed' ? 'bg-emerald-500' : status === 'Investigating' ? 'bg-blue-500' : 'bg-rose-500'}`} />
    <span className="text-[8px] font-black uppercase text-slate-500">{status}</span>
  </div>
);

const MetaItem = ({ icon, text }) => (
  <div className="flex items-center gap-1 text-slate-400">
    {icon}
    <span className="text-[9px] font-bold uppercase tracking-tight">{text}</span>
  </div>
);

const DetailBlock = ({ label, value }) => (
  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
    <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{label}</p>
    <p className="text-[11px] font-bold text-slate-900 uppercase italic tracking-tight">{value}</p>
  </div>
);