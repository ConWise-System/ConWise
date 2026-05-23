"use client";
import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Lock,
  Loader2,
  MapPin,
  User,
  Calendar,
  Filter,
  Search,
  AlertCircle,
  CheckCircle2,
  Briefcase,
  History,
  Clock,
  X,
  ExternalLink,
} from "lucide-react";
import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function SiteIssueRegistry() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchIssueData();
  }, []);

  const fetchIssueData = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...summeryApi.getIssueByAssignee });
      if (response.data.success) setIssues(response.data.data);
    } catch (error) {
      console.error("API Sync Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.project.projectName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 min-h-screen bg-[#FDFDFD]">
        <Loader2 className="animate-spin mb-2" size={30} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          loading issues...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:px-8 lg:py-6 font-sans antialiased text-slate-900 bg-[#FDFDFD]">
      <div className="max-w-[1500px] mx-auto space-y-6">
        {/* --- HEADER --- */}
        <header className="flex justify-between items-center border-b border-slate-100 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight">
                Incident <span className="text-rose-600">Registry</span>
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Blocked Task Monitoring & Forensics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative bg-white rounded-xl shadow-sm hidden md:block">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"
                size={15}
              />
              <input
                type="text"
                placeholder="Filter incidents..."
                className="pl-9 pr-4 py-2.5 border border-slate-100 rounded-xl text-[12px] font-medium w-72 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
              <Lock size={12} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Engineer View
              </span>
            </div>
          </div>
        </header>

        {/* --- SUMMARY STATS --- */}
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-4">
            <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <AlertCircle size={14} className="text-rose-500" />
              <span className="text-[10px] font-black uppercase text-slate-600">
                {issues.filter((i) => i.status !== "RESOLVED").length} Active
              </span>
            </div>
            <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-[10px] font-black uppercase text-slate-600">
                {issues.filter((i) => i.status === "RESOLVED").length} Resolved
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total Records: {issues.length}
          </span>
        </div>

        {/* --- GRID TABLE --- */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-12 bg-slate-50/80 border-b border-slate-100 px-6 py-4 items-center">
            <div className="col-span-1 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
              #
            </div>
            <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Incident & Project
            </div>
            <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Blocked Task
            </div>
            <div className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Reporter & Location
            </div>
            <div className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
              Status / Date
            </div>
          </div>

          {/* Data Rows */}
          <div className="divide-y divide-slate-50">
            {filteredIssues.map((issue, index) => (
              <div
                key={issue.id}
                className="grid grid-cols-12 items-center px-6 py-6 hover:bg-blue-50/30 transition-all group cursor-default"
              >
                {/* 1. Counter */}
                <div className="col-span-1 text-center">
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-rose-500 transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* 2. Incident & Project */}
                <div className="col-span-3 pr-4">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter mb-0.5 truncate">
                      {issue.project?.projectName}
                    </span>
                    <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight leading-tight group-hover:text-rose-600 transition-colors">
                      {issue.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic italic leading-none">
                      "{issue.description}"
                    </p>
                  </div>
                </div>

                {/* 3. Blocked Task */}
                <div className="col-span-3 pr-4">
                  <div className="flex items-center gap-2 bg-rose-50 border border-rose-100/50 px-3 py-2 rounded-xl w-fit">
                    <ExternalLink size={12} className="text-rose-500" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-black text-rose-700 truncate max-w-[180px] uppercase">
                        {issue.blockedTask?.taskTitle}
                      </span>
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest leading-none">
                        Impediment
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Reporter & Location */}
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User size={13} className="text-slate-300" />
                    <span className="text-[11px] font-bold uppercase tracking-tight">
                      {issue.reporter?.firstName} {issue.reporter?.lastName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin size={13} className="text-slate-300" />
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate max-w-[200px]">
                      {issue.location}
                    </span>
                  </div>
                </div>

                {/* 5. Status / Date */}
                <div className="col-span-2 flex flex-col items-end gap-2 pr-2">
                  <div
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm
                    ${issue.status === "RESOLVED" ? "bg-emerald-500 text-white border-emerald-100" : "bg-rose-500 text-rose-600 border-rose-100"}`}
                  >
                    {issue.status}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter italic">
                      {new Date(issue.updatedAt).toLocaleDateString()}
                    </span>
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${issue.status === "RESOLVED" ? "bg-emerald-500 shadow-emerald-100 shadow-lg" : "bg-rose-500 shadow-rose-100 shadow-lg"} `}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <footer className="flex justify-between items-center px-4 pt-4">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
            Authorized Site Forensics • System Ref: 2026.05.11
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <History size={12} />
            <span className="text-[9px] font-black uppercase">
              Live Update Active
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
