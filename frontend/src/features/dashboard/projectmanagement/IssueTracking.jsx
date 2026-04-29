'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, ArrowUpRight, Zap, ArrowLeft,
  Camera, Loader2, Image as ImageIcon, Plus, Filter
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';
import axios from 'axios';

export default function IssueTracking() {
  const [view, setView] = useState('ledger'); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(""); // Stores PostgreSQL ID (int or uuid)
  const [images, setImages] = useState([]); 
  const fileInputRef = useRef(null);

  // --- DATA LOADING ---
  const loadProjects = async () => {
    try {
      const res = await Axios({...summeryApi.getAllProjects});
      // PostgreSQL typically returns rows in a 'data' array
      const projects = res.data.data || res.data;
      setProjectList(Array.isArray(projects) ? projects : []);
    } catch (error) {
      console.error("Failed to load projects:", error);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    location: '',
    photoUrls: [],
    blockedTaskId: null
  });

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'blockedTaskId' ? (value ? Number(value) : null) : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (images.length + files.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    setIsProcessing(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const data = new FormData();
        data.append('file', file);
        const response = await Axios({
          ...summeryApi.uploadImage,
          data: data,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.data.success) {
          uploadedUrls.push(response.data.url);
        }
      }
      setImages(prev => [...prev, ...uploadedUrls]);
      setFormData(prev => ({
        ...prev,
        photoUrls: [...prev.photoUrls, ...uploadedUrls]
      }));
    } catch (error) {
      alert("Image upload failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProjectId) {
      alert("Please select a Target Project.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const response = await Axios({
        // 1. Call the function to get the dynamic URL: /api/projects/10/issues
        url: summeryApi.createIssue.url(selectedProjectId), 
        method: summeryApi.createIssue.method,
        data: formData
      });

      if (response.data.success) {
        alert("Anomaly Transmitted Successfully");
        setFormData({
          title: '', description: '', priority: 'MEDIUM',
          location: '', photoUrls: [], blockedTaskId: null
        });
        setImages([]);
        setSelectedProjectId("");
        setView('ledger');
      }
    } catch (error) {
      console.error("Attempted URL:", error.config?.url);
      console.error("Status:", error.response?.status);
      
      const message = error.response?.data?.message || "Transmission failed.";
      alert(`Status ${error.response?.status || 'Network'}: ${message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 text-slate-900">
      <AnimatePresence mode="wait">
        {view === 'ledger' ? (
          <motion.div key="ledger" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1300px] mx-auto space-y-6 text-left">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Risk Management</p>
                <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">Issue Tracking</h1>
              </div>
              <button onClick={() => setView('report')} className="bg-[#111827] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all">
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
                      onClick={() => setView('report')}
                    />
                  </tbody>
              </table>
            </div>
          </motion.div>
        ) : view === 'report' ? (
          <motion.div key="report" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-[700px] mx-auto text-left">
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
                {/** PROJECT DROPDOWN (PostgreSQL id) */}
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Target Project</label>
                  <select 
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-xl text-[11px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
                  >
                    <option value="">Choose Project...</option>
                    {projectList.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.projectName || p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Photo Evidence ({images.length}/4)</label>
                     {isProcessing && <Loader2 size={12} className="animate-spin text-blue-600" />}
                  </div>
                  
                  <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" disabled={isProcessing} />
                  
                  <div className="grid grid-cols-4 gap-3">
                    <div 
                      onClick={() => !isProcessing && fileInputRef.current.click()}
                      className={`col-span-2 aspect-video border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 group hover:border-blue-400 transition-all cursor-pointer overflow-hidden ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {images[0] ? <img src={images[0]} className="w-full h-full object-cover" alt="p" /> : <Camera size={24} className="text-slate-300" />}
                    </div>
                    {images.slice(1).map((img, i) => (
                      <div key={i} className="aspect-square border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <img src={img} className="w-full h-full object-cover" alt="sub" />
                      </div>
                    ))}
                    {images.length < 4 && images.length > 0 && (
                      <div onClick={() => !isProcessing && fileInputRef.current.click()} className="aspect-square border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 cursor-pointer">
                        <Plus size={16}/>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <FormInput label="Anomaly Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="Issue summary..." />
                  </div>
                  
                  <div className="space-y-1.5 text-left">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Anomaly Priority</label>
                    <select 
                      name="priority" 
                      value={formData.priority} 
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[10px] font-black uppercase outline-none focus:border-blue-500 appearance-none"
                    >
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                      <option value="CRITICAL">CRITICAL</option>
                    </select>
                  </div>

                  <FormInput label="Location Code" name="location" value={formData.location} onChange={handleInputChange} placeholder="ZONE-B4" />
                  <FormInput label="Blocked Task ID" name="blockedTaskId" type="number" value={formData.blockedTaskId || ''} onChange={handleInputChange} placeholder="1" />

                  <div className="col-span-2 space-y-1.5">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Quick Description</label>
                    <textarea 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500 min-h-[100px]" 
                      placeholder="Describe the issue..." 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing} 
                  className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-2 transition-all ${isProcessing ? 'bg-slate-400' : 'bg-[#111827] hover:bg-blue-600 text-white'}`}
                >
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : "Transmit to Engineering"}
                </button>
              </form>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function FormInput({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-1.5 flex-1">
      <label className="text-[8px] font-black uppercase text-slate-400 ml-1 tracking-widest">{label}</label>
      <input 
        name={name} 
        value={value} 
        onChange={onChange} 
        type={type}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500" 
        placeholder={placeholder} 
      />
    </div>
  );
}

function MiniMetric({ label, value, sub, color }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm">
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

function TableButton({ icon, label }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[8px] font-black uppercase text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all">
      {icon} {label}
    </button>
  );
}