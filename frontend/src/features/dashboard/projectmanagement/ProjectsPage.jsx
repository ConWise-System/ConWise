'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MoreVertical, Briefcase, Filter, ChevronRight, 
  Calendar, MapPin, User, DollarSign, ArrowLeft, Loader2, AlertCircle 
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';

export default function ProjectPortfolio() {
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([])

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
    
    // 1. Precise Frontend Validation
    const budgetNum = Number(formData.projectBudget);
    if (isNaN(budgetNum) || budgetNum <= 0) {
      alert("Please enter a valid positive budget.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // 2. Explicit Payload (No spread operator)
      const payload = {
        projectName: formData.projectName,
        location: formData.location,
        clientName: formData.clientName,
        projectBudget: budgetNum, // Guaranteed to be a Number
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      };
  
      console.log("Sending Payload:", payload); // Verify in console that it's a number, not string
  
      const response = await Axios({
        method: summeryApi.createProject.method,
        url: summeryApi.createProject.url,
        data: payload,
        withCredentials: true // Ensure session/cookies are sent
      });
  
      const result = response.data;
  
      if (result.success) {
        alert("Project Initialized Successfully");
        setView('list');
        // Fix the state reset keys to match your state definition
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
        error.response.data.errors.forEach(err => {
          // Zod paths are arrays, join them to read them easily
          console.error("FIELD:", err.path?.join('.') || "Unknown");
          console.error("MESSAGE:", err.message);
        });
        alert(`Validation Error: ${error.response.data.errors[0].message}`);
      } else {
        console.error("General Error:", error);
        alert(error.response?.data?.message || "Internal Server Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await Axios({...summeryApi.getAllProjects}); // Adjust to your actual GET endpoint
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      fetchProjects();
    }
  }, [view]);

  return (
    <div className="w-full min-h-screen bg-[#F3F4F6] text-[#111827] font-sans antialiased p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div 
            key="list" initial="hidden" animate="visible" exit={{ opacity: 0, y: -10 }}
            className="max-w-[1300px] mx-auto space-y-6"
          >
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-black tracking-tight uppercase leading-none">Project Management</h1>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mt-1 opacity-70">Industrial & Infrastructure Assets</p>
              </div>
              <button 
                onClick={() => setView('create')}
                className="bg-[#111827] text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all"
              >
                <Plus size={14} className="inline mr-1" /> New Project
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden">
  {projects.length > 0 ? (
    <table className="w-full text-left border-collapse">
      <thead className="bg-slate-50 border-b border-slate-100">
        <tr>
          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Project Name</th>
          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Budget</th>
          <th className="p-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((proj,index) => (
          <tr key={proj.id || index} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
            <td className="p-5 text-sm font-bold text-slate-800">{proj.projectName}</td>
            <td className="p-5 text-xs text-slate-500 font-medium">{proj.location}</td>
            <td className="p-5 text-xs font-black text-blue-600">
              ${proj.projectBudget?.toLocaleString()}
            </td>
            <td className="p-5 text-right">
              <button className="p-2 hover:bg-white rounded-lg transition-all shadow-sm">
                <MoreVertical size={14} className="text-slate-400" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="p-20 text-center">
       <p className="text-slate-400 text-xs font-bold uppercase italic">No industrial assets found in database.</p>
    </div>
  )}
</div>
          </motion.div>
        ) : (
          <motion.div 
            key="create" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="max-w-[800px] mx-auto"
          >
            <button 
              onClick={() => setView('list')}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Return to Portfolio
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Project Initialization</h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Fill in the technical specifications below</p>
              </div>

              <form onSubmit={handleCreate} className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <InputGroup 
                    label="Project Identity" name="projectName" placeholder="e.g. Neo-Industrial Hub" 
                    icon={<Briefcase size={14}/>} value={formData.projectName} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Geographic Location" name="location" placeholder="City, Country" 
                    icon={<MapPin size={14}/>} value={formData.location} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Lead Client" name="clientName" placeholder="Corporation Name" 
                    icon={<User size={14}/>} value={formData.clientName} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Allocated Budget" name="projectBudget" type="number" placeholder="0.00" 
                    icon={<DollarSign size={14}/>} value={formData.projectBudget} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Commencement" name="startDate" type="date" 
                    icon={<Calendar size={14}/>} value={formData.startDate} onChange={handleInputChange} 
                  />
                  <InputGroup 
                    label="Target Completion" name="endDate" type="date" 
                    icon={<Calendar size={14}/>} value={formData.endDate} onChange={handleInputChange} 
                  />
                </div>

                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600"><AlertCircle size={16}/></div>
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-tight">System will perform automatic fiscal risk assessment upon submission.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setView('list')} className="px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50">Cancel</button>
                  <button 
                    type="submit" disabled={isLoading}
                    className="bg-[#111827] text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Initialize Site"}
                    <ChevronRight size={14} />
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
    <div className="space-y-2 text-left">
      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
          {icon}
        </div>
        <input 
          required
          name={name}
          value={value||''}
          onChange={onChange}
          type={type} 
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}