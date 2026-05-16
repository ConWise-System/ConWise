"use client";
import React, { useState, useEffect } from "react";
import {
  HardHat,
  Search,
  Briefcase,
  Calendar,
  X,
  User,
  CheckCircle2,
  History,
  Clock,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function SiteEngineerLedger() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLedgerData();
  }, []);

  const fetchLedgerData = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...summeryApi.getTasksByAssignee });
      if (response.data.success) setTasks(response.data.data);
    } catch (error) {
      console.error("API Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (taskId, newStatus) => {
    try {
      setSubmitting(true);
      const apiConfig = summeryApi.changeTaskStatus;

      // Handle both dynamic function mapping or static token string replacement templates
      const targetUrl = typeof apiConfig.url === 'function' 
        ? apiConfig.url(taskId) 
        : apiConfig.url.replace("{taskId}", taskId);

      const response = await Axios({
        url: targetUrl,
        method: apiConfig.method,
        data: { taskStatus: newStatus }
      });

      if (response.data.success) {
        // Sync collection rows instantly
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, taskStatus: newStatus } : t,
          ),
        );
        // Sync active modal display values immediately
        setSelectedTask(prev => prev ? { ...prev, taskStatus: newStatus } : null);
      }
    } catch (error) {
      console.error("Task status update failed:", error);
      alert("Failed to update status. Please verify server connectivity.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.project.projectName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // --- PREMIUM MODAL COMPONENT ---
  const TaskDetailModal = () => {
    if (!isModalOpen || !selectedTask) return null;

    const isTaskDone = selectedTask.taskStatus === "DONE";
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const statusOptions = [
      { value: "TODO", label: "To Do", bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" },
      { value: "IN_PROGRESS", label: "In Progress", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
      { value: "DONE", label: "Done", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
      { value: "BLOCKED", label: "Blocked", bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" }
    ];

    const currentOption = statusOptions.find(opt => opt.value === selectedTask.taskStatus) || statusOptions[0];

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-md">
        <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
          
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-xl text-white shadow-sm">
                <Briefcase size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Detailed Work Order #{selectedTask.id}
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 hover:bg-slate-200/60 rounded-full text-slate-400 hover:text-slate-900 transition-all active:scale-95"
            >
              <X size={18} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-8 space-y-6 max-h-[65vh] overflow-y-auto scroll-smooth">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                {selectedTask.taskTitle}
              </h2>
              <p className="text-[13px] text-slate-500 font-medium mt-3 leading-relaxed bg-slate-50/60 p-4 rounded-2xl border border-slate-100 italic">
                "{selectedTask.taskDescription}"
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Project Site</p>
                <p className="text-[12px] font-black text-slate-800 mt-1 uppercase truncate">{selectedTask.project.projectName}</p>
                <p className="text-[9px] font-black text-blue-600 mt-1.5 uppercase bg-blue-50 inline-block px-2 py-0.5 rounded-md">Stage: {selectedTask.project.status}</p>
              </div>
              <div className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Financial Budget</p>
                <p className="text-[13px] font-black text-slate-900 mt-1">${Number(selectedTask.taskBudget).toLocaleString()}</p>
                <p className="text-[9px] font-bold text-slate-400 mt-1.5 uppercase">ID: {selectedTask.projectId}</p>
              </div>
            </div>

            {/* Timeline Breakdown */}
            <div className="grid grid-cols-2 gap-y-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 tracking-wider"><Calendar size={12} /> Timeline</p>
                <p className="text-[11px] font-bold text-slate-600">Start: {formatDate(selectedTask.startDate)}</p>
                <p className="text-[11px] font-bold text-slate-600">Due: {formatDate(selectedTask.dueDate)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 tracking-wider"><User size={12} /> Assigned To</p>
                <p className="text-[11px] font-black text-slate-800 uppercase">{selectedTask.assignee?.firstName} {selectedTask.assignee?.lastName}</p>
                <p className="text-[9px] font-bold text-slate-400">UID: {selectedTask.assigneeUserId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 tracking-wider"><Clock size={12} /> Schedule</p>
                <p className="text-[11px] font-black text-rose-600 uppercase bg-rose-50 px-2 py-0.5 rounded-md inline-block">{selectedTask.daysRemaining} Days Left</p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5 tracking-wider"><History size={12} /> Last Sync</p>
                <p className="text-[11px] font-bold text-slate-500 uppercase">{formatDate(selectedTask.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Modal Footer (Actions) */}
          <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-4 relative">
            
            {isTaskDone ? (
              /* Static archived locked badge if status === DONE */
              <div className="flex items-center gap-2.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] shadow-sm">
                <CheckCircle2 size={15} />
                Task Completed & Locked
              </div>
            ) : (
              /* Interactive select menu for state configurations */
              <div className="flex items-center gap-3 flex-1 relative">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Status:
                </span>
                
                <div className="relative flex-1">
                  <button
                    disabled={submitting}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-3.5 text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm hover:border-slate-300 focus:ring-4 focus:ring-slate-900/[0.03] transition-all disabled:opacity-50 group text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${currentOption.dot}`} />
                      <span>{currentOption.label}</span>
                    </div>
                    {submitting ? (
                      <Loader2 size={14} className="animate-spin text-blue-600" />
                    ) : (
                      <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-slate-900' : ''}`} />
                    )}
                  </button>

                  {/* Backdrop Closer */}
                  {isDropdownOpen && (
                    <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                  )}

                  {/* Dropdown Options List */}
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute bottom-full mb-2 left-0 right-0 bg-white border border-slate-100 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.12)] z-20 overflow-hidden p-1.5"
                      >
                        {statusOptions.map((option) => {
                          const isSelected = option.value === selectedTask.taskStatus;
                          return (
                            <button
                              key={option.value}
                              onClick={() => {
                                handleChangeStatus(selectedTask.id, option.value);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                isSelected 
                                  ? 'bg-slate-900 text-white shadow-sm' 
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : option.dot}`} />
                                <span>{option.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 shrink-0"
            >
              Close
            </button>
          </div>
          
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 lg:px-8 lg:py-6 font-sans antialiased text-slate-900 bg-[#FDFDFD]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Page Top Header */}
        <header className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
              <HardHat size={20} />
            </div>
            <div>
              <h1 className="text-base font-black uppercase tracking-tight">
                Ledger <span className="text-blue-600">Pro</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Cross-Site Synchronization
              </p>
            </div>
          </div>
          
          {/* Task Search Input */}
          <div className="relative bg-white rounded-xl shadow-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
            <input
              type="text"
              placeholder="Filter tasks..."
              className="pl-9 pr-4 py-2.5 border border-slate-100 rounded-xl text-[12px] font-medium w-64 focus:ring-2 focus:ring-blue-100 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Data Loading State Toggle */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
             Loading tasks...
            </span>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden">
            <table className="w-full text-left table-fixed">
              <thead className="bg-slate-50/80 border-b border-slate-100">
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-4 py-3 w-[5%] text-center">#</th>
                  <th className="px-5 py-3 w-[20%]">Project Name</th>
                  <th className="px-5 py-3 w-[30%]">Task Description</th>
                  <th className="px-5 py-3 w-[12%] text-center">Priority</th>
                  <th className="px-5 py-3 w-[12%]">Status</th>
                  <th className="px-5 py-3 w-[11%] text-right">Budget</th>
                  <th className="px-5 py-3 w-[10%] text-center">Remaining Days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredTasks.map((task, index) => (
                  <tr
                    key={task.id}
                    onClick={() => {
                      setSelectedTask(task);
                      setIsModalOpen(true);
                    }}
                    className="group hover:bg-blue-50/30 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 text-center align-middle">
                      <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-500">
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-800 uppercase line-clamp-1 group-hover:text-blue-600">
                          {task.project.projectName}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                          ID-{task.projectId}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <p className="text-[13px] font-bold text-slate-700 leading-tight line-clamp-1">
                        {task.taskTitle}
                      </p>
                      <p className="text-[12px] text-slate-400 line-clamp-1 mt-0.5 italic">
                        {task.taskDescription}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-center align-top">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${task.taskPriority === "HIGH" ? "text-rose-500 bg-rose-50" : "text-slate-400 bg-slate-100"}`}
                      >
                        {task.taskPriority}
                      </span>
                    </td>
                    <td className="px-5 py-3 align-top">
                      <StatusPill status={task.taskStatus} />
                    </td>
                    <td className="px-5 py-3 text-right align-top font-black text-[11px] text-slate-700">
                      ${Number(task.taskBudget).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-center align-top">
                      <div className="flex flex-col items-center">
                        <span className="text-[11px] font-black text-slate-700">
                          {task.daysRemaining}
                        </span>
                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                          Days
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <TaskDetailModal />
    </div>
  );
}

const StatusPill = ({ status }) => {
  const styles = {
    DONE: "text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded",
    TODO: "text-slate-400 font-bold bg-slate-100 px-2 py-0.5 rounded",
    BLOCKED: "text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded",
    IN_PROGRESS: "text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded",
  };
  return (
    <span className={`text-[9px] uppercase tracking-widest ${styles[status] || styles.TODO}`}>
      {status?.replace("_", " ")}
    </span>
  );
};