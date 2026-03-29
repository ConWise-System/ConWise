"use client";
import React, { useState, useMemo } from 'react';
import { 
  Plus, Download, Filter, LayoutGrid, ChevronLeft, 
  ChevronRight, Sparkles, AlertCircle, Clock, Trash2 
} from 'lucide-react';

const INITIAL_TASKS = [
  { id: 1, name: 'Quarterly Audit Compliance', sub: 'High Priority • Financial', project: 'Internal Operations', assignee: 'Alex Morgan', deadline: 'Tomorrow', deadlineIcon: true, status: 'In Progress', priority: 'High' },
  { id: 2, name: 'Cloud Infrastructure Migration', sub: 'Medium Priority • Tech', project: 'Project Zenith', assignee: 'Jordan Doe', deadline: 'Oct 24, 2023', status: 'Pending', priority: 'Medium' },
  { id: 3, name: 'Executive Board Presentation', sub: 'Low Priority • Strategy', project: 'Annual Review', assignee: 'Sarah Chen', deadline: 'Completed', status: 'Completed', priority: 'Low' },
  { id: 4, name: 'Security Patch Deployment', sub: 'High Priority • DevOps', project: 'Infrastructure', assignee: 'Riley Brown', deadline: 'In 2 hours', deadlineAlert: true, status: 'In Progress', priority: 'High' },
];

export default function TaskManagement() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');

  // Logic: Derived state for filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const statusMatch = statusFilter === 'All Statuses' || task.status === statusFilter;
      const priorityMatch = priorityFilter === 'All Priorities' || task.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [tasks, statusFilter, priorityFilter]);

  // Logic: Dynamic Metrics
  const metrics = useMemo(() => ({
    total: filteredTasks.length,
    inProgress: filteredTasks.filter(t => t.status === 'In Progress').length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    nearDeadline: filteredTasks.filter(t => t.deadlineAlert || t.deadlineIcon).length
  }), [filteredTasks, tasks]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 space-y-8 font-sans">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Task Management</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and delegate high-priority operational objectives.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
            <Download size={16} /> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] rounded-lg text-sm font-bold text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            <Plus size={16} /> Create Task
          </button>
        </div>
      </header>

      {/* --- LIVE METRICS GRID --- */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="TOTAL ACTIVE" value={metrics.total} badge="LIVE" badgeColor="bg-emerald-100 text-emerald-600" />
        <MetricCard label="IN PROGRESS" value={metrics.inProgress} sub={`${((metrics.inProgress / metrics.total || 0) * 100).toFixed(0)}% of filtered`} />
        <MetricCard label="COMPLETED (MTD)" value={metrics.completed} badge="Global" badgeColor="bg-indigo-100 text-indigo-600" />
        <MetricCard label="NEAR DEADLINE" value={metrics.nearDeadline} isAlert={metrics.nearDeadline > 0} />
      </section>

      {/* --- FILTERS --- */}
      <section className="bg-white border border-slate-200 rounded-xl p-3 flex flex-wrap items-center gap-6 shadow-sm">
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 tracking-widest uppercase">
          Status: 
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 px-2 py-1 rounded border-none text-slate-900 font-bold outline-none cursor-pointer"
          >
            <option>All Statuses</option>
            <option>In Progress</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 tracking-widest uppercase border-l border-slate-200 pl-6">
          Priority: 
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 px-2 py-1 rounded border-none text-slate-900 font-bold outline-none cursor-pointer"
          >
            <option>All Priorities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </section>

      {/* --- TASK TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-slate-100 bg-slate-50/30">
            <tr>
              {['Task Name', 'Project', 'Deadline', 'Status', 'Actions'].map((head) => (
                <th key={head} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredTasks.map((task) => (
              <tr key={task.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <p className="font-bold text-slate-900">{task.name}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{task.sub}</p>
                </td>
                <td className="px-6 py-5">
                   <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[11px] font-bold rounded-full border border-indigo-100">{task.project}</span>
                </td>
                <td className="px-6 py-5">
                  <div className={`flex items-center gap-1.5 text-sm font-bold ${task.deadlineAlert ? 'text-rose-600' : 'text-slate-400'}`}>
                    {task.deadline} {task.deadlineAlert && <AlertCircle size={14} />}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusTag status={task.status} />
                </td>
                <td className="px-6 py-5 text-right">
                  <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS (Place these at the bottom of the file) ---

function MetricCard({ label, value, badge, badgeColor, isAlert, sub }) {
  return (
    <div className={`bg-white p-6 rounded-2xl border-l-4 shadow-sm transition-all ${isAlert ? 'border-rose-500' : 'border-slate-200'}`}>
      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{label}</span>
      <div className="mt-4 flex items-baseline gap-3">
        <span className={`text-4xl font-black ${isAlert ? 'text-rose-600' : 'text-slate-900'}`}>{value}</span>
        {badge && <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${badgeColor}`}>{badge}</span>}
        {sub && <span className="text-xs font-bold text-slate-400 italic">{sub}</span>}
      </div>
    </div>
  );
}

function StatusTag({ status }) {
  const themes = {
    'In Progress': 'bg-amber-50 text-amber-600 border-amber-100',
    'Pending': 'bg-slate-100 text-slate-500 border-slate-200',
    'Completed': 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border flex items-center gap-1.5 w-fit ${themes[status]}`}>
      <div className={`w-1 h-1 rounded-full ${status === 'In Progress' ? 'bg-amber-500' : status === 'Completed' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
      {status}
    </span>
  );
}