"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Imported to handle isolated root layout rendering
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
import Table from '../../../components/dashboard/Table';

export default function SiteIssueRegistry() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Safety check to ensure document object exists in Next.js Client Components
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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

  const issueColumns = [
    {
      header: "No.",
      width: "8.33%",
      align: "center",
      cell: (issue, absoluteRowNumber) => (
        <span 
          onClick={() => setSelectedIssue(issue)} 
          className="text-[10px] font-black text-slate-500 cursor-pointer block w-full h-full py-2"
        >
          {String(absoluteRowNumber).padStart(2, "0")}
        </span>
      )
    },
    {
      header: "Project",
      accessor: "title",
      width: "25%",
      align: "left",
      cell: (issue) => (
        <div 
          onClick={() => setSelectedIssue(issue)} 
          className="flex flex-col pr-4 cursor-pointer w-full h-full py-1"
        >
          <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight leading-tight hover:text-blue-600 group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h3>
        </div>
      )
    },
    {
      header: "Blocked Task",
      accessor: "blockedTask.taskTitle",
      width: "25%",
      align: "left",
      cell: (issue) => (
        <div 
          onClick={() => setSelectedIssue(issue)} 
          className="pr-4 cursor-pointer w-full h-full"
        >
          <div className="flex items-start py-2 rounded-xl w-fit">
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-black truncate max-w-[180px] uppercase text-slate-700">
                {issue.blockedTask?.taskTitle || 'Unassigned'}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest leading-none text-slate-400 mt-1">
                Impediment
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Reporter",
      accessor: "reporter.firstName",
      width: "25%",
      align: "left",
      cell: (issue) => (
        <div 
          onClick={() => setSelectedIssue(issue)} 
          className="space-y-2 cursor-pointer w-full h-full py-2"
        >
          <div className="flex items-center gap-2 text-slate-600">
            <User size={13} className="text-slate-300" />
            <span className="text-[11px] font-bold uppercase tracking-tight">
              {issue.reporter?.firstName} {issue.reporter?.lastName}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Status / Date",
      accessor: "status",
      width: "16.67%",
      align: "right",
      cell: (issue) => (
        <div 
          onClick={() => setSelectedIssue(issue)} 
          className="flex flex-col items-end gap-2 pr-2 cursor-pointer w-full h-full py-1"
        >
          <div

            className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm
            ${issue.status === "RESOLVED" ? "bg-emerald-500 text-white border-emerald-100" : "bg-rose-500 text-white border-rose-100"}`}
          >
            {issue.status}
          </div>
        </div>
      )
    }
  ];

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.project?.projectName?.toLowerCase().includes(searchTerm.toLowerCase()),
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
                Incident Registry
              </h1>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Blocked Task Monitoring & Forensics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative bg-white rounded-xl shadow-sm hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
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
        <Table
          columns={issueColumns}
          data={filteredIssues}
          noResultsMessage="No incidents match your search."
        />

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

      {/* --- DETAILED INSPECTION MODAL OVERLAY (PORTAL CONTAINER) --- */}
      {mounted && selectedIssue && createPortal(
        // z-[9999] combined with portal puts this card completely on top of sidebars/navbars
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] my-auto">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedIssue.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Incident Tracking Sheet
                  </span>
                  <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight mt-0.5 max-w-[320px] sm:max-w-[380px] truncate">
                    {selectedIssue.title}
                  </h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content Space */}
            <div className="p-6 space-y-5 overflow-y-auto text-xs font-sans">
              
              {/* Context Description Abstract */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Incident Context</span>
                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-slate-700 italic leading-relaxed break-words">
                  "{selectedIssue.description || 'No descriptive structural abstract documented for this incident item node.'}"
                </div>
              </div>

              {/* Data Blocks Key-Value Distribution */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-xl p-3 bg-white">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Briefcase size={10} /> Associated Project
                  </span>
                  <span className="text-slate-700 font-bold block mt-1 uppercase tracking-tight truncate">
                    {selectedIssue.project?.projectName || 'N/A'}
                  </span>
                </div>


                <div className="border border-slate-100 rounded-xl p-3 bg-white">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <MapPin size={10} /> Location Node
                  </span>
                  <span className="text-slate-700 font-bold block mt-1 uppercase tracking-tight truncate">
                    {selectedIssue.location || 'Site Location Unspecified'}
                  </span>
                </div>

                <div className="border border-slate-100 rounded-xl p-3 bg-white">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <User size={10} /> Logged By Reporter
                  </span>
                  <span className="text-slate-700 font-bold block mt-1 uppercase tracking-tight truncate">
                    {selectedIssue.reporter?.firstName} {selectedIssue.reporter?.lastName}
                  </span>
                </div>

                <div className="border border-slate-100 rounded-xl p-3 bg-white">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1">
                    <Calendar size={10} /> Timeline Index
                  </span>
                  <span className="text-slate-700 font-bold block mt-1 tracking-tight">
                    {selectedIssue.updatedAt ? new Date(selectedIssue.updatedAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    }) : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Blocked Task Impediment Element Section */}
              {selectedIssue.blockedTask && (
                <div className="bg-rose-50/60 border border-rose-100/60 rounded-xl p-4 flex items-start gap-3">
                  <ExternalLink size={14} className="text-rose-500 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black uppercase text-rose-500 tracking-widest block">
                      Blocked Operational Dependency Task
                    </span>
                    <span className="text-slate-800 font-black text-xs block mt-1 uppercase tracking-tight break-words">
                      {selectedIssue.blockedTask?.taskTitle}
                    </span>
                    <span className="text-[10px] text-rose-600 block mt-0.5 italic">
                      Critical path task workflow operation is completely locked by this registry abstract item.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Close Panel Controls */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/30 shrink-0">
              <button
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
              >
                Dismiss View
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
