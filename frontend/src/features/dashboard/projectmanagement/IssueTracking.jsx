'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Zap, MapPin, User, X, CheckCircle2, Info, Loader2
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';

export default function IssueTracking() {
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  // Data Loading
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await Axios({...summeryApi.getAllProjects});
        const projects = res.data.data || res.data;
        setProjectList(Array.isArray(projects) ? projects : []);
        if (projects.length > 0) setSelectedProjectId(String(projects[0].id));
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };
    loadProjects();
  }, []);

  useEffect(() => {
    const loadIssues = async () => {
      if (!selectedProjectId) return;
      setLoading(true);
      try {
        const res = await Axios({
          url: summeryApi.getAllIssues.url(selectedProjectId),
          method: summeryApi.getAllIssues.method
        });
        setIssues(res.data.data || []);
      } catch (error) {
        console.error("Failed to load issues:", error);
      } finally {
        setLoading(false);
      }
    };
    loadIssues();
  }, [selectedProjectId]);

  // Sync tempStatus when an issue is selected
  useEffect(() => {
    if (selectedIssue) {
      setTempStatus(selectedIssue.status);
    }
  }, [selectedIssue]);

  const handleUpdateStatus = async () => {
    if (!selectedIssue || !tempStatus) return;
    setUpdating(true);
    
    try {
      await Axios({
        url: summeryApi.updateIssueStatus.url(selectedProjectId, selectedIssue.id),
        method: summeryApi.updateIssueStatus.method,
        data: { status: tempStatus }
      });

      // Update local states
      setIssues(prev => prev.map(i => i.id === selectedIssue.id ? { ...i, status: tempStatus } : i));
      setSelectedIssue(prev => ({ ...prev, status: tempStatus }));
      
      alert("Lifecycle status updated successfully.");
    } catch (error) {
      console.error("Update Error:", error);
      const errMsg = error.response?.data?.errors?.[0]?.message || "Failed to update status.";
      alert(errMsg);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 text-slate-900 relative">
      <div className="max-w-[1300px] mx-auto space-y-6 text-left">
        
        {/* HEADER */}
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Risk Management</p>
            <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">Issue Tracking</h1>
          </div>
          <select 
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm cursor-pointer"
          >
            {projectList.map(p => (
              <option key={p.id} value={p.id}>{p.projectName || p.name}</option>
            ))}
          </select>
        </div>

        {/* TOP METRICS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard 
            label="Total Anomalies" 
            value={issues.length} 
            sub="Live Database" 
            color="bg-blue-50 text-blue-600" 
          />
          <MetricCard 
            label="High Priority" 
            value={issues.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length} 
            sub="Requires Action" 
            color="bg-red-50 text-red-600" 
          />
          <div className="bg-[#111827] rounded-[1.5rem] p-6 text-white flex justify-between items-center shadow-sm min-h-[120px]">
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase opacity-40 tracking-widest text-slate-100">System Status</p>
              <p className="text-sm font-bold italic text-blue-400">Monitoring Active</p>
            </div>
            <Zap size={24} className="text-blue-400 animate-pulse" />
          </div>
        </div>

        {/* GRID */}
        {loading ? (
          <div className="py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">Synchronizing Ledger...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} onClick={() => setSelectedIssue(issue)} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedIssue(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedIssue(null)} className="absolute top-6 right-6 z-10 p-2 bg-white/80 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                <X size={20} />
              </button>

              <div className="w-full md:w-1/2 bg-slate-100 h-64 md:h-auto overflow-hidden">
                {selectedIssue.photoUrls?.[0] ? (
                  <img src={selectedIssue.photoUrls[0]} alt="Evidence" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><AlertTriangle size={48} /></div>
                )}
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-10 text-left overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <span className="text-[8px] font-black bg-blue-600 text-white px-3 py-1 rounded-full uppercase tracking-widest">{selectedIssue.priority} Priority</span>
                    <h2 className="text-2xl font-black text-[#111827] uppercase italic leading-tight mt-4 tracking-tighter">{selectedIssue.title}</h2>
                    <div className="flex items-center gap-2 mt-2 text-slate-400">
                      <MapPin size={14} />
                      <p className="text-[10px] font-bold uppercase">{selectedIssue.location}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Description</p>
                    <p className="text-[13px] text-slate-600 font-medium italic leading-relaxed">"{selectedIssue.description}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
                    <DetailItem label="Reporter" value={`${selectedIssue.reporter?.firstName} ${selectedIssue.reporter?.lastName}`} />
                    <DetailItem label="Created" value={new Date(selectedIssue.createdAt).toLocaleDateString()} />
                  </div>

                  {/* UPDATE STATUS SECTION */}
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-[8px] font-black uppercase text-blue-600 tracking-widest">Lifecycle Status</label>
                      <select 
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-[10px] font-black uppercase outline-none focus:border-blue-500 appearance-none cursor-pointer"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={handleUpdateStatus}
                      disabled={updating || tempStatus === selectedIssue.status}
                      className="w-full bg-[#111827] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2"
                    >
                      {updating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                      {updating ? "Updating..." : "Update Status"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const MetricCard = ({ label, value, sub, color }) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-sm flex flex-col justify-between min-h-[120px]">
    <div className="flex justify-between items-start">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <Info size={12} className="text-slate-200" />
    </div>
    <div className="flex items-baseline justify-between mt-auto">
      <h3 className="text-4xl font-black text-[#111827] tracking-tighter italic leading-none">{value}</h3>
      <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-tight ${color}`}>
        {sub}
      </span>
    </div>
  </div>
);

function IssueCard({ issue, onClick }) {
  const priorityColors = {
    CRITICAL: "bg-red-500 text-white",
    HIGH: "bg-orange-500 text-white",
    MEDIUM: "bg-blue-500 text-white",
    LOW: "bg-slate-500 text-white"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden group cursor-pointer text-left"
    >
      <div className="h-40 bg-slate-100 overflow-hidden relative">
        {issue.photoUrls?.[0] ? (
          <img src={issue.photoUrls[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="p" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300"><AlertTriangle size={24} /></div>
        )}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${priorityColors[issue.priority] || 'bg-slate-500'}`}>
          {issue.priority}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">Issue ID: #{issue.id}</p>
          <h3 className="text-sm font-black text-[#111827] uppercase leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">{issue.title}</h3>
        </div>
        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 italic leading-relaxed">"{issue.description}"</p>
        <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
               <User size={10} className="text-blue-600" />
            </div>
            <span className="text-[9px] font-black uppercase text-slate-600">{issue.reporter?.firstName}</span>
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{issue.status.replace('_', ' ')}</span>
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[7px] font-black uppercase text-slate-400 tracking-widest mb-1">{label}</p>
      <p className="text-[11px] font-bold text-slate-800 uppercase truncate">{value || 'N/A'}</p>
    </div>
  );
}