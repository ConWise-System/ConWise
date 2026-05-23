"use client";
import React, { useState, useEffect } from 'react';
import { 
  X, Edit3, MapPin, Building2, Plus, 
  Trash2, Calendar, DollarSign, Search, 
  ArrowLeft, Target, Clock, ShieldCheck, 
  Briefcase, LayoutDashboard, TrendingUp, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';

export default function ProjectManagementSystem() {
  const [view, setView] = useState('list'); 
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({ ...summeryApi.getProjects });
      if (response.data.success) {
        setProjects(response.data.data.projects || response.data.data || []);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const saveProject = async (data) => {
    try {
      const isEdit = !!editingProject;
      const config = isEdit ? summeryApi.updateProject : summeryApi.createProject;
      
      // --- SANITIZATION LAYER 1: Submission ---
      // This forces the budget to be a number right before sending to the API
      const payload = {
        ...data,
        projectBudget: Number(data.projectBudget || 0)
      };

      const response = await Axios({
        ...config,
        url: isEdit ? `${config.url}/${editingProject._id || editingProject.id}` : config.url,
        data: payload, // Send the sanitized payload
      });

      if (response.data.success) {
        await fetchProjects();
        setView('list');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Operational Failure");
    }
  };

  const filteredProjects = projects.filter(p => 
    p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6 lg:p-12 max-w-7xl mx-auto space-y-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200"><LayoutDashboard size={20} /></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Enterprise Registry</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">PROJECT <span className="text-blue-600">PORTFOLIO</span></h1>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search assets..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm" />
                </div>
                <button onClick={() => { setEditingProject(null); setView('form'); }} className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-xl shadow-slate-900/10">
                  <Plus size={18} strokeWidth={3} /> New Deployment
                </button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Total Projects" value={projects.length} icon={<TrendingUp className="text-blue-600" />} />
              <StatCard label="Aggregate Budget" value={`ETB ${projects.reduce((acc, p) => acc + (Number(p.projectBudget) || 0), 0).toLocaleString()}`} icon={<DollarSign className="text-emerald-600" />} />
              <StatCard label="Planning Status" value={projects.filter(p => p.status === 'PLANNING').length} icon={<Clock className="text-amber-600" />} />
            </div>
            <ProjectTable projects={filteredProjects} isLoading={isLoading} onEdit={(p) => { setEditingProject(p); setView('form'); }} />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <ProjectForm initialData={editingProject} onSave={saveProject} onCancel={() => setView('list')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectForm({ initialData, onSave, onCancel }) {
  const [loading, setLoading] = useState(false);
  
  // --- SANITIZATION LAYER 2: Initialization ---
  // Ensure the starting value is 0 (number) instead of '' (string) if creating a new project
  const [formData, setFormData] = useState({
    projectName: initialData?.projectName || '',
    location: initialData?.location || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    clientName: initialData?.clientName || '',
    projectBudget: initialData?.projectBudget ? Number(initialData.projectBudget) : 0,
    status: initialData?.status || 'PLANNING'
  });

  const handleSubmit = async () => {
    if (!formData.projectName || !formData.clientName) {
      alert("Operational error: Project Identity and Client are required.");
      return;
    }
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <button onClick={onCancel} className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs tracking-widest transition-all mb-3">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">{initialData ? 'REVISE PROJECT ASSET' : 'DEPLOY NEW ASSET'}</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={onCancel} className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all">Discard</button>
          <button disabled={loading} onClick={handleSubmit} className="px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white bg-blue-600 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
            {loading ? 'Processing...' : 'Commit Project'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[1rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Briefcase size={18} /></div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Project Identity</h3>
            </div>
            <div className="p-10 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Designation</label>
                <div className="relative group">
                  <Target className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                  <input value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-xl pl-12 pr-6 py-3 font-bold text-slate-800 outline-none transition-all " placeholder="e.g. Skyline Corporate Plaza" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client / Stakeholder</label>
                  <div className="relative group">
                    <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl pl-12 pr-6 py-3 font-bold text-slate-800 outline-none transition-all" placeholder="Entity Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Geographical Location</label>
                  <div className="relative group">
                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 focus:bg-white rounded-2xl pl-12 pr-6 py-3 font-bold text-slate-800 outline-none transition-all" placeholder="City, State" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Clock size={18} /></div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Execution Schedule</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commencement</label>
                <input type="date" value={formData.startDate?.split('T')[0]} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white rounded-2xl px-4 py-3 font-bold text-slate-800 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Completion Target</label>
                <input type="date" value={formData.endDate?.split('T')[0]} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-100 focus:bg-white rounded-2xl px-4 py-3 font-bold text-slate-800 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lifecycle Status</label>
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-100 rounded-2xl px-4 py-3 font-bold text-slate-800 outline-none appearance-none cursor-pointer">
                  <option value="PLANNING">Planning</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ON_HOLD">On Hold</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-300">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/10 rounded-2xl text-blue-400"><DollarSign size={24} /></div>
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Capital Allocation</h3>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Total Budget (ETB)</label>
              <input 
                type="number"
                // --- SANITIZATION LAYER 3: Input Keystrokes ---
                // We cast the string input to a Number immediately
                value={formData.projectBudget}
                onChange={(e) => setFormData({
                  ...formData, 
                  projectBudget: e.target.value === '' ? 0 : Number(e.target.value)
                })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-2xl font-black text-white focus:border-blue-500 focus:bg-white/10 outline-none transition-all"
                placeholder="0.00"
              />
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Audit Secure</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Financial modifications trigger a re-valuation event in the enterprise ledger.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectTable({ projects, isLoading, onEdit }) {
  if (isLoading) return (
    <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[2rem] border border-slate-100 gap-4">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Registry...</span>
    </div>
  );
  return (
    <div className="bg-white rounded-[1rem] border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100">
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Project Details</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {projects.map((p) => (
            <tr key={p._id || p.id} className="hover:bg-blue-50/20 transition-colors group">
              <td className="px-10 py-7">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"><Building2 size={20} /></div>
                  <div>
                    <div className="font-semibold text-slate-800 uppercase tracking-tight text-sm">{p.projectName}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-1"><MapPin size={10} className="text-blue-500" /> {p.location}</div>
                  </div>
                </div>
              </td>
              <td className="px-10 py-7"><span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200/50 uppercase">{p.clientName}</span></td>
              <td className="px-10 py-7">
                <div className="font-semibold text-slate-900 text-sm">ETB {Number(p.projectBudget).toLocaleString()}</div>
                <StatusChip status={p.status} />
              </td>
              <td className="px-10 py-7 text-right">
                <div className="flex justify-end gap-3">
                  <button onClick={() => onEdit(p)} className="p-3 bg-white text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm border border-slate-100 hover:border-blue-100"><Edit3 size={18} /></button>
                  <button className="p-3 bg-white text-slate-400 hover:text-rose-600 rounded-xl transition-all shadow-sm border border-slate-100 hover:border-rose-100"><Trash2 size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white p-8 rounded-[1rem] border border-slate-200 shadow-sm flex items-center gap-6">
      <div className="p-5 bg-slate-50 rounded-[1rem]">{icon}</div>
      <div>
        <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
        <div className="text-xl font-black text-slate-900 tracking-tight">{value}</div>
      </div>
    </div>
  );
}

function StatusChip({ status }) {
  const styles = {
    PLANNING: 'text-blue-600 bg-blue-50',
    ACTIVE: 'text-emerald-600 bg-emerald-50',
    COMPLETED: 'text-slate-500 bg-slate-50',
    ON_HOLD: 'text-amber-600 bg-amber-50'
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mt-2 ${styles[status] || styles.PLANNING}`}>
      <span className="w-1 h-1 rounded-full bg-current" />
      {status}
    </div>
  );
}