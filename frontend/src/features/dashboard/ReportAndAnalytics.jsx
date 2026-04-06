"use client";
import React, { useState } from 'react';
import { 
  Download, FileText, TrendingUp, ChevronLeft, Plus, 
  Send, CheckCircle2, BarChart3, Activity, Trash2, MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PROGRESS_DATA = [
  { month: 'JAN', value: 35, color: '#6366f1' }, { month: 'FEB', value: 48, color: '#8b5cf6' },
  { month: 'MAR', value: 92, color: '#ec4899' }, { month: 'APR', value: 65, color: '#f43f5e' },
  { month: 'MAY', value: 42, color: '#f59e0b' }, { month: 'JUN', value: 98, color: '#10b981' }
];

const DEPARTMENT_MATRIX = [
  { id: 1, name: 'Product Engineering', trend: 'Peak' },
  { id: 2, name: 'Strategic Marketing', trend: 'Stable' },
  { id: 3, name: 'Customer Success', trend: 'High' },
];

export default function IntegratedAnalyticsSystem() {
  const [view, setView] = useState('analytics'); 
  const [reports, setReports] = useState([]);

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
              reportCount={reports.length} 
              reports={reports}
              onDelete={deleteReport}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          >
            <DailyReportForm onBack={() => setView('analytics')} onSubmit={addReport} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalyticsDashboard({ onCreateReport, reportCount, reports, onDelete }) {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1100px] mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-200 pb-4">
        <div>
          <span className="text-[8px] font-black tracking-[0.3em] text-blue-600 uppercase mb-0.5 block">Subsystem 4.6.6</span>
          <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
            Executive <span className="text-slate-400 italic font-medium">Intelligence</span>
          </h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:shadow-sm transition-all">
            <Download size={13} /> Export
          </button>
          <button 
            onClick={onCreateReport}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0F172A] text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-blue-600 transition-all"
          >
            <Plus size={13} strokeWidth={3} /> Create Report
          </button>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Reports" value={reportCount + 124} icon={<FileText />} trend="+12%" color="blue" />
        <KPICard title="Avg Velocity" value="84%" icon={<Activity />} trend="Stable" color="emerald" />
        <KPICard title="Completion" value="68.2%" icon={<CheckCircle2 />} trend="+4.1%" color="indigo" />
        <KPICard title="Efficiency" value="92/100" icon={<TrendingUp />} trend="Peak" color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] p-5 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
              <BarChart3 size={16} className="text-blue-500"/> Task Throughput
            </h3>
            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded">Real-time</span>
          </div>
          <div className="h-36 w-full flex items-end justify-between gap-3 px-1">
            {PROGRESS_DATA.map((item) => (
              <div key={item.month} className="relative flex-1 flex flex-col items-center group">
                <motion.div 
                  initial={{ height: 0 }} animate={{ height: `${item.value}%` }}
                  style={{ backgroundColor: item.color }}
                  className="w-full max-w-[28px] rounded-t-lg group-hover:brightness-110 transition-all shadow-sm"
                />
                <span className="mt-2 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F172A] rounded-[1.5rem] p-5 text-white flex flex-col justify-between shadow-xl border border-slate-800">
          <h3 className="text-[9px] font-bold tracking-widest text-slate-500 uppercase">Resource Load</h3>
          <div className="relative flex justify-center py-2">
            <svg viewBox="0 0 100 100" className="w-24 h-24 -rotate-90">
              <circle cx="50" cy="50" r="42" fill="transparent" stroke="#1E293B" strokeWidth="12" />
              <circle cx="50" cy="50" r="42" fill="transparent" stroke="#3B82F6" strokeWidth="12" strokeDasharray="190 263.8" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black italic">72%</span>
              <span className="text-[7px] font-black uppercase text-slate-500">Utilized</span>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 tracking-widest">
              <span>Crew Sync</span>
              <span>72%</span>
            </div>
            <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div style={{ width: '72%' }} className="bg-blue-500 h-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Activity Logs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-start group hover:border-blue-200 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-[12px] font-black text-slate-800 truncate max-w-[200px]">{report.workDone}</h4>
                </div>
                <div className="flex gap-4">
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase"><Activity size={10}/> {report.crewSize} Crew</span>
                  <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 uppercase"><FileText size={10}/> {report.materials}</span>
                </div>
              </div>
              <button onClick={() => onDelete(report.id)} className="p-2 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DailyReportForm({ onBack, onSubmit }) {
  const [formData, setFormData] = useState({
    workDone: '',
    crewSize: '',
    materials: '',
    blockers: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!formData.workDone) return;
    onSubmit({ ...formData, id: Date.now() });
  };

  return (
    <div className="max-w-[750px] mx-auto p-6 md:p-10">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 mb-6 transition-all">
        <ChevronLeft size={14} /> Back to Insights
      </button>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 text-center">
          <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Daily <span className="text-blue-600 italic">Field Log</span></h2>
          <p className="text-slate-400 font-bold text-[7px] uppercase tracking-[0.3em] mt-0.5">Subsystem 4.6.6 Protocol</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Description (Work Done)</label>
            <textarea 
              required
              value={formData.workDone}
              onChange={(e) => setFormData({...formData, workDone: e.target.value})}
              className="w-full bg-slate-50 rounded-xl p-4 text-[13px] font-medium text-slate-700 outline-none min-h-[120px] border border-transparent focus:border-blue-200 transition-all shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Crew Size</label>
              <input 
                type="number"
                value={formData.crewSize}
                onChange={(e) => setFormData({...formData, crewSize: e.target.value})}
                className="w-full bg-slate-50 p-4 rounded-xl text-[12px] font-bold outline-none border border-slate-100" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Material Log</label>
              <input 
                value={formData.materials}
                onChange={(e) => setFormData({...formData, materials: e.target.value})}
                className="w-full bg-slate-50 p-4 rounded-xl text-[12px] font-bold outline-none border border-slate-100" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-rose-600 uppercase tracking-widest ml-1">Active Blockers/Challenges</label>
            <input 
              value={formData.blockers}
              onChange={(e) => setFormData({...formData, blockers: e.target.value})}
              className="w-full bg-rose-50/30 p-4 rounded-xl text-[12px] font-bold outline-none border border-rose-100 text-rose-700 placeholder:text-rose-300" 
            />
          </div>
        </div>

        <div className="p-5 bg-[#0F172A] flex justify-between items-center px-8">
          <button type="button" onClick={onBack} className="text-[8px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">Abort</button>
          <button 
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <Send size={12} fill="currentColor" /> Finalize & Push
          </button>
        </div>
      </form>
    </div>
  );
}

function KPICard({ title, value, icon, trend, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    emerald: "text-emerald-600 bg-emerald-50",
    indigo: "text-indigo-600 bg-indigo-50",
    rose: "text-rose-600 bg-rose-50"
  };

  return (
    <div className="bg-white p-4 rounded-[1.2rem] border border-slate-200 shadow-sm flex flex-col justify-between h-28 hover:shadow-md transition-all">
      <div className="flex justify-between items-start">
        <div className={`p-2 rounded-lg ${colors[color]}`}>{React.cloneElement(icon, { size: 14, strokeWidth: 2.5 })}</div>
        <span className="text-[7px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 uppercase tracking-tighter">{trend}</span>
      </div>
      <div>
        <h4 className="text-lg font-black text-slate-900 leading-none italic">{value}</h4>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{title}</p>
      </div>
    </div>
  );
}