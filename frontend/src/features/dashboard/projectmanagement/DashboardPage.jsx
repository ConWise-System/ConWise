'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, CheckCircle2, Clock, AlertCircle, 
  TrendingUp, BarChart3, Landmark, ShieldAlert,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

// Animation presets for clean premium pacing
const containerVars = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 30 } }
};

export default function DashboardHome() {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...summeryApi.getDashboardSummary });
      if (response.data.success) {
        setSummaryData(response.data.data);
      }
    } catch (error) {
      console.error("Dashboard Analytics Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 font-sans">
        <Loader2 className="animate-spin text-blue-600 mb-3" size={24} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Assembling Financial & Task Intelligence...</span>
      </div>
    );
  }

  if (!summaryData) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-slate-400 font-sans border-2 border-dashed border-slate-100 rounded-[2rem]">
        <AlertCircle className="text-slate-300 mb-2" size={24} />
        <span className="text-[11px] font-bold">Failed to load system telemetry. Please refresh.</span>
      </div>
    );
  }

  // Safely extract dataset keys mapping default fallbacks if fields are absent
  const totalProjects = summaryData.projectsWithStats?.length || 0;
  const inProgressTasks = summaryData.tasks?.IN_PROGRESS || 0;
  const doneTasks = summaryData.tasks?.DONE || 0;
  const totalTasks = inProgressTasks + doneTasks;
  
  // Calculate aggregated velocity index across all projects
  const averageVelocity = totalProjects > 0
    ? Math.round(summaryData.projectsWithStats.reduce((acc, curr) => acc + (curr.progress?.progressPercent || 0), 0) / totalProjects)
    : 0;

  // Prepare chart format from projectsWithStats data payload
  const projectChartData = summaryData.projectsWithStats?.map(p => ({
    name: p.projectName.length > 20 ? `${p.projectName.substring(0, 18)}...` : p.projectName,
    allocated: p.projectBudget,
    utilized: p.totalTaskBudget,
  })) || [];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div 
      variants={containerVars} 
      initial="hidden" 
      animate="visible"
      className="space-y-8 font-sans antialiased text-slate-900"
    >
      {/* Structural Header */}
      <header className="flex justify-between items-end border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Portfolio Overview</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
            Role: {summaryData.role?.replace("_", " ")} — Cross-Project Sync Engine
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Live Ledger Feed</span>
        </div>
      </header>

      {/* 4-Column Core Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label="Active Projects" 
          value={totalProjects} 
          subtext="Under Management" 
          icon={<Briefcase size={16} />} 
          color="blue" 
        />
        <StatCard 
          label="Portfolio Allocation" 
          value={`$${Number(summaryData.managerTotals?.totalProjectBudget || 0).toLocaleString()}`} 
          subtext="Capital Cap Structure" 
          icon={<Landmark size={16} />} 
          color="indigo" 
        />
        <StatCard 
          label="WBS Tasks Allocated" 
          value={totalTasks} 
          subtext={`${doneTasks} Finalized Tasks`} 
          icon={<CheckCircle2 size={16} />} 
          color="emerald" 
        />
        <StatCard 
          label="Open Issues Raised" 
          value={summaryData.openIssueCount} 
          subtext={`${summaryData.recentReportCount} Incident Filings Pending`} 
          icon={<ShieldAlert size={16} />} 
          color={summaryData.openIssueCount > 0 ? "rose" : "slate"} 
        />
      </div>

      {/* Charts & Analytical Velocity Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Capital vs Task Budget Utilization Bar Chart */}
        <motion.div 
          variants={itemVars}
          className="lg:col-span-2 bg-white p-6 rounded-[2.5rem] border border-slate-200/80 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">Financial Allocation vs Utilization</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Project Budget Compared to Task Allotments</p>
            </div>
            <BarChart3 className="text-slate-300" size={18} />
          </div>
          
          {projectChartData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              No Data Matrices Found
            </div>
          ) : (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 8, fontWeight: 700, fill: '#cbd5e1' }}
                    tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} 
                    contentStyle={{ background: '#0f172a', borderRadius: '12px', border: 'none', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="allocated" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={14} name="Project Cap" />
                  <Bar dataKey="utilized" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={14} name="Task Assigned" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Global Progress Radial Completion Loop */}
        <motion.div 
          variants={itemVars}
          className="bg-[#0f111a] p-6 rounded-[2.5rem] text-white shadow-xl flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-black tracking-tight uppercase text-slate-200">Portfolio Completion</h3>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mt-1">Aggregated Progress Velocity</p>
          </div>

          <div className="relative flex justify-center my-6">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r="52" stroke="#1e293b" strokeWidth="9" fill="transparent" />
              <motion.circle 
                cx="64" cy="64" r="52" stroke="#2563eb" strokeWidth="9" fill="transparent" strokeLinecap="round"
                strokeDasharray="326.7" initial={{ strokeDashoffset: 326.7 }}
                animate={{ strokeDashoffset: 326.7 - (326.7 * (averageVelocity / 100)) }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-white tracking-tighter">{averageVelocity}%</span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Resolved</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-400 border-t border-slate-800/80 pt-3">
            <span>Variance Surplus</span>
            <span className="text-emerald-400 font-bold">${Number(summaryData.managerTotals?.budgetVariance || 0).toLocaleString()}</span>
          </div>
        </motion.div>
      </div>

      {/* Individual Project Trackers Stack */}
      <motion.div variants={itemVars} className="space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-900 tracking-tight">Active Infrastructure Rollouts</h3>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Live Management Nodes</p>
        </div>
        
        <div className="space-y-4">
          {summaryData.projectsWithStats?.map((project) => (
            <ProjectRow 
              key={project.id} 
              project={project} 
              formatDate={formatDate}
            />
          ))}

          {totalProjects === 0 && (
            <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">No Projects Configured in Profile</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Minimalist High-End Stat Card Layout Module
function StatCard({ label, value, subtext, icon, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50/80 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50/80 border-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50/80 border-indigo-100",
    rose: "text-rose-600 bg-rose-50/80 border-rose-100",
    slate: "text-slate-500 bg-slate-50 border-slate-100"
  };

  return (
    <motion.div 
      variants={itemVars}
      className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-200"
    >
      <div className={`p-3 rounded-xl border ${colorMap[color] || colorMap.slate}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{label}</p>
        <p className="text-xl font-black text-slate-900 tracking-tight mt-0.5 truncate">{value}</p>
        <p className="text-[9px] font-bold text-slate-400 truncate mt-0.5">{subtext}</p>
      </div>
    </motion.div>
  );
}

// Clean Enterprise Project Progress Track Component Row
function ProjectRow({ project, formatDate }) {
  const progressVal = project.progress?.progressPercent || 0;
  
  return (
    <div className="bg-white border border-slate-200/80 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-all duration-200">
      <div className="space-y-1.5 max-w-md flex-1">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight leading-none">
            {project.projectName}
          </h4>
          <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${
            project.status === "DONE" ? "text-emerald-600 bg-emerald-50" : "text-blue-600 bg-blue-50"
          }`}>
            {project.status}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          Target Date: <span className="text-slate-600">{formatDate(project.endDate)}</span>
        </p>
      </div>

      {/* Budget Allotment Profiles */}
      <div className="grid grid-cols-2 gap-6 sm:gap-12 shrink-0">
        <div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Project Capital</span>
          <span className="text-xs font-black text-slate-800">${Number(project.projectBudget).toLocaleString()}</span>
        </div>
        <div>
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Task Allocation</span>
          <span className="text-xs font-black text-slate-500">${Number(project.totalTaskBudget).toLocaleString()}</span>
        </div>
      </div>

      {/* Horizontal Segmented Progress Profile */}
      <div className="w-full md:w-48 space-y-1.5 shrink-0">
        <div className="flex justify-between items-baseline text-[9px] font-black uppercase text-slate-400 tracking-wider">
          <span>Progress</span>
          <span className="text-slate-800">{progressVal}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressVal}%` }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="h-full bg-blue-600 rounded-full"
          />
        </div>
        <p className="text-[8px] font-bold text-slate-400 text-right uppercase">
          {project.progress?.doneTasks || 0}/{project.progress?.totalTasks || 0} Tasks Done
        </p>
      </div>
    </div>
  );
}