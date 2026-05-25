"use client";
import React, { useState, useEffect } from 'react';
import {
  Clock, FileText, ShieldCheck, AlertTriangle,
  BarChart3, User, MapPin, CloudRain, Loader2,
  Calendar, X, Trash2, RefreshCw, ExternalLink,HardHat, CloudSun, AlertCircle, FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'
import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function SiteEngineerReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const [activeInspectionReport, setActiveInspectionReport] = useState(null);
  const [isProcessingId, setIsProcessingId] = useState(null);

  useEffect(() => {
    setHasMounted(true);
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...summeryApi.reports });
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInspectReport = (report) => {
    setActiveInspectionReport(report);
  };

  

  const handleDeleteReport = async (report, e) => {
    e.stopPropagation(); // Avoid triggering card selection click
    const currentId = report.id || report._id;
    if (!window.confirm("Are you sure you want to delete this report from server records?")) return;
    
    try {
      setReports(prev => prev.filter(r => (r.id || r._id) !== currentId));
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  const formatDateString = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!hasMounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 min-h-screen bg-[#FDFDFD]">
        <Loader2 className="animate-spin mb-2" size={30} />
        <span className="text-[10px] font-black uppercase tracking-widest">Loading Reports...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans antialiased">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
            Site Reports
          </h1>
          <p className="text-slate-500 text-sm font-medium">Daily status and supervisor analytics across all active projects.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-xl text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
          Read-Only Archive Access
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* --- METRICS --- */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          <MetricCard label="Total Submissions" value={reports.length.toString().padStart(2, '0')} sub="Documented Logs" />
          <MetricCard label="Weather Impact" value="Rainy" sub="Condition reported today" />
          <MetricCard label="Work Force" value="10" sub="Personnel Present" />
          <MetricCard label="Last Submission" value={reports[0] ? new Date(reports[0].submittedAt).toLocaleDateString() : 'N/A'} sub="Latest log sync" />
        </div>


        {/* --- UPDATED REPORT VIEW DISPLAY GRID --- */}
        <div className="col-span-12 space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-base font-semibold text-slate-800">Supervisor Documentation Cards</h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-medium text-slate-400">Live Data Sync</span>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="w-full bg-white border border-slate-200 rounded-2xl p-16 text-center text-slate-400 font-medium uppercase tracking-wider text-[11px]">
              No reports submitted yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => {
                const currentId = report.id || report._id;
                const currentType = report.reportType || 'DAILY_SITE_REPORT';
                
                return (
                  <div
                    key={currentId}
                    onClick={() => handleInspectReport(report)}
                    className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 hover:shadow-md group ${
                      (activeInspectionReport?.id || activeInspectionReport?._id) === currentId 
                        ? 'border-blue-500 shadow-sm' 
                        : 'border-slate-100'
                    }`}
                  >
                    <div className="flex items-start gap-4 truncate">
                      <div className={`p-3.5 rounded-xl shrink-0 ${
                        currentType === 'INCIDENT_REPORT' ? 'bg-rose-50 text-rose-600' :
                        currentType === 'PROGRESS_REPORT' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        <FileText size={18} />
                      </div>
                      
                      <div className="truncate w-full">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                            ID: {String(currentId).slice(-6).toUpperCase()}
                          </span>
                          <span className="text-[7px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">
                            {currentType.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <h4 className="text-[13px] font-black text-[#111827] uppercase tracking-tight mt-1 group-hover:text-blue-600 transition-colors truncate">
                          {report.reportTitle || 'Untitled Performance Abstract'}
                        </h4>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-[9px] font-normal text-slate-400 mt-2 uppercase tracking-wide">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} /> {formatDateString(report.reportDate || report.submittedAt || report.createdAt)}
                          </span>
                          <span className="truncate max-w-[180px]">
                            Project: {report.project?.projectName || 'N/A'}
                          </span>
                          {report.weatherCondition && (
                            <span className="flex items-center gap-0.5 capitalize">
                              <CloudRain size={9} /> {report.weatherCondition.toLowerCase()}
                            </span>
                          )}
                          {report.user && (
                            <span className="flex items-center gap-0.5 sm:ml-auto">

                              <User size={9} /> {report.user?.firstName} {report.user?.lastName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* --- OVERLAY MODAL: DEEP EXTRACTION INSPECTOR --- */}
      <AnimatePresence>
        {activeInspectionReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Dark Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveInspectionReport(null)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
            />

            {/* Modal Box Window Layout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-10 text-left overflow-hidden"
            >
              {/* Header Panel Node (Sticky Top) */}
              <div className="p-6 md:p-8 pb-4 border-b border-slate-50 shrink-0 flex justify-between items-start gap-4">
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Selected Object Identity</span>
                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Active Log
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#111827] uppercase tracking-tighter italic mt-1.5 leading-tight truncate">
                    {activeInspectionReport.reportTitle || activeInspectionReport.title || 'Performance Intelligence Metric Node'}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    System Reference Token: {activeInspectionReport.id || activeInspectionReport._id}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setActiveInspectionReport(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all shrink-0 mt-0.5"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Data Field Stream (Scrollable Center) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 space-y-4 text-xs font-bold text-slate-700 uppercase tracking-tight">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block flex items-center gap-1">
                    <HardHat size={10} /> Completed Execution Logic
                  </span>
                  <p className="text-[11px] font-medium text-slate-600 lowercase first-letter:uppercase normal-case tracking-normal leading-relaxed">
                    {activeInspectionReport.workCompleted || "No recorded completion description notes."}
                  </p>
                </div>


                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[7px] font-black text-slate-400 block mb-0.5">Workers Present</span>
                    <span className="font-black text-slate-800">{activeInspectionReport.workersPresent || 0} Operators</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[7px] font-black text-slate-400 block mb-0.5">Weather Metrics</span>
                    <span className="font-black text-slate-800 flex items-center gap-1">
                      <CloudSun size={11} /> {activeInspectionReport.weatherCondition || 'N/A'}
                    </span>
                  </div>
                </div>

                {activeInspectionReport.materialsUsed && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Materials Vector Logs</span>
                    <p className="text-[10px] font-black text-slate-700">{activeInspectionReport.materialsUsed}</p>
                  </div>
                )}

                {activeInspectionReport.challenges && (
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/60">
                    <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 block mb-1 flex items-center gap-1">
                      <AlertCircle size={10} /> Active Deployment Impediments
                    </span>
                    <p className="text-[11px] text-slate-600 lowercase first-letter:uppercase normal-case tracking-normal font-medium leading-relaxed">
                      {activeInspectionReport.challenges}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricCard({ label, value, trend, sub, isAlert }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <p className="text-[9px] font-semibold uppercase text-slate-400 tracking-[0.2em] mb-3">{label}</p>
      <p className={`text-3xl font-black tracking-tighter ${isAlert ? 'text-blue-600' : 'text-slate-900'}`}>{value}</p>
      {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg mt-3 inline-block">{trend}</span>}
      {sub && <p className="text-[10px] font-bold text-slate-400 mt-2">"{sub}"</p>}
    </div>
  );
}
