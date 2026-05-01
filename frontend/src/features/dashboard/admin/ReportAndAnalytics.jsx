"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, FileText, X, Trash2,
  CheckCircle2, Filter, Loader2,
  CloudSun, HardHat, Construction, AlertTriangle, 
  Image as ImageIcon, Calendar, Clock, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios'

export default function AdminReportSystem({ projectId = 1 }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  // --- API INTEGRATION ---

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await Axios({
        ...summeryApi.reports
      })

      console.log(response.data.success)
      
      if (response.data.success) {
        setReports(response.data.data || []);
      } else {
        throw new Error(resData.message || "Failed to fetch");
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
      // 1. Fetch the PDF as a blob
      const response = await Axios({
        url: summeryApi.downloadReport.url(reportId),
        method: "GET",
        responseType: 'blob', // Critical for handling binary files like PDF
      });
  
      // 2. Create a local URL for the downloaded blob
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);
  
      // 3. Create a temporary 'a' tag to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Set the filename (you can customize this)
      link.setAttribute('download', `Report_${reportId}.pdf`);
      
      // 4. Append, click, and clean up
      document.body.appendChild(link);
      link.click();
      
      // Clean up the DOM and the URL object
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
  
    } catch (err) {
      console.error("PDF Download Error:", err);
      alert("Could not download the file. Check if the server is running.");
    }
  };

  const handleDeleteReport = async (reportId) => {
    // 1. Validate ID exists
    if (!reportId) {
        alert("Cannot delete: Report ID is missing.");
        return;
    }

    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
        // 2. Use your API config and include the full backend URL
        // Accessing the method and url dynamically from your summeryApi object
        const response = await Axios({
            method: summeryApi.deleteReport.method, 
            url: `http://localhost:8000${summeryApi.deleteReport.url(reportId)}`
        });
        
        // 3. Axios puts the response body in .data
        if (response.data.success) {
            // 4. Update state using both 'id' and '_id' for safety
            setReports(prev => prev.filter(r => (r.id || r._id) !== reportId));
            
            // Close the modal after deletion
            setSelectedReport(null);
            
            // Optional: Show success feedback
            console.log("Report deleted successfully");
        } else {
            throw new Error(response.data.message || "Server failed to delete");
        }
    } catch (err) {
        console.error("Delete Error:", err);
        // Access server error message if available
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Live Project Feed</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Report <span className="text-blue-600 italic font-medium tracking-normal">Vault</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={fetchReports} 
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all border border-slate-100"
             >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
             </button>
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Filter size={14} className="text-blue-500" />
                <select 
                    className="bg-transparent text-[11px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-600 min-w-[140px]"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                >
                    <option value="ALL">All Report Types</option>
                    <option value="DAILY_SITE_REPORT">Daily Logs</option>
                    <option value="INSPECTION_REPORT">Inspections</option>
                </select>
             </div>
          </div>
        </header>

        {/* Loading/Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Decrypting Archives...</p>
          </div>
        ) : error ? (
          <div className="p-10 bg-rose-50 border border-rose-100 rounded-[2rem] text-center">
            <AlertTriangle className="text-rose-500 mx-auto mb-4" />
            <p className="text-rose-900 font-bold uppercase text-xs tracking-widest">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReports.map((report) => (
                <motion.div 
                  layout
                  key={report.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                          {report.reportType?.replace(/_/g, ' ')}
                      </span>
                      <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            // If Prisma/DB uses _id, use report._id here
                            handleDownloadPDF(report.id || report._id); 
                          }}
                          className="..."
                        >
                          <Download size={18} />
                      </button>
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{report.reportTitle}</h4>
                        <div className="flex items-center gap-2 mt-2 text-slate-400">
                            <Calendar size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">{new Date(report.reportDate).toDateString()}</span>
                        </div>
                    </div>
                  </div>
                  <div className="pt-6 mt-6 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Inspect Data &rarr;</span>
                      <FileText size={14} className="text-slate-300" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[85vh] border border-white/20"
            >
              {/* Left Column: Evidence Image */}
              <div className={`md:w-5/12 bg-slate-100 relative min-h-[300px] ${!selectedReport.progressPhotoUrl && 'bg-slate-900'}`}>
                {selectedReport.progressPhotoUrl ? (
                  <img 
                    src={selectedReport.progressPhotoUrl} 
                    className="w-full h-full object-cover" 
                    alt="Site Evidence" 
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center text-white">
                    <ImageIcon size={48} className="text-slate-700 mb-4 opacity-20" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Evidence Attached</p>
                  </div>
                )}
                <div className="absolute top-6 left-6">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur shadow-xl rounded-2xl">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Evidence</span>
                    </div>
                </div>
              </div>

              {/* Right Column: Information Ledger */}
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-white sticky top-0 z-10">
                    <div className="max-w-[80%]">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 block">
                          {selectedReport.reportType?.replace(/_/g, ' ')}
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">
                          {selectedReport.reportTitle}
                        </h2>
                    </div>
                    <div className="flex gap-2">
                    <button 
                      onClick={() => handleDeleteReport(selectedReport.id || selectedReport._id)} 
                      className="..."
                    >
                      <Trash2 size={20} />
                    </button>
                        <button 
                          onClick={() => setSelectedReport(null)} 
                          className="p-2 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-white">
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoBox 
                          icon={<Calendar size={14}/>} 
                          label="Date" 
                          value={new Date(selectedReport.reportDate).toLocaleDateString()} 
                        />
                        <InfoBox 
                          icon={<HardHat size={14}/>} 
                          label="Personnel" 
                          value={`${selectedReport.workersPresent} Workers`} 
                        />
                        <InfoBox 
                          icon={<CloudSun size={14}/>} 
                          label="Weather" 
                          value={selectedReport.weatherCondition} 
                        />
                        <InfoBox 
                          icon={<Construction size={14}/>} 
                          label="Materials" 
                          value={selectedReport.materialsUsed} 
                        />
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-blue-500" /> Work Summary
                            </h5>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 leading-relaxed text-slate-700 text-sm italic shadow-inner">
                                "{selectedReport.workCompleted}"
                            </div>
                        </section>

                        {/* Challenges Section - Only shows if data exists */}
                        {selectedReport.challenges && selectedReport.challenges !== "None" && (
                            <section className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                                <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <AlertTriangle size={14} /> Challenges
                                </h5>
                                <p className="text-sm text-rose-800 font-medium">{selectedReport.challenges}</p>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-8 bg-white border-t border-slate-100 sticky bottom-0">
                    <button 
                        onClick={() => handleDownloadPDF(selectedReport.id || selectedReport._id)}
                        className="w-full py-4 bg-[#0F172A] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Download size={14} /> PDF Ledger
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
    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase mb-1">{icon} {label}</div>
      <div className="text-xs font-black tracking-tight text-slate-800">{value}</div>
    </div>
  );
}