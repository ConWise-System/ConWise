"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, Edit3, MapPin, Building2, Plus, 
  Trash2, Calendar, DollarSign, Search, 
  ArrowLeft, Target, Clock, ShieldCheck, 
  Briefcase, Loader2, ChevronDown, CheckCircle2, AlertCircle
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';
import Table from '../../../components/dashboard/Table';

export default function ProjectManagementSystem() {
  const [view, setView] = useState('list'); 
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // --- FETCH PROJECTS ---
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
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // --- SAVE / UPDATE PROJECT ---
  const saveProject = async (data) => {
    try {
      const isEdit = !!editingProject;
      const config = isEdit ? summeryApi.updateProject : summeryApi.createProject;
      
      const payload = {
        ...data,
        projectBudget: Number(data.projectBudget || 0)
      };

      const response = await Axios({
        ...config,
        url: isEdit ? `${config.url}/${editingProject._id || editingProject.id}` : config.url,
        data: payload,
      });

      if (response.data.success) {
        await fetchProjects();
        setView('list');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Operational Failure");
    }
  };

  // --- SEARCH LOGIC ---
  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  // --- METRIC STATS ---
  const stats = useMemo(() => ({
    total: projects.length,
    budget: projects.reduce((acc, p) => acc + (Number(p.projectBudget) || 0), 0),
    planning: projects.filter(p => p.status === 'PLANNING').length
  }), [projects]);

  // --- REUSABLE TABLE COLUMNS CONFIGURATION ---
  const columns = [
    {
      header: "Project Details",
      accessor: "projectName",
      cell: (row) => (
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/40">
            <Building2 size={14} />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 block text-xs truncate uppercase">{row.projectName}</span>
            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 block truncate">
              <MapPin size={10} className="text-slate-400" /> {row.location || "No location configured"}
            </span>
          </div>
        </div>
      )
    },
    {
      header: "Client / Stakeholder",
      accessor: "clientName",
      cell: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
          {row.clientName}
        </span>
      )
    },
    {
      header: "Financial Valuation",
      accessor: "projectBudget",
      cell: (row) => (
        <span className="font-mono text-xs font-bold text-slate-900">
          ETB {Number(row.projectBudget || 0).toLocaleString()}
        </span>
      )
    },
    {
      header: "Lifecycle Status",
      accessor: "status",
      align: "center",
      width: "140px",
      cell: (row) => {
        const status = row.status || 'PLANNING';
        const styles = {
          PLANNING: 'bg-blue-50 text-blue-700 border-blue-100',
          ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          COMPLETED: 'bg-slate-50 text-slate-600 border-slate-100',
          ON_HOLD: 'bg-amber-50 text-amber-700 border-amber-100'
        };
        const dotStyles = {
          PLANNING: 'bg-blue-500',
          ACTIVE: 'bg-emerald-500 animate-pulse',
          COMPLETED: 'bg-slate-400',
          ON_HOLD: 'bg-amber-500'
        };

        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-tight ${styles[status] || styles.PLANNING}`}>
            <span className={`w-1 h-1 rounded-full ${dotStyles[status] || dotStyles.PLANNING}`} />
            {status.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      header: "Actions",
      align: "right",
      width: "100px",
      cell: (row) => (
        <div className="flex justify-end gap-1.5 text-slate-400" onClick={(e) => e.stopPropagation()}>
          <button 
            onClick={() => { setEditingProject(row); setView('form'); }}
            className="p-1.5 hover:bg-slate-100 rounded border border-slate-200/60 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <Edit3 size={12}/>
          </button>
          <button className="p-1.5 hover:bg-rose-50 rounded border border-slate-200/60 hover:text-rose-600 hover:border-rose-100 transition-colors shadow-2xs">
            <Trash2 size={12}/>
          </button>
        </div>
      )
    }
  ];

  if (view === 'form') return (
    <ProjectForm 
      initialData={editingProject} 
      onSave={saveProject} 
      onCancel={() => setView('list')} 
    />
  );

  return (
    <div className="p-4 md:p-8 max-w-[1300px] mx-auto space-y-6 text-left">
      {/* --- HEADER --- */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl tracking-tight text-slate-900 uppercase font-bold">Project Portfolio</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage corporate operational scopes, capital allocation framework, and timelines.</p>
        </div>
        <button 
          onClick={() => { setEditingProject(null); setView('form'); }} 
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
        >
          <Plus size={14} /> New Project
        </button>
      </header>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Monitored Projects" value={stats.total} icon={<Briefcase size={14}/>} />
        <MetricCard label="Aggregate Asset Budget" value={`ETB ${stats.budget.toLocaleString()}`} icon={<DollarSign size={14}/>} />
        <MetricCard label="Planning Status Queue" value={stats.planning} icon={<Clock size={14}/>} />
      </div>

      {/* --- CONTROLS --- */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" placeholder="Search project attributes..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/50 rounded-lg text-xs font-medium outline-none focus:bg-white focus:border-slate-300 transition-all text-slate-800"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* --- CENTRALIZED TABLE INTERACTION LAYER --- */}
      {isLoading ? (
        <div className="w-full min-h-[350px] flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader2 size={24} className="animate-spin text-slate-700" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loading Project Registry...</span>
        </div>
      ) : (
        <Table 
          columns={columns}
          data={filteredProjects}
          searchPlaceholder="Filter project entities..."
        />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function ProjectForm({ initialData, onSave, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    projectName: initialData?.projectName || '',
    location: initialData?.location || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    clientName: initialData?.clientName || '',
    projectBudget: initialData?.projectBudget ? Number(initialData.projectBudget) : 0,
    status: initialData?.status || 'PLANNING'
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.projectName.trim()) newErrors.projectName = "Project identification required";
    if (!formData.clientName.trim()) newErrors.clientName = "Stakeholder identity required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-[#F8FAFC] flex items-center justify-center text-left">
      <div className="w-full max-w-5xl bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div>
                <button 
                  onClick={onCancel} 
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors text-[10px] uppercase font-bold tracking-wider mb-2"
                >
                  <ArrowLeft size={12} /> Return Back
                </button>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  <Briefcase size={16} className="text-slate-900" /> Project Creation Module
                </h2>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">Configure Company Project</p>
              </div>
              <button 
                onClick={onCancel} 
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors text-slate-400 hover:text-slate-900"
              >
                <X size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputGroup 
                label="Official Project Name" 
                value={formData.projectName} 
                onChange={(v) => handleChange('projectName', v)} 
                error={errors.projectName}
                icon={<Target size={13} />} 
              />
              <InputGroup 
                label="Client / Stakeholder Entity" 
                value={formData.clientName} 
                onChange={(v) => handleChange('clientName', v)} 
                error={errors.clientName}
                icon={<Building2 size={13} />} 
              />
              <InputGroup 
                label="Geographical Location" 
                value={formData.location} 
                onChange={(v) => handleChange('location', v)} 
                icon={<MapPin size={13} />} 
              />
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lifecycle Status</label>
                <div className="relative">
                  <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                  <select 
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs outline-none focus:border-slate-400 focus:bg-white appearance-none cursor-pointer text-slate-800 transition-all"
                  >
                    <option value="PLANNING">Planning Phase</option>
                    <option value="ACTIVE">Active Deployment</option>
                    <option value="COMPLETED">Completed Lifecycle</option>
                    <option value="ON_HOLD">Operational Hold</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <InputGroup 
                label="Commencement Date" 
                value={formData.startDate?.split('T')[0]} 
                onChange={(v) => handleChange('startDate', v)} 
                type="date"
                icon={<Calendar size={13} />} 
              />
              <InputGroup 
                label="Completion Target" 
                value={formData.endDate?.split('T')[0]} 
                onChange={(v) => handleChange('endDate', v)} 
                type="date"
                icon={<Calendar size={13} />} 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-end p-4 bg-slate-50 border border-slate-200/60 rounded-xl mt-6">
            <div className="flex gap-2 w-full sm:w-auto shrink-0">
              <button 
                onClick={onCancel} 
                disabled={loading} 
                className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg font-bold text-xs hover:bg-slate-50 hover:text-slate-800 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 sm:flex-none px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm transition-all disabled:bg-slate-400 active:scale-[0.99] flex items-center justify-center gap-2"
              >
                {loading ? "Processing Registry..." : "Commit Project"}
              </button>
            </div>
          </div>
        </div>

        {/* --- CAPITAL ALLOCATION SIDE PANEL --- */}
        <div className="w-full lg:w-64 bg-slate-900 p-6 flex flex-col justify-between items-center text-center text-white border-t lg:border-t-0 lg:border-l border-slate-800 relative">
          <div className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-700 select-none font-mono">FIN_LEDGER_V1</div>

          <div className="space-y-4 w-full my-auto z-10">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 mx-auto text-slate-400">
              <DollarSign size={20} />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">Capital Allocation (ETB)</label>
              <input 
                type="number"
                value={formData.projectBudget}
                onChange={(e) => handleChange('projectBudget', e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-lg font-mono font-bold text-center text-white focus:border-slate-500 focus:bg-white/10 outline-none transition-all"
                placeholder="0"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 w-full hidden lg:block">
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-medium tracking-tight text-slate-500">
              <CheckCircle2 size={10} className="text-slate-500" /> Audit Registry Secured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SYSTEM INPUT GROUP ---
function InputGroup({ label, value, onChange, type = "text", placeholder, icon, error }) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        {error && (
          <span className="text-[10px] font-semibold text-rose-500 flex items-center gap-1 animate-in fade-in duration-100">
            <AlertCircle size={10} /> {error}
          </span>
        )}
      </div>
      <div className="relative">
        {icon && (
          <div className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rose-400' : 'text-slate-400'}`}>
            {icon}
          </div>
        )}
        <input 
          type={type} 
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? 'pl-9' : 'px-3'} pr-3 py-2.5 bg-white border rounded-lg font-semibold text-xs outline-none transition-all text-slate-800 ${
            error 
              ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/10' 
              : 'border-slate-200 bg-slate-50/30 focus:border-slate-400 focus:bg-white'
          }`} 
        />
      </div>
    </div>
  );
}

// --- METRIC DISPLAY CARD ---
function MetricCard({ label, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <span className="text-base font-bold tracking-tight text-slate-900 block">{value}</span>
      </div>
      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400">{icon}</div>
    </div>
  );
}