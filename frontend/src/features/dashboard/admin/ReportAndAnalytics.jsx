"use client";
import React, { useState, useEffect } from 'react';
import { 
  Trash2, AlertTriangle, Calendar, ShieldCheck, Search, Loader2, 
  X, MapPin, Users, HardHat, CloudSun, Info, Building, Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from '../../../../utils/Axios';
import summeryApi from '@/common/summeryApi';

export default function AdminIssueDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);

  // --- FETCH REPORTS ---
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...summeryApi.reports, 
        method: 'GET'
      });
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // --- DELETE FUNCTION ---
  const deleteReport = async (e, id) => {
    e.stopPropagation(); // Prevent opening modal
    if (window.confirm("Are you sure you want to permanently delete this issue?")) {
      try {
        setReports(reports.filter(r => (r.id || r._id) !== id));
        await Axios({
          url: `${summeryApi.reports.url}/${id}`,
          method: 'DELETE'
        });
      } catch (error) {
        console.error("Delete failed:", error);
        fetchReports();
      }
    }
  };

  const filteredReports = reports.filter(r => 
    r.reportTitle?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.challenges?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <div className="max-w-[1000px] mx-auto p-6 space-y-6">
        
        {/* --- PAGE HEADER --- */}
        <header className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Administrative Access</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Reported Issues Ledger</h1>
            <p className="text-slate-500 text-sm">
              {loading ? "Syncing data..." : `Reviewing ${reports.length} site challenges.`}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search challenges..."
              className="w-full bg-slate-100 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* --- ISSUES LIST --- */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="font-medium">Loading ledger records...</p>
            </div>
          ) : (
            <AnimatePresence>
              {filteredReports.map((report) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, x: -20 }}
                  key={report.id || report._id} 
                  onClick={() => setSelectedReport(report)}
                  className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex gap-4">
                    <div className="mt-1 p-3 bg-red-50 text-red-600 rounded-xl h-fit">
                      <AlertTriangle size={20}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                        {report.reportTitle}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed mb-3 max-w-2xl line-clamp-2">
                        {report.challenges}
                      </p>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black bg-slate-100 px-2.5 py-1 rounded-md text-slate-500 uppercase flex items-center gap-1.5">
                          <Calendar size={12} /> {new Date(report.reportDate).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] font-black bg-blue-50 px-2.5 py-1 rounded-md text-blue-600 uppercase flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye size={12} /> View Details
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => deleteReport(e, report.id || report._id)} 
                    className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* --- REPORT DETAIL MODAL --- */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENT: MODAL ---
function ReportDetailModal({ report, onClose }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-900/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} 
        animate={{ scale: 1, y: 0 }} 
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-4xl h-full max-h-[85vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- FIXED HEADER --- */}
        <div className="shrink-0 p-8 bg-[#0F172A] text-white flex justify-between items-start relative border-b border-slate-800">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {report.reportType?.replace('_', ' ') || "Site Report"}
              </span>
            </div>
            <h3 className="text-3xl font-bold tracking-tight leading-tight">{report.reportTitle}</h3>
            <p className="text-slate-400 text-sm mt-2 flex items-center gap-2">
              <Building size={14} /> {report.project?.projectName} • {report.company?.name}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl transition-all border border-white/10 shadow-lg"
          >
            <X size={20}/>
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <InfoBox icon={<Users size={16}/>} label="Supervisor" value={`${report.user?.firstName} ${report.user?.lastName}`} color="blue" />
            <InfoBox icon={<Calendar size={16}/>} label="Date" value={new Date(report.reportDate).toLocaleDateString()} color="slate" />
            <InfoBox icon={<CloudSun size={16}/>} label="Weather" value={report.weatherCondition} color="orange" />
            <InfoBox icon={<HardHat size={16}/>} label="Manpower" value={`${report.workersPresent} Workers`} color="emerald" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 space-y-8">
              <section>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Work Completed
                </h5>
                <div className="text-[15px] text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 italic">
                  "{report.workCompleted}"
                </div>
              </section>

              <section>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Challenges & Resolutions
                </h5>
                <div className="text-[14px] text-slate-700 leading-relaxed bg-amber-50/40 p-6 rounded-[1.5rem] border border-amber-100">
                  {report.challenges}
                </div>
              </section>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <section>
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Materials Utilized</h5>
                <div className="flex flex-wrap gap-2">
                  {report.materialsUsed?.split(',').map((mat, i) => (
                    <span key={i} className="text-[12px] font-bold px-4 py-2 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm">
                      {mat.trim()}
                    </span>
                  ))}
                </div>
              </section>

              {report.progressPhotoUrl && (
                <section>
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4">Site Documentation</h5>
                  <div className="rounded-[2rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100 aspect-video">
                    <img 
                      src={report.progressPhotoUrl} 
                      alt="Progress" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* --- FIXED FOOTER --- */}
        <div className="shrink-0 px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">System Entry ID: {report.id}</span>
            <span className="text-[11px] font-medium text-slate-500 italic">Logged on {new Date(report.submittedAt).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full uppercase tracking-widest">
            <MapPin size={14} /> {report.project?.location}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- SUB-COMPONENT: INFOBOX ---
function InfoBox({ icon, label, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div className={`p-5 rounded-3xl border ${colors[color] || colors.slate} transition-all hover:shadow-md`}>
      <div className="flex items-center gap-2 opacity-60 mb-1.5">
        {icon}
        <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-[13px] font-black truncate">{value}</p>
    </div>
  );
}