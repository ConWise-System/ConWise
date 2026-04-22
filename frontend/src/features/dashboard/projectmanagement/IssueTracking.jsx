'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, CheckCircle2, FileText, Filter, Download, 
  MoreHorizontal, ArrowUpRight, Zap, ShieldAlert, ArrowLeft,
  Camera, User, Send, ChevronRight, Loader2, X, Image as ImageIcon,
  Scan, Maximize2, Plus 
} from 'lucide-react';

export default function IssueTracking() {
  const [view, setView] = useState('ledger'); // 'ledger' | 'report' | 'resolve'
  const [activeIssue, setActiveIssue] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const pageTransition = { 
    initial: { opacity: 0, y: 10 }, 
    animate: { opacity: 1, y: 0 }, 
    exit: { opacity: 0, y: -10 } 
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= 4) {
      const newUrls = files.map(file => URL.createObjectURL(file));
      setImages([...images, ...newUrls]);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setView('ledger');
      setImages([]); // Reset images after submission
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 text-slate-900">
      <AnimatePresence mode="wait">
        {view === 'ledger' ? (
          /* --- MANAGER LEDGER --- */
          <motion.div key="ledger" {...pageTransition} className="max-w-[1300px] mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Risk Management</p>
                <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">Issue Tracking</h1>
              </div>
              <button 
                onClick={() => setView('report')}
                className="bg-[#111827] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all"
              >
                <AlertTriangle size={14} /> Report Exception
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MiniMetric label="Critical Exceptions" value="24" sub="+12% Trend" color="text-blue-600" />
              <MiniMetric label="Active Resolution" value="158" sub="4.2h Avg" color="text-indigo-600" />
              <div className="bg-[#111827] rounded-2xl p-5 text-white flex justify-between items-center shadow-sm">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">Predictive engine</p>
                  <p className="text-[11px] font-bold italic text-blue-400">Sector B Anomaly</p>
                </div>
                <Zap size={20} className="text-blue-400 animate-pulse" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Centralized Ledger</h3>
                <TableButton icon={<Filter size={12} />} label="Filter" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-3">Anomaly Descriptor</th>
                      <th className="px-6 py-3">Severity</th>
                      <th className="px-6 py-3">Lead</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <IssueRow 
                      title="HVAC Compression Failure" area="Sector B" priority="Critical" color="blue" lead="M. Thorne"
                      onClick={() => { setActiveIssue("HVAC Compression Failure"); setView('resolve'); }}
                    />
                    <IssueRow title="Structural Joint Anomaly" area="Level 4" priority="High" color="indigo" lead="E. Rodriguez" />
                    <IssueRow title="Misting System Calib" area="Whole Site" priority="Std" color="slate" lead="S. Chen" />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : view === 'report' ? (
          /* --- SUPERVISOR REPORTING VIEW --- */
          <motion.div key="report" {...pageTransition} className="max-w-[700px] mx-auto">
            <button onClick={() => setView('ledger')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-6 hover:text-black">
              <ArrowLeft size={14} /> Back to Ledger
            </button>
            <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-8 bg-blue-50/50 border-b border-blue-100 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-black uppercase italic tracking-tighter text-blue-600">Field Incident Report</h2>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Visual Evidence Required</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm"><ImageIcon size={20} className="text-blue-500"/></div>
              </div>
              
              <form onSubmit={handleReportSubmit} className="p-8 space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Photo Evidence ({images.length}/4)</label>
                    <span className="text-[8px] font-bold text-blue-600 uppercase">System Ready</span>
                  </div>
                  
                  <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="col-span-2 aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group hover:border-blue-400 transition-all cursor-pointer overflow-hidden"
                    >
                      {images[0] ? (
                        <img src={images[0]} className="w-full h-full object-cover" alt="preview" />
                      ) : (
                        <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                          <Camera size={24} className="text-slate-300 group-hover:text-blue-500 mb-2" />
                          <p className="text-[8px] font-black uppercase text-slate-400">Capture Scene</p>
                        </div>
                      )}
                    </div>
                    {[1, 2, 3].map((i) => (
                      <div key={i} onClick={() => fileInputRef.current.click()} className="aspect-square border border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 hover:bg-blue-50 transition-colors cursor-pointer overflow-hidden">
                        {images[i] ? <img src={images[i]} className="w-full h-full object-cover" alt="sub" /> : <Plus size={16} />}
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Scan size={16} className="text-blue-500" />
                      <p className="text-[9px] font-bold text-slate-500 uppercase italic">Awaiting coordinates...</p>
                    </div>
                    <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div initial={{ x: -64 }} animate={{ x: 64 }} transition={{ repeat: Infinity, duration: 1.5 }} className="h-full w-full bg-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormSelect label="Anomaly Priority">
                    <option>Standard Maintenance</option>
                    <option>High Priority</option>
                    <option>Critical Failure</option>
                  </FormSelect>
                  <FormInput label="Location Code" placeholder="e.g. ZONE-B4" />
                  <div className="col-span-2">
                    <FormInput label="Quick Description" placeholder="Detailed anomaly analysis..." isTextArea />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#111827] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-all">
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : "Transmit to Engineering"}
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          /* --- RESOLUTION VIEW --- */
          <motion.div key="resolve" {...pageTransition} className="max-w-[500px] mx-auto">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[8px] font-black px-2 py-1 bg-blue-50 text-blue-600 rounded uppercase border border-blue-100">Status: In Review</span>
                  <h2 className="text-xl font-black italic tracking-tighter">{activeIssue}</h2>
                </div>
                <button onClick={() => setView('ledger')} className="p-2 text-slate-300 hover:text-black"><X size={20}/></button>
              </div>
              
              <div className="aspect-square rounded-3xl bg-slate-100 overflow-hidden relative group">
                 <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${activeIssue}`} className="w-full h-full object-cover opacity-20 grayscale" alt="placeholder" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Maximize2 size={24} className="text-slate-300 group-hover:text-blue-500 transition-colors cursor-pointer" />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y border-slate-50 py-4">
                 <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reported By</p>
                   <p className="text-[10px] font-bold text-slate-700 uppercase italic">Supervisor Alpha</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Timestamp</p>
                   <p className="text-[10px] font-bold text-slate-700">11:22 AM - APR 22</p>
                 </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setView('ledger')} className="flex-1 bg-white border border-slate-200 py-3 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">Request More Data</button>
                <button onClick={() => setView('ledger')} className="flex-1 bg-[#111827] text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all">Finalize & Close</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MiniMetric({ label, value, sub, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm group hover:border-blue-100 transition-all">
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <h4 className={`text-2xl font-black italic tracking-tighter ${color}`}>{value}</h4>
      <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{sub}</p>
    </div>
  );
}

function IssueRow({ title, area, priority, color, lead, onClick }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    slate: "text-slate-500 bg-slate-50 border-slate-100"
  };
  return (
    <tr onClick={onClick} className="hover:bg-blue-50/30 transition-colors cursor-pointer group">
      <td className="px-6 py-4">
        <h4 className="text-[10px] font-black text-[#111827] uppercase leading-none mb-1 group-hover:text-blue-600 transition-colors">{title}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic">Ref: {area}</p>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${themes[color]}`}>{priority}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-slate-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead}`} alt="avatar" />
          </div>
          <span className="text-[9px] font-bold text-slate-500 uppercase">{lead}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <ArrowUpRight size={14} className="inline text-slate-200 group-hover:text-blue-400 transition-all" />
      </td>
    </tr>
  );
}

function FormInput({ label, placeholder, isTextArea }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">{label}</label>
      {isTextArea ? (
        <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500 min-h-[80px]" placeholder={placeholder} />
      ) : (
        <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500" placeholder={placeholder} />
      )}
    </div>
  );
}

function FormSelect({ label, children }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">{label}</label>
      <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none focus:border-blue-500 appearance-none cursor-pointer">
        {children}
      </select>
    </div>
  );
}

function TableButton({ icon, label }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[8px] font-black uppercase text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">
      {icon} {label}
    </button>
  );
}