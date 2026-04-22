"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Edit3, ChevronRight, MapPin, Building2, Plus, 
  Trash2, Eye, Briefcase, Calendar, DollarSign, 
  Search, ArrowLeft, Target, HardHat, TrendingUp, AlertCircle, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from '../../../../utils/Axios';
import summeryApi from '@/common/summeryApi';

export default function ProjectManagementSystem() {
  const [view, setView] = useState('list'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA ---
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({ ...summeryApi.getProjects });
      if (response.data.success) {
        // Adjusting based on common API wrapper patterns
        setProjects(response.data.data.projects || response.data.data || []);
      }
    } catch (error) {
      console.error("Registry Protocol: Fetch Failed", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- PERSIST DATA ---
  const saveProject = async (projectData) => {
    try {
      const isEditing = !!editingProject;
      const config = isEditing ? summeryApi.updateProject : summeryApi.createProject;

      const response = await Axios({
        ...config,
        url: isEditing ? `${config.url}/${editingProject._id || editingProject.id}` : config.url,
        data: projectData,
      });

      if (response.data.success) {
        await fetchProjects();
        setView('list');
        setEditingProject(null);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Operational Failure");
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, projects]);

  const handleEdit = (project) => {
    setEditingProject(project);
    setView('form');
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans antialiased p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
            <ProjectRegistry 
              projects={filteredProjects} 
              isLoading={isLoading}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onCreate={() => { setEditingProject(null); setView('form'); }} 
              onEdit={handleEdit} 
              onDeleteSuccess={fetchProjects}
              onView={setSelectedProject}
            />
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <ProjectForm 
              initialData={editingProject} 
              onSave={saveProject} 
              onCancel={() => setView('list')} 
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ViewProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectRegistry({ projects, isLoading, searchTerm, setSearchTerm, onCreate, onEdit, onDeleteSuccess, onView }) {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeletion = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const id = deleteTarget._id || deleteTarget.id;
      const response = await Axios({
        ...summeryApi.deleteProject,
        url: `${summeryApi.deleteProject.url}/${id}`,
      });
      if (response.data.success) {
        setDeleteTarget(null);
        onDeleteSuccess();
      }
    } catch (error) {
      console.error("Purge Protocol Failed", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <nav className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-blue-600 mb-1">
            <span>Portfolio</span> <ChevronRight size={10} strokeWidth={3} /> <span className="text-slate-400">Inventory Management</span>
          </nav>
          <h1 className="text-3xl tracking-tight text-slate-900 uppercase font-bold">Registry Nodes</h1>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by Asset, Client, or Site..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm" 
            />
          </div>
          <button onClick={onCreate} className="bg-[#0F172A] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/10">
            <Plus size={16} strokeWidth={3} /> Deploy Asset
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-100">
           <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset Identity</div>
           <div className="col-span-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Stakeholder</div>
           <div className="col-span-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Valuation</div>
           <div className="col-span-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operational Status</div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {isLoading ? (
            [1, 2, 3].map(n => <SkeletonRow key={n} />)
          ) : projects.length > 0 ? projects.map((p) => (
            <div key={p._id || p.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-50/30 transition-colors group">
              <div className="col-span-4 space-y-1">
                <h4 className="font-black text-slate-800 text-[14px] tracking-tight group-hover:text-blue-600 transition-colors uppercase">{p.projectName}</h4>
                <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold tracking-tighter uppercase italic">
                  <MapPin size={10} className="text-blue-500" /> {p.location}
                </div>
              </div>
              <div className="col-span-3">
                <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">{p.clientName}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[13px] font-black text-slate-900">ETB {Number(p.projectBudget).toLocaleString()}</span>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Capital Allocated</p>
              </div>
              <div className="col-span-3 flex justify-end items-center gap-4">
                <StatusBadge status={p.status} />
                <div className="flex gap-1">
                  <button onClick={() => onView(p)} className="p-2 text-slate-300 hover:text-blue-600 transition-all"><Eye size={16}/></button>
                  <button onClick={() => onEdit(p)} className="p-2 text-slate-300 hover:text-amber-600 transition-all"><Edit3 size={16}/></button>
                  <button onClick={() => setDeleteTarget(p)} className="p-2 text-slate-300 hover:text-rose-600 transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center opacity-40">
              <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">No project records detected</p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTarget(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-2xl overflow-hidden">
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
                  <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Confirm <span className="text-rose-500">Purge</span></h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 px-4">
                  Confirming will permanently remove <span className="font-black text-slate-900">"{deleteTarget.projectName}"</span> and all associated dependencies from the master registry.
                </p>
                <div className="mt-8 flex gap-3">
                  <button onClick={() => setDeleteTarget(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all">Abort</button>
                  <button onClick={confirmDeletion} disabled={isDeleting} className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50">
                    {isDeleting ? "Purging..." : "Confirm Purge"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProjectForm({ initialData, onSave, onCancel }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    projectName: '', location: '', startDate: '', endDate: '',
    clientName: '', projectBudget: 0, status: 'PLANNING', priority: 'MEDIUM'
  });

  const handleCommit = async () => {
    if (!formData.projectName || !formData.clientName) return alert("Required Identity Missing");
    setSubmitting(true);
    await onSave(formData);
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <button onClick={onCancel} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all">
            <ArrowLeft size={14} /> Return to Inventory
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {initialData ? 'Modify' : 'New'} <span className="text-blue-600 italic underline decoration-slate-200 underline-offset-8">Asset</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Discard</button>
          <button 
            disabled={submitting} 
            onClick={handleCommit} 
            className="px-10 py-3.5 bg-[#0F172A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all disabled:bg-slate-400 flex items-center gap-2"
          >
            {submitting ? "Committing..." : "Commit Asset"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
          <div className="space-y-3">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={12}/> Project Identity</label>
            <input value={formData.projectName} onChange={(e) => setFormData({...formData, projectName: e.target.value})} placeholder="e.g. Adama Logistics Hub" className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[14px] font-bold border-none outline-none focus:ring-4 focus:ring-blue-50 transition-all" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Entity</label>
                <input value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[13px] font-bold border-none outline-none" />
             </div>
             <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Location</label>
                <input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[13px] font-bold border-none outline-none" />
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F172A] p-8 rounded-[2.5rem] text-white space-y-6 shadow-xl">
            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] border-b border-white/10 pb-4">Financials</h4>
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Capital Budget (ETB)</label>
              <input type="number" value={formData.projectBudget} onChange={(e) => setFormData({...formData, projectBudget: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[20px] font-black text-white outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---
function StatusBadge({ status }) {
  const styles = {
    'PLANNING': 'bg-blue-600 text-white',
    'ACTIVE': 'bg-emerald-500 text-white',
    'COMPLETED': 'bg-slate-900 text-white',
  };
  return <span className={`px-4 py-1 rounded-xl text-[8px] font-black uppercase tracking-tighter ${styles[status] || 'bg-slate-200 text-slate-600'}`}>{status}</span>;
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 px-8 py-6 items-center animate-pulse">
      <div className="col-span-4 space-y-2"><div className="h-4 bg-slate-100 rounded w-48" /><div className="h-2 bg-slate-50 rounded w-24" /></div>
      <div className="col-span-3"><div className="h-6 bg-slate-50 rounded-lg w-32" /></div>
      <div className="col-span-2"><div className="h-4 bg-slate-100 rounded w-20" /></div>
      <div className="col-span-3 flex justify-end gap-2"><div className="h-8 w-8 bg-slate-50 rounded-lg" /><div className="h-8 w-8 bg-slate-50 rounded-lg" /></div>
    </div>
  );
}

function ViewProjectModal({ project, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden">
        <div className="p-8 bg-[#0F172A] text-white flex justify-between items-center">
          <div><h3 className="text-xl font-black uppercase tracking-tight">{project.projectName}</h3><p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1">Registry Record Details</p></div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all"><X size={20}/></button>
        </div>
        <div className="p-10 grid grid-cols-2 gap-8">
          <DetailBlock label="Principal Client" value={project.clientName} />
          <DetailBlock label="Financial Allocation" value={`ETB ${Number(project.projectBudget).toLocaleString()}`} />
          <DetailBlock label="Geographic Site" value={project.location} />
          <DetailBlock label="Phase" value={project.status} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailBlock({ label, value }) {
  return (
    <div className="space-y-1">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <p className="text-[14px] font-black text-slate-900 uppercase tracking-tight">{value}</p>
    </div>
  );
}