"use client";
import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, Search, ArrowLeft, Camera, 
  Users, Package, AlertTriangle, Send, 
  X, Info, ShieldAlert, ChevronRight, Layout, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_ISSUES = [
  { id: 'TKT-8842', title: 'Security Breach: Node 7', reporter: 'Marcus Chen', system: 'Server Infrastructure', status: 'OPEN', priority: 'HIGH' },
  { id: 'TKT-8839', title: 'Database Latency Spike', reporter: 'Sarah Jenkins', system: 'Core API', status: 'IN PROGRESS', priority: 'MEDIUM' },
  { id: 'TKT-8831', title: 'UI Glitch: Mobile Sidebar Overlay', reporter: 'David Miller', system: 'Frontend', status: 'RESOLVED', priority: 'LOW' },
];

export default function IssueManagementSystem() {
  const [view, setView] = useState('list');
  const [issues, setIssues] = useState(INITIAL_ISSUES);

  const addIssue = (newIssue) => {
    setIssues([newIssue, ...issues]);
    setView('list');
  };

  const deleteIssue = (id) => {
    setIssues(issues.filter(issue => issue.id !== id));
  };

  const resolveIssue = (id) => {
    setIssues(issues.map(issue => 
      issue.id === id ? { ...issue, status: 'RESOLVED' } : issue
    ));
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans antialiased text-slate-900 p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
            <IssueList 
              issues={issues} 
              onReportClick={() => setView('report')} 
              onDelete={deleteIssue}
              onResolve={resolveIssue}
            />
          </motion.div>
        ) : (
          <motion.div key="report" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ReportIssuePage 
              onBack={() => setView('list')} 
              onSubmit={addIssue} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IssueList({ issues, onReportClick, onDelete, onResolve }) {
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const pMatch = priorityFilter === 'All' || issue.priority === priorityFilter.toUpperCase();
      const sMatch = statusFilter === 'All' || issue.status === statusFilter.toUpperCase() || (statusFilter === 'In Progress' && issue.status === 'IN PROGRESS');
      const searchMatch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) || issue.id.toLowerCase().includes(searchTerm.toLowerCase());
      return pMatch && sMatch && searchMatch;
    });
  }, [issues, priorityFilter, statusFilter, searchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <nav className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">
            <span>Operations</span> <ChevronRight size={10} strokeWidth={3} /> <span className="text-slate-400">Audit Trail</span>
          </nav>
          <h1 className="text-2xl tracking-tight text-slate-900 uppercase">Issue Log</h1>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..." 
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all" 
            />
          </div>
          <button onClick={onReportClick} className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/10">
            <Plus size={14} strokeWidth={3} /> Initiate Report
          </button>
        </div>
      </header>

      <section className="bg-white p-2 rounded-[1.2rem] border border-slate-200 flex flex-wrap gap-6 items-center shadow-sm">
        <FilterTab label="PRIORITY" options={['All', 'High', 'Medium', 'Low']} active={priorityFilter} onChange={setPriorityFilter} />
        <div className="h-6 w-px bg-slate-100 hidden md:block" />
        <FilterTab label="STATUS" options={['All', 'Open', 'In Progress', 'Resolved']} active={statusFilter} onChange={setStatusFilter} />
      </section>

      <div className="bg-white rounded-[1.5rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-8 py-4 bg-slate-50/50 border-b border-slate-100">
           <div className="col-span-5 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Ticket Identity</div>
           <div className="col-span-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Personnel</div>
           <div className="col-span-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Protocol</div>
           <div className="col-span-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {filteredIssues.map((issue) => (
            <div key={issue.id} className="grid grid-cols-12 px-8 py-5 items-center hover:bg-blue-50/30 transition-colors group">
              <div className="col-span-5">
                <h4 className="font-black text-slate-800 text-[13px] tracking-tight group-hover:text-blue-600 transition-colors uppercase">{issue.title}</h4>
                <p className="text-[9px] text-slate-400 font-bold tracking-tighter uppercase italic">{issue.id} • {issue.system}</p>
              </div>
              <div className="col-span-3 flex justify-center items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0F172A] flex items-center justify-center text-white font-black text-[9px] uppercase tracking-tighter shadow-md shadow-slate-200">{issue.reporter.charAt(0)}</div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">{issue.reporter}</span>
              </div>
              <div className="col-span-2 flex justify-center">
                <StatusBadge status={issue.status} />
              </div>
              <div className="col-span-2 flex justify-end gap-3">
                {issue.status !== 'RESOLVED' && (
                  <button onClick={() => onResolve(issue.id)} className="text-[9px] font-black text-blue-600 uppercase hover:underline">Resolve</button>
                )}
                <button onClick={() => onDelete(issue.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ReportIssuePage({ onBack, onSubmit }) {
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    department: 'Operations',
    assets: '',
    challenges: '',
    priority: 'HIGH'
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCommit = () => {
    if (!formData.title) return alert("Please enter incident summary");
    onSubmit({
      id: `TKT-${Math.floor(Math.random()*9000)+1000}`,
      title: formData.title,
      reporter: 'Executive',
      system: formData.department,
      status: 'OPEN',
      priority: formData.priority,
      image: imagePreview
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <button onClick={onBack} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all">
            <ArrowLeft size={14} /> Protocol Return
          </button>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">New <span className="text-blue-600 italic underline decoration-slate-200 underline-offset-8">Incident</span></h1>
        </div>
        <div className="flex gap-3">
            <button onClick={onBack} className="px-5 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Discard</button>
            <button onClick={handleCommit} className="px-8 py-3 bg-[#0F172A] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-900/20 hover:bg-blue-600 transition-all flex items-center gap-2 active:scale-95">
              <Send size={14} fill="currentColor"/> Commit Ticket
            </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Incident Summary</label>
              <textarea 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                rows={3} 
                placeholder="What happened? (e.g. Server Timeout)" 
                className="w-full bg-slate-50 rounded-2xl p-5 text-[12px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all border-none" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Users size={12}/> Department</label>
                  <select 
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-[12px] font-bold outline-none border-none appearance-none"
                  >
                    <option>Operations</option>
                    <option>Infrastructure</option>
                    <option>Financial Systems</option>
                    <option>Frontend</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Package size={12}/> Asset ID</label>
                  <input 
                    value={formData.assets}
                    onChange={(e) => setFormData({...formData, assets: e.target.value})}
                    placeholder="e.g. SRV-092" 
                    className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-[12px] font-bold outline-none border-none" 
                  />
               </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-[9px] font-black text-blue-600 uppercase tracking-widest ml-1 flex items-center gap-2 italic"><AlertTriangle size={12}/> Critical Blockers</label>
              <textarea 
                value={formData.challenges}
                onChange={(e) => setFormData({...formData, challenges: e.target.value})}
                rows={2} 
                placeholder="Any obstacles to resolution?" 
                className="w-full bg-slate-50 border-l-4 border-l-blue-600 rounded-r-2xl p-5 text-[12px] font-bold outline-none focus:bg-white transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm space-y-4 text-center">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Evidence Upload</h4>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            <div 
              onClick={() => fileInputRef.current.click()}
              className="aspect-video bg-slate-50 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 group hover:border-blue-200 cursor-pointer transition-all overflow-hidden"
            >
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
              ) : (
                <>
                  <Camera className="text-slate-300 group-hover:text-blue-600" size={24} strokeWidth={1.5}/>
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Image</p>
                </>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-5">
             <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tier</span>
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 rounded border-none outline-none"
                >
                  <option>HIGH</option>
                  <option>MEDIUM</option>
                  <option>LOW</option>
                </select>
             </div>
             <MetaItem label="System" value={formData.department} />
             <MetaItem label="Timestamp" value={new Date().toLocaleDateString()} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterTab({ label, options, active, onChange }) {
  return (
    <div className="flex items-center gap-4 ml-2">
      <span className="text-[8px] font-black text-slate-400 tracking-[0.2em] uppercase leading-none">{label}</span>
      <div className="flex bg-slate-100 p-1 rounded-xl">
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} className={`px-4 py-1.5 rounded-lg text-[9px] font-black transition-all uppercase tracking-tighter ${active === opt ? 'bg-white text-blue-600 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'OPEN': 'bg-blue-600 text-white border-blue-600',
    'RESOLVED': 'bg-[#0F172A] text-white border-slate-900',
    'IN PROGRESS': 'bg-blue-50 text-blue-600 border-blue-100',
  };
  return <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase italic tracking-tighter shadow-sm ${styles[status] || 'bg-slate-100'}`}>{status}</span>;
}

function MetaItem({ label, value }) {
  return (
    <div className="flex justify-between items-center border-b border-slate-50 pb-2 last:border-0 last:pb-0">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className="text-[10px] font-black text-slate-900 uppercase italic">{value}</span>
    </div>
  );
}