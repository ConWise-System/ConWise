"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, Clock, User, 
  MapPin, HardHat, 
  DollarSign, Package, Lock, Eye,
  CheckCircle, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi'; 
import Axios from '../../../../utils/Axios'; 

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All Tasks'); 
  const [currentSupervisor, setCurrentSupervisor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  // PAGINATION STATES (2 tasks per page layout)
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 2;

  // SAFE CLIENT-SIDE MOUNT HOOK
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLogs = localStorage.getItem('supervisor_activity_logs');
      if (savedLogs) {
        try {
          setLogs(JSON.parse(savedLogs));
        } catch (e) {
          console.error("Error parsing persisted activity records:", e);
        }
      }
    }
  }, []);

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
          // Get manual status overrides to protect against hard-refresh race conditions
          const localOverrides = JSON.parse(localStorage.getItem('task_status_overrides') || '{}');

          // Sort tasks: Newest items at the top
          const sortedTasks = [...fetchedTasks].map(task => {
            const taskId = task.id || task._id;
            // If a local override exists for this task, use it instead of lagging backend data
            if (localOverrides[taskId]) {
              return { ...task, taskStatus: localOverrides[taskId] };
            }
            return task;
          }).sort((a, b) => {
            const dateA = new Date(b.createdAt || b.updatedAt || b._id?.toString().substring(0,8) || 0);
            const dateB = new Date(a.createdAt || a.updatedAt || a._id?.toString().substring(0,8) || 0);
            return dateA - dateB;
          });

          setTasks(sortedTasks);

          if (sortedTasks.length > 0) {
            const primaryAssignee = sortedTasks[0].assignee;
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

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleUpdateStatus = async (id, targetStatus) => {
    if (!id) return;
    try {
      const targetUrl = summeryApi.submitTask.url.replace("{id}", id);

      // Save to local storage overrides immediately before network hit to guard against instant refresh
      const localOverrides = JSON.parse(localStorage.getItem('task_status_overrides') || '{}');
      localOverrides[id] = targetStatus;
      localStorage.setItem('task_status_overrides', JSON.stringify(localOverrides));

      await Axios({
        url: targetUrl,
        method: summeryApi.submitTask.method,
        data: { status: targetStatus }
      });


      setTasks(prev => prev.map(task => 
        (task.id === id || task._id === id) ? { ...task, taskStatus: targetStatus } : task
      ));
      
      const targetTaskItem = tasks.find(t => (t.id === id || t._id === id));
      if (targetTaskItem) {
        const newLogEntry = {
          id: Date.now(),
          task: targetTaskItem.taskTitle,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          status: targetStatus,
          user: currentSupervisor || "Supervisor",
          cost: Number(targetTaskItem.taskBudget || 0)
        };

        const updatedLogs = [newLogEntry, ...logs];
        setLogs(updatedLogs);
        localStorage.setItem('supervisor_activity_logs', JSON.stringify(updatedLogs));
      }
    } catch (err) {
      console.error(`Status update error:`, err);
      alert(err.response?.data?.message || "Failed to update task state.");
      // Rollback override if server flat out rejects it
      const localOverrides = JSON.parse(localStorage.getItem('task_status_overrides') || '{}');
      delete localOverrides[id];
      localStorage.setItem('task_status_overrides', JSON.stringify(localOverrides));
    }
  };

  // METRICS CALCULATIONS
  const totalTasksCount = tasks.length;
  
  const completedTasksCount = tasks.filter(task => {
    const status = (task.taskStatus || "").toUpperCase();
    return status === "SUBMITTED" || status === "DONE" || status === "COMPLETED";
  }).length;

  const tasksCompletedPercentage = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  const onTimeTasksCount = tasks.filter(task => {
    const status = (task.taskStatus || "").toUpperCase();
    const isCompletedStatus = status === "SUBMITTED" || status === "DONE" || status === "COMPLETED";
    
    if (isCompletedStatus) return true;
    return typeof task.daysRemaining === 'number' ? task.daysRemaining >= 0 : true;
  }).length;

  const deadlineAccuracyPercentage = totalTasksCount > 0 
    ? Math.round((onTimeTasksCount / totalTasksCount) * 100) 
    : 100;

  const dynamicProjects = [
    ...new Set(tasks.map(t => t.project?.projectName).filter(Boolean))
  ];

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'All Tasks' || activeTab === 'Supervision Overview') {
      return true; 
    }
    return task.project?.projectName === activeTab;
  });

  // PAGINATION SLICE ENGINE
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentPagedTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  return (
    <div className="w-full min-h-screen bg-[#F4F7F9] text-[#0F172A] font-sans antialiased flex flex-col">
      <main className="max-w-[1400px] w-full mx-auto px-6 py-8 flex flex-col flex-1 h-screen overflow-hidden space-y-6">
        
        {/* FIXED HEADER BLOCK */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-slate-200 pb-4 gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-200">
              <HardHat className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black uppercase tracking-tighter">Supervisor Portal</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
                Active Session: {currentSupervisor || "Synchronizing Profile..."}
              </p>
            </div>
          </div>


          {/* DESIGN SELECTION DROPDOWN */}
          <div className="relative inline-block w-full max-w-xs">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full appearance-none px-4 py-2 border bg-slate-50 border-slate-100 rounded-lg text-[11px] font-black uppercase tracking-wider text-slate-700 shadow-sm cursor-pointer hover:border-slate-200 outline-none focus:ring-2 focus:ring-slate-100 transition-all pr-10"
            >
              {['All Tasks', ...dynamicProjects].map((tab) => (
                <option 
                  key={tab} 
                  value={tab}
                  className="text-[11px] font-bold uppercase tracking-normal text-slate-700 bg-white"
                >
                  {tab}
                </option>
              ))}
            </select>

            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* MAIN SPLIT GRID CORE LAYOUT */}
        <div className="grid grid-cols-12 gap-8 flex-1 overflow-hidden min-h-0">
          
          {/* FIXED SIDEBAR PANEL WITH INTEGRATED PAGINATION */}
          <aside className="col-span-12 lg:col-span-3 space-y-4 shrink-0 h-fit">
            <div className="bg-emerald-500 rounded-2xl p-5 text-white text-center space-y-1 shadow-lg shadow-emerald-100">
              <CheckCircle2 size={20} className="mx-auto opacity-80" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Active Status</h3>
              <p className="text-[9px] font-medium opacity-90 uppercase">Permission: Submissions Enabled</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4">
              <div>
                <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3 text-center">Your Performance</h4>
                <div className="space-y-3">
                  <ResourceStat 
                    label="Tasks Completed" 
                    value={`${tasksCompletedPercentage}%`} 
                    color="bg-emerald-500" 
                  />
                  <ResourceStat 
                    label="Deadline Accuracy" 
                    value={`${deadlineAccuracyPercentage}%`} 
                    color="bg-blue-500" 
                  />
                </div>
              </div>


              {/* PAGINATION PANEL INTERFACE */}
              {totalPages > 1 && (
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-sm flex-1 max-w-[45%]"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-all disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shadow-sm flex-1 max-w-[45%]"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="text-center text-[9px] font-black text-slate-400 uppercase tracking-wider pt-1">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* DYNAMIC SCROLLABLE TASK FEED SECTION */}
          <div className="col-span-12 lg:col-span-9 flex flex-col h-full overflow-hidden min-h-0 space-y-3">
            <div className="flex justify-between items-end px-2 shrink-0">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Tasks Assigned to You</h2>
            </div>
            
            {/* INNER WRAPPER CONTAINS THE LIVE SCROLL NODE */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              <AnimatePresence mode='popLayout'>
                {isLoading ? (
                  <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 gap-3">
                    <Loader2 className="text-blue-600 animate-spin" size={24} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Manifest...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-16 bg-red-50 text-red-600 rounded-2xl border border-red-100 p-6">
                    <p className="text-[11px] font-black uppercase tracking-wider mb-1">Database Sync Failure</p>
                    <p className="text-xs text-red-500/80 font-medium">{error}</p>
                  </div>
                ) : currentPagedTasks.length > 0 ? (
                  currentPagedTasks.map((task) => {
                    const statusStr = task.taskStatus ? String(task.taskStatus).trim().toUpperCase() : "";
                    
                    const isTodo = statusStr === "TODO" || statusStr === "" || statusStr === "NONE";
                    const isInProgress = statusStr === "IN_PROGRESS" || statusStr === "INPROGRESS";
                    const isDone = statusStr === "SUBMITTED" || statusStr === "DONE" || statusStr === "COMPLETED";
                    
                    const cleanDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "N/A";


                    return (
                      <motion.div 
                        layout 
                        key={task.id || task._id} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-5 items-start md:items-center relative overflow-hidden"
                      >
                        <div className={`p-3 rounded-xl shrink-0 ${isDone ? 'bg-emerald-50 text-emerald-500' : isInProgress ? 'bg-blue-50 text-blue-500 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
                          {isDone ? <CheckCircle size={20} /> : <Clock size={20} />}
                        </div>
                        
                        <div className="flex-1 space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${task.taskPriority === 'CRITICAL' || task.taskPriority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>{task.taskPriority || 'MEDIUM'}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase italic">Due: {cleanDate}</span>
                          </div>
                          <h3 className={`text-base font-black tracking-tight ${isDone ? 'text-slate-400 line-through' : 'text-[#111827]'}`}>{task.taskTitle}</h3>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{task.taskDescription}</p>
                          
                          <div className="flex flex-wrap gap-3 pt-1.5 border-t border-slate-100">
                            <TaskTag icon={<MapPin size={10}/>} text={task.project?.projectName || "Unknown Sector"} />
                            <TaskTag icon={<Package size={10}/>} text={task.taskStatus || "TODO"} />
                            <TaskTag icon={<DollarSign size={10}/>} text={`$${Number(task.taskBudget || 0).toLocaleString()}`} />
                          </div>
                        </div>

                        {/* WORKFLOW ACTION BUTTONS RESTORED */}
                        <div className="shrink-0 w-full md:w-auto flex md:justify-end mt-2 md:mt-0">
                          {isTodo && (
                            <button 
                              type="button"
                              onClick={() => handleUpdateStatus(task.id || task._id, "IN_PROGRESS")}
                              className="w-full md:w-auto flex items-center justify-center gap-2 text-[9px] font-black uppercase bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-md shadow-slate-200 cursor-pointer"
                            >
                              <Clock size={12} /> Start Task
                            </button>
                          )}

                          {isInProgress && (
                            <button 
                              type="button"
                              onClick={() => handleUpdateStatus(task.id || task._id, "DONE")}
                              className="w-full md:w-auto flex items-center justify-center gap-2 text-[9px] font-black uppercase bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all active:scale-95 shadow-md shadow-blue-100 cursor-pointer"
                            >
                              <CheckCircle2 size={12} /> Submit Done
                            </button>
                          )}


                          {isDone && (
                            <span className="w-full md:w-auto text-center text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 inline-block">
                              {statusStr === "SUBMITTED" ? "Pending Verification" : "Task Verified"}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No assigned tasks found</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* FIXED RECENT USER ACTIVITY LOGS */}
        {logs.length > 0 && (
          <section className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm shrink-0">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 italic">Your Recent Activity</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-h-[120px] overflow-y-auto pr-1">
              {logs.map(log => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-1">
                  <p className="text-[10px] font-black text-[#111827] uppercase truncate">{log.task}</p>
                  <div className="flex justify-between items-center pt-1">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">{log.date}</p>
                    <span className={`text-[7px] font-black px-2 py-0.5 rounded ${log.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-600' : log.status === 'DONE' || log.status === 'Submitted' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {log.status === 'IN_PROGRESS' ? 'In Progress' : log.status}
                    </span>
                  </div>
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
  <div className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
    <span className="text-blue-500">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-tight">{text}</span>
  </div>
);

const ResourceStat = ({ label, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
      <span className="text-slate-400">{label}</span>
      <span className="text-[#111827]">{value}</span>
    </div>
    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: value }} />
    </div>
  </div>
);
