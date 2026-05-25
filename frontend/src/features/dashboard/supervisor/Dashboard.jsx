"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart3,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Loader2,
  RefreshCw,
  TrendingUp,
  UserCheck
} from "lucide-react";
import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function DashboardAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async (isRefresh = false) => {
    try {
      if (isRefresh) setSyncing(true);
      else setLoading(true);

      const response = await Axios({ ...summeryApi.getDashboardSummary });
      if (response.data.success) {
        setMetrics(response.data.data);
      }
    } catch (error) {
      console.error("Analytics Engine Sync Error:", error);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 min-h-[60vh]">
        <Loader2 className="animate-spin text-slate-800 mb-3" size={28} />
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          Loading Metrics...
        </span>
      </div>
    );
  }

  // Derived metrics calculation safely parsing data attributes
  const completedTasks = metrics?.tasks?.DONE || 0;
  const activeIssues = metrics?.myOpenIssueCount || 0;
  const reportsFiled = metrics?.myReportCount || 0;
  const overdueTasks = metrics?.overdueTaskCount || 0;
  
  // Total work scope counter
  const totalScopeItems = completedTasks + activeIssues + overdueTasks;
  const resolutionRate = totalScopeItems > 0 ? Math.round((completedTasks / totalScopeItems) * 100) : 0;

  return (
    <div className="space-y-6 p-1 md:p-2 font-sans antialiased text-slate-900">
      
      {/* --- DASHBOARD SUB-HEADER --- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-100 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-xl shadow-md shadow-slate-100">
            <BarChart3 size={20} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase tracking-tight">Performance Analytics</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 bg-slate-100 text-[#111827] text-[9px] font-black uppercase tracking-wider rounded-md flex items-center gap-1">
                <UserCheck size={10} /> {metrics?.role?.replace("_", " ")}
              </span>
              
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchAnalyticsData(true)}
          disabled={syncing}
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Refreshing..." : "Refresh Core"}
        </button>
      </div>


      {/* --- ANALYTICS STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Block: Completed Tasks */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Completed Tasks
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-800">{completedTasks}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Closed Node
            </span>
          </div>
        </div>

        {/* Metric Block: Active Incidents */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Open Issues
            </span>
            <div className={`p-2 rounded-xl ${activeIssues > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-800">{activeIssues}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${activeIssues > 0 ? 'text-rose-600 bg-rose-50 animate-pulse' : 'text-slate-400 bg-slate-50'}`}>
              {activeIssues > 0 ? 'Attention Required' : 'System Clear'}
            </span>
          </div>
        </div>

        {/* Metric Block: Filed Field Reports */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Your Reports
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-800">{reportsFiled}</span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">
              Archived Manifest
            </span>
          </div>
        </div>


        {/* Metric Block: Overdue Milestones */}
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Overdue Tasks
            </span>
            <div className={`p-2 rounded-xl ${overdueTasks > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-800">{overdueTasks}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${overdueTasks > 0 ? 'text-amber-600 bg-amber-50' : 'text-slate-400 bg-slate-50'}`}>
              {overdueTasks > 0 ? 'Breached Deadline' : 'On Schedule'}
            </span>
          </div>
        </div>

      </div>

      {/* --- VISUAL CHART SUMMARY & EFFICIENCY REPORT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Dynamic Throughput Rate Progress Card */}
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
              Operational Efficiency
            </span>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Task Resolution Ratio Index
            </h3>
          </div>

          <div className="my-6 space-y-3">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-1.5 text-slate-500">
                <TrendingUp size={14} className="text-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-tight">Throughput Metric</span>
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">{resolutionRate}%</span>
            </div>
            
            {/* Custom Tailwind Micro Chart Progress Bar Line */}
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
              <div
                className="bg-slate-900 h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${Math.max(resolutionRate, 4)}%` }}
              />
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
            Data reflects total completed items against total recognized blockages and active operational dependencies tracked on your engine layout profile.
          </p>
        </div>

        {/* Data Meta Integrity Manifest Card */}
        <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 text-slate-800 opacity-20 pointer-events-none">
            <BarChart3 size={120} />
          </div>

          <div className="space-y-1 z-10">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
              Registry Abstract
            </span>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">
              System Audit Node
            </h3>
          </div>


          <div className="my-5 space-y-2 text-[11px] text-slate-300 font-medium z-10">
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Total Action Scope:</span>
              <span className="font-bold text-white">{totalScopeItems} Units</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-1.5">
              <span className="text-slate-400">Pipeline Pipeline Status:</span>
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">Active Sync</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-400">Role View Clearance:</span>
              <span className="font-bold text-white text-[9px] uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded">
                Verified
              </span>
            </div>
          </div>

          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em] z-10">
            ConWise Core Engine • Ref v1.0
          </div>
        </div>

      </div>

    </div>
  );
}
