'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Briefcase, CheckCircle2, AlertTriangle, Users, FileText, 
  TrendingUp, DollarSign, PieChart, BarChart3, RefreshCw, Calendar, Loader2
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';
import Table from '../../../components/dashboard/Table';

export default function AdminAnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await Axios({
        url: summeryApi.getDashboardSummary.url,
        method: summeryApi.getDashboardSummary.method
      });

      if (res.data.success) {
        setData(res.data.data);
      } else {
        throw new Error(res.data.message || "Failed to parse system metrics.");
      }
    } catch (err) {
      console.error("Dashboard Analytics Error:", err);
      setError(err.message || "An error occurred while loading dashboard summaries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Define Table Schemas matching your modular architecture
  const projectColumns = useMemo(() => [
    {
      header: "Project Identifier Context",
      accessor: "projectName",
      cell: (row) => (
        <div className="text-left">
          <span className="font-bold text-slate-900 block uppercase tracking-tight">
            {row.projectName}
          </span>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-0.5">
            <span>Node ID: {row.id}</span>
            <span className="flex items-center gap-1">
              <Calendar size={10} /> 
              Target End: {new Date(row.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      accessor: "status",
      align: "center",
      width: "100px",
      cell: (row) => (
        <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 text-[9px] font-bold rounded uppercase tracking-wide inline-block">
          {row.status}
        </span>
      )
    },
    {
      header: "Milestones Progress",
      accessor: "progress.progressPercent",
      align: "center",
      width: "180px",
      cell: (row) => (
        <div className="space-y-1 w-full max-w-[150px] mx-auto text-left">
          <div className="flex justify-between items-center text-[10px] font-bold font-mono">
            <span className="text-slate-500">
              {row.progress?.doneTasks}/{row.progress?.totalTasks} Tasks
            </span>
            <span className="text-slate-800">{row.progress?.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/20">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${row.progress?.progressPercent}%` }} 
            />
          </div>
        </div>
      )
    },
    {
      header: "Assigned Capital",
      accessor: "projectBudget",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-xs font-medium text-slate-800">
          {formatCurrency(row.projectBudget)}
        </span>
      )
    },
    {
      header: "Task Allocation",
      accessor: "totalTaskBudget",
      align: "right",
      cell: (row) => (
        <span className="font-mono text-xs font-medium text-slate-600">
          {formatCurrency(row.totalTaskBudget)}
        </span>
      )
    },
    {
      header: "Budget Consumed",
      accessor: "budgetUtilization",
      align: "right",
      width: "110px",
      cell: (row) => (
        <div className="inline-block text-right">
          <span className="font-bold font-mono text-slate-900 block">{row.budgetUtilization}%</span>
          <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5 ml-auto">
            <div 
              className={`h-full rounded-full ${row.budgetUtilization > 80 ? 'bg-amber-500' : 'bg-blue-500'}`} 
              style={{ width: `${Math.min(row.budgetUtilization, 100)}%` }} 
            />
          </div>
        </div>
      )
    }
  ], []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-3 text-slate-600" size={28} />
        <p className="text-[10px] font-bold uppercase tracking-wider">Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center">
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center max-w-md w-full">
          <AlertTriangle className="text-rose-500 mx-auto mb-3" size={20} />
          <p className="text-rose-900 font-bold uppercase text-[11px] tracking-wider mb-1">Metrics Loading Failure</p>
          <p className="text-xs text-rose-700 font-medium mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs"
          >
            Retry Fetch Operational Core
          </button>
        </div>
      </div>
    );
  }

  // Dynamic calculations from current schema response context
  const totalProjectsCount = Object.values(data?.projects || {}).reduce((a, b) => a + b, 0);
  const totalTasksCount = Object.values(data?.tasks || {}).reduce((a, b) => a + b, 0);
  const totalIssuesCount = Object.values(data?.issues || {}).reduce((a, b) => a + b, 0);
  const projectsData = data?.projectsWithStats || [];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans antialiased text-left">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Core Administrative Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-bold rounded uppercase tracking-wider">
                {data?.role?.replace('_', ' ')} Panel
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Operational Analytics & Insights</h1>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time compilation of budget metrics, team tracking vectors, structural milestones, and blocking anomalies.</p>
          </div>
          
          <button 
            onClick={fetchDashboardData}
            className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all shadow-2xs self-stretch sm:self-auto flex items-center justify-center gap-2 text-xs font-semibold"
          >
            <RefreshCw size={13} />
            <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-slate-500">Synchronize Logs</span>
          </button>
        </header>

        {/* Top-Tier Operational KPI Strips */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard label="Active Projects" value={totalProjectsCount} subtext="Planning Phase" icon={<Briefcase size={14} />} />
          <MetricCard label="Task Manifest" value={totalTasksCount} subtext={`${data?.tasks?.IN_PROGRESS || 0} In Progress`} icon={<CheckCircle2 size={14} />} />
          <MetricCard label="Overdue Items" value={data?.overdueTaskCount || 0} subtext="Requires Immediate Review" icon={<AlertTriangle size={14} />} danger={data?.overdueTaskCount > 0} />
          <MetricCard label="Active Personnel" value={data?.activeUserCount || 0} subtext="Assigned Node Workers" icon={<Users size={14} />} />
          <MetricCard label="Pending Issues" value={totalIssuesCount} subtext="Resolved / Closed Records" icon={<FileText size={14} />} />
        </section>

        {/* Financial Allocations and Structural Resource Matrices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Financial Ledger Breakdown Panel */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between lg:col-span-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <DollarSign size={14} className="text-slate-500" /> Capital Allocation Summary
                </h3>
              </div>
              
              <div className="space-y-4 py-2">
                <BudgetRow label="Total Allocated Capital" value={data?.companyTotals?.totalProjectBudget} primary />
                <BudgetRow label="Task Working Expenditure" value={data?.companyTotals?.totalTaskBudget} />
                <BudgetRow label="Available Variance Margin" value={data?.companyTotals?.budgetVariance} highlight />
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-3 mt-4 text-[11px] text-slate-500 font-medium flex items-center gap-2">
              <TrendingUp size={13} className="text-emerald-500 shrink-0" />
              <span>Financial indices verified across matching workflow data nodes.</span>
            </div>
          </div>

          {/* Workflow Distributions & System Node States */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <PieChart size={14} className="text-slate-500" /> Target Work Distributions
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Task Status Matrix Bars */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status Vector: Tasks</span>
                <ProgressBarLabel label="Completed Operations" value={data?.tasks?.DONE || 0} total={totalTasksCount} color="bg-emerald-500" />
                <ProgressBarLabel label="Active Workflows" value={data?.tasks?.IN_PROGRESS || 0} total={totalTasksCount} color="bg-blue-500" />
                <ProgressBarLabel label="System Blockers" value={data?.tasks?.BLOCKED || 0} total={totalTasksCount} color="bg-amber-500" />
              </div>

              {/* Issues Status Matrix Bars */}
              <div className="space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Status Vector: Field Issues</span>
                <ProgressBarLabel label="Resolved Tickets" value={data?.issues?.RESOLVED || 0} total={totalIssuesCount} color="bg-emerald-500" />
                <ProgressBarLabel label="Closed Archives" value={data?.issues?.CLOSED || 0} total={totalIssuesCount} color="bg-slate-600" />
              </div>
            </div>
          </div>

        </div>

        {/* Modular Paginated Projects Progression Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 size={14} className="text-slate-500" /> Context Project Progression Indicators
            </h3>
          </div>
          
          <Table 
            columns={projectColumns}
            data={projectsData}
            searchPlaceholder="Search operational project contexts..."
          />
        </div>

      </div>
    </div>
  );
}

// Helper presentation layout modules
function MetricCard({ label, value, subtext, icon, danger = false }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between text-left">
      <div className="space-y-0.5 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">{label}</p>
        <span className="text-xl font-bold tracking-tight text-slate-900 block">{value}</span>
        <span className={`text-[10px] font-semibold block truncate ${danger ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
          {subtext}
        </span>
      </div>
      <div className={`p-2 rounded-lg border shrink-0 ${danger ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
        {icon}
      </div>
    </div>
  );
}

function BudgetRow({ label, value, primary = false, highlight = false }) {
  return (
    <div className={`flex justify-between items-center py-2.5 ${!primary && !highlight ? 'border-b border-slate-50' : ''}`}>
      <span className={`text-xs ${primary ? 'font-bold text-slate-900' : 'font-medium text-slate-500'}`}>{label}:</span>
      <span className={`font-mono text-xs font-bold ${
        highlight ? 'text-emerald-600 bg-emerald-50/60 border border-emerald-100 px-2 py-0.5 rounded' : 'text-slate-800'
      }`}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function ProgressBarLabel({ label, value, total, color }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-[11px] font-semibold text-slate-600">
        <span className="truncate">{label} ({value})</span>
        <span className="font-mono text-slate-900 text-right">{percent}%</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/40">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function formatCurrency(amount) {
  if (amount === undefined || amount === null) return 'ETB 0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 1
  }).format(amount);
}