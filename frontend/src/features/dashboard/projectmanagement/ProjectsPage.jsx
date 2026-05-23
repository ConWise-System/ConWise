'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MoreVertical, Briefcase, Calendar, MapPin, 
  User, DollarSign, ArrowLeft, Loader2, AlertCircle 
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';
import Table from '../../../components/dashboard/Table';
import Loader from '../../../components/dashboard/Loader';


export default function ProjectPortfolio() {
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  // --- 1. Form State Management ---
  const [formData, setFormData] = useState({
    projectName: '',
    location: '',
    clientName: '',
    projectBudget: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- 2. API Integration ---
  const handleCreate = async (e) => {
    e.preventDefault();
    
    const budgetNum = Number(formData.projectBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      alert("Please enter a valid positive budget.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const payload = {
        projectName: formData.projectName,
        location: formData.location,
        clientName: formData.clientName,
        projectBudget: budgetNum,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };
  
      const response = await Axios({
        method: summeryApi.createProject.method,
        url: summeryApi.createProject.url,
        data: payload,
        withCredentials: true
      });
  
      const result = response.data;
  
      if (result.success) {
        alert("Project Initialized Successfully");
        setView('list');
        setFormData({ 
          projectName: '', 
          location: '', 
          clientName: '', 
          projectBudget: '', 
          startDate: '', 
          endDate: '' 
        });
      } else {
        alert(result.message || "Initialization failed");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        alert(`Validation Error: ${error.response.data.errors[0].message}`);
      } else {
        alert(error.response?.data?.message || "Internal Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await Axios({...summeryApi.getAllProjects});
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }finally{
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchProjects();
    }
  }, [view]);

  // --- 3. Table Column Schema Architecture Configuration ---
  const tableColumns = [
    {
      header: "No.",
      width: "50px",
      align: "center",
      // Use the absolute number context passed up from the base component iteration engine
      cell: (_, rowNumber) => (
        <span className="text-slate-400 font-bold font-mono">
          {rowNumber}
        </span>
      )
    },
    { 
      header: "Project Details", 
      accessor: "projectName",
      cell: (row) => (
        <div>
          <div className="text-slate-900 font-bold text-xs">{row.projectName}</div>
          <div className="text-[10px] text-slate-400 font-medium mt-0.5">ID: {row.id} • Client: {row.clientName}</div>
        </div>
      )
    },
    { 
      header: "Location", 
      accessor: "location" 
    },
    {
      header: "Operational Status",
      accessor: "status",
      cell: (row) => (
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
          {row.status}
        </span>
      )
    },
    { 
      header: "Allocated Budget", 
      accessor: "projectBudget",
      cell: (row) => {
        const value = Number(row.projectBudget);
        return (
          <span className="font-bold text-slate-900">
            {isNaN(value) ? "$0" : `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </span>
        );
      }
    },
    {
      header: "Action",
      align: "right",
      width: "60px",
      cell: (row) => (
        <button className="p-1.5 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-colors">
          <MoreVertical size={13} className="text-slate-400" />
        </button>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-[1300px] mx-auto space-y-6"
          >
            {/* Humanized, Clean Dashboard Header Area */}
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Project Directory</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">Overview and track active infrastructure development projects.</p>
              </div>
              <button 
                onClick={() => setView('create')}
                className="bg-slate-900 text-white px-4 py-3 rounded-lg text-xs font-bold transition-all hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} /> Create New Project
              </button>
            </div>

            {/* Global Reusable Table Call */}
            {isLoading ? (
              <Loader message="Loading system data..." />
            ) : (
              <Table 
                columns={tableColumns} 
                data={projects} 
                searchPlaceholder="Filter project records..." 
              />
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-[800px] mx-auto"
          >
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Return to Directory
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <h2 className="text-base font-bold text-slate-900 uppercase">Project Initialization</h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">Input specifications to establish a new managed system project record.</p>
              </div>

              <form onSubmit={handleCreate} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <InputGroup 
                    label="Project Name" name="projectName" placeholder="e.g. ASTU Lab Infrastructure Expansion" 
                    icon={<Briefcase size={13}/>} value={formData.projectName} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Geographic Location" name="location" placeholder="e.g. Adama" 
                    icon={<MapPin size={13}/>} value={formData.location} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Lead Client Organization" name="clientName" placeholder="e.g. ASTU Administration" 
                    icon={<User size={13}/>} value={formData.clientName} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Allocated Funding Budget" name="projectBudget" type="number" placeholder="0.00" 
                    icon={<DollarSign size={13}/>} value={formData.projectBudget} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Commencement Date" name="startDate" type="date" 
                    icon={<Calendar size={13}/>} value={formData.startDate} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Target Completion Date" name="endDate" type="date" 
                    icon={<Calendar size={13}/>} value={formData.endDate} onChange={handleInputChange} 
                  />
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 flex items-center gap-3">
                  <AlertCircle size={15} className="text-slate-500 shrink-0" />
                  <p className="text-[11px] font-medium text-slate-600">The system record will process initial parameter entries into active states automatically.</p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setView('list')} className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                  <button 
                    type="submit" disabled={isLoading}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={13} className="animate-spin" /> : "Save Project"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputGroup({ label, placeholder, icon, type = "text", name, value, onChange }) {
  return (
    <div className="space-y-1.5 text-left">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-700 transition-colors">
          {icon}
        </div>
        <input 
          required
          name={name}
          value={value||''}
          onChange={onChange}
          type={type} 
          placeholder={placeholder}
          className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}