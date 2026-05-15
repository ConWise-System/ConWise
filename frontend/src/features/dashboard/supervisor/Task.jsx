"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, User, 
  MapPin, HardHat, 
  DollarSign, Package, Lock, Eye,
  CheckCircle
} from 'lucide-react';

export default function TaskManagement() {
  const [activeTab, setActiveTab] = useState('Fleet Operations');
  
  // Supervisor's Name (Usually from Auth context/cookies)
  const currentSupervisor = "Elena Rossi";

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
    { id: 1, task: "Zone 2 Excavation", date: "04 May 2026", status: "Approved", user: "Elena Rossi", cost: 8500 }
  ]);

  // ACTION: Mark task as done
  const handleMarkAsDone = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: "Done" } : task
    ));
    
    // Optional: Add to logs automatically
    const completedTask = tasks.find(t => t.id === id);
    setLogs(prev => [{
        id: Date.now(),
        task: completedTask.title,
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: "Submitted",
        user: currentSupervisor,
        cost: completedTask.cost
    }, ...prev]);
  };

  // 1. FILTER: Only show tasks assigned to this supervisor
  const filteredTasks = tasks.filter(task => {
    const isAssignedToMe = task.engineer === currentSupervisor;
    if (activeTab === 'Supervision Overview') return isAssignedToMe; 
    return isAssignedToMe && task.category === activeTab;
  });

  return (
    <div className="w-full min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans antialiased relative">
      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200">
              <HardHat className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Supervisor <span className="text-slate-400 font-medium italic">Portal</span></h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Active Session: {currentSupervisor}</p>
            </div>
          </div>

          <nav className="flex p-1 bg-slate-200/50 rounded-xl">
            {['Fleet Operations', 'Asset Board', 'Supervision Overview'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 ${
                  activeTab === tab ? 'bg-white text-[#111827] shadow-md' : 'text-slate-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-12 gap-8">
          
          {/* SIDEBAR */}
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-emerald-500 rounded-[2rem] p-6 text-white text-center space-y-2 shadow-lg shadow-emerald-100">
              <CheckCircle2 size={24} className="mx-auto opacity-80" />
              <h3 className="text-[11px] font-black uppercase tracking-widest">Active Status</h3>
              <p className="text-[10px] font-medium opacity-90 uppercase">Permission: Submissions Enabled</p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 text-center">Your Performance</h4>
              <div className="space-y-3">
                <ResourceStat label="Tasks Completed" value="75%" color="bg-emerald-500" />
                <ResourceStat label="Deadline Accuracy" value="92%" color="bg-blue-500" />
              </div>
            </div>
          </aside>

          {/* MAIN TASK FEED */}
          <div className="col-span-12 lg:col-span-9 space-y-4">
            <div className="flex justify-between items-end mb-4 px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Tasks Assigned to You</h2>
            </div>
            
            <AnimatePresence mode='popLayout'>
              {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                <motion.div 
                  layout key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden"
                >
                  {task.status === "Done" && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-1 rotate-45 translate-x-6 translate-y-2 text-[8px] font-black uppercase">Completed</div>
                  )}

                  <div className={`p-4 rounded-2xl ${task.status === "Done" ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                    {task.status === "Done" ? <CheckCircle size={24} /> : <Clock size={24} />}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${task.priority === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{task.priority}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase italic">Due: {task.deadline}</span>
                    </div>
                    <h3 className={`text-lg font-black tracking-tight ${task.status === "Done" ? 'text-slate-400 line-through' : 'text-[#111827]'}`}>{task.title}</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                      <TaskTag icon={<MapPin size={12}/>} text={task.location} />
                      <TaskTag icon={<Package size={12}/>} text={task.materials} />
                      <TaskTag icon={<DollarSign size={12}/>} text={`$${task.cost?.toLocaleString()}`} />
                    </div>
                  </div>

                  <div className="shrink-0">
                    {task.status !== "Done" ? (
                      <button 
                        onClick={() => handleMarkAsDone(task.id)}
                        className="flex items-center gap-2 text-[9px] font-black uppercase bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                      >
                        <CheckCircle2 size={14} /> Submit Done
                      </button>
                    ) : (
                      <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
                        Task Verified
                      </span>
                    )}
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No assigned tasks in this category</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AUDIT LOGS */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic">Your Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {logs.filter(l => l.user === currentSupervisor).map(log => (
              <div key={log.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-[#111827] uppercase truncate">{log.task}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">{log.date}</p>
                <span className={`text-[7px] font-black px-2 py-0.5 rounded ${log.status === 'Submitted' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Sub-components kept identical but with refined styling
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