"use client";
import React, { useState, useMemo } from 'react';
import { 
  Download, FileText, X, Search,
  CheckCircle2, Activity, Filter,
  CloudSun, HardHat, Construction, AlertTriangle, 
  Image as ImageIcon, Calendar, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA CONSTANTS ---
const INITIAL_REPORTS = [
  {
    id: 1,
    reportTitle: "Concrete Pouring - Block A Foundation",
    reportType: "DAILY_SITE_REPORT",
    reportDate: "2026-04-05T08:30:00.000Z",
    workCompleted: "Successfully poured 20 cubic meters of C-25 concrete for the main foundation. Vibrators used to ensure density across all support pillars.",
    workersPresent: 18,
    materialsUsed: "20m3 Concrete, 12kg Curing agent",
    weatherCondition: "Sunny/Dry",
    challenges: "Minor delay in concrete truck arrival (20 mins). Heavy traffic on main access road.",
    progressPhotoUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    reportTitle: "Electrical Rough-in - Level 2",
    reportType: "INSPECTION_REPORT",
    reportDate: "2026-04-06T10:00:00.000Z",
    workCompleted: "Conduit installation for the north wing completed and ready for wiring. All inspections passed with 100% compliance.",
    workersPresent: 5,
    materialsUsed: "500m PVC Conduit",
    weatherCondition: "Overcast",
    challenges: "None.",
    progressPhotoUrl: ""
  }
];

export default function AdminReportSystem() {
  const [reports] = useState(INITIAL_REPORTS);
  const [filterType, setFilterType] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);

  // 1. Admin Filtering Logic
  const filteredReports = useMemo(() => {
    if (filterType === 'ALL') return reports;
    return reports.filter(r => r.reportType === filterType);
  }, [filterType, reports]);

  // 2. Mock Download Function
  const handleDownloadPDF = (report) => {
    alert(`Generating Secure PDF Ledger for: ${report.reportTitle}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10 space-y-8">
        
        {/* Header with Admin Controls */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">Admin Control Panel</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Report <span className="text-blue-600 italic font-medium tracking-normal">Vault</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
             <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-slate-100">
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

        {/* Audit Log Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredReports.map((report) => (
              <motion.div 
                layout
                key={report.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between group cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-300"
                onClick={() => setSelectedReport(report)}
              >
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black rounded-lg uppercase tracking-widest border border-blue-100">
                        {report.reportType.replace(/_/g, ' ')}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDownloadPDF(report); }}
                      className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
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
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">View Details &rarr;</span>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={14} />
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* --- REFINED DETAIL MODAL (Fixed Collision) --- */}
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
              {/* Left Column: Visual Asset / Evidence */}
              <div className={`md:w-5/12 bg-slate-100 relative min-h-[300px] ${!selectedReport.progressPhotoUrl && 'bg-slate-900'}`}>
                {selectedReport.progressPhotoUrl ? (
                  <img src={selectedReport.progressPhotoUrl} className="w-full h-full object-cover" alt="Site Evidence" />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-12 text-center text-white">
                    <ImageIcon size={48} className="text-slate-700 mb-4 opacity-20" />
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Evidence Attached</p>
                  </div>
                )}
                <div className="absolute top-6 left-6">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur shadow-xl rounded-2xl">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Digital Audit</span>
                    </div>
                </div>
              </div>

              {/* Right Column: Information Ledger */}
              <div className="flex-1 flex flex-col min-h-0 bg-white">
                <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-white sticky top-0 z-10">
                    <div className="max-w-[80%]">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-1 block">Report Detail View</span>
                        <h2 className="text-2xl font-black text-slate-900 leading-tight">{selectedReport.reportTitle}</h2>
                    </div>
                    <button onClick={() => setSelectedReport(null)} className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-white">
                    {/* Metadata Grid (Matches 'the modal.png' style) */}
                    <div className="grid grid-cols-2 gap-4">
                        <InfoBox icon={<Calendar size={14}/>} label="Log Date" value={new Date(selectedReport.reportDate).toLocaleDateString()} />
                        <InfoBox icon={<Clock size={14}/>} label="Status" value="Verified" color="text-emerald-500" />
                        <InfoBox icon={<HardHat size={14}/>} label="Crew Size" value={`${selectedReport.workersPresent} Active`} />
                        <InfoBox icon={<CloudSun size={14}/>} label="Weather" value={selectedReport.weatherCondition} />
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

                        <section>
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Construction size={14} className="text-blue-500" /> Logistics & Materials
                            </h5>
                            <p className="text-sm font-bold text-slate-800 ml-1 bg-white border border-slate-100 p-4 rounded-xl">{selectedReport.materialsUsed}</p>
                        </section>

                        {selectedReport.challenges !== "None." && (
                            <section className="p-5 bg-rose-50 rounded-2xl border border-rose-100">
                                <h5 className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <AlertTriangle size={14} /> Safety & Field Blockers
                                </h5>
                                <p className="text-sm text-rose-800 font-medium">{selectedReport.challenges}</p>
                            </section>
                        )}
                    </div>
                </div>

                {/* Footer Action Bar */}
                <div className="p-8 bg-white border-t border-slate-100 sticky bottom-0">
                    <button 
                        onClick={() => handleDownloadPDF(selectedReport)}
                        className="w-full py-4 bg-[#0F172A] text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Download size={14} /> Download PDF Ledger
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

// --- UI ATOMS ---

function InfoBox({ icon, label, value, color = "text-slate-800" }) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase mb-1">
        {icon} {label}
      </div>
      <div className={`text-xs font-black tracking-tight ${color}`}>{value}</div>
    </div>
  );
}