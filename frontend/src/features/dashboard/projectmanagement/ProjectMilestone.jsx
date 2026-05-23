'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Milestone, Calendar, CheckCircle2, Clock, 
  AlertTriangle, XCircle, BarChart3, 
  Layers, ChevronDown, Briefcase, RefreshCw, AlertCircle
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';

export default function ProjectMilestonesDashboard() {
  // Database infrastructure state arrays
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectData, setProjectData] = useState(null);
  
  // Isolated status monitors
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  // --- 1. FETCH ALL PROJECT LOOKUP NODES ---
  const fetchAllProjects = async () => {
    try {
      const response = await Axios({
        url: summeryApi.getAllProjects.url,
        method: summeryApi.getAllProjects.method,
        withCredentials: true
      });

      if (response.data?.success) {
        const structuralData = response.data.data || [];
        setProjectsList(structuralData);
        
        // Auto-select the leading instance if records exist in the repository
        if (structuralData.length > 0) {
          const initialId = structuralData[0].id || structuralData[0]._id || structuralData[0].projectId;
          setSelectedProjectId(initialId);
        }
      }
    } catch (error) {
      console.error("Critical fault fetching comprehensive projects portfolio index:", error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  // Run portfolio index fetch once on component initial execution frame
  useEffect(() => {
    fetchAllProjects();
  }, []);

  // --- 2. FETCH SPECIFIC MILESTONE TELEMETRY STREAM ---
  const fetchProjectTelemetry = async (projectId) => {
    if (!projectId) return;
    setIsLoadingMetrics(true);
    try {
      const response = await Axios({
        url: summeryApi.projectMilestones.url(projectId),
        method: summeryApi.projectMilestones.method,
        withCredentials: true
      });

      if (response.data?.success) {
        setProjectData(response.data.data);
      }
    } catch (error) {
      console.error("Critical error pulling raw project milestones telemetry:", error);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  // Trigger metrics api stream whenever the selection token mutates
  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectTelemetry(selectedProjectId);
    }
  }, [selectedProjectId]);

  const formatEpoch = (isoString) => {
    if (!isoString) return '---';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Extract current dropdown presentation context string values dynamically
  const activeSelectionObject = projectsList.find(p => (p.id || p._id || p.projectId) === selectedProjectId);
  const activeProjectLabel = activeSelectionObject?.projectName || activeSelectionObject?.name || "Select Project Matrix...";

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased p-6 md:p-12 text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- DASHBOARD HEADER & DROPDOWN CONTROLS --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-200 pb-6 gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] tracking-[0.2em] uppercase mb-1">
              <Milestone size={12} /> Milestone Analytics Dashboard
            </div>
            <h1 className="text-3xl font-black tracking-tighter uppercase italic text-[#111827]">
              {/* FIXED: Uses optional chaining and falls back to active dynamic dropdown name to prevent null pointer exceptions */}
              {projectData?.projectName || activeProjectLabel}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Data Scope: {projectsList.length} Authenticated Repositories
            </p>
          </div>

          {/* DENSE TECHNICAL DROPDOWN SELECTION HUB */}
          <div className="relative w-full md:w-80 z-50">
            <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1.5 pl-1">
              Active Context Project
            </label>
            <button
              type="button"
              disabled={isInitialLoad || projectsList.length === 0}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-slate-200 p-3.5 rounded-xl text-left text-xs font-black uppercase tracking-tight text-[#111827] flex items-center justify-between shadow-sm hover:border-slate-300 transition-colors focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            >
              <span className="truncate">
                {isInitialLoad ? "Synchronizing Portfolio..." : activeProjectLabel}
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* EXPANDABLE INTERACTION OVERLAY PANEL */}
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.1 }}
                    className="absolute right-0 left-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50"
                  >
                    {projectsList.map((project) => {
                      const currentId = project.id || project._id || project.projectId;
                      const isSelected = currentId === selectedProjectId;
                      const nameDisplay = project.projectName || project.name || "Unnamed Target Cluster";
                      
                      return (
                        <button
                          key={currentId}
                          type="button"
                          onClick={() => {
                            setSelectedProjectId(currentId);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left p-3.5 border-b border-slate-50 last:border-b-0 text-xs font-bold uppercase tracking-tight flex flex-col transition-colors ${
                            isSelected 
                              ? 'bg-slate-50 text-blue-600 font-black' 
                              : 'text-[#111827] hover:bg-slate-50 hover:text-blue-600'
                          }`}
                        >
                          <span className="truncate">{nameDisplay}</span>
                          <span className="text-[8px] font-bold text-slate-400 tracking-wider mt-0.5">
                            ID Token: {String(currentId).toUpperCase()}
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* --- MAIN METRICS VIEWER HUB WORKSPACE --- */}
        <div className="relative min-h-[400px]">
          {isLoadingMetrics ? (
            <div className="absolute inset-0 bg-[#F8FAFC]/50 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw size={24} className="animate-spin text-blue-600" />
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Syncing Node Metrics Array...</p>
              </div>
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            {projectData ? (
              <motion.main
                key={projectData.projectId}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
              >
                
                {/* PRIMARY LEFT LOG PARAMETERS GRID */}
                <section className="lg:col-span-2 space-y-6">
                  
                  {/* TIMELINE RUNTIME DATES VECTORS */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                      Project Lifespan Lifecycles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-1">Project Start Date</span>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tight text-slate-700">
                          <Calendar size={12} className="text-slate-400" />
                          {formatEpoch(projectData.projectStartDate)}
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider block mb-1">Project Due Date</span>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tight text-slate-700">
                          <Calendar size={12} className="text-slate-400" />
                          {formatEpoch(projectData.projectDueDate)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TASK LOG QUANTITIES COMPACT MATRIX */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-2">
                      Tasks MileStone ({projectData.projectId || '---'})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Completed Tasks Card */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={16} /></div>
                          <div>
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-[#111827]">Completed</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Successful closures</p>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-[#111827] italic tracking-tight">{projectData.completedTasks || 0}</span>
                      </div>

                      {/* In Progress Tasks Card */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Clock size={16} /></div>
                          <div>
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-[#111827]">In Progress</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active sprint threads</p>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-[#111827] italic tracking-tight">{projectData.inProgressTasks || 0}</span>
                      </div>

                      {/* Under Review Tasks Card */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-purple-50 text-purple-600"><Layers size={16} /></div>
                          <div>
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-[#111827]">Under Review</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Quality verification</p>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-[#111827] italic tracking-tight">{projectData.underReviewTasks || 0}</span>
                      </div>

                      {/* Blocked Tasks Card */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-amber-50 text-amber-600"><AlertTriangle size={16} /></div>
                          <div>
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-[#111827]">Blocked</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Open dependencies</p>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-[#111827] italic tracking-tight">{projectData.blockedTasks || 0}</span>
                      </div>

                      {/* Rejected Tasks Card */}
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between sm:col-span-2">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-rose-50 text-rose-600"><XCircle size={16} /></div>
                          <div>
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-[#111827]">Rejected Tasks</h4>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Requires logic updates</p>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-[#111827] italic tracking-tight">{projectData.rejectedTasks || 0}</span>
                      </div>

                    </div>
                  </div>

                </section>

                {/* RIGHT SIDEBAR COLUMN: PERFORMANCE GAUGES */}
                <section className="space-y-4">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-2">
                    Velocity Profile Metric
                  </h3>

                  <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Aggregated Performance Threshold</p>
                      <h2 className="text-7xl font-black text-[#111827] tracking-tighter italic leading-none mt-4">
                        {projectData.completionPercentage || 0}<span className="text-xl text-slate-300 ml-1">%</span>
                      </h2>
                    </div>

                    {/* HIGH EFFICIENCY COMPLETION LOG TRACK BAR */}
                    <div className="space-y-2 text-left">
                      <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 tracking-wider">
                        <span>Total Tasks Target Boundary</span>
                        <span>{projectData.totalTasks || 0} Log Units</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${projectData.completionPercentage || 0}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          className="h-full bg-blue-600 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6 text-left">
                      <div className="flex items-start gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
                        <BarChart3 size={16} className="text-slate-300 shrink-0 mt-0.5" />
                        <span>Data calculations scale metrics automatically dynamically sourced directly from project telemetry files.</span>
                      </div>
                    </div>
                  </div>
                </section>

              </motion.main>
            ) : (
              !isLoadingMetrics && !isInitialLoad && (
                <div className="bg-white p-12 rounded-[2rem] border border-dashed border-slate-200 text-center text-slate-400 py-24">
                  <AlertCircle className="mx-auto opacity-40 mb-3 text-slate-400" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">
                    No active projects identified in this supervisor profile context
                  </p>
                </div>
              )
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}