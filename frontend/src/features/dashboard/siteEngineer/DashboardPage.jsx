"use client";
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  AlertOctagon,
  FileText,
  LayoutDashboard,
  Calendar,
  ChevronRight,
  TrendingUp,
  HardHat,
} from "lucide-react";
import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function SiteEngineerDashboard() {
  const [stats, setStats] = useState({
    tasks: { TODO: 0, DONE: 0 },
    overdueTaskCount: 0,
    assignedIssueCount: 0,
    myReportCount: 0,SiteEngineerDashboard
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-12 font-sans text-slate-900">
      {/* HEADER SECTION */}
      <header className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white shadow-md shadow-blue-200">
              <HardHat size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Field Operations
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            ENGINEER <span className="text-blue-600">CONSOLE</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">
            Sector Access • Level 04 Control
          </p>
        </div>

        <div className="hidden md:flex bg-white px-6 py-3 rounded-2xl border border-slate-200 items-center gap-4 shadow-sm">
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase">
              System Status
            </p>
            <p className="text-xs font-black text-emerald-600 uppercase">
              Live Connection
            </p>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </header>

      {/* KPI GRID - Direct Backend Mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <EngineerStatCard
          label="Pending Tasks"
          value={stats.tasks.TODO}
          subtext="Assigned to you"
          icon={<Clock className="text-blue-600" />}
          color="blue"
        />
        <EngineerStatCard
          label="Critical Issues"
          value={stats.assignedIssueCount}
          subtext="Immediate Attention"
          icon={<AlertOctagon className="text-rose-600" />}
          color="rose"
        />
        <EngineerStatCard
          label="Reports Filed"
          value={stats.myReportCount}
          subtext="Current Cycle"
          icon={<FileText className="text-slate-600" />}
          color="slate"
        />
        <EngineerStatCard
          label="Completed"
          value={stats.tasks.DONE}
          subtext="Milestones Hit"
          icon={<CheckCircle2 className="text-emerald-600" />}
          color="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* TASK VELOCITY PANEL */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">
                  Weekly Output Velocity
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase">
                  Efficiency Analysis
                </p>
              </div>
              <div className="bg-slate-50 px-4 py-2 rounded-xl text-[10px] font-black text-slate-500 border border-slate-100 uppercase">
                Current:{" "}
                {Math.round(
                  (stats.tasks.DONE /
                    (stats.tasks.TODO + stats.tasks.DONE || 1)) *
                    100,
                )}
                %
              </div>
            </div>
            {/* Simple Bar Chart Style */}
            <div className="flex items-end gap-2 h-32 pt-4">
              {[30, 45, 25, 60, 40, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-100 rounded-lg relative group transition-all hover:bg-blue-100"
                >
                  <div
                    style={{ height: `${h}%` }}
                    className={`absolute bottom-0 w-full rounded-lg transition-all ${i === 6 ? "bg-blue-600" : "bg-slate-300"}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS TABLE */}
          <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-8 py-5 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Active Schedule Preview
              </span>
              <span className="text-[9px] font-black bg-white text-blue-600 px-3 py-1 rounded-full border border-slate-200">
                {stats.tasks.TODO} ACTIVE
              </span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">
                      Morning Site Walkthrough
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">
                      Target: 09:00 AM
                    </p>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* STATUS PANEL */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-300">
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-white/10 rounded-2xl text-rose-400">
                <AlertOctagon size={24} />
              </div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">
                Risk Assessment
              </h3>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">
                  Overdue Commitments
                </p>
                <p className="text-5xl font-black text-white">
                  {stats.overdueTaskCount}
                </p>
              </div>
              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                  System audit detects{" "}
                  <span className="text-rose-400">
                    {stats.assignedIssueCount} assigned issues
                  </span>{" "}
                  requiring resolution signatures.
                </p>
              </div>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 hover:text-white transition-all active:scale-95">
                Review All Issues
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HUMANIZED COMPONENTS
function EngineerStatCard({ label, value, subtext, icon, color }) {
  const colorMap = {
    blue: "border-blue-100 bg-white group-hover:border-blue-300",
    rose: "border-rose-100 bg-white group-hover:border-rose-300",
    slate: "border-slate-100 bg-white group-hover:border-slate-300",
    emerald: "border-emerald-100 bg-white group-hover:border-emerald-300",
  };

  return (
    <div
      className={`p-8 rounded-[1.5rem] border-2 shadow-sm transition-all group cursor-default ${colorMap[color]}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-slate-50 rounded-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {label}
          </p>
          <p className="text-3xl font-black text-slate-900">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`w-1 h-1 rounded-full ${value > 0 ? "bg-orange-500 animate-pulse" : "bg-slate-300"}`}
        ></div>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">
          {subtext}
        </p>
      </div>
    </div>
  );
}
