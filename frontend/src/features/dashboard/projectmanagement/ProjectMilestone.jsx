'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Milestone, Calendar, CheckCircle2, Clock, 
  Layers, ChevronDown, RefreshCw, AlertCircle,
  Activity, ArrowUpRight
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';

export default function ProjectMilestonesDashboard() {
  // Main repository matrix states
  const [projectsData, setProjectsData] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [activeProject, setActiveProject] = useState(null);
  
  // Interface status monitors
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // --- FETCH ALL ACTIVE PROJECTS METRICS ---
  const fetchProjectMilestones = async () => {
    try {
      // Calls your updated manager-scoped milestone backend endpoint
      const response = await Axios({
        url: summeryApi.projectMilestones.url,
        method: 'GET',
        withCredentials: true
      });

      if (response.data?.success && response.data.data) {
        const structuralArray = response.data.data;
        setProjectsData(structuralArray);
        
        // Auto-select the first project in the array if it exists
        if (structuralArray.length > 0) {
          setSelectedProjectId(structuralArray[0].projectId);
          setActiveProject(structuralArray[0]);
        }
      }
    } catch (error) {
      console.error("Critical fault syncing project management milestone telemetry:", error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchProjectMilestones();
  }, []);

  // Update active view layout whenever selection changes inside the state matrix
  const handleProjectSelection = (id) => {
    setSelectedProjectId(id);
    const matched = projectsData.find(p => p.projectId === id);
    if (matched) setActiveProject(matched);
    setIsDropdownOpen(false);
  };

  const formatEpoch = (isoString) => {
    if (!isoString) return '---';
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* --- PROFESSIONAL INTERFACE CONTROL HEADER --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[10px] tracking-widest uppercase mb-1">
              <Milestone size={12} /> Milestone Analytics Dashboard
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">
              {activeProject ? activeProject.projectName : "Project Portfolios Tracker"}
            </h1>
          </div>

          {/* MINIMALIST DESIGN DROPDOWN SELECTOR */}
          <div className="relative w-full sm:w-72 z-50">
            <button
              type="button"
              disabled={isInitialLoad || projectsData.length === 0}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-tight text-slate-800 flex items-center justify-between shadow-2xs hover:border-slate-300 transition-colors focus:outline-none"
            >
              <span className="truncate">
                {isInitialLoad ? "Synchronizing Context..." : (activeProject?.projectName || "Select Managed Project...")}
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute right-0 left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50 p-1"
                  >
                    {projectsData.map((project) => {
                      const isSelected = project.projectId === selectedProjectId;
                      return (
                        <button
                          key={project.projectId}
                          type="button"
                          onClick={() => handleProjectSelection(project.projectId)}
                          className={`w-full text-left px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-tight flex items-center justify-between transition-all ${
                            isSelected ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span className="truncate">{project.projectName}</span>
                          <span className="font-mono text-[10px] opacity-60">{project.completionPercentage}%</span>
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* --- PERFORMANCE ANALYTICS CONTAINER --- */}
        {isInitialLoad ? (
          <div className="h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
            <RefreshCw size={20} className="animate-spin text-blue-600 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Parsing Active Registries...</span>
          </div>
        ) : activeProject ? (
          <div className="space-y-6">
            
            {/* COMPACT STATISTICS OVERVIEW ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Operational Timeline</span>
                  <span className="text-xs font-bold text-slate-800 mt-1 block">
                    {formatEpoch(activeProject.projectStartDate)} — {formatEpoch(activeProject.projectDueDate)}
                  </span>
                </div>
                <Calendar size={16} className="text-slate-300" />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Components</span>
                  <span className="text-2xl font-bold tracking-tight text-slate-900 mt-1 block">{activeProject.inProgressTasks}</span>
                </div>
                <Activity size={16} className="text-amber-500" />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed Targets</span>
                  <span className="text-2xl font-bold tracking-tight text-slate-900 mt-1 block">{activeProject.completedTasks}</span>
                </div>
                <CheckCircle2 size={16} className="text-emerald-500" />
              </div>

              {/* INTEGRATED GLOBAL COMPACT PROGRESS RADIAL */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Metrics</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{activeProject.completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${activeProject.completionPercentage}%` }}
                    className={`h-full rounded-full transition-all duration-500 ${
                      activeProject.completionPercentage === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* --- GRANULAR PROGRESS MILESTONES WORKFLOW TIMELINE --- */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestone Progress Workflow</h2>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight mt-0.5">Chronological Project Breakdown</h3>
                </div>
                <span className="text-[10px] font-bold bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg text-slate-500">
                  {activeProject.milestones.length} SEQUENTIAL NODES
                </span>
              </div>

              <div className="space-y-4">
                {activeProject.milestones.map((milestone) => {
                  const isDone = milestone.completionPercentage === 100;
                  return (
                    <div 
                      key={milestone.milestoneId} 
                      className="group border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-200 p-5 rounded-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-3xs"
                    >
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isDone ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`} />
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                            {milestone.milestoneName}
                          </h4>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={10} /> Target Due Window: {formatEpoch(milestone.milestoneDueDate)}
                        </p>
                      </div>

                      {/* INDIVIDUAL PROGRESS GAUGES */}
                      <div className="w-full md:w-64 space-y-1.5 shrink-0">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          <span className="font-mono">
                            {isDone ? "Stage Verification Saved" : "Execution Thread In Progress"}
                          </span>
                          <span className="font-mono text-slate-900">{milestone.completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${milestone.completionPercentage}%` }}
                            className={`h-full rounded-full ${isDone ? 'bg-emerald-500' : 'bg-blue-600'}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 py-20">
            <AlertCircle className="mx-auto opacity-30 mb-2" size={28} />
            <p className="text-[10px] font-bold uppercase tracking-widest">No active engineering project tracks registered.</p>
          </div>
        )}
      </div>
    </div>
  );
}