'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Calendar, Plus, ArrowLeft,
  Search, AlertCircle,  RefreshCw,
  Briefcase, CloudSun, HardHat, CheckCircle2, Package,X, Image, UploadCloud
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';

export default function ReportManagementEngine() {
  // Primary data storage arrays
  const [reports, setReports] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [materialsList, setMaterialsList] = useState([]);
  
  // Navigation Routing Simulation View State ('INDEX' | 'CREATE_FORM')
  const [activeView, setActiveView] = useState('INDEX');
  
  // UI Interaction triggers
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [activeInspectionReport, setActiveInspectionReport] = useState(null);
  
  // System operational states
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Form blueprint data state
  const [formData, setFormData] = useState({
    projectId: '',
    reportTitle: '',
    reportType: 'DAILY_SITE_REPORT',
    workCompleted: '',
    workersPresent: 0,
    materialsUsed: '',
    weatherCondition: 'Sunny/Dry',
    challenges: '',
    progressPhotoUrl: ''
  });

  // --- 1. GET ALL COMPONENT LOOKUP DICTIONARIES ---
  const fetchLookupData = async () => {
    try {
      // Fetch target project boundaries
      const projectRes = await Axios({
        url: summeryApi.getAllProjects.url,
        method: summeryApi.getAllProjects.method,
        withCredentials: true
      });
      if (projectRes.data?.success) {
        setProjectsList(projectRes.data.data || []);
      }

      // Fetch material catalog indices
      const materialRes = await Axios({
        url: summeryApi.getAllMaterial.url,
        method: summeryApi.getAllMaterial.method,
        withCredentials: true
      });
      if (materialRes.data?.success) {
        setMaterialsList(materialRes.data.data || []);
      }
    } catch (error) {
      console.error("Critical fault reading structural contextual lookup indexes:", error);
    }
  };

  // --- 2. GET ALL REPORTS DATA METRICS ---
  const fetchAllReports = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({
        url: summeryApi.reports.url,
        method: summeryApi.reports.method,
        withCredentials: true
      });

      if (response.data?.success) {
        setReports(response.data.data || []);
      }
    } catch (error) {
      console.error("Critical error reading core intelligence repository logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLookupData();
    fetchAllReports();
  }, []);

  const handleInspectReport = (report) => {
    setActiveInspectionReport(report);
  };


  // --- 3. BINARY LOCAL FILE UPLOAD HANDLER ---
  const handleImageUpload = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
  
    setIsUploadingImage(true);
    const uploadPayload = new FormData();
    uploadPayload.append('file', selectedFile);
  
    try {
      const response = await Axios({
        url: summeryApi.uploadImage.url,
        method: summeryApi.uploadImage.method,
        data: uploadPayload,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      });
  
      if (response.data?.success) {
        // Look for Cloudinary's secure_url across common backend wrapper structures
        const targetUrl = 
          response.data.data?.secure_url || 
          response.data?.secure_url || 
          response.data.data?.url || 
          response.data?.url;
  
        if (targetUrl) {
          setFormData(prev => ({ ...prev, progressPhotoUrl: targetUrl }));
        } else {
          console.error("Cloudinary payload mapping discrepancy. Full response:", response.data);
          alert("Extraction Error: Could not locate a valid image URL in the upload response.");
        }
      }
    } catch (error) {
      console.error("Image file uplink compilation connection fault:", error);
      alert("FILE UPLOAD DISCREPANCY: Failed to write image binary to cloud directory pipeline.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  // --- 4. CREATE NEW REPORT SUBMISSION PIPELINE ---
  const handleCreateReport = async (e) => {
    e.preventDefault();
    if (!formData.projectId) {
      alert("CRITICAL ERROR: A target project boundary selection token is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        projectId: Number(formData.projectId),
        // Inject current system clock runtime timestamp context automatically
        reportDate: new Date().toISOString(),
        workersPresent: Number(formData.workersPresent)
      };

      const response = await Axios({
        url: summeryApi.createReport.url,
        method: summeryApi.createReport.method,
        data: payload,
        withCredentials: true
      });

      if (response.data?.success) {
        setFormData({
          projectId: '',
          reportTitle: '',
          reportType: 'DAILY_SITE_REPORT',
          workCompleted: '',
          workersPresent: 0,
          materialsUsed: '',
          weatherCondition: 'Sunny/Dry',
          challenges: '',
          progressPhotoUrl: ''
        });
        
        await fetchAllReports();
        setActiveView('INDEX');
      }
    } catch (error) {
      console.error("Critical exception writing operational report metrics to pipeline:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredReports = reports.filter(item => {
    const titleText = item.reportTitle || item.title || '';
    const idText = String(item.id || item._id || '');
    const typeText = item.reportType || 'DAILY_SITE_REPORT';

    const matchesSearch = titleText.toLowerCase().includes(searchQuery.toLowerCase()) || idText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'ALL' ? true : typeText === selectedFilter;
    return matchesSearch && matchesFilter;
  });


  // --- RENDERING ROUTER CONDITIONAL LOGIC ---
  if (activeView === 'CREATE_FORM') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased p-6 md:p-12 text-left">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* FORM PAGE HEADER */}
          <header className="flex items-center justify-between border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setActiveView('INDEX')}
                className="flex items-center gap-1.5 text-slate-400 hover:text-blue-600 font-black text-[10px] tracking-widest uppercase transition-colors"
              >
                <ArrowLeft size={12} /> Return
              </button>
              <h1 className="text-2xl font-black tracking-tighter uppercase text-[#111827] mt-2">
                Create Report
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Deployment Node Registry Page Context
              </p>
            </div>
          </header>

          {/* DEDICATED FULL-PAGE FORM LAYOUT */}
          <main className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-12">
            <form onSubmit={handleCreateReport} className="space-y-6 text-xs font-bold text-slate-700">
              
              {/* TARGET PROJECT SELECT DROPDOWN */}
              <div className="space-y-1.5 border-b border-slate-100 pb-5">
                <label className="block text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                  <Briefcase size={12} className="text-blue-600" /> Project *
                </label>
                <select
                  required
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs uppercase tracking-tight focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827] mt-1"
                >
                  <option value="">Select Project</option>
                  {projectsList.map((project) => {
                    const id = project.id || project._id || project.projectId;
                    return (
                      <option key={id} value={id}>
                        {project.projectName || project.name || "Unnamed Target Context"}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">Report Title *</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g., Concrete Pouring - Block A Foundation"
                    value={formData.reportTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, reportTitle: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 tracking-tight text-[#111827]"
                  />
                </div>


                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">Report Type</label>
                  <select
                    value={formData.reportType}
                    onChange={(e) => setFormData(prev => ({ ...prev, reportType: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs uppercase tracking-tight focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827]"
                  >
                    <option value="DAILY_SITE_REPORT">Daily Site Report</option>
                    <option value="INCIDENT_REPORT">Incident Report</option>
                    <option value="PROGRESS_REPORT">Progress Report</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">Active Personnel</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.workersPresent}
                    onChange={(e) => setFormData(prev => ({ ...prev, workersPresent: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">Weather Condition</label>
                  <input 
                    type="text"
                    placeholder="e.g., Sunny/Dry, Windy 15km/h"
                    value={formData.weatherCondition}
                    onChange={(e) => setFormData(prev => ({ ...prev, weatherCondition: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">Work Summary *</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Enter your work summery..."
                  value={formData.workCompleted}
                  onChange={(e) => setFormData(prev => ({ ...prev, workCompleted: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827] tracking-normal font-medium leading-relaxed"
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MATERIALS SELECT DROPDOWN INDEX */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                    <Package size={10} className="text-slate-400" /> Material
                  </label>
                  <select
                    value={formData.materialsUsed}
                    onChange={(e) => setFormData(prev => ({ ...prev, materialsUsed: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs uppercase tracking-tight focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827]"
                  >
                    <option value="">Select Material...</option>
                    {materialsList.map((material) => {
                      const matName = material.materialName || material.name || "Unnamed Resource";
                      const matUnit = material.unit || "";
                      return (
                        <option key={material.id || material._id} value={`${matName} ${matUnit}`.trim()}>
                          {matName} {matUnit ? `(${matUnit})` : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {/* FILE SELECTION & STREAM UPLOAD COMPONENT */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-1">
                    <Image size={10} className="text-slate-400" /> Upload Image
                  </label>
                  <div className="relative flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-[46px] border border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/70 rounded-xl cursor-pointer transition-all">
                      <div className="flex items-center justify-center gap-2 px-3 text-slate-400 group">
                        {isUploadingImage ? (
                          <RefreshCw size={14} className="animate-spin text-blue-600" />
                        ) : (
                          <UploadCloud size={14} className="group-hover:text-blue-600 transition-colors" />
                        )}
                        <span className="text-[10px] font-black tracking-tight uppercase truncate max-w-[280px]">
                          {isUploadingImage ? "Writing Image to Directory..." : 
                            formData.progressPhotoUrl ? "Change Selected Image Object File" : "Choose File"}
                        </span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        disabled={isUploadingImage}
                        onChange={handleImageUpload} 
                      />
                    </label>
                  </div>
                  {formData.progressPhotoUrl && (
                    <span className="text-[8px] font-black text-emerald-600 uppercase tracking-wider block mt-1">
                      ✓ Target cloud image pointer active
                    </span>
                  )}
                </div>
              </div>


              <div className="space-y-1.5">
                <label className="block text-[8px] font-black uppercase text-slate-400 tracking-widest">Challenges</label>
                <input 
                  type="text"
                  placeholder="Write challenges you face..."
                  value={formData.challenges}
                  onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827]"
                />
              </div>

              {/* ACTION FOOTER BAR */}
              <div className="flex justify-end items-center gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveView('INDEX')}
                  className="px-6 py-3.5 border border-slate-200 text-slate-400 hover:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors disabled:bg-slate-300"
                >
                  {isSubmitting ? <RefreshCw size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                  Submit
                </button>
              </div>

            </form>
          </main>
        </div>
      </div>
    );
  }

  // --- DEFAULT PRIMARY INDEX PERSPECTIVE VIEW ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#111827] font-sans antialiased p-6 md:p-12 text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- DASHBOARD HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase text-[#111827]">
              Project Report
            </h1>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setActiveView('CREATE_FORM')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-sm transition-colors"
            >
              <Plus size={14} /> Create Report
            </button>
          </div>
        </header>

        {/* --- FILTER AND SEARCH PIPELINE --- */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-1 focus:ring-blue-600 uppercase tracking-tight placeholder-slate-400"
            />
          </div>


          <div className="w-full md:w-auto flex justify-end">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="w-full md:w-56 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-[10px] font-black uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-blue-600 text-[#111827] cursor-pointer"
            >
              <option value="ALL">All Reports</option>
              <option value="DAILY_SITE_REPORT">Daily Site Report</option>
              <option value="INCIDENT_REPORT">Incident Report</option>
              <option value="PROGRESS_REPORT">Progress Report</option>
            </select>
          </div>
        </div>

        {/* --- MAIN LEDGER VAULT VIEW GRID --- */}
        <main className="w-full">
          <section className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Reports ({filteredReports.length})
              </h3>
            </div>

            {isLoading ? (
              <div className="bg-white p-16 rounded-[2rem] border border-slate-100 text-center flex items-center justify-center">
                <RefreshCw size={24} className="animate-spin text-slate-400" />
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="bg-white p-16 rounded-[2rem] border border-dashed border-slate-200 text-center">
                <AlertCircle className="mx-auto text-slate-300 mb-3" size={24} />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  No Report
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.map((report) => {
                  const currentId = report.id || report._id;
                  const currentType = report.reportType || 'DAILY_SITE_REPORT';
                  return (
                    <div
                      key={currentId}
                      onClick={() => handleInspectReport(report)}
                      className={`bg-white p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 hover:shadow-md group ${
                        (activeInspectionReport?.id || activeInspectionReport?._id) === currentId ? 'border-blue-500 shadow-sm' : 'border-slate-100'
                      }`}
                    >
                      <div className="flex items-start gap-4 truncate">
                        <div className={`p-3.5 rounded-xl shrink-0 ${
                          currentType === 'INCIDENT_REPORT' ? 'bg-rose-50 text-rose-600' :
                          currentType === 'PROGRESS_REPORT' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          <FileText size={18} />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                              ID: {String(currentId).slice(-6).toUpperCase()}
                            </span>
                            <span className="text-[7px] font-black px-2 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wider">
                              {currentType.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="text-[13px] font-black text-[#111827] uppercase tracking-tight mt-1 group-hover:text-blue-600 transition-colors truncate">
                            {report.reportTitle || report.title || 'Untitled Performance Abstract'}
                          </h4>

                          <div className="flex items-center gap-4 text-[9px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                            <span className="flex items-center gap-1">
                              <Calendar size={10} /> {formatDateString(report.reportDate || report.createdAt)}
                            </span>
                            <span>Project Context ID: {report.projectId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </div>
      {/* --- OVERLAY MODAL: DEEP EXTRACTION INSPECTOR --- */}
      <AnimatePresence>
        {activeInspectionReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            {/* Dark Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveInspectionReport(null)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
            />

            {/* Modal Box Window Layout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-2xl z-10 text-left overflow-hidden"
            >
              {/* Header Panel Node (Sticky Top) */}
              <div className="p-6 md:p-8 pb-4 border-b border-slate-50 shrink-0 flex justify-between items-start gap-4">
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Selected Object Identity</span>
                    <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Active Log
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#111827] uppercase tracking-tighter italic mt-1.5 leading-tight truncate">
                    {activeInspectionReport.reportTitle || activeInspectionReport.title || 'Performance Intelligence Metric Node'}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    System Reference Token: {activeInspectionReport.id || activeInspectionReport._id}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setActiveInspectionReport(null)}
                  className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-xl transition-all shrink-0 mt-0.5"
                >
                  <X size={14} />
                </button>
              </div>


              {/* Data Field Stream (Scrollable Center) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 space-y-4 text-xs font-bold text-slate-700 uppercase tracking-tight">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block flex items-center gap-1">
                    <HardHat size={10} /> Completed Execution Logic
                  </span>
                  <p className="text-[11px] font-medium text-slate-600 lowercase first-letter:uppercase normal-case tracking-normal leading-relaxed">
                    {activeInspectionReport.workCompleted || "No recorded completion description notes."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[7px] font-black text-slate-400 block mb-0.5">Workers Present</span>
                    <span className="font-black text-slate-800">{activeInspectionReport.workersPresent || 0} Operators</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[7px] font-black text-slate-400 block mb-0.5">Weather Metrics</span>
                    <span className="font-black text-slate-800 flex items-center gap-1">
                      <CloudSun size={11} /> {activeInspectionReport.weatherCondition || 'N/A'}
                    </span>
                  </div>
                </div>

                {activeInspectionReport.materialsUsed && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 block mb-1">Materials Vector Logs</span>
                    <p className="text-[10px] font-black text-slate-700">{activeInspectionReport.materialsUsed}</p>
                  </div>
                )}

                {activeInspectionReport.challenges && (
                  <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100/60">
                    <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 block mb-1 flex items-center gap-1">
                      <AlertCircle size={10} /> Active Deployment Impediments
                    </span>
                    <p className="text-[11px] text-slate-600 lowercase first-letter:uppercase normal-case tracking-normal font-medium leading-relaxed">
                      {activeInspectionReport.challenges}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function formatDateString(isoString) {
  if (!isoString) return '---';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
