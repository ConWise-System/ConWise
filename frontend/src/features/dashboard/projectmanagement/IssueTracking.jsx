'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Zap, MapPin, User, X, CheckCircle2, ArrowLeft, Loader2, ChevronRight, Hash
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';
import Table from '../../../components/dashboard/Table';
import Loader from '../../../components/dashboard/Loader';


export default function IssueTracking() {
  const [view, setView] = useState('list'); // 'list' | 'issues'
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  // Load Initial Project Directory Records
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await Axios({...summeryApi.getAllProjects});
        const projects = res.data.data || res.data;
        setProjectList(Array.isArray(projects) ? projects : []);
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    };
    loadProjects();
  }, []);

  // Fetch Live Issues when a specific project is targeted
  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setView('issues');
    setLoadingIssues(true);
    setIssues([]);

    try {
      const res = await Axios({
        url: summeryApi.getAllIssues.url(project.id),
        method: summeryApi.getAllIssues.method
      });
      setIssues(res.data.data || []);
    } catch (error) {
      console.error("Failed to load project issues:", error);
    } finally {
      setLoadingIssues(false);
    }
  };

  // Sync tempStatus when an issue is opened in deep-inspection modal
  useEffect(() => {
    if (selectedIssue) {
      setTempStatus(selectedIssue.status);
    }
  }, [selectedIssue]);

  const handleUpdateStatus = async () => {
    if (!selectedIssue || !tempStatus || !selectedProject) return;
    setUpdating(true);
    
    try {
      await Axios({
        url: summeryApi.updateIssueStatus.url(selectedProject.id, selectedIssue.id),
        method: summeryApi.updateIssueStatus.method,
        data: { status: tempStatus }
      });

      // Synchronize modified item across localized component collection contexts
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

  // --- Table Schema 1: Initial Projects List Directory ---
  const projectColumns = [
    {
      header: "No.",
      width: "60px",
      align: "center",
      cell: (_, rowNumber) => <span className="text-slate-400 font-bold font-mono">{rowNumber}</span>
    },
    {
      header: "Project Details",
      accessor: "projectName",
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{row.projectName}</span>
          <span className="text-[10px] text-slate-400 font-medium">ID Ref: {row.id}</span>
        </div>
      )
    },
    {
      header: "Security Risk Progress",
      accessor: "projectProgress.totalTasks",
      cell: (row) => {
        const taskCount = row.projectProgress?.totalTasks ?? 0;
        return (
          <span className="text-xs font-semibold text-slate-600">
            {taskCount} Linked Workflows
          </span>
        );
      }
    },
    {
      header: "Action",
      align: "right",
      width: "100px",
      cell: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleProjectClick(row); }}
          className="p-1.5 hover:bg-slate-100 rounded border border-slate-200 text-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
        >
          Inspect Issues <ChevronRight size={13} />
        </button>
      )
    }
  ];

  // --- Table Schema 2: Issues Manifest Array ---
  const issueColumns = [
    {
      header: "No.",
      width: "60px",
      align: "center",
      cell: (_, rowNumber) => <span className="text-slate-400 font-bold font-mono">{rowNumber}</span>
    },
    {
      header: "Anomaly Descriptor",
      accessor: "title",
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{row.title}</span>
          <span className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-sm">{row.description}</span>
        </div>
      )
    },
    {
      header: "Risk Urgency",
      accessor: "priority",
      align: "center",
      cell: (row) => {
        const isCritical = row.priority === 'CRITICAL' || row.priority === 'HIGH';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
            isCritical ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-50 text-slate-600 border-slate-200'
          }`}>
            {row.priority}
          </span>
        );
      }
    },
    {
      header: "Reporter Node",
      accessor: "reporter.firstName",
      cell: (row) => (
        <span className="text-xs font-medium text-slate-600">
          {row.reporter ? `${row.reporter.firstName} ${row.reporter.lastName || ''}` : "System Automated"}
        </span>
      )
    },
    {
      header: "Status Lifecycle",
      accessor: "status",
      align: "right",
      cell: (row) => (
        <button 
          onClick={() => setSelectedIssue(row)}
          className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-slate-400 font-bold text-[10px] text-slate-700 shadow-sm transition-all inline-flex items-center gap-1.5"
        >
          <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'OPEN' ? 'bg-red-500' : 'bg-emerald-500'}`} />
          {row.status.replace('_', ' ')}
        </button>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans antialiased text-left relative">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: PROJECTS HUB OVERVIEW */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1300px] mx-auto space-y-6">
            <div className="border-b border-slate-200 pb-5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">System Issue Management</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Select a managed operational system terminal core node below to view active filed anomalies.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MiniMetric label="Total Tracked Projects" value={projectList.length} sub="Monitored Infrastructure Nodes" />
              <div className="bg-slate-900 rounded-xl p-4 text-white flex justify-between items-center border border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Automated Sentinel Status</p>
                  <p className="text-xs font-medium text-slate-300">Integrity diagnostics active. Select a directory object to fetch log data.</p>
                </div>
                <Zap size={18} className="text-slate-400" />
              </div>
            </div>

            <Table 
              columns={projectColumns}
              data={projectList}
              searchPlaceholder="Filter project directory assets..."
            />
          </motion.div>
        )}

        {/* VIEW 2: DRILL-DOWN PROJECT ISSUES LIST VIEW */}
        {view === 'issues' && selectedProject && (
          <motion.div key="issues" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1300px] mx-auto space-y-6">
            <div className="border-b border-slate-200 pb-5 space-y-1">
              <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                <ArrowLeft size={14} /> Return to Project Directories
              </button>
              <h2 className="text-xl font-bold text-slate-900 uppercase">{selectedProject.projectName}</h2>
              <p className="text-xs text-slate-400 font-medium">Displaying registered field vulnerabilities mapped onto System Node: {selectedProject.id}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MiniMetric label="Total Blocked Anomalies" value={issues.length} sub="Active Database Records" />
              <MiniMetric label="High Priority Severity Risk" value={issues.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length} sub="Requiring Engineering Action" danger />
            </div>

            {loadingIssues ? (
              <Loader messages="Loading issuses..."/>
            ) : (
              <Table 
                columns={issueColumns}
                data={issues}
                searchPlaceholder="Search logged system anomalies..."
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* COMPONENT MODAL DETAIL VIEW CONTAINER INSPECTION PANEL */}
      <AnimatePresence>
        {selectedIssue && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedIssue(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }}
              className="bg-white w-full max-w-4xl rounded-xl overflow-hidden border border-slate-200 shadow-xl relative flex flex-col md:flex-row max-h-[85vh] z-[10000]"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setSelectedIssue(null)} className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-md text-slate-400 hover:text-slate-900 border border-slate-200 transition-colors shadow-sm">
                <X size={16} />
              </button>

              {/* IMAGE MEDIA ATTACHMENT SECTION */}
              <div className="w-full md:w-1/2 bg-slate-50 h-56 md:h-auto overflow-hidden border-r border-slate-200 flex items-center justify-center">
                {selectedIssue.photoUrls?.[0] ? (
                  <img src={selectedIssue.photoUrls[0]} alt="Field Evidence" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-300">
                    <AlertTriangle size={36} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No media context provided</span>
                  </div>
                )}
              </div>

              {/* DATA DISCOVERY ANALYSIS WRAPPER */}
              <div className="w-full md:w-1/2 p-6 md:p-8 text-left overflow-y-auto flex flex-col justify-between bg-white">
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-bold bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedIssue.priority} Severity
                    </span>
                    <h2 className="text-base font-bold text-slate-900 uppercase mt-3 tracking-tight">{selectedIssue.title}</h2>
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-[11px] font-medium">
                      <MapPin size={12} />
                      <span>{selectedIssue.location || "No Geo-Coordinates Registered"}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Vulnerability Summary</span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {selectedIssue.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
                    <DetailItem label="Assigned Reporter Node" value={selectedIssue.reporter ? `${selectedIssue.reporter.firstName} ${selectedIssue.reporter.lastName}` : "N/A"} />
                    <DetailItem label="Filing Log Date" value={new Date(selectedIssue.createdAt).toLocaleDateString()} />
                  </div>
                </div>

                {/* SYSTEM INTEGRATION MATRIX LIFECYCLE ACTION MANAGEMENT */}
                <div className="space-y-3 pt-4 border-t border-slate-100 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Modify Operational Lifecycle State</label>
                    <select 
                      value={tempStatus}
                      onChange={(e) => setTempStatus(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-slate-400 cursor-pointer"
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
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {updating ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                    {updating ? "Committing Database Registry..." : "Synchronize System Status"}
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

// Minimalist Standard Utility Components
function FormInput({ label, name, value, onChange, placeholder, type = "text", colSpan = "" }) {
  return (
    <div className={`space-y-1.5 ${colSpan}`}>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <input 
        name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} 
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 transition-all" 
      />
    </div>
  );
}

function MiniMetric({ label, value, sub, danger = false }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <h4 className="text-xl font-bold text-slate-900">{value}</h4>
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
          danger ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-50 text-slate-600 border border-slate-100'
        }`}>
          {sub}
        </span>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{label}</p>
      <p className="text-xs font-semibold text-slate-800 truncate">{value || 'N/A'}</p>
    </div>
  );
}