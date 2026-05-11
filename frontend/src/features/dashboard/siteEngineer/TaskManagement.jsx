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
} from "lucide-react";

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

  // --- INTEGRATED SUBMIT LOGIC ---
  const handleSubmitTask = async (taskId) => {
    try {
      setSubmitting(true);
      const apiConfig = summeryApi.submitTask;

      // Call the patch /tasks/:id/submit endpoint
      const response = await Axios({
        url: apiConfig.url(taskId),
        method: apiConfig.method,
      });

      if (response.data.success) {
        // Update local state so the table reflects "DONE" immediately
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === taskId ? { ...t, taskStatus: "DONE" } : t,
          ),
        );
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Task submission failed:", error);
      alert("Failed to submit task. Please try again.");
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

  // --- MODAL COMPONENT ---
  const TaskDetailModal = () => {
    if (!isModalOpen || !selectedTask) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
        <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-blue-600 rounded-lg text-white">
                <Briefcase size={14} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Detailed Work Order #{selectedTask.id}
              </span>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">
                {selectedTask.taskTitle}
              </h2>
              <p className="text-[11px] text-slate-500 mt-2 leading-relaxed italic border-l-2 border-slate-100 pl-3">
                {selectedTask.taskDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50/30">
                <p className="text-[9px] font-bold text-slate-400 uppercase">
                  Project Site
                </p>
                <p className="text-[11px] font-black text-slate-800 mt-0.5 uppercase">
                  {selectedTask.project.projectName}
                </p>
                <p className="text-[9px] font-bold text-blue-600 mt-1 uppercase">
                  Stage: {selectedTask.project.status}
                </p>
              </div>
              <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30">
                <p className="text-[9px] font-bold text-emerald-600 uppercase">
                  Financial Budget
                </p>
                <p className="text-[11px] font-black text-slate-800 mt-0.5">
                  ${Number(selectedTask.taskBudget).toLocaleString()}
                </p>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                  ID: {selectedTask.projectId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 pt-2 border-t border-slate-50">
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                  <Calendar size={12} /> Timeline
                </p>
                <p className="text-[10px] font-bold text-slate-700">
                  Start: {formatDate(selectedTask.startDate)}
                </p>
                <p className="text-[10px] font-bold text-slate-700">
                  Due: {formatDate(selectedTask.dueDate)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                  <User size={12} /> Assigned To
                </p>
                <p className="text-[10px] font-bold text-slate-700 uppercase">
                  {selectedTask.assignee?.firstName}{" "}
                  {selectedTask.assignee?.lastName}
                </p>
                <p className="text-[9px] text-slate-400">
                  User ID: {selectedTask.assigneeUserId}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                  <Clock size={12} /> Schedule
                </p>
                <p className="text-[10px] font-bold text-rose-600 uppercase">
                  {selectedTask.daysRemaining} Days Left
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                  <History size={12} /> Last Sync
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  {formatDate(selectedTask.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
            {selectedTask.taskStatus !== "DONE" && (
              <button
                disabled={submitting}
                onClick={() => handleSubmitTask(selectedTask.id)}
                className="flex-1 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                {submitting ? "Processing..." : "Mark as Completed"}
              </button>
            )}
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 text-[10px] font-black uppercase rounded-lg hover:bg-slate-50 transition-all"
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
          <div className="relative bg-white rounded-xl shadow-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
              size={15}
            />
            <input
              type="text"
              placeholder="Filter tasks..."
              className="pl-9 pr-4 py-2.5 border border-slate-100 rounded-xl text-[12px] font-medium w-64 focus:ring-2 focus:ring-blue-100 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Syncing Ledger...
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
                  <th className="px-5 py-3 w-[10%] text-center">
                    Remaining Days
                  </th>
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
    DONE: "text-emerald-600 font-bold",
    TODO: "text-slate-400 font-bold",
    BLOCKED: "text-rose-500 font-bold",
    IN_PROGRESS: "text-blue-600 font-bold",
  };
  return (
    <span
      className={`text-[9px] uppercase tracking-widest ${styles[status] || styles.TODO}`}
    >
      {status?.replace("_", " ")}
    </span>
  );
};
