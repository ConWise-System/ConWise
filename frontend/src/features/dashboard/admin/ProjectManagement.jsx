"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, Edit3, ChevronRight, MapPin, Building2, Plus, 
  Trash2, Eye, Briefcase, Calendar, DollarSign, 
  Search, ArrowLeft, Target, HardHat, TrendingUp,AlertCircle,ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Axios from '../../../../utils/Axios';
import summeryApi from '@/common/summeryApi';

// --- INITIAL DATA ---
const INITIAL_PROJECTS = [
  {
    id: 1,
    projectName: 'Adama Office Complex',
    location: 'Adama, Ethiopia',
    startDate: '2026-04-14',
    endDate: '2026-12-31',
    clientName: 'ABC Construction PLC',
    projectBudget: 5000000,
    status: 'PLANNING',
    priority: 'HIGH'
  }
];

export default function ProjectManagementSystem() {
  const [view, setView] = useState('list'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(false);


  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await Axios({
        ...summeryApi.getProjects // Assuming this exists in your summeryApi
      });
      console.log(response.data.success)
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- 2. CREATE / UPDATE PROJECT ---
  const saveProject = async (projectData) => {
    try {
      const isEditing = !!editingProject;
      const sanitizedData = {
        ...projectData,
        // 1. Ensure budget is a number (or 0 if empty)
        projectBudget: Number(projectData.projectBudget) || 0,
        
        // 2. Convert empty strings to null for PostgreSQL DATE compatibility
        startDate: projectData.startDate === "" ? null : projectData.startDate,
        endDate: projectData.endDate === "" ? null : projectData.endDate,
      };
      // Select the correct API configuration
      const config = isEditing 
        ? summeryApi.updateProject // Make sure to define this in summeryApi
        : summeryApi.createProject;

      const response = await Axios({
        ...config,
        url: isEditing ? `${config.url}/${editingProject._id}` : config.url,
        data: projectData,
      });

      if (response.data.success) {
        // Refresh list from server for accuracy
        await fetchProjects();
        setView('list');
        setEditingProject(null);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Operation failed";
      alert(msg);
    }
  };
  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, projects]);

  const handleCreateNew = () => {
    setEditingProject(null);
    setView('form');
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setView('form');
  };

  const handleDelete = async(id) => {
    setProjects(projects.filter(p => p.id !== id));
    try{
      const response = await Axios({
        ...summeryApi.deleteProject,
        url: `${summeryApi.deleteProject.url}/${id}`
      });
      if (response.data.success) {
        // 3. Update UI State (Remove from the list)
        console.log('successfully deleted!')
        setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
      }
    }catch(error){
      console.error("Deletion Protocol Failed:", error);
    }
  };

  
  
  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 font-sans antialiased p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }}>
            <ProjectRegistry 
              projects={filteredProjects} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onCreate={handleCreateNew} 
              onEdit={handleEdit} 
              onDelete={handleDelete}
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

// --- TABLE VIEW COMPONENT ---
function ProjectRegistry({ projects, searchTerm, setSearchTerm, onCreate, onEdit, onDelete, onView }) {
  const [deleteTarget, setDeleteTarget] = useState(null); // Stores the project object
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDeletion = async () => {
    if (!deleteTarget) return;
  
    const idToPurge = deleteTarget.id; // Capture ID immediately
    setIsDeleting(true);
  
    try {
      const response = await Axios({
        method: summeryApi.deleteProject.method,
        url: `${summeryApi.deleteProject.url}/${idToPurge}`,
      });
  
      if (response.data.success) {
        // 1. CLEAR THE MODAL FIRST
        setDeleteTarget(null); 
        
        // 2. THEN UPDATE THE LIST
        setProjects(prev => prev.filter(p => p.id !== idToPurge));
        
        console.log("Registry updated: Project purged.");
      }
    } catch (error) {
      console.error("Purge Protocol Failed", error);
      // If it fails, we still want to close the modal and stop the loading state
      setDeleteTarget(null);
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
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
            Project <span className="text-slate-400 italic font-medium tracking-normal">Vault</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search registry (Name, Client, Site)..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all shadow-sm" 
            />
          </div>
          <button onClick={onCreate} className="bg-[#0F172A] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/10">
            <Plus size={16} strokeWidth={3} /> New Deployment
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-8 py-5 bg-slate-50/50 border-b border-slate-100">
           <div className="col-span-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset & Identity</div>
           <div className="col-span-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Stakeholder</div>
           <div className="col-span-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Valuation</div>
           <div className="col-span-3 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Operational Status</div>
        </div>
        
        <div className="divide-y divide-slate-50">
          {projects.length > 0 ? projects.map((p) => (
            <div key={p.id} className="grid grid-cols-12 px-8 py-6 items-center hover:bg-blue-50/30 transition-colors group">
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
                  <button onClick={() => onView(p)} className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"><Eye size={16}/></button>
                  <button onClick={() => onEdit(p)} className="p-2.5 text-slate-300 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none hover:shadow-sm"><Edit3 size={16}/></button>
                  <button 
                    onClick={() => setDeleteTarget(p)} // Pass the whole project object
                    className="p-1.5 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center space-y-2">
              <p className="text-slate-300 font-black uppercase text-[10px] tracking-[0.3em]">No project records detected</p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setDeleteTarget(null)} 
          />
          
              {/* Modal Content */}
              <div className="relative bg-white w-full max-w-md rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-rose-100">
                    <AlertCircle size={32} />
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                    Confirm <span className="text-rose-500">Deletion</span>
                  </h3>
                  
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-2 px-4">
                    You are about to deleting <span className="font-black text-slate-900">"{deleteTarget.projectName}"</span> from the registry. This action will revoke all associated access nodes and cannot be undone.
                  </p>

                  <div className="mt-8 flex gap-3">
                    <button 
                      onClick={() => setDeleteTarget(null)}
                      className="flex-1 px-6 py-3 bg-slate-50 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={confirmDeletion}
                      disabled={isDeleting}
                      className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50"
                    >
                      {isDeleting ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
                
                {/* Visual Branding Footer */}
                <div className="bg-slate-50 px-8 py-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Sovereign Auth Control</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 rounded-full bg-rose-500" />
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          )}
    </div>
  );
}

// --- PROJECT FORM COMPONENT ---
function ProjectForm({ initialData, onSave, onCancel }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(initialData || {
    projectName: '',
    location: '',
    startDate: '',
    endDate: '',
    clientName: '',
    projectBudget: 0,
    status: 'PLANNING',
    priority: 'MEDIUM'
  });

  const handleCommit = async () => {
    setSubmitting(true);
    await onSave(formData);
    setSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto py-4 space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <button onClick={onCancel} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all">
            <ArrowLeft size={14} /> Back to Registry
          </button>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            {initialData ? 'Update' : 'New'} <span className="text-blue-600 italic underline decoration-slate-200 underline-offset-8">Record</span>
          </h1>
        </div>
        <div className="flex gap-3">
            <button onClick={onCancel} className="px-6 py-3.5 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50">Discard</button>
            <button 
  // 1. Prevents duplicate API calls while the request is in flight
  disabled={submitting}
  
  // 2. Calls the async wrapper that handles the Axios request
  onClick={handleCommit} 
  
  // 3. Added 'disabled:bg-slate-400' and 'disabled:cursor-not-allowed' for better UX
  className="px-10 py-3.5 bg-[#0F172A] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-2"
>
  {/* 4. Dynamic feedback: Shows "Processing..." and optionally a spinner icon */}
  {submitting ? (
    <>
      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      Processing...
    </>
  ) : (
    "Commit Project"
  )}
</button>
          
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={12}/> Project Identity</label>
              <input 
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                placeholder="e.g. Bole Road Expansion" 
                className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[14px] font-bold outline-none focus:ring-4 focus:ring-blue-50 transition-all border-none" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Building2 size={12}/> Client Entity</label>
                  <input 
                    value={formData.clientName}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder="Company Name" 
                    className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[13px] font-bold outline-none border-none" 
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><MapPin size={12}/> Site Location</label>
                  <input 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="City, Region" 
                    className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[13px] font-bold outline-none border-none" 
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12}/> Start Date</label>
                  <input 
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[13px] font-bold outline-none border-none" 
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Target size={12}/> Completion Deadline</label>
                  <input 
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full bg-slate-50 rounded-2xl px-6 py-4 text-[13px] font-bold outline-none border-none" 
                  />
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-b pb-4">Financial Protocol</h4>
            <div className="space-y-3">
               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><DollarSign size={12}/> Capital Budget (ETB)</label>
               <input 
                type="number"
                value={formData.projectBudget}
                onChange={(e) => setFormData({...formData, projectBudget: Number(e.target.value)})}
                className="w-full bg-blue-50/50 rounded-2xl px-6 py-4 text-[18px] font-black text-blue-600 outline-none border-none" 
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] border-b pb-4">Priority & Phase</h4>
            <div className="space-y-4">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Operational Criticality</label>
              <div className="flex flex-wrap gap-2">
                {['LOW', 'MEDIUM', 'HIGH', 'URGENT'].map(p => (
                  <button 
                    key={p}
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black transition-all ${formData.priority === p ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function StatusBadge({ status }) {
  const styles = {
    'PLANNING': 'bg-blue-600 text-white border-blue-600',
    'ACTIVE': 'bg-emerald-500 text-white border-emerald-500',
    'COMPLETED': 'bg-[#0F172A] text-white border-slate-900',
    'ON HOLD': 'bg-amber-100 text-amber-600 border-amber-200',
  };
  return <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase italic tracking-tighter shadow-sm ${styles[status] || 'bg-slate-100'}`}>{status}</span>;
}

function ViewProjectModal({ project, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20">
        <div className="p-10 bg-[#0F172A] text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black uppercase tracking-tight">{project.projectName}</h3>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">Operational Data Sheet</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-2xl transition-all relative z-10"><X size={24}/></button>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Building2 size={200} />
          </div>
        </div>
        <div className="p-12 grid grid-cols-2 gap-10">
          <DetailBlock label="Principal Client" value={project.clientName} icon={<HardHat size={14}/>}/>
          <DetailBlock label="Financial Allocation" value={`ETB ${Number(project.projectBudget).toLocaleString()}`} icon={<DollarSign size={14}/>}/>
          <DetailBlock label="Geographic Site" value={project.location} icon={<MapPin size={14}/>}/>
          <DetailBlock label="Status" value={project.status} icon={<TrendingUp size={14}/>}/>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailBlock({ label, value, icon }) {
  return (
    <div className="space-y-2">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">{icon} {label}</span>
      <p className="text-[16px] font-black text-slate-900 uppercase italic tracking-tight">{value}</p>
    </div>
  );
}