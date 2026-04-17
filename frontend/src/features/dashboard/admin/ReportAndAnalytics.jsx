"use client";
import React, { useEffect, useState } from 'react';
import { 
  Download, FileText, ChevronLeft, Plus, 
  Send, CheckCircle2, BarChart3, Activity, Trash2, 
  CloudSun, HardHat, Construction, AlertTriangle, Image as ImageIcon,
  Calendar, Layers, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from '../../../../utils/Axios';
import summeryApi from '@/common/summeryApi';

// --- DATA INITIALIZATION ---
const INITIAL_REPORTS = [
  {
    id: 1,
    reportTitle: "Concrete Pouring - Block A Foundation",
    reportType: "DAILY_SITE_REPORT",
    reportDate: "2026-04-05T08:30:00.000Z",
    workCompleted: "Successfully poured 20 cubic meters of C-25 concrete for the main foundation.",
    workersPresent: 18,
    materialsUsed: "20m3 Concrete, 12kg Curing agent",
    weatherCondition: "Sunny/Dry",
    challenges: "Minor delay in concrete truck arrival (20 mins).",
    progressPhotoUrl: ""
  }
];

const PROGRESS_DATA = [
  { month: 'JAN', value: 35, color: '#2563eb' }, { month: 'FEB', value: 48, color: '#2563eb' },
  { month: 'MAR', value: 92, color: '#2563eb' }, { month: 'APR', value: 65, color: '#2563eb' },
  { month: 'MAY', value: 42, color: '#2563eb' }, { month: 'JUN', value: 98, color: '#2563eb' }
];

export default function IntegratedAnalyticsSystem() {
  const [view, setView] = useState('analytics'); 
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const addReport = (newReport) => {
    setReports([newReport, ...reports]);
    setView('analytics');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      <AnimatePresence mode="wait">
        {view === 'analytics' ? (
          <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnalyticsDashboard onCreateReport={() => setView('report-form')} reports={reports} onDelete={(id) => setReports(reports.filter(r => r.id !== id))} />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <DailySiteReportForm onBack={() => setView('analytics')} onSubmit={addReport} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- DASHBOARD ---
function AnalyticsDashboard({ onCreateReport, reports, onDelete }) {
  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Intelligence Dashboard</h1>
          <p className="text-slate-500 text-sm">Monitoring {reports.length} active site logs</p>
        </div>
        <button onClick={onCreateReport} className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Plus size={20} /> New Site Report
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard title="Total Reports" value={reports.length + 124} icon={<FileText className="text-blue-600" />} />
        <KPICard title="Staff on Site" value="42" icon={<HardHat className="text-orange-600" />} />
        <KPICard title="Progress Sync" value="94%" icon={<Activity className="text-emerald-600" />} />
        <KPICard title="Safety Status" value="Optimal" icon={<CheckCircle2 className="text-blue-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all">
            <div className="flex justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Construction size={18}/></div>
                <h4 className="font-bold">{report.reportTitle}</h4>
              </div>
              <button onClick={() => onDelete(report.id)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">"{report.workCompleted}"</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase">{new Date(report.reportDate).toDateString()}</span>
              <span className="text-[10px] font-bold bg-blue-50 px-2 py-1 rounded text-blue-600 uppercase">{report.workersPresent} Workers</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- FULL FORM (FIXED VISIBILITY) ---
function DailySiteReportForm({ onBack, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reportTitle: '',
    reportType: 'DAILY_SITE_REPORT',
    reportDate: new Date().toISOString().split('T')[0],
    workCompleted: '',
    workersPresent: '',
    materialsUsed: '',
    weatherCondition: 'Sunny/Dry',
    challenges: '',
    progressPhoto: null // Changed from progressPhotoUrl string to null
  });

  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, progressPhoto: file });
      // Generate a local preview URL
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Prepare FormData for multipart/form-data transmission
    const dataToSend = new FormData();
    
    // Append all text fields from state
    Object.keys(formData).forEach(key => {
      if (key !== 'progressPhoto') {
        dataToSend.append(key, formData[key]);
      }
    });

    // Append the file if it exists
    if (formData.progressPhoto) {
      dataToSend.append('progressPhoto', formData.progressPhoto);
    }

    try {
      const response = await Axios({
        ...summeryApi.reports,
        data:dataToSend
      })

      if (response.data.success) {
        const savedReport = await response.json();
        // Pass the saved data back to the parent to update the dashboard
        onSubmit(savedReport);
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };
  useEffect(() => {
    // Cleanup the preview URL to prevent memory leaks
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview])

  return (
    <div className="max-w-[800px] mx-auto p-6 md:py-12">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-6 transition-all">
        <ChevronLeft size={18} /> Back to Dashboard
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl"><FileText size={24}/></div>
          <div>
            <h2 className="text-xl font-bold">New Daily Site Report</h2>
            <p className="text-slate-500 text-sm">Please provide accurate field data for the ledger.</p>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {/* Section 1: Title & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="Report Title" icon={<FileText size={16}/>} placeholder="e.g. Foundation Pouring" value={formData.reportTitle} onChange={v => setFormData({...formData, reportTitle: v})} />
            <FormInput label="Date of Work" icon={<Calendar size={16}/>} type="date" value={formData.reportDate} onChange={v => setFormData({...formData, reportDate: v})} />
          </div>

          {/* Section 2: Details */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={14} className="text-blue-600"/> Work Execution Details
            </label>
            <textarea 
              required 
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-sm focus:border-blue-500 focus:bg-white outline-none transition-all min-h-[120px]"
              placeholder="What tasks were completed today?"
              value={formData.workCompleted}
              onChange={e => setFormData({...formData, workCompleted: e.target.value})}
            />
          </div>

          {/* Section 3: Personnel, Weather, Materials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput label="Personnel" icon={<HardHat size={16}/>} type="number" placeholder="0" value={formData.workersPresent} onChange={v => setFormData({...formData, workersPresent: v})} />
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2"><CloudSun size={14}/> Weather</label>
              <select className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white" value={formData.weatherCondition} onChange={e => setFormData({...formData, weatherCondition: e.target.value})}>
                <option>Sunny/Dry</option><option>Rainy/Wet</option><option>Overcast</option><option>Windy</option>
              </select>
            </div>
            <FormInput label="Materials" icon={<MapPin size={16}/>} placeholder="e.g. 10m3 Concrete" value={formData.materialsUsed} onChange={v => setFormData({...formData, materialsUsed: v})} />
          </div>

          {/* Section 4: Challenges */}
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 space-y-3">
             <label className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-2"><AlertTriangle size={14}/> Challenges & Blockers</label>
             <input className="w-full bg-white border-2 border-red-200 rounded-xl p-4 text-sm outline-none focus:border-red-500" placeholder="List any safety issues or delays..." value={formData.challenges} onChange={e => setFormData({...formData, challenges: e.target.value})} />
          </div>

          {/* Section 5: LOCAL PHOTO UPLOAD */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={16}/> Progress Photo (Local Upload)
            </label>
            
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Upload Trigger */}
              <label className="w-full md:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-blue-500 hover:bg-blue-50/30 cursor-pointer transition-all">
                <div className="p-3 bg-slate-100 text-slate-400 rounded-full mb-2">
                  <ImageIcon size={24} />
                </div>
                <span className="text-sm font-bold text-slate-600">Click to upload photo</span>
                <span className="text-[10px] text-slate-400 mt-1 uppercase">JPG, PNG or WEBP (Max 5MB)</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>

              {/* Preview Area */}
              <div className="w-full md:w-1/2 h-[140px] border-2 border-slate-100 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center">
                {preview ? (
                  <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-slate-300 uppercase italic">No photo selected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button type="button" onClick={onBack} className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cancel Draft</button>
          <button 
          type="submit" 
            disabled={isSubmitting}
            className={`px-10 py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-blue-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 active:scale-95'}`}
          >
            <Send size={18} /> 
            {isSubmitting ? "Uploading..." : "Submit Report"}
        </button>
        </div>
      </form>
    </div>
  );
}

// --- ATOMS ---
function FormInput({ label, icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
        {icon} {label}
      </label>
      <input 
        type={type} 
        required 
        placeholder={placeholder} 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-sm font-medium outline-none focus:border-blue-500 focus:bg-white transition-all"
      />
    </div>
  );
}

function KPICard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className="p-3 bg-slate-50 rounded-xl">{icon}</div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}