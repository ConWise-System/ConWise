"use client";
import React, { useState } from 'react';
import { 
  Plus, Search, Trash2, CheckCircle, Clock, 
  AlertCircle, Briefcase, ArrowLeft, Save, X, ChevronRight, Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_TASKS = [
  { id: 1, name: 'Foundation Pouring', project: 'Apartment A1', assignee: 'Eng. Solomon', deadline: 'Apr 10', status: 'In Progress', priority: 'High' },
  { id: 2, name: 'Electrical Wiring', project: 'Office Complex', assignee: 'Sup. Kedir', deadline: 'Apr 15', status: 'Pending', priority: 'Medium' },
  { id: 3, name: 'Site Clearance', project: 'Villa Project', assignee: 'Eng. Chala', deadline: 'Completed', status: 'Completed', priority: 'Low' },
];

export default function IntegratedTaskSystem() {
  const [view, setView] = useState('list'); 
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const addNewTask = (newTask) => {
    setTasks([{ id: Date.now(), ...newTask }, ...tasks]);
    setView('list');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans selection:bg-blue-100 antialiased">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
            className="max-w-6xl mx-auto space-y-6"
          >
         
            <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
              <div className="space-y-1">
                <nav className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-blue-600">
                  <span>Operations</span> <ChevronRight size={10} strokeWidth={3} /> <span className="text-slate-400">Activity Control</span>
                </nav>
                <h1 className="text-xl text-slate-900 tracking-tight uppercase">Task Repository</h1>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Archive</button>
                <button 
                  onClick={() => setView('add')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:bg-blue-600 transition-all active:scale-95"
                >
                  <Plus size={14} strokeWidth={3} /> Initiate Task
                </button>
              </div>
            </header>

            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Units" value={tasks.length} icon={<Briefcase size={14}/>} color="black" />
              <StatCard label="In Motion" value={tasks.filter(t => t.status === 'In Progress').length} icon={<Clock size={14}/>} color="blue" />
              <StatCard label="Finalized" value={tasks.filter(t => t.status === 'Completed').length} icon={<CheckCircle size={14}/>} color="blue" />
              <StatCard label="Priority" value={tasks.filter(t => t.priority === 'High').length} icon={<AlertCircle size={14}/>} color="black" />
            </div>

           
            <div className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    placeholder="Search strategic tasks..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" 
                  />
                </div>
              </div>
              
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-100">
                  <tr className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-4">Activity Description</th>
                    <th className="px-8 py-4">Assignee</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="text-[12px] font-black text-slate-800 tracking-tight">{task.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter italic">{task.project} • {task.deadline}</div>
                      </td>
                      <td className="px-8 py-5 text-[11px] font-bold text-slate-500 uppercase">{task.assignee}</td>
                      <td className="px-8 py-5">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => setTasks(tasks.filter(t => t.id !== task.id))}
                          className="p-2 text-slate-200 hover:text-blue-600 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
         
          <motion.div 
            key="add" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="max-w-xl mx-auto py-8"
          >
            <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 mb-6 transition-all">
              <ArrowLeft size={14} /> Return to Dashboard
            </button>
            
            <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-center mb-2">
                   <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Layout size={16}/></div>
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight text-center">New <span className="text-blue-600 italic">Project Unit</span></h2>
                <p className="text-slate-400 font-bold text-[7px] uppercase tracking-[0.4em] text-center mt-1">Operational Sync Protocol</p>
              </div>
              
              <form className="p-8 space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addNewTask({
                  name: formData.get('name'),
                  project: formData.get('project'),
                  assignee: formData.get('assignee'),
                  deadline: formData.get('deadline'),
                  priority: formData.get('priority'),
                  status: 'Pending'
                });
              }}>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Identity/Label</label>
                  <input required name="name" placeholder="Activity identification..." className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-100 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Site Domain</label>
                    <input required name="project" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Deadline</label>
                    <input required name="deadline" type="date" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Assignee</label>
                    <select name="assignee" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border-none text-[11px] font-bold appearance-none outline-none cursor-pointer">
                      <option>Eng. Solomon</option>
                      <option>Sup. Kedir</option>
                      <option>Eng. Chala</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority Load</label>
                    <select name="priority" className="w-full px-5 py-3.5 bg-slate-50 rounded-xl border-none text-[11px] font-bold appearance-none outline-none cursor-pointer">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-3">
                  <button type="submit" className="flex-1 py-4 bg-[#0F172A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95">
                    <Save size={14} fill="currentColor" /> Finalize & Push
                  </button>
                  <button type="button" onClick={() => setView('list')} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Abort
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



function StatCard({ label, value, icon, color }) {
  const styles = {
    black: "text-white bg-[#0F172A] border-slate-800",
    blue: "text-blue-700 bg-blue-50 border-blue-100"
  };

  return (
    <div className={`p-5 rounded-[1.5rem] border shadow-sm flex items-center gap-4 hover:shadow-md transition-all ${styles[color] || "bg-white text-slate-900 border-slate-200"}`}>
      <div className={`p-2.5 rounded-xl ${color === 'black' ? 'bg-white/10' : 'bg-white shadow-sm'}`}>{icon}</div>
      <div>
        <p className={`text-[8px] font-black uppercase tracking-widest leading-none mb-1.5 ${color === 'black' ? 'text-slate-400' : 'text-blue-400'}`}>{label}</p>
        <p className="text-xl font-black leading-none ">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'In Progress': 'bg-blue-600 text-white border-blue-600',
    'Pending': 'bg-slate-100 text-slate-600 border-slate-200',
    'Completed': 'bg-[#0F172A] text-white border-slate-900',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase italic tracking-tighter shadow-sm ${styles[status]}`}>
      {status}
    </span>
  );
}