"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, User, 
  MapPin, HardHat, 
  DollarSign, Package, Lock, Eye,
  CheckCircle, Loader2
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi'; 
import Axios from '../../../../utils/Axios'; 

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All Tasks'); // Set default fallback to show everything initially
  const [currentSupervisor, setCurrentSupervisor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await Axios({
          ...summeryApi.getTasksByAssignee,
        });

        const fetchedTasks = response.data?.data || [];
        
        if (Array.isArray(fetchedTasks)) {
          setTasks(fetchedTasks);

          if (fetchedTasks.length > 0) {
            // Set supervisor session profile text dynamically from backend payload
            const primaryAssignee = fetchedTasks[0].assignee;
            if (primaryAssignee) {
              setCurrentSupervisor(`${primaryAssignee.firstName} ${primaryAssignee.lastName}`);
            }
          }
        }
      } catch (err) {
        console.error("Backend Task Synchronization Failed:", err);
        const errMsg = err.response?.data?.message || err.message || "An error occurred while fetching system records.";
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Action: Mark a single task item as finalized
  const handleMarkAsDone = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, taskStatus: "Done" } : task
    ));
    
    const completedTask = tasks.find(t => t.id === id);
    if (completedTask) {
      setLogs(prev => [{
          id: Date.now(),
          task: completedTask.taskTitle,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: "Submitted",
          user: currentSupervisor || "Supervisor",
          cost: Number(completedTask.taskBudget || 0)
      }, ...prev]);
    }
  };

  // DYNAMIC TABS GENERATION: Compile all unique project tracking titles present in the collection
  const dynamicProjects = [
    ...new Set(tasks.map(t => t.project?.projectName).filter(Boolean))
  ];

  // FILTER LOGIC: Since your API route 'getTasksByAssignee' already filters tasks specific to this user,
  // we only need to filter out items based on the active project sub-tab choice.
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'All Tasks' || activeTab === 'Supervision Overview') {
      return true; // Show absolutely everything returned by the endpoint
    }
    return task.project?.projectName === activeTab;
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
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                Active Session: {currentSupervisor || "Synchronizing Profile..."}
              </p>
            </div>
          </div>

          {/* SYSTEM NAVIGATION TABS */}
          <nav className="flex p-1 bg-slate-200/50 rounded-xl overflow-x-auto max-w-full">
            {['All Tasks', ...dynamicProjects, 'Supervision Overview'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-200 whitespace-nowrap ${
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
              {isLoading ? (
                <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 gap-3">
                  <Loader2 className="text-blue-600 animate-spin" size={24} />
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Registry Ledger...</p>
                </div>
              ) : error ? (
                <div className="text-center py-16 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 p-6">
                  <p className="text-[11px] font-black uppercase tracking-wider mb-1">Database Sync Failure</p>
                  <p className="text-xs text-red-500/80 font-medium">{error}</p>
                </div>
              ) : filteredTasks.length > 0 ? filteredTasks.map((task) => {
                const isDone = task.taskStatus === "Done" || task.taskStatus === "COMPLETED";
                const cleanDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "N/A";

                return (
                  <motion.div 
                    layout key={task.id || task._id} // Supports both sequential integers and default Mongo/Postgres auto IDs
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden"
                  >
                    {isDone && (
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white px-8 py-1 rotate-45 translate-x-6 translate-y-2 text-[8px] font-black uppercase">Completed</div>
                    )}

                    <div className={`p-4 rounded-2xl ${isDone ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                      {isDone ? <CheckCircle size={24} /> : <Clock size={24} />}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${task.taskPriority === 'CRITICAL' || task.taskPriority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{task.taskPriority || 'MEDIUM'}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase italic">Due: {cleanDate}</span>
                      </div>
                      <h3 className={`text-lg font-black tracking-tight ${isDone ? 'text-slate-400 line-through' : 'text-[#111827]'}`}>{task.taskTitle}</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{task.taskDescription}</p>
                      
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                        <TaskTag icon={<MapPin size={12}/>} text={task.project?.projectName || "Unknown Sector"} />
                        <TaskTag icon={<Package size={12}/>} text={task.taskStatus || "TODO"} />
                        <TaskTag icon={<DollarSign size={12}/>} text={`$${Number(task.taskBudget || 0).toLocaleString()}`} />
                      </div>
                    </div>

                    <div className="shrink-0">
                      {!isDone ? (
                        <button 
                          onClick={() => handleMarkAsDone(task.id || task._id)}
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
                );
              }) : (
                <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No assigned tasks found</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* AUDIT LOGS */}
        {logs.length > 0 && (
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 italic">Your Recent Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {logs.map(log => (
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
        )}
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