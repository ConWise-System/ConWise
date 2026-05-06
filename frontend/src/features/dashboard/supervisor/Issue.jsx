"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, CheckCircle2, Clock, User, 
  Filter, X, Image as ImageIcon,
  ChevronRight, ShieldAlert, Lock, Plus, Send, Camera, History
} from 'lucide-react';

export default function SiteIssueReport() {
  // 1. ACTORS & ROLE MANAGEMENT
  // Roles: 'supervisor' (can log), 'engineer' (can update), 'manager' (can close)
  const [userRole, setUserRole] = useState('supervisor'); 

  // 2. STATE MANAGEMENT
  const [issues, setIssues] = useState([
    { 
      id: "ISS-942", title: "Structural Rebar Anomaly", description: "Ground floor reinforcement misalignment detected in Sector B.",
      priority: "Critical", reporter: "Alan E.", status: "Open", date: "2026-05-03",
      category: "Structural", history: ["Issue reported by Alan E."]
    },
    { 
      id: "ISS-938", title: "HVAC Ducting Obstruction", description: "Unforeseen piping clash at Pillar 42C preventing duct installation.",
      priority: "High", reporter: "Sarah L.", status: "Investigating", date: "2026-05-04",
      category: "Mechanical", history: ["Issue reported by Sarah L.", "Engineer assigned to investigation"]
    }
  ]);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newIssueDesc, setNewIssueDesc] = useState('');
  const [newIssuePriority, setNewIssuePriority] = useState('Routine');

  // 3. FLOW OF EVENTS HANDLERS

  // Supervisor Event: Log New Issue
  const handleLogIssue = (e) => {
    e.preventDefault();
    const newEntry = {
      id: `ISS-${Math.floor(100 + Math.random() * 900)}`,
      title: newIssueDesc.substring(0, 25) + "...",
      description: newIssueDesc,
      priority: newIssuePriority,
      reporter: "Christy", // Supervisor identity
      status: "Open",
      date: new Date().toISOString().split('T')[0],
      category: "General",
      history: ["Issue logged by Supervisor"]
    };
    setIssues([newEntry, ...issues]);
    setShowLogModal(false);
    setNewIssueDesc('');
  };

  // Engineer/Manager Event: Update Status & Store History
  const updateStatus = (id, nextStatus) => {
    setIssues(issues.map(iss => {
      if (iss.id === id) {
        return {
          ...iss,
          status: nextStatus,
          history: [...iss.history, `Status updated to ${nextStatus} by ${userRole}`]
        };
      }
      return iss;
    }));
    setSelectedIssue(null);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans antialiased">
      {/* HEADER SECTION */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2 rounded-lg text-white">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">Issue Tracking</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Scenario: Site Reporting Flow</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              value={userRole} 
              onChange={(e) => setUserRole(e.target.value)}
              className="text-[10px] font-black uppercase bg-slate-100 border-none rounded-lg px-3 py-2 outline-none"
            >
              <option value="supervisor">Role: Supervisor</option>
              <option value="engineer">Role: Engineer</option>
              <option value="manager">Role: Manager</option>
            </select>
            {userRole === 'supervisor' && (
              <button 
                onClick={() => setShowLogModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all"
              >
                <Plus size={14} /> Log Issue
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-6 py-10 grid grid-cols-12 gap-8">
        
        {/* STATS OVERVIEW */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <StatCard label="Authenticated as" value={userRole.toUpperCase()} color="text-slate-900" />
          <StatCard label="Active Impediments" value={issues.filter(i => i.status !== 'Closed').length} color="text-rose-600" />
          <StatCard label="System Status" value="Online" color="text-emerald-500" />
        </section>

        {/* MAIN ISSUE FEED */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Issues Module</h2>
          </div>

          <div className="space-y-3">
            {issues.map((issue) => (
              <motion.div 
                key={issue.id}
                layout
                onClick={() => setSelectedIssue(issue)}
                className={`bg-white border border-slate-200 rounded-3xl p-5 flex items-center gap-6 cursor-pointer hover:shadow-lg transition-all ${selectedIssue?.id === issue.id ? 'ring-2 ring-blue-500' : ''} ${issue.status === 'Closed' ? 'opacity-60 grayscale' : ''}`}
              >
                <div className="min-w-[80px] flex flex-col items-center">
                  <span className="text-[10px] font-black text-slate-300">#{issue.id}</span>
                  <PriorityBadge priority={issue.priority} />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm font-black text-slate-900">{issue.title}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <MetaItem icon={<User size={10}/>} text={issue.reporter} />
                    <StatusTag status={issue.status} />
                  </div>
                </div>
                <ChevronRight className="text-slate-300" size={20} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ACTIONS & HISTORY SIDEBAR */}
        <aside className="col-span-12 lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedIssue ? (
              <motion.div 
                key={selectedIssue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 sticky top-28"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-black">Issue Details</h2>
                  <button onClick={() => setSelectedIssue(null)}><X size={20}/></button>
                </div>

                <div className="space-y-6">
                  <DetailBlock label="Description" value={selectedIssue.description} />
                  
                  {/* Actor Specific Actions */}
                  <div className="pt-4 space-y-3">
                    <h4 className="text-[10px] font-black uppercase text-slate-400">Available Actions</h4>
                    
                    {userRole === 'engineer' && selectedIssue.status === 'Open' && (
                      <button 
                        onClick={() => updateStatus(selectedIssue.id, 'Investigating')}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all"
                      >
                        Begin Investigation
                      </button>
                    )}

                    {userRole === 'manager' && selectedIssue.status === 'Investigating' && (
                      <button 
                        onClick={() => updateStatus(selectedIssue.id, 'Closed')}
                        className="w-full bg-emerald-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all"
                      >
                        Review & Close Issue
                      </button>
                    )}

                    {((userRole === 'engineer' && selectedIssue.status === 'Investigating') || selectedIssue.status === 'Closed') && (
                      <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <Lock size={14} className="text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Status updates restricted for this role/state</span>
                      </div>
                    )}
                  </div>

                  {/* Postcondition: History Store */}
                  <div className="pt-6 border-t border-slate-100">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2 mb-3">
                      <History size={12}/> Resolution History
                    </h4>
                    <div className="space-y-2">
                      {selectedIssue.history.map((log, i) => (
                        <div key={i} className="text-[10px] font-medium text-slate-500 pl-3 border-l-2 border-slate-100 italic">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400">
                <p className="text-[10px] font-black uppercase">Select an issue to act</p>
              </div>
            )}
          </AnimatePresence>
        </aside>
      </main>

      {/* LOG ISSUE MODAL (Supervisor Flow) */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] w-full max-w-lg p-10 shadow-2xl">
              <div className="flex justify-between mb-8">
                <h3 className="text-2xl font-black italic tracking-tighter">Log New Site Issue</h3>
                <button onClick={() => setShowLogModal(false)}><X/></button>
              </div>
              <form onSubmit={handleLogIssue} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                  <textarea 
                    required
                    value={newIssueDesc}
                    onChange={(e) => setNewIssueDesc(e.target.value)}
                    className="w-full bg-slate-50 rounded-2xl p-4 text-sm outline-none border-2 border-transparent focus:border-slate-900 h-32"
                    placeholder="Describe the impediment..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Priority</label>
                  <div className="flex gap-2">
                    {['Critical', 'High', 'Routine'].map(p => (
                      <button 
                        key={p} type="button" 
                        onClick={() => setNewIssuePriority(p)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase border-2 transition-all ${newIssuePriority === p ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-100 text-slate-400'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center gap-2 text-slate-300">
                  <Camera size={24}/>
                  <span className="text-[10px] font-black uppercase">Attach Photo</span>
                </div>
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3">
                  <Send size={16}/> Assign to Engineering
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// SHARED COMPONENTS
const StatCard = ({ label, value, color }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-[2rem]">
    <p className="text-[10px] font-black uppercase text-slate-400 mb-1">{label}</p>
    <p className={`text-2xl font-black tracking-tight ${color}`}>{value}</p>
  </div>
);

const PriorityBadge = ({ priority }) => {
  const colors = { Critical: "bg-rose-100 text-rose-600", High: "bg-orange-100 text-orange-600", Routine: "bg-blue-100 text-blue-600" };
  return <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase mt-1 ${colors[priority]}`}>{priority}</span>;
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
    <p className="text-[8px] font-black uppercase text-slate-400 mb-2">{label}</p>
    <p className="text-xs font-medium text-slate-700 leading-relaxed italic">{value}</p>
  </div>
);