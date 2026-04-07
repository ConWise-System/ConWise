"use client";
import React, { useState, useMemo } from 'react';
import { 
  Download, FileText, TrendingUp, ChevronLeft, Plus, 
  Send, CheckCircle2, BarChart3, Activity, Trash2, 
  CloudSun, HardHat, Construction, AlertTriangle, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA INITIALIZATION ---
const INITIAL_REPORTS = [
  {
    id: 1,
    reportTitle: "Concrete Pouring - Block A Foundation",
    reportType: "DAILY_SITE_REPORT",
    reportDate: "2026-04-05T08:30:00.000Z",
    workCompleted: "Successfully poured 20 cubic meters of C-25 concrete for the main foundation. Vibrators used to ensure density.",
    workersPresent: 18,
    materialsUsed: "20m3 Concrete, 12kg Curing agent",
    weatherCondition: "Sunny/Dry",
    challenges: "Minor delay in concrete truck arrival (20 mins), but caught up by noon.",
    progressPhotoUrl: ""
  }
];

const PROGRESS_DATA = [
  { month: 'JAN', value: 35, color: '#6366f1' }, { month: 'FEB', value: 48, color: '#8b5cf6' },
  { month: 'MAR', value: 92, color: '#ec4899' }, { month: 'APR', value: 65, color: '#f43f5e' },
  { month: 'MAY', value: 42, color: '#f59e0b' }, { month: 'JUN', value: 98, color: '#10b981' }
];

export default function IntegratedAnalyticsSystem() {
  const [view, setView] = useState('analytics'); 
  const [reports, setReports] = useState(INITIAL_REPORTS);

  const addReport = (newReport) => {
    setReports([newReport, ...reports]);
    setView('analytics');
  };

  const deleteReport = (id) => {
    setReports(reports.filter(report => report.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans selection:bg-blue-100 overflow-x-hidden antialiased">
      <AnimatePresence mode="wait">
        {view === 'analytics' ? (
          <motion.div 
            key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}
          >
            <AnalyticsDashboard 
              onCreateReport={() => setView('report-form')} 
              reports={reports}
              onDelete={deleteReport}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          >
            <DailySiteReportForm onBack={() => setView('analytics')} onSubmit={addReport} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- DASHBOARD COMPONENT ---
function AnalyticsDashboard({ onCreateReport, reports, onDelete }) {
  return (
    <div className="p-4 md:p-10 space-y-8 max-w-[1200px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-[9px] font-black tracking-[0.4em] text-blue-600 uppercase mb-1 block">Subsystem 4.6.6 / FYP</span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none">
            Executive <span className="text-slate-400 italic font-medium tracking-normal text-2xl">Intelligence</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-500 hover:shadow-sm transition-all uppercase tracking-widest">
            <Download size={14} /> Export Logs
          </button>
          <button 
            onClick={onCreateReport}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0F172A] text-white rounded-xl text-[11px] font-black uppercase tracking-[0.15em] shadow-xl shadow-blue-900/20 hover:bg-blue-600 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={3} /> Create Site Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard title="Project Reports" value={reports.length + 124} icon={<FileText />} trend="+12%" color="blue" />
        <KPICard title="Active Workers" value="42" icon={<HardHat />} trend="Peak" color="emerald" />
        <KPICard title="Material Sync" value="94%" icon={<Construction />} trend="Stable" color="indigo" />
        <KPICard title="Alert Level" value="Low" icon={<AlertTriangle />} trend="Optimal" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Chart */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-[12px] font-black text-slate-800 flex items-center gap-3 uppercase tracking-widest">
              <BarChart3 size={18} className="text-blue-500"/> Site Progress Velocity
            </h3>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Audit Validated</span>
          </div>
          <div className="h-48 w-full flex items-end justify-between gap-4 px-2">
            {PROGRESS_DATA.map((item) => (
              <div key={item.month} className="relative flex-1 flex flex-col items-center group">
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: `${item.value}%` }}
                  style={{ backgroundColor: item.color }}
                  className="w-full max-w-[32px] rounded-t-xl group-hover:brightness-110 transition-all shadow-md"
                />
                <span className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-tighter">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Load Gauge */}
        <div className="bg-[#0F172A] rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-2xl border border-slate-800">
          <h3 className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Site Resource Load</h3>
          <div className="relative flex justify-center py-4">
            <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="transparent" stroke="#1E293B" strokeWidth="10" />
              <circle cx="50" cy="50" r="42" fill="transparent" stroke="#3B82F6" strokeWidth="10" strokeDasharray="210 263.8" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black italic tracking-tighter">80%</span>
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Live Load</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 tracking-widest">
              <span>Machinery Sync</span>
              <span className="text-blue-400">80%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="bg-blue-500 h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* RECENT REPORTS LIST */}
      <div className="space-y-5 pb-10">
        <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 flex items-center gap-2">
           <Activity size={14} /> Master Site Logs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between group hover:border-blue-300 hover:shadow-xl transition-all duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Construction size={16}/></div>
                    <div>
                      <h4 className="text-[14px] font-black text-slate-800 leading-tight">{report.reportTitle}</h4>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(report.reportDate).toDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => onDelete(report.id)} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed line-clamp-2 italic">"{report.workCompleted}"</p>
                
                <div className="flex flex-wrap gap-3 pt-2">
                   <Badge icon={<HardHat size={10}/>} text={`${report.workersPresent} Workers`} />
                   <Badge icon={<CloudSun size={10}/>} text={report.weatherCondition} />
                   <Badge icon={<Construction size={10}/>} text={report.reportType.replace(/_/g, ' ')} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- FORM COMPONENT (UPDATED WITH YOUR SCHEMA) ---
function DailySiteReportForm({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    reportTitle: '',
    reportType: 'DAILY_SITE_REPORT',
    reportDate: new Date().toISOString().split('T')[0],
    workCompleted: '',
    workersPresent: '',
    materialsUsed: '',
    weatherCondition: 'Sunny/Dry',
    challenges: '',
    progressPhotoUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, id: Date.now(), reportDate: new Date(formData.reportDate).toISOString() });
  };

  return (
    <div className="max-w-[850px] mx-auto p-6 md:py-16">
      <button onClick={onBack} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 mb-8 transition-all">
        <ChevronLeft size={16} /> Return to Subsystem Analytics
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center px-12">
          <div className="text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Daily <span className="text-blue-600 italic">Site Report</span></h2>
            <p className="text-slate-400 font-bold text-[8px] uppercase tracking-[0.4em] mt-1">Personnel Authorization Level 4</p>
          </div>
          <FileText size={32} className="text-slate-200" />
        </div>

        <div className="p-10 space-y-8">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormGroup label="Report Title" icon={<FileText size={14}/>}>
               <input required placeholder="e.g. Concrete Pouring - Block A" value={formData.reportTitle} onChange={e => setFormData({...formData, reportTitle: e.target.value})} className="form-input-custom" />
            </FormGroup>
            <FormGroup label="Logging Date" icon={<Activity size={14}/>}>
               <input type="date" value={formData.reportDate} onChange={e => setFormData({...formData, reportDate: e.target.value})} className="form-input-custom" />
            </FormGroup>
          </div>

          {/* Main Work Summary */}
          <FormGroup label="Work Completed (Description)" icon={<CheckCircle2 size={14}/>}>
            <textarea required placeholder="Describe successfully completed tasks..." value={formData.workCompleted} onChange={e => setFormData({...formData, workCompleted: e.target.value})} className="form-input-custom min-h-[120px] pt-4" />
          </FormGroup>

          {/* Resources & Weather */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormGroup label="Workers Present" icon={<HardHat size={14}/>}>
               <input type="number" placeholder="0" value={formData.workersPresent} onChange={e => setFormData({...formData, workersPresent: e.target.value})} className="form-input-custom" />
            </FormGroup>
            <FormGroup label="Weather Condition" icon={<CloudSun size={14}/>}>
               <select value={formData.weatherCondition} onChange={e => setFormData({...formData, weatherCondition: e.target.value})} className="form-input-custom appearance-none">
                  <option>Sunny/Dry</option>
                  <option>Rainy/Wet</option>
                  <option>Overcast</option>
                  <option>Windy</option>
               </select>
            </FormGroup>
            <FormGroup label="Materials Used" icon={<Construction size={14}/>}>
               <input placeholder="e.g. 20m3 Concrete" value={formData.materialsUsed} onChange={e => setFormData({...formData, materialsUsed: e.target.value})} className="form-input-custom" />
            </FormGroup>
          </div>

          {/* Challenges */}
          <FormGroup label="Challenges & Blockers" icon={<AlertTriangle size={14}/>} color="rose">
            <input placeholder="Any delays or safety issues?" value={formData.challenges} onChange={e => setFormData({...formData, challenges: e.target.value})} className="form-input-custom border-rose-50 bg-rose-50/20 placeholder:text-rose-200 text-rose-700" />
          </FormGroup>

          {/* Media Link */}
          <FormGroup label="Progress Photo URL (S3/Cloud)" icon={<ImageIcon size={14}/>}>
            <input placeholder="https://cloud-storage.com/photo.jpg" value={formData.progressPhotoUrl} onChange={e => setFormData({...formData, progressPhotoUrl: e.target.value})} className="form-input-custom text-blue-500 font-medium" />
          </FormGroup>
        </div>

        <div className="p-8 bg-[#0F172A] flex justify-between items-center px-12">
          <button type="button" onClick={onBack} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Discard Draft</button>
          <button 
            type="submit"
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl shadow-blue-500/40 flex items-center gap-3 active:scale-95 transition-all"
          >
            <Send size={14} fill="currentColor" /> Commit to Ledger
          </button>
        </div>
      </form>
    </div>
  );
}

// --- SMALL REUSABLE UI COMPONENTS ---

function FormGroup({ label, children, icon, color = "blue" }) {
  const labelColors = color === "rose" ? "text-rose-600" : "text-slate-400";
  return (
    <div className="space-y-2.5 flex-1">
      <label className={`text-[10px] font-black uppercase tracking-[0.15em] ml-1 flex items-center gap-2 ${labelColors}`}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-tighter">
      {icon} {text}
    </div>
  );
}

function KPICard({ title, value, icon, trend, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100"
  };

  return (
    <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:shadow-lg transition-all group">
      <div className="flex justify-between items-start">
        <div className={`p-2.5 rounded-xl border ${colors[color]}`}>{React.cloneElement(icon, { size: 16, strokeWidth: 2.5 })}</div>
        <span className="text-[8px] font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-400 uppercase tracking-widest">{trend}</span>
      </div>
      <div>
        <h4 className="text-2xl font-black text-slate-900 leading-none italic tracking-tighter group-hover:text-blue-600 transition-colors">{value}</h4>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{title}</p>
      </div>
    </div>
  );
}