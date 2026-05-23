'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, Trash2, Calendar, Search, 
  AlertCircle, FileDown, RefreshCw, Layers,
  CloudSun, HardHat, X
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';

// --- Helper Utilities ---
function formatDateString(isoString) {
  if (!isoString) return '---';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export default function ReportManagementEngine() {
  // Primary data storage arrays
  const [reports, setReports] = useState([]);
  
  // Navigation Routing Simulation View State ('INDEX')
  const [activeView, setActiveView] = useState('INDEX');
  
  // UI Interaction triggers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [activeInspectionReport, setActiveInspectionReport] = useState(null);
  
  // System operational states
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState(null);

  // Structural contextual lookup states
  const [projectsList, setProjectsList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);

  // --- 1. GET ALL COMPONENT LOOKUP DICTIONARIES ---
  const fetchLookupData = async () => {
    try {
      const projectRes = await Axios({
        url: summeryApi.getAllProjects.url,
        method: summeryApi.getAllProjects.method,
        withCredentials: true
      });
      if (projectRes.data?.success) {
        setProjectsList(projectRes.data.data || []);
      }

      const materialRes = await Axios({
        url: summeryApi.getAllMaterial.url,
        method: summeryApi.getAllMaterial.method,
        withCredentials: true
      });
      if (materialRes.data?.success) {
        setMaterialsList(materialRes.data.data || []);
      }
    } catch (error) {
      console.error("Critical fault reading structural contextual lookup indexes:", error);
    }
  };

  // --- 2. GET ALL REPORTS DATA METRICS ---
  const fetchAllReports = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({
        url: summeryApi.reports.url,
        method: summeryApi.reports.method,
        withCredentials: true
      });

      if (response.data?.success) {
        setReports(response.data.data || []);
      }
    } catch (error) {
      console.error("Critical error reading core intelligence repository logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLookupData();
    fetchAllReports();
  }, []);

  const handleInspectReport = (report) => {
    setActiveInspectionReport(report);
  };

  // --- 3. DOWNLOAD REPORT PDF BLOB STREAM INTEGRATION ---
  const handleDownloadPDF = async (report, e) => {
    if (e) e.stopPropagation(); 
    const reportId = report.id || report._id || report.reportId;
    setIsProcessingId(reportId);
    
    try {
      const response = await Axios({
        url: summeryApi.downloadReport.url(reportId),
        method: summeryApi.downloadReport.method,
        responseType: 'blob',
        withCredentials: true
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchorElement = document.createElement('a');
      
      anchorElement.href = downloadUrl;
      anchorElement.download = `${String(report.reportTitle || report.title || 'System_Report').replace(/\s+/g, '_')}_${reportId}.pdf`;
      document.body.appendChild(anchorElement);
      anchorElement.click();
      
      document.body.removeChild(anchorElement);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("PDF engine document compilation connection fault:", error);
    } finally {
      setIsProcessingId(null);
    }
  };

  // --- 4. DELETE REPORT RECORD DATA NODE INTEGRATION ---
  const handleDeleteReport = async (report, e) => {
    if (e) e.stopPropagation();
    const reportId = report.id || report._id;

    if (!window.confirm(`Permanently Delete ${reportId}?`)) return;

    try {
      const response = await Axios({
        url: summeryApi.deleteReport.url(reportId),
        method: summeryApi.deleteReport.method,
        withCredentials: true
      });

      if (response.data?.success) {
        setReports(prev => prev.filter(item => (item.id || item._id) !== reportId));
        if ((activeInspectionReport?.id || activeInspectionReport?._id) === reportId) {
          setActiveInspectionReport(null);
        }
      }
    } catch (error) {
      console.error("Server failure clearing data node from database pipeline:", error);
    }
  };

  const filteredReports = reports.filter(item => {
    const titleText = item.reportTitle || item.title || '';
    const idText = String(item.id || item._id || '');
    const typeText = item.reportType || 'DAILY_SITE_REPORT';

    const matchesSearch = titleText.toLowerCase().includes(searchQuery.toLowerCase()) || idText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'ALL' ? true : typeText === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased p-6 md:p-12 text-left relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- DASHBOARD HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-[#111827]">
              Project Reports
            </h1>
          </div>
        </header>

        {/* --- FILTER AND SEARCH PIPELINE --- */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase tracking-tight placeholder-slate-400"
            />
          </div>

          {/* --- DROP-DOWN SELECTION COMPONENT --- */}
          <div className="w-full md:w-64">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-black uppercase tracking-wider rounded-xl px-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-blue-600 appearance-none cursor-pointer text-[#111827]"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 1rem center',
                backgroundSize: '1.25rem',
                backgroundRepeat: 'no-repeat',
                paddingRight: '2.5rem'
              }}
            >
              <option value="ALL">ALL REPORTS</option>
              <option value="DAILY_SITE_REPORT">DAILY SITE REPORT</option>
              <option value="INCIDENT_REPORT">INCIDENT REPORT</option>
              <option value="PROGRESS_REPORT">PROGRESS REPORT</option>
            </select>
          </div>
        </div>

        {/* --- MAIN LEDGER VAULT VIEW GRID --- */}
        <main className="w-full">
          <section className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Reports ({filteredReports.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="bg-white p-16 rounded-[2rem] border border-slate-100 text-center flex items-center justify-center">
                <RefreshCw size={24} className="animate-spin text-slate-400" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="bg-white p-16 rounded-[2rem] border border-dashed border-slate-200 text-center">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  No Report
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((report) => {
                  const currentId = report.id || report._id;
                  const currentType = report.reportType || 'DAILY_SITE_REPORT';
                  return (
                    <div
                      key={currentId}
                      onClick={() => handleInspectReport(report)}
                      className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 hover:shadow-md group ${
                        (activeInspectionReport?.id || activeInspectionReport?._id) === currentId ? 'border-blue-500 shadow-sm' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-4 truncate">
                        <div className={`p-3.5 rounded-xl shrink-0 ${
                          currentType === 'INCIDENT_REPORT' ? 'bg-rose-50 text-rose-600' :
                          currentType === 'PROGRESS_REPORT' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          <FileText size={18} />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                              ID: {String(currentId).slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[7px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">
                              {currentType.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-[13px] font-black text-[#111827] uppercase tracking-tight mt-1 group-hover:text-blue-600 transition-colors truncate">
                            {report.reportTitle || report.title || 'Untitled Performance Abstract'}
                          </h4>
                          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} /> {formatDateString(report.reportDate || report.createdAt)}
                            </span>
                            <span>Project Context ID: {report.projectId}</span>
                          </div>
                        </div>
                      </div>

                      {/* OPERATION ACTIONS TARGET */}
                      <div className="flex items-center gap-1 justify-end border-t pt-3 border-slate-100">
                        <button
                          type="button"
                          onClick={(e) => handleDownloadPDF(report, e)}
                          disabled={isProcessingId !== null}
                          className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                          title="Download Document Node PDF"
                        >
                          {isProcessingId === currentId ? (
                            <RefreshCw size={14} className="animate-spin text-blue-600" />
                          ) : (
                            <Download size={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteReport(report, e)}
                          className="p-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all"
                          title="Purge From Server Records"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
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

              {/* Action Layout Row (Sticky Bottom Footer) */}
              <div className="p-6 md:p-8 pt-4 border-t border-slate-50 shrink-0 space-y-2 bg-white">
                <button
                  type="button"
                  onClick={() => handleDownloadPDF(activeInspectionReport)}
                  disabled={isProcessingId !== null}
                  className="w-full bg-[#111827] text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-sm"
                >
                  {isProcessingId === (activeInspectionReport.id || activeInspectionReport._id) ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" /> Compiling Document Node...
                    </>
                  ) : (
                    <>
                      <FileDown size={14} /> Download PDF
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleDeleteReport(activeInspectionReport)}
                  className="w-full border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}