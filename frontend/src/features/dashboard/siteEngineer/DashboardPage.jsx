"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  AlertOctagon,
  FileText,
  ChevronRight,
  HardHat,
  Activity,
  ArrowUpRight
} from "lucide-react";
import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function SiteEngineerDashboard() {
  const [stats, setStats] = useState({
    tasks: { IN_PROGRESS: 0, DONE: 0 },
    overdueTaskCount: 0,
    assignedIssueCount: 0,
    myReportCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await Axios({ ...summeryApi.getDashboardSummary });
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalTasks = stats.tasks.IN_PROGRESS + stats.tasks.DONE;
  const completionRate = totalTasks > 0 ? Math.round((stats.tasks.DONE / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* HEADER BAR */}
      <header className="max-w-[1400px] mx-auto mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1 bg-slate-900 text-white rounded">
              <HardHat size={12} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Field Execution Overview
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
            Site Operations Management Console
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Node Server Live Connection
          </span>
        </div>
      </header>

      {/* CORE PERFORMANCE ANALYTICS GRID */}
      <main className="max-w-[1400px] mx-auto space-y-6">
        
        {/* KPI CARD REGION */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPIStatCard
            label="In Progress Operations"
            value={stats.tasks.IN_PROGRESS}
            indicatorText="Active Assignments"
            icon={<Activity size={14} className="text-amber-600" />}
            accent="amber"
          />
          <KPIStatCard
            label="Completed Tasks"
            value={stats.tasks.DONE}
            indicatorText="System Schema Saved"
            icon={<CheckCircle2 size={14} className="text-emerald-600" />}
            accent="emerald"
          />
          <KPIStatCard
            label="Pending Field Issues"
            value={stats.assignedIssueCount}
            indicatorText="Requires Signature"
            icon={<AlertOctagon size={14} className="text-slate-400" />}
            accent="slate"
          />
          <KPIStatCard
            label="Submitted Daily Logs"
            value={stats.myReportCount}
            indicatorText="Current Cycle Logs"
            icon={<FileText size={14} className="text-blue-600" />}
            accent="blue"
          />
        </div>

        {/* WORKFLOW SPLIT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* EFFICIENCY ENGINE GRAPHICAL CARD */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Metric Metrics</h2>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mt-0.5">Task Fulfillment Volume</h3>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-xs font-mono font-bold text-slate-700">
                Fulfillment Vector: {completionRate}%
              </div>
            </div>

            {/* Custom Visual Data Progress Tracker */}
            <div className="space-y-4 my-auto py-4">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div 
                  style={{ width: `${completionRate}%` }} 
                  className="bg-slate-900 rounded-full h-full transition-all duration-500"
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <span>Total Workload Nodes: {totalTasks} items</span>
                <span>Remaining: {stats.tasks.IN_PROGRESS} tasks pending</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Operational Analytics Status</span>
              <span className="text-slate-900 inline-flex items-center gap-1 cursor-pointer hover:underline">
                View Task Logs <ArrowUpRight size={12} />
              </span>
            </div>
          </div>

          {/* CRITICAL RISK MANAGEMENT SUMMARY CARD */}
          <div className="bg-slate-900 border border-slate-950 rounded-2xl p-6 text-white shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/10 rounded-lg text-rose-400">
                  <Clock size={14} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Risk Mitigation Spectrum</span>
              </div>
              {stats.overdueTaskCount > 0 && (
                <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[9px] font-bold uppercase px-2 py-0.5 rounded tracking-wide animate-pulse">
                  Attention Required
                </span>
              )}
            </div>

            <div className="my-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Overdue Engineering Commitments</span>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tighter text-white">{stats.overdueTaskCount}</span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Critical Items</span>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                System telemetry parsing registers <span className="text-white font-bold">{stats.overdueTaskCount} expired schedule timeline</span> configuration. Immediate intervention required to restore sprint velocity.
              </p>
              <button className="w-full bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm">
                Initiate Timeline Review
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Clean Sub-Component Core Parameter Structure
function KPIStatCard({ label, value, indicatorText, icon, accent }) {
  const accentMap = {
    amber: "border-amber-100 bg-white hover:border-amber-300",
    emerald: "border-emerald-100 bg-white hover:border-emerald-300",
    slate: "border-slate-200/80 bg-white hover:border-slate-400",
    blue: "border-blue-100 bg-white hover:border-blue-300",
  };

  const bulletMap = {
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    slate: "bg-slate-300",
    blue: "bg-blue-500"
  };

  return (
    <div className={`p-5 rounded-xl border border-slate-200 shadow-2xs transition-all flex flex-col justify-between h-32 cursor-default ${accentMap[accent]}`}>
      <div className="flex justify-between items-start">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <div className="p-1.5 bg-slate-50 border border-slate-200/60 rounded-lg">
          {icon}
        </div>
      </div>
      
      <div className="flex items-end justify-between mt-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900 leading-none">
          {value}
        </span>
        <div className="flex items-center gap-1.5 pb-0.5">
          <div className={`w-1.5 h-1.5 rounded-full ${bulletMap[accent]} ${value > 0 && accent === "amber" ? "animate-pulse" : ""}`} />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            {indicatorText}
          </span>
        </div>
      </div>
    </div>
  );
}