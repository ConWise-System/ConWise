"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trash2, AlertTriangle, Calendar, ShieldCheck, Search, Loader2, 
  X, MapPin, Users, HardHat, CloudSun, Building, Download, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from '../../../../utils/Axios';
import summeryApi from '@/common/summeryApi';

export default function AdminIssueDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null); 
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [selectedReport, setSelectedReport] = useState(null);
  
  // State for the custom delete confirmation modal
  const [reportToDelete, setReportToDelete] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...summeryApi.reports, method: 'GET' });
      if (response.data.success) setReports(response.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const handleConfirmDelete = async () => {
    const id = reportToDelete._id || reportToDelete.id;
    try {
      setDeletingId(id);
      setReportToDelete(null); // Close the confirm modal immediately
      await Axios({
        url: summeryApi.deleteReport.url(id),
        method: summeryApi.deleteReport.method
      });
      setReports(prev => prev.filter(r => (r.id || r._id) !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      fetchReports();
    } finally {
      setDeletingId(null);
    }
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.reportTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.challenges?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "ALL" || r.reportType === filterType;
    return matchesSearch && matchesFilter;
  });

  const reportTypes = ["ALL", ...new Set(reports.map(r => r.reportType).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <div className="max-w-[1000px] mx-auto p-6 space-y-6">
        
        {/* --- HEADER --- */}
        <header className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Access</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Reported Issues Ledger</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" placeholder="Search..." 
                className="w-full bg-slate-100 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select 
                className="bg-slate-100 border-none rounded-xl py-3 pl-10 pr-8 text-xs font-bold uppercase appearance-none outline-none cursor-pointer"
                value={filterType} onChange={(e) => setFilterType(e.target.value)}
              >
                {reportTypes.map(type => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
              </select>
            </div>
          </div>
        </header>

        {/* --- LIST --- */}
        <div className="grid grid-cols-1 gap-4 pb-20">
          {loading ? (
            <div className="flex justify-center py-20 text-slate-400"><Loader2 className="animate-spin" size={32} /></div>
          ) : (
            <AnimatePresence>
              {filteredReports.map((report) => (
                <motion.div 
                  layout key={report.id || report._id} 
                  onClick={() => deletingId !== (report.id || report._id) && setSelectedReport(report)}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center hover:border-blue-200 transition-all shadow-sm"
                >
                  <div className="flex gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertTriangle size={20}/></div>
                    <div>
                      <h4 className="font-bold text-slate-800">{report.reportTitle}</h4>
                      <p className="text-slate-500 text-sm line-clamp-1">{report.challenges}</p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setReportToDelete(report); }} 
                    className="p-3 text-slate-300 hover:text-red-600 transition-colors"
                  >
                    {deletingId === (report.id || report._id) ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {reportToDelete && (
          <DeleteConfirmModal 
            title={reportToDelete.reportTitle} 
            onConfirm={handleConfirmDelete} 
            onCancel={() => setReportToDelete(null)} 
          />
        )}
      </AnimatePresence>

      {/* --- REPORT DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- NEW COMPONENT: DELETE CONFIRMATION MODAL ---
function DeleteConfirmModal({ title, onConfirm, onCancel }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-md p-8 rounded-[2rem] shadow-2xl border border-slate-100 text-center"
      >
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Report?</h3>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          You are about to permanently remove <span className="font-bold text-slate-700">"{title}"</span>. This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-200"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- MODAL COMPONENT (Detail View) ---
function ReportDetailModal({ report, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = async () => {
    try {
      setIsDownloading(true);
      const reportId = report._id || report.id;
      const response = await Axios({
        url: summeryApi.downloadReport.url(reportId),
        method: summeryApi.downloadReport.method,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Report_${report.reportTitle.replace(/\s+/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-4xl h-full max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 p-8 bg-[#0F172A] text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block mb-1">{report.reportType?.replace('_', ' ')}</span>
            <h3 className="text-2xl font-bold">{report.reportTitle}</h3>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={downloadReport} disabled={isDownloading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase transition-all disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="animate-spin" size={14}/> : <Download size={14} />}
              {isDownloading ? "Generating..." : "Download PDF"}
            </button>
            <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10"><X size={20}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-10 bg-white">
          {/* ... modal body content same as before ... */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <InfoBox label="Supervisor" value={`${report.user?.firstName} ${report.user?.lastName}`} color="blue" icon={<Users size={16}/>} />
             <InfoBox label="Date" value={new Date(report.reportDate).toLocaleDateString()} color="slate" icon={<Calendar size={16}/>} />
             <InfoBox label="Weather" value={report.weatherCondition} color="orange" icon={<CloudSun size={16}/>} />
             <InfoBox label="Workers" value={`${report.workersPresent}`} color="emerald" icon={<HardHat size={16}/>} />
          </div>
          <div className="space-y-8">
            <section>
               <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Work Completed</h5>
               <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">"{report.workCompleted}"</p>
            </section>
            <section>
               <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Challenges</h5>
               <p className="text-sm text-slate-700 leading-relaxed bg-amber-50/40 p-6 rounded-2xl border border-amber-100">{report.challenges}</p>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoBox({ label, value, color, icon }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };
  return (
    <div className={`p-5 rounded-3xl border ${colors[color]}`}>
      <div className="flex items-center gap-2 opacity-60 mb-1">{icon} <span className="text-[8px] font-black uppercase tracking-widest">{label}</span></div>
      <p className="text-[11px] font-black truncate">{value}</p>
    </div>
  );
}