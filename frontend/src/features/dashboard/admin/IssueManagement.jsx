'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, Zap, MapPin, User, X, CheckCircle2, ArrowLeft, Loader2, ChevronRight, Hash, Search, Briefcase, Layout, Filter, Calendar
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';
import Table from '../../../components/dashboard/Table';
import Loader from '../../../components/dashboard/Loader';

export default function IssueManagement() {
  const [view, setView] = useState('list'); // 'list' | 'issues'
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [tempStatus, setTempStatus] = useState("");

  // Filters state
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Load Project Directory
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

  // Fetch Live Issues for Selected Project Context
  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setView('issues');
    setLoadingIssues(true);
    setIssues([]);
    setPriorityFilter('All');
    setStatusFilter('All');
    setSearchTerm('');

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

  // Sync state variables for Modal lifecycle edits
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

      // Local mutations sync
      setIssues(prev => prev.map(i => i.id === selectedIssue.id ? { ...i, status: tempStatus } : i));
      setSelectedIssue(prev => ({ ...prev, status: tempStatus }));
      
      alert("Issue lifecycle status synchronized successfully.");
    } catch (error) {
      console.error("Status Mutation Error:", error);
      const errMsg = error.response?.data?.errors?.[0]?.message || "Failed to update status.";
      alert(errMsg);
    } finally {
      setUpdating(false);
    }
  };

  // Live filter runtime computations
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchPriority = priorityFilter === 'All' || issue.priority === priorityFilter.toUpperCase();
      
      const cleanStatusFilter = statusFilter.toUpperCase().replace(' ', '_');
      const matchStatus = statusFilter === 'All' || issue.status === cleanStatusFilter;
      
      const combinedTerm = `${issue.title || ''} ${issue.id || ''} ${issue.description || ''}`.toLowerCase();
      const matchSearch = combinedTerm.includes(searchTerm.toLowerCase());

      return matchPriority && matchStatus && matchSearch;
    });
  }, [issues, priorityFilter, statusFilter, searchTerm]);

  // --- Table Schema 1: Initial Projects Directory ---
  const projectColumns = [
    {
      header: "Project Details",
      accessor: "projectName",
      cell: (row) => (
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200/40 shrink-0">
            <Briefcase size={14} />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs uppercase">{row.projectName}</span>
            <span className="text-[10px] text-slate-400 font-medium block">System Registry ID: {row.id}</span>
          </div>
        </div>
      )
    },
    {
      header: "Workflow Linked Nodes",
      accessor: "projectProgress.totalTasks",
      cell: (row) => {
        const taskCount = row.projectProgress?.totalTasks ?? 0;
        return (
          <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
            {taskCount} Associated Systems
          </span>
        );
      }
    },
    {
      header: "Operational Action",
      align: "right",
      width: "120px",
      cell: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleProjectClick(row); }}
          className="p-1.5 hover:bg-slate-100 rounded border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight shadow-2xs"
        >
          Inspect Issues <ChevronRight size={12} />
        </button>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans antialiased text-left relative">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: MASTER DIRECTORY OF LINKED ENTERPRISE PROJECTS */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-[1300px] mx-auto space-y-6">
            <header className="border-b border-slate-200 pb-5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Project Issues Management</h1>
              <p className="text-xs text-slate-500 mt-1 font-medium">Select an active context asset module core node to scan and parse operational ticket reports.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MiniMetric label="Monitored Projects Modules" value={projectList.length} subtext="System Registry Nodes" icon={<Briefcase size={14}/>} />
              <div className="bg-slate-900 rounded-xl p-4 text-white flex justify-between items-center border border-slate-800 shadow-sm">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Diagnostic Monitor State</p>
                  <p className="text-base font-bold tracking-tight text-emerald-400">Sentinel Active</p>
                  <p className="text-[10px] text-slate-400 font-medium block">Awaiting cluster query operations</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 shrink-0">
                  <Zap size={14} className="text-amber-400 animate-pulse" />
                </div>
              </div>
            </div>

            <Table 
              columns={projectColumns}
              data={projectList}
              searchPlaceholder="Filter project modular nodes..."
            />
          </motion.div>
        )}

        {/* VIEW 2: DRILL-DOWN SPECIFIC PROJECT LIVE ISSUES HUB */}
        {view === 'issues' && selectedProject && (
          <motion.div key="issues" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1300px] mx-auto space-y-6">
            
            <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 mb-2 transition-colors">
                  <ArrowLeft size={12} /> Back to Master Node Logs
                </button>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{selectedProject.projectName}</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Displaying registered field vulnerabilities mapped onto Context Module: {selectedProject.id}</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter target tickets..." 
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-slate-400 transition-all" 
                />
              </div>
            </header>

            {/* Direct Multi-Filter Option Tab Strip */}
            <section className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center shadow-sm">
              <FilterTab label="Priority Level" options={['All', 'High', 'Medium', 'Low']} active={priorityFilter} onChange={setPriorityFilter} />
              <div className="h-5 w-px bg-slate-200 hidden sm:block" />
              <FilterTab label="Log Status" options={['All', 'Open', 'In Progress', 'Resolved', 'Closed']} active={statusFilter} onChange={setStatusFilter} />
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MiniMetric label="Total Filtered Tickets" value={filteredIssues.length} subtext={`Out of ${issues.length} total nodes`} icon={<Layout size={14}/>} />
              <MiniMetric label="Critical Threats Remaining" value={filteredIssues.filter(i => i.priority === 'CRITICAL' || i.priority === 'HIGH').length} subtext="Actionable items" icon={<AlertTriangle size={14}/>} danger={filteredIssues.some(i => i.priority === 'CRITICAL' || i.priority === 'HIGH')} />
            </div>

            {loadingIssues ? (
              <Loader message="Querying live issue manifests..." />
            ) : (
              /* Custom Clean Built In Grid Matrix representation to completely professionalize row displays */
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-12 px-6 py-3.5 bg-slate-50 border-b border-slate-200 text-left font-semibold">
                   <div className="col-span-5 text-[10px] uppercase tracking-wider text-slate-400">Anomaly Fault Descriptor</div>
                   <div className="col-span-3 text-[10px] uppercase tracking-wider text-slate-400 text-center">Reporter Personnel</div>
                   <div className="col-span-2 text-[10px] uppercase tracking-wider text-slate-400 text-center">Urgency Tier</div>
                   <div className="col-span-2 text-[10px] uppercase tracking-wider text-slate-400 text-right">Lifecycle Management</div>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {filteredIssues.length === 0 ? (
                    <div className="p-8 text-center text-xs font-medium text-slate-400">
                      No active ticket items map onto chosen filtration scopes.
                    </div>
                  ) : (
                    filteredIssues.map((issue) => {
                      const isCritical = issue.priority === 'CRITICAL' || issue.priority === 'HIGH';
                      return (
                        <div key={issue.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/70 transition-colors text-left group">
                          <div className="col-span-5 pr-4 space-y-0.5">
                            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-tight group-hover:text-blue-600 transition-colors">{issue.title}</h4>
                            <span className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-sm block">
                              {issue.description || 'No detailed descriptor text input logged.'}
                            </span>
                          </div>
                          <div className="col-span-3 flex justify-center items-center gap-2">
                            <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-[10px] uppercase shrink-0">
                              {issue.reporter?.firstName ? issue.reporter.firstName.charAt(0) : 'S'}
                            </div>
                            <span className="text-xs font-semibold text-slate-700">
                              {issue.reporter ? `${issue.reporter.firstName} ${issue.reporter.lastName || ''}` : "Automated Bot"}
                            </span>
                          </div>
                          <div className="col-span-2 flex justify-center">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase ${
                              isCritical ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                            }`}>
                              <span className={`w-1 h-1 rounded-full ${isCritical ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                              {issue.priority || 'NORMAL'}
                            </span>
                          </div>
                          <div className="col-span-2 flex justify-end">
                            <button 
                              onClick={() => setSelectedIssue(issue)}
                              className="px-2.5 py-1 rounded bg-white border border-slate-200 hover:border-slate-400 font-bold text-[10px] text-slate-700 shadow-2xs transition-all inline-flex items-center gap-1.5 uppercase"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${issue.status === 'OPEN' ? 'bg-amber-500' : issue.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                              {issue.status ? issue.status.replace('_', ' ') : 'OPEN'}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPONENT MODAL DEEP TICKET MODIFICATION CONTROLS PANEL */}
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

              {/* LIVE FILE ATTACHED MEDIA CAPTURE WRAPPER */}
              <div className="w-full md:w-1/2 bg-slate-50 h-56 md:h-auto overflow-hidden border-r border-slate-200 flex items-center justify-center">
                {selectedIssue.photoUrls?.[0] ? (
                  <img src={selectedIssue.photoUrls[0]} alt="Field Evidence Capture Frame" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-slate-300">
                    <AlertTriangle size={28} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No Media Logs Provided</span>
                  </div>
                )}
              </div>

              {/* TICKET DISCOVERY DETAILS LOG */}
              <div className="w-full md:w-1/2 p-6 md:p-8 text-left overflow-y-auto flex flex-col justify-between bg-white">
                <div className="space-y-5">
                  <div>
                    <span className="text-[9px] font-bold bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedIssue.priority} Priority
                    </span>
                    <h2 className="text-base font-bold text-slate-900 uppercase mt-3 tracking-tight">{selectedIssue.title}</h2>
                    <div className="flex items-center gap-1.5 mt-1.5 text-slate-400 text-[11px] font-medium">
                      <MapPin size={12} />
                      <span>{selectedIssue.location || "No Registered Geographic Coordinates"}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vulnerability Descriptor</span>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                      {selectedIssue.description || "No elaboration parameters appended to this file."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
                    <DetailItem label="Logged By User Node" value={selectedIssue.reporter ? `${selectedIssue.reporter.firstName} ${selectedIssue.reporter.lastName || ''}` : "System Automated"} />
                    <DetailItem label="Filing Log Date" value={selectedIssue.createdAt ? new Date(selectedIssue.createdAt).toLocaleDateString() : 'N/A'} />
                  </div>
                </div>

                {/* STATUS LIFECYCLE MANAGEMENT MUTATION CONTROL BLOCKS */}
                <div className="space-y-3 pt-4 border-t border-slate-100 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alter Operational Lifecycle Status</label>
                    <select 
                      value={tempStatus}
                      onChange={(e) => setTempStatus(e.target.value)}
                      className="w-full bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-slate-400 cursor-pointer transition-all"
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
                    {updating ? "Committing Database Sync..." : "Synchronize System Status"}
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

function FilterTab({ label, options, active, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto text-left">
      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase shrink-0">{label}:</span>
      <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
        {options.map(opt => (
          <button 
            key={opt} 
            type="button"
            onClick={() => onChange(opt)} 
            className={`px-3 py-1 rounded text-[10px] font-bold transition-all uppercase whitespace-nowrap tracking-tight ${
              active === opt 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/40' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function MiniMetric({ label, value, subtext, icon, danger = false }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between text-left">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <span className="text-base font-bold tracking-tight text-slate-900 block">{value}</span>
        <span className={`text-[10px] font-semibold block ${danger ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>{subtext}</span>
      </div>
      <div className={`p-2 rounded-lg border shrink-0 ${danger ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>{icon}</div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-0.5 text-left">
      <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{label}</p>
      <p className="text-xs font-semibold text-slate-800 truncate">{value || 'N/A'}</p>
    </div>
  );
}