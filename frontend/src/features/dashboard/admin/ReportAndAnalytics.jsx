"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, FileText, X, Trash2,
  CheckCircle2, Filter, Loader2,
  CloudSun, HardHat, Construction, AlertTriangle, 
  Image as ImageIcon, Calendar, Clock, RefreshCw, ChevronDown, FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';

export default function AdminReportSystem({ projectId = 1 }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  // --- API INTEGRATION (UNTOUCHED BACKEND CALLS) ---

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await Axios({
        ...summeryApi.reports
      });
      
      if (response.data.success) {
        setReports(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async (reportId) => {
    if (!reportId) {
      alert("Report ID is missing. Cannot download.");
      return;
    }
  
    try {
      const response = await Axios({
        url: summeryApi.downloadReport.url(reportId),
        method: "GET",
        responseType: 'blob',
      });
  
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `Report_${reportId}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
  
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Could not download the file. Check if the server is running.");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!reportId) {
        alert("Cannot delete: Report ID is missing.");
        return;
    }

    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
        const response = await Axios({
            method: summeryApi.deleteReport.method, 
            url: `http://localhost:8000${summeryApi.deleteReport.url(reportId)}`
        });
        
        if (response.data.success) {
            setReports(prev => prev.filter(r => (r.id || r._id) !== reportId));
            setSelectedReport(null);
            console.log("Report deleted successfully");
        } else {
            throw new Error(response.data.message || "Server failed to delete");
        }
    } catch (err) {
        console.error("Delete Error:", err);
        const errorMsg = err.response?.data?.message || "Delete failed";
        alert(errorMsg);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [projectId]);

  // Filtering Logic
  const filteredReports = useMemo(() => {
    if (filterType === 'ALL') return reports;
    return reports.filter(r => r.reportType === filterType);
  }, [filterType, reports]);

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans antialiased text-left relative">
      <div className="max-w-[1300px] mx-auto space-y-6">
        
        {/* Professional Minimalist Header Container */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Project Reports Directory</h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Review field logging parameters, site status indices, structural inspections, and dynamic PDF downloads.</p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
             <button 
                onClick={fetchReports} 
                className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg transition-all shadow-2xs"
                title="Refresh log metrics"
             >
                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
             </button>
             <div className="relative flex-1 sm:w-56">
                <Filter size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
                <select 
                    className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-700 outline-none focus:border-slate-400 appearance-none cursor-pointer shadow-2xs"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="ALL">All Report Formats</option>
                    <option value="DAILY_SITE_REPORT">Daily Logs</option>
                    <option value="INSPECTION_REPORT">Site Inspections</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
             </div>
          </div>
        </header>

        {/* Core Loading / Exception Handlers */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <Loader2 className="animate-spin mb-3 text-slate-600" size={28} />
            <p className="text-[10px] font-bold uppercase tracking-wider">Querying secure report archives...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-rose-50 border border-rose-200/60 rounded-xl text-center max-w-xl mx-auto">
            <AlertTriangle className="text-rose-500 mx-auto mb-3" size={20} />
            <p className="text-rose-900 font-bold uppercase text-[11px] tracking-wider mb-1">Server Connectivity Failure</p>
            <p className="text-xs text-rose-700 font-medium">{error}</p>
          </div>
        ) : (
          /* Grid Representation Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredReports.length === 0 ? (
                <div className="col-span-full py-16 bg-white border border-slate-200 rounded-xl text-center text-xs font-medium text-slate-400 shadow-2xs">
                  No registered files map to this filtering parameter.
                </div>
              ) : (
                filteredReports.map((report) => (
                  <motion.div 
                    layout
                    key={report.id || report._id} 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between group cursor-pointer hover:border-slate-400 transition-all text-left"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200/60 text-slate-700 text-[9px] font-bold rounded uppercase tracking-tight">
                            {report.reportType?.replace(/_/g, ' ')}
                        </span>
                        <button 
                            type="button"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              handleDownloadPDF(report.id || report._id); 
                            }}
                            className="p-1.5 text-slate-400 hover:text-slate-900 bg-slate-50 border border-slate-200/40 rounded transition-colors shrink-0"
                            title="Download PDF Ledger"
                          >
                            <Download size={13} />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
                          {report.reportTitle}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-2.5 text-slate-400 text-[10px] font-semibold tracking-wide font-mono">
                          <Calendar size={11} className="text-slate-400" />
                          <span>{new Date(report.reportDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-tight text-slate-400 group-hover:text-slate-700 transition-colors">
                      <span>Inspect Ledger Details &rarr;</span>
                      <FileText size={13} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Structured Deep Inspection Drawer Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.98, y: 10 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.98, y: 10 }}
              className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] border border-slate-200"
            >
              {/* Left Column: Visual Capture Canvas */}
              <div className={`w-full md:w-5/12 bg-slate-50 relative min-h-[220px] md:min-h-0 border-r border-slate-200 flex items-center justify-center overflow-hidden ${!selectedReport.progressPhotoUrl && 'bg-slate-900'}`}>
                {selectedReport.progressPhotoUrl ? (
                  <img 
                    src={selectedReport.progressPhotoUrl} 
                    className="w-full h-full object-cover" 
                    alt="Site evidence frame snapshot" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 gap-1.5">
                    <ImageIcon size={28} className="text-slate-600 opacity-40" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No Media Logs Provided</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 z-10">
                  <div className="px-2 py-0.5 bg-slate-900/80 backdrop-blur text-white text-[9px] font-bold rounded uppercase tracking-wider border border-white/10">
                    Field Attachment
                  </div>
                </div>
              </div>

              {/* Right Column: Meta Metrics Matrix */}
              <div className="w-full md:w-7/12 flex flex-col min-h-0 bg-white text-left">
                
                {/* Modal Title Block Area */}
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-start sticky top-0 z-10">
                    <div className="max-w-[82%] space-y-0.5">
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                          {selectedReport.reportType?.replace(/_/g, ' ')}
                        </span>
                        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight leading-tight">
                          {selectedReport.reportTitle}
                        </h2>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button 
                        type="button"
                        onClick={() => handleDeleteReport(selectedReport.id || selectedReport._id)} 
                        className="p-1.5 text-slate-400 hover:text-red-600 bg-white border border-slate-200 rounded-md transition-colors shadow-2xs"
                        title="Purge record file"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button 
                        type="button"
                        onClick={() => setSelectedReport(null)} 
                        className="p-1.5 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-md transition-colors shadow-2xs"
                      >
                        <X size={14} />
                      </button>
                    </div>
                </div>

                {/* Main Scroll Content Scope */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6 bg-white">
                    {/* Core Grid Metadata Indicators */}
                    <div className="grid grid-cols-2 gap-3.5">
                        <InfoBox 
                          icon={<Calendar size={12} className="text-slate-400" />} 
                          label="Logging Timestamp" 
                          value={new Date(selectedReport.reportDate).toLocaleDateString()} 
                        />
                        <InfoBox 
                          icon={<HardHat size={12} className="text-slate-400" />} 
                          label="Labor Manifest" 
                          value={`${selectedReport.workersPresent || 0} Operators Present`} 
                        />
                        <InfoBox 
                          icon={<CloudSun size={12} className="text-slate-400" />} 
                          label="Environment Index" 
                          value={selectedReport.weatherCondition || "Unspecified"} 
                        />
                        <InfoBox 
                          icon={<Construction size={12} className="text-slate-400" />} 
                          label="Material Allocation" 
                          value={selectedReport.materialsUsed || "None Declared"} 
                        />
                    </div>

                    {/* Textual Summaries Parameter Sets */}
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-500" /> Executive Progress Statement
                            </h5>
                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 leading-relaxed shadow-2xs">
                                {selectedReport.workCompleted || "No clear summary report metrics submitted for this node iteration."}
                            </div>
                        </div>

                        {/* Condition Blockers Check Exception Frame */}
                        {selectedReport.challenges && selectedReport.challenges !== "None" && (
                            <div className="p-4 bg-rose-50 border border-rose-200/50 rounded-lg space-y-1">
                                <h5 className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                                    <AlertTriangle size={12} /> Logged Deployment Obstacles
                                </h5>
                                <p className="text-xs text-rose-900 font-semibold leading-relaxed">{selectedReport.challenges}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Process Operation Download Bar */}
                <div className="p-6 bg-slate-50 border-t border-slate-200 sticky bottom-0">
                    <button 
                        type="button"
                        onClick={() => handleDownloadPDF(selectedReport.id || selectedReport._id)}
                        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Download size={13} /> Export Cryptographic PDF Ledger
                    </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="p-3 bg-slate-50/50 border border-slate-200 rounded-lg text-left space-y-0.5 shadow-2xs">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
        {icon} 
        <span>{label}</span>
      </div>
      <div className="text-xs font-bold tracking-tight text-slate-800 truncate">{value || 'N/A'}</div>
    </div>
  );
}