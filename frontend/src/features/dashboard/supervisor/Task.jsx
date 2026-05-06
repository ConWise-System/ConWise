"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, User, 
  MapPin, HardHat, 
  DollarSign, Package, Lock, Eye
} from 'lucide-react';

export default function TaskManagement() {
 
  const [activeTab, setActiveTab] = useState('Fleet Operations');


  const [tasks] = useState([
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

  const [logs] = useState([
    { id: 1, task: "Zone 2 Excavation", date: "04 May 2026", status: "Approved", user: "Elena Rossi", cost: 8500 }
  ]);

 
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'Supervision Overview') return true; 
    return task.category === activeTab;
  });

  return (
    <div className="w-full min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans antialiased relative">
      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">
        
        
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 p-3 rounded-2xl shadow-xl">
              <HardHat className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Task <span className="text-slate-400 font-medium italic">Management</span></h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">Supervision Module // Adama Sector</p>
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
        
          <aside className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 text-center space-y-3">
              <div className="bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Lock size={18} />
              </div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-tight italic">
                Read-Only Access<br/>Modifications Disabled
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 text-center">Resource Analytics</h4>
              <div className="space-y-3">
                <ResourceStat label="Material Cap" value="88%" color="bg-emerald-500" />
                <ResourceStat label="Labor Hours" value="62%" color="bg-blue-500" />
              </div>
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-9 space-y-4">
            <div className="flex justify-between items-end mb-4 px-2">
              <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Live Feed: {activeTab}</h2>
            </div>
            
            <AnimatePresence mode='popLayout'>
              {filteredTasks.length > 0 ? filteredTasks.map((task) => (
                <motion.div 
                  layout key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center"
                >
                  <div className="p-4 rounded-2xl bg-slate-50 text-slate-400">
                    <Eye size={24} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-slate-100 text-slate-500">{task.priority}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase italic">{task.deadline}</span>
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

                  <div className="shrink-0">
                    <span className="text-[9px] font-black uppercase text-slate-400 border border-slate-200 px-4 py-2 rounded-xl">
                      {task.status}
                    </span>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No Data Available</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* LOG LEDGER (Non-Interactive) */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic">Audit Logs</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {logs.map(log => (
              <div key={log.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-[10px] font-black text-[#111827] uppercase truncate">{log.task}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase">{log.user} • {log.date}</p>
                <span className="text-[7px] font-black px-2 py-0.5 rounded bg-emerald-50 text-emerald-600">
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