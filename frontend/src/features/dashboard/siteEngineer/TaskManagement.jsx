"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, CheckCircle2, Clock, Send, User, 
  MapPin, ClipboardList, X, HardHat, 
  DollarSign, Package, FileText, Calendar, Eye, Search
} from 'lucide-react';

export default function TaskManagement() {
  // 1. STATE MANAGEMENT
  const [activeTab, setActiveTab] = useState('Fleet Operations');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewingLog, setReviewingLog] = useState(null); // State for approval modal

  const [tasks, setTasks] = useState([
    { 
      id: 1, title: "Structural Foundation Pour", description: "Grade A-2 concrete pouring for Block B sector.",
      deadline: "2026-05-10", priority: "Critical", location: "Sector 04", 
      status: "Active", engineer: "Elena Rossi", cost: 12500, materials: "Concrete C30/37",
      category: "Fleet Operations" 
    },
    { 
      id: 2, title: "HVAC System Calibration", description: "Pressure testing and thermal sensor sync.",
      deadline: "2026-05-15", priority: "Medium", location: "Main Plant", 
      status: "Pending", engineer: "Mark Thornton", cost: 4200, materials: "R-410A Refrigerant",
      category: "Asset Board"
    }
  ]);

  const [logs, setLogs] = useState([
    { id: 1, task: "Zone 2 Excavation", date: "04 May 2026", status: "Approved", user: "Elena Rossi", cost: 8500, details: "Excavation completed to 5m depth. Soil stability verified." }
  ]);

  // 2. FILTERING LOGIC
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'Manager Console') return true; 
    return task.category === activeTab;
  });

  // 3. ACTION HANDLERS

  // Engineer submits task for review
  const handleEngineerSubmit = (id) => {
    const taskToSubmit = tasks.find(t => t.id === id);
    if (!taskToSubmit) return;

    // Update local task status to simulate submission
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Submitted' } : t));

    // Create a pending log entry for management review
    const pendingLog = {
      id: Date.now(),
      task: taskToSubmit.title,
      date: "Just Now",
      status: "Pending Review",
      user: taskToSubmit.engineer,
      cost: taskToSubmit.cost,
      details: `Field Report submitted by ${taskToSubmit.engineer}. Awaiting structural sign-off.`,
      originalTaskId: taskToSubmit.id
    };
    setLogs(prev => [pendingLog, ...prev]);
  };

  // Manager Approves/Rejects a log
  const handleManagerDecision = (logId, status) => {
    // 1. Update the log status
    setLogs(prev => prev.map(log => log.id === logId ? { ...log, status: status, reviewer: "Manager" } : log));

    // 2. Update the original task status based on decision
    const reviewedLog = logs.find(log => log.id === logId);
    if (reviewedLog && reviewedLog.originalTaskId) {
      setTasks(prev => prev.map(task => 
        task.id === reviewedLog.originalTaskId 
        ? { ...task, status: status === 'Approved' ? 'Completed' : 'Revision Required' } 
        : task
      ));
    }

    // Close review modal
    setReviewingLog(null);
  };

  const addNewTask = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newTask = {
      id: Date.now(),
      title: fd.get('title'),
      description: fd.get('description'),
      deadline: fd.get('deadline'),
      priority: fd.get('priority'),
      location: "Adama Sector",
      engineer: fd.get('engineer'),
      cost: Number(fd.get('cost')) || 0,
      materials: fd.get('materials'),
      status: "Pending",
      category: activeTab 
    };
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans antialiased relative">
      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">
        
        {/* ENTERPRISE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#111827] p-3 rounded-2xl shadow-xl shadow-blue-900/20">
              <HardHat className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Task <span className="text-slate-400 font-medium italic">v3.2</span></h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Operations Management // Adama Sector</p>
            </div>
          </div>

          <nav className="flex p-1 bg-slate-200/50 rounded-xl">
            {['Fleet Operations', 'Asset Board', 'Manager Console'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab ? 'bg-white text-[#111827] shadow-md scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* CONTROL PANEL */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <motion.div 
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsModalOpen(true)}
              className="bg-[#111827] rounded-[2rem] p-6 text-white cursor-pointer relative overflow-hidden group shadow-2xl"
            >
              <div className="relative z-10 space-y-4">
                <div className="bg-blue-500/20 w-fit p-2 rounded-lg"><Plus size={20} /></div>
                <h3 className="text-xl font-bold leading-tight tracking-tight">Deploy New<br/>Engineering Task</h3>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-relaxed">Allocate resources and personnel in real-time.</p>
              </div>
              <ClipboardList className="absolute -bottom-4 -right-4 opacity-5 group-hover:scale-110 transition-transform" size={150} />
            </motion.div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 italic text-center">Active Resources</h4>
              <div className="space-y-3">
                <ResourceStat label="Material Cap" value="88%" color="bg-emerald-500" />
                <ResourceStat label="Labor Hours" value="62%" color="bg-blue-500" />
              </div>
            </div>
          </aside>

          {/* TASK ARCHITECTURE - FILTERED BY TAB */}
          <div className="col-span-12 lg:col-span-9 space-y-4">
            <div className="flex justify-between items-end mb-4 px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Queue: {activeTab}</h2>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{filteredTasks.length} Systems Active</span>
            </div>
            
            <AnimatePresence mode='popLayout'>
              {filteredTasks.map((task) => (
                <motion.div 
                  layout key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start md:items-center ${task.status === 'Completed' ? 'opacity-50 grayscale bg-slate-50' : ''} ${task.status === 'Submitted' ? 'border-blue-200 bg-blue-50/50' : ''}`}
                >
                  <div className={`p-4 rounded-2xl ${task.status === 'Completed' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                    {task.status === 'Completed' ? <CheckCircle2 /> : <Clock />}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${task.priority === 'Critical' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{task.priority}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter italic">{task.deadline}</span>
                    </div>
                    <h3 className="text-lg font-black text-[#111827] tracking-tight">{task.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                      <TaskTag icon={<User size={12}/>} text={task.engineer} />
                      <TaskTag icon={<MapPin size={12}/>} text={task.location} />
                      <TaskTag icon={<Package size={12}/>} text={task.materials} />
                      <TaskTag icon={<DollarSign size={12}/>} text={`$${task.cost?.toLocaleString()}`} />
                    </div>
                  </div>

                  {task.status !== 'Completed' && task.status !== 'Submitted' && (
                    <button 
                      onClick={() => handleEngineerSubmit(task.id)}
                      className="bg-[#111827] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-colors shrink-0 shadow-lg"
                    >
                      <Send size={14} /> Submit
                    </button>
                  )}
                  {task.status === 'Submitted' && (
                    <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-100 px-4 py-2 rounded-xl">Under Review</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* COMPLIANCE LOGS - Reviewable Section */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative z-10">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic">Compliance & Approval Ledger</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {logs.map(log => (
              <div key={log.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-blue-100 transition-colors">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#111827] uppercase truncate w-32">{log.task}</p>
                  <p className="text-[8px] font-bold text-slate-400 uppercase">{log.user} • {log.date}</p>
                  <span className={`text-[7px] font-black px-2 py-0.5 rounded ${log.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    {log.status}
                  </span>
                </div>
                {log.status === 'Pending Review' ? (
                  <button onClick={() => setReviewingLog(log)} className="p-2 bg-[#111827] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Search size={14} />
                  </button>
                ) : (
                  <button onClick={() => setReviewingLog(log)} className="p-2 bg-slate-100 text-slate-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 4. APPROVAL MODAL SYSTEM */}
      <AnimatePresence>
        {reviewingLog && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative border border-white/20"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#111827]">Compliance Review</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Task Audit Module</p>
                </div>
                <button onClick={() => setReviewingLog(null)} className="p-3 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all"><X size={20} /></button>
              </div>

              <div className="space-y-8 text-sm">
                <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <DetailItem label="Task Title" value={reviewingLog.task} />
                  <DetailItem label="Submitted By" value={reviewingLog.user} />
                  <DetailItem label="Submission Date" value={reviewingLog.date} />
                  <DetailItem label="Reported Cost" value={`$${reviewingLog.cost?.toLocaleString()}`} />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Field Report / Completion Details</h4>
                  <p className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                    {reviewingLog.details || "No detailed report provided."}
                  </p>
                </div>

                {reviewingLog.status === 'Pending Review' ? (
                  <div className="flex flex-col md:flex-row gap-4 pt-6 border-t border-slate-100">
                    <button 
                      onClick={() => handleManagerDecision(reviewingLog.id, 'Revision Required')}
                      className="flex-1 bg-rose-50 text-rose-600 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-rose-100 transition-colors"
                    >
                      Request Revision
                    </button>
                    <button 
                      onClick={() => handleManagerDecision(reviewingLog.id, 'Approved')}
                      className="flex-[2] bg-[#111827] text-white py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 size={16} /> Approve System Deployment
                    </button>
                  </div>
                ) : (
                  <div className="pt-6 border-t border-slate-100 text-center">
                    <span className={`text-[9px] font-black uppercase px-6 py-3 rounded-full ${reviewingLog.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      Final Decision: {reviewingLog.status} by {reviewingLog.reviewer || "System"}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW TASK MODAL SYSTEM */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start md:items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-sm overflow-y-auto pt-20 md:pt-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl relative my-auto border border-white/20"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter text-[#111827]">New Task Deployment</h2>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Deploying to: {activeTab}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-100 rounded-full hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm"><X size={20} /></button>
              </div>

              <form onSubmit={addNewTask} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <FormInput name="title" label="Project Title" icon={<FileText size={14}/>} placeholder="Structural Phase A..." />
                    <FormInput name="deadline" label="Deployment Date" type="date" icon={<Calendar size={14}/>} />
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Priority Protocol</label>
                      <select name="priority" className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-4 text-xs font-bold uppercase ring-1 ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                        <option>Critical</option>
                        <option>Operational</option>
                        <option>Routine</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <FormInput name="engineer" label="Assigned Lead" icon={<User size={14}/>} placeholder="Lead Engineer Name" />
                    <FormInput name="materials" label="Material Allocation" icon={<Package size={14}/>} placeholder="Concrete, Steel, etc." />
                    <FormInput name="cost" label="Estimated Budget ($)" type="number" icon={<DollarSign size={14}/>} placeholder="0.00" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Technical Description</label>
                  <textarea name="description" rows="3" className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-4 text-xs font-bold ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none" placeholder="Enter detailed engineering requirements..." />
                </div>

                <button type="submit" className="w-full bg-[#111827] text-white py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:bg-blue-600 transition-all transform active:scale-95">
                  Initialize Deployment
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- MICRO COMPONENTS ---

const FormInput = ({ label, name, type = "text", icon, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <input required name={name} type={type} {...props} className="w-full bg-slate-50 border-0 rounded-2xl px-5 py-4 text-xs font-bold ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none" />
  </div>
);

const TaskTag = ({ icon, text }) => (
  <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
    <span className="text-blue-500">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-tight">{text}</span>
  </div>
);

const ResourceStat = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
      <span className="text-slate-400">{label}</span>
      <span className="text-[#111827]">{value}</span>
    </div>
    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: value }} />
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
    <p className="text-[11px] font-bold text-[#111827] uppercase">{value || "N/A"}</p>
  </div>
);