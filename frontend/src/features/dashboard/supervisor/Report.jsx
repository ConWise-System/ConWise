"use client";

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, Camera, ArrowLeft, Loader2, 
  CheckCircle2, Plus, History, LayoutGrid, 
  SlidersHorizontal, Search, Bell, MoreVertical, 
  ChevronRight, X, FileText, HardHat, Package, AlertTriangle,
  Users
} from 'lucide-react';

export default function SupervisorReport() {
  // Scenario State: Authenticated Project Context
  const [activeProject] = useState("ConWise Infrastructure Phase A");
  const [isLoggingMode, setIsLoggingMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Scenario State: Report Data Fields
  const [reportData, setReportData] = useState({
    workDone: "",
    workersPresent: "",
    materialsUsed: "",
    challenges: ""
  });
  
  // Scenario State: Photo Uploads
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Logic: System saves report and notifies manager
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating API Save & Manager Notification
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    setIsSubmitting(false);
    setSubmittedSuccess(true);
    
    // Postconditions: Return to dashboard after storage confirmation
    setTimeout(() => {
      setIsLoggingMode(false);
      setSubmittedSuccess(false);
      setReportData({ workDone: "", workersPresent: "", materialsUsed: "", challenges: "" });
      setImages([]);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-[#334155] font-sans selection:bg-blue-100">
      
     

      <main className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!isLoggingMode ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            >
              {/* DASHBOARD HEADER */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Daily Reports</h1>
                  <p className="text-sm text-slate-500 font-medium">System Role: Site Supervisor</p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <History size={15} /> Logs Archive
                  </button>
                  <button 
                    onClick={() => setIsLoggingMode(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    <Plus size={16} /> Create New Report
                  </button>
                </div>
              </div>

              {/* METRICS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Phase Efficiency" value="94.2%" status="up" icon={<LayoutGrid size={18}/>} />
                <StatCard label="Incident Rate" value="0.00" status="stable" icon={<AlertTriangle size={18}/>} />
                <StatCard label="Active Personnel" value="24" status="active" icon={<Users size={18}/>} />
              </div>

              {/* ACTIVITY STREAM */}
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Submissions</h3>
                  <button className="text-[10px] font-bold text-blue-600 hover:underline">Download CSV</button>
                </div>
                <div className="divide-y divide-slate-50">
                  <ActivityItem date="May 06" title="Foundation Pouring - Sector B" user="Me (Supervisor)" status="Verified" />
                  <ActivityItem date="May 05" title="Material Delivery: Cement Grade A" user="Me (Supervisor)" status="Verified" />
                  <ActivityItem date="May 04" title="Structural Steel Inspection" user="Me (Supervisor)" status="Reviewed" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* FORM NAVIGATION */}
              <button 
                onClick={() => setIsLoggingMode(false)}
                className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 text-[10px] font-bold uppercase tracking-widest mb-10 transition-colors"
              >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Reports Module
              </button>

              <div className="mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-tighter mb-4 border border-blue-100">
                  Step 2: Data Entry
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Daily Site Activity Log</h2>
                <p className="text-sm text-slate-500">Provide specific updates on today's progress, personnel, and hurdles.</p>
              </div>

              <form onSubmit={handleSubmitReport} className="space-y-8">
                {/* TEXT INPUTS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Work Accomplished" name="workDone" icon={<FileText size={14}/>} value={reportData.workDone} onChange={handleInputChange} placeholder="Tasks completed today" />
                  <FormField label="Workers Present" name="workersPresent" icon={<Users size={14}/>} value={reportData.workersPresent} onChange={handleInputChange} placeholder="E.g., 12 Engineers, 8 Labor" />
                  <FormField label="Materials Used" name="materialsUsed" icon={<Package size={14}/>} value={reportData.materialsUsed} onChange={handleInputChange} placeholder="Steel, Concrete, etc." />
                  <FormField label="Challenges Faced" name="challenges" icon={<AlertTriangle size={14}/>} value={reportData.challenges} onChange={handleInputChange} placeholder="Delays or blockers" />
                </div>

                {/* PHOTO UPLOAD SECTION */}
                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Site Evidence (Upload Photos)</label>
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="group border-2 border-dashed border-slate-200 bg-white rounded-2xl p-12 flex flex-col items-center justify-center gap-4 hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer"
                  >
                    <input type="file" hidden multiple ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                      <Camera size={24} className="text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-600">Click to upload site photos</p>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG or WEBP (Max 5MB each)</p>
                    </div>
                  </div>

                  {/* PREVIEW THUMBNAILS */}
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                          <img src={img} alt="site" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button 
                  disabled={isSubmitting || !reportData.workDone}
                  className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white py-4 rounded-2xl text-sm font-bold transition-all shadow-xl active:scale-[0.99] flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={18}/>
                      Saving & Notifying Manager...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Final Daily Report
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* POSTCONDITION: SUCCESS OVERLAY */}
        <AnimatePresence>
          {submittedSuccess && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-md flex items-center justify-center px-4"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} 
                className="bg-white p-10 rounded-[40px] text-center max-w-sm shadow-2xl border border-white"
              >
                <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Report Stored</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-6">
                  The daily log has been archived. Your project manager has been notified of the submission.
                </p>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.5 }}
                    className="h-full bg-emerald-500"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// SUPPORTING UI COMPONENTS
function StatCard({ label, value, status, icon }) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group border-b-4 border-b-slate-100 hover:border-b-blue-500">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        <div className="text-slate-300 group-hover:text-blue-500 transition-colors bg-slate-50 p-2 rounded-xl">{icon}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">{value}</span>
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${status === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
          {status === 'up' ? '↑ TRENDING' : '• ACTIVE'}
        </span>
      </div>
    </div>
  );
}

function ActivityItem({ date, title, user, status }) {
  return (
    <div className="flex items-center justify-between p-5 hover:bg-slate-50/80 transition-all cursor-pointer group">
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-sm group-hover:border-blue-200 transition-all">
          <span className="text-[8px] font-bold text-slate-400 uppercase">{date.split(' ')[0]}</span>
          <span className="text-sm font-bold text-slate-700">{date.split(' ')[1]}</span>
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{title}</h4>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-slate-400">{user}</span>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
      <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-all">
        <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}

function FormField({ label, icon, ...props }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">
        <span className="text-blue-500">{icon}</span>
        {label}
      </label>
      <input 
        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300 shadow-sm"
        {...props}
      />
    </div>
  );
}