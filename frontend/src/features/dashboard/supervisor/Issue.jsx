"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, X, Plus, Send, Camera, History,
  ChevronRight, ShieldAlert, ListTodo, ClipboardCheck,
  LayoutGrid, Search, Filter, Loader2
} from 'lucide-react';
import summeryApi from '../../../common/summeryApi'; 
import Axios from '../../../../utils/Axios'; 

export default function SupervisorIssueCenter() {
  const [issues, setIssues] = useState([]);
  const [tasks, setTasks] = useState([]); // Used to link issues to real dynamic task references
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showLogModal, setShowLogModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // New Media Storage States & Reference Pointers
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // Form State Linked to Dynamic Task References
  const [newIssue, setNewIssue] = useState({ 
    title: '', 
    desc: '', 
    priority: 'Routine',
    relatedTaskId: '' 
  });

  // 1. FETCH CONTEXT DATA (TASKS + ISSUES) ON MOUNT
  useEffect(() => {
    const initializeIssueCenter = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch tasks assigned to the supervisor first to get target project contexts
        const taskResponse = await Axios({
          ...summeryApi.getTasksByAssignee,
        });
        const fetchedTasks = taskResponse.data?.data || [];
        setTasks(fetchedTasks);

        // Extract the active Project ID from the assigned tasks ledger
        const activeProjectId = fetchedTasks[0]?.project?.id || fetchedTasks[0]?.projectId;

        if (activeProjectId) {
          // Construct the endpoint path using your summaryApi functional parameter pattern
          const targetUrl = summeryApi.getAllIssues.url(activeProjectId);

          const issueResponse = await Axios({
            url: targetUrl,
            method: summeryApi.getAllIssues.method,
          });

          setIssues(issueResponse.data?.data || []);
        } else {
          // Fallback context configuration if no tasks are assigned yet
          setIssues([]);
        }
      } catch (err) {
        console.error("Failed to synchronize with system Issue registry:", err);
        setError(err.response?.data?.message || "Error establishing network database connection.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeIssueCenter();
  }, []);

  // 2. DISPATCH MEDIA UPLOAD TO THE CLOUD INFRASTRUCTURE
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await Axios({
        url: summeryApi.uploadImage.url,
        method: summeryApi.uploadImage.method,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = response.data?.data?.url || response.data?.url;
      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
      }
    } catch (err) {
      console.error("Media server upload disruption caught:", err);
      alert(err.response?.data?.message || "Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // 3. DISPATCH CREATION SUBMISSION TO NEON DATABASE
  const handleLogIssue = async (e) => {
    e.preventDefault();
    
    // Find the referenced task to safely pull its project context mapping
    const linkedTask = tasks.find(t => t.id === Number(newIssue.relatedTaskId) || t._id === newIssue.relatedTaskId);
    const targetProjectId = linkedTask?.project?.id || linkedTask?.projectId || tasks[0]?.project?.id;

    if (!targetProjectId) {
      alert("Validation Error: Cannot identify target project tracking sequence context.");
      return;
    }

    try {
      setIsSubmitting(true);
      const targetUrl = summeryApi.createIssue.url(targetProjectId);

      // Map local components values to database column registry formats
      const payload = {
        title: newIssue.title,
        description: newIssue.desc,
        taskPriority: newIssue.priority.toUpperCase(), // Normalize matching system strings
        taskId: newIssue.relatedTaskId ? Number(newIssue.relatedTaskId) : null,
        issueImage: uploadedImageUrl || null, // Appends your uploaded image link directly to the DB column record
        history: ["Issue logged via Supervisor Dashboard Terminal Engine"]
      };

      const response = await Axios({
        url: targetUrl,
        method: summeryApi.createIssue.method,
        data: payload
      });

      // Insert fresh database record directly into view stream arrays instantly
      if (response.data?.data) {
        setIssues(prev => [response.data.data, ...prev]);
      } else {
        // Fallback UI rendering tracking update if response payload wraps data differently
        const structuralFallback = {
          id: response.data?.id || `ISS-${Math.floor(100 + Math.random() * 900)}`,
          title: newIssue.title,
          description: newIssue.desc,
          taskPriority: newIssue.priority.toUpperCase(),
          issueImage: uploadedImageUrl || null,
          status: "OPEN",
          createdAt: new Date().toISOString(),
          history: payload.history
        };
        setIssues(prev => [structuralFallback, ...prev]);
      }

      setShowLogModal(false);
      setNewIssue({ title: '', desc: '', priority: 'Routine', relatedTaskId: '' });
      setUploadedImageUrl(""); // Clean state storage safely after clear tracking loop
    } catch (err) {
      console.error("Critical submission disruption caught:", err);
      alert(err.response?.data?.message || "Submission failed. Please verify pipeline parameters.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F1F5F9] text-slate-900 p-6 md:p-10 font-sans antialiased">
      
      {/* PROFESSIONAL COMPACT HEADER */}
      <div className="max-w-[1400px] mx-auto mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-slate-900 p-1 rounded-sm text-white"><ShieldAlert size={12}/></div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Terminal / Issue Management</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Supervisor Console</h1>
        </div>

        <button 
          onClick={() => setShowLogModal(true)}
          disabled={tasks.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={14} strokeWidth={3}/> New Report
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6">
        
        {/* LEFT: COMPACT FEED */}
        <div className="col-span-12 lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2">
            <h2 className="text-[9px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ListTodo size={12}/> Site Impediments <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-sm">{issues.length}</span>
            </h2>
          </div>

          <div className="space-y-2">
            {isLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 gap-3">
                <Loader2 className="text-blue-600 animate-spin" size={20} />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Issue Ledger...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 text-red-600 rounded-2xl border border-red-100 p-6">
                <p className="text-[10px] font-black uppercase tracking-wider mb-1">Sync Failure</p>
                <p className="text-xs text-red-500/80 font-medium">{error}</p>
              </div>
            ) : issues.length > 0 ? (
              issues.map((iss) => {
                const priorityStr = (iss.taskPriority || iss.priority || "ROUTINE").toUpperCase();
                const statusStr = (iss.status || "OPEN").toUpperCase();
                const displayId = iss.id || iss._id;

                return (
                  <motion.div 
                    key={displayId}
                    layout
                    onClick={() => setSelectedIssue(iss)}
                    className={`group bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:border-blue-400 ${selectedIssue?.id === displayId || selectedIssue?._id === displayId ? 'ring-1 ring-blue-500 shadow-sm' : 'hover:shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-1 h-8 rounded-full ${priorityStr === 'CRITICAL' || priorityStr === 'HIGH' ? 'bg-red-500' : 'bg-slate-200'}`} />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[8px] font-bold text-slate-400 uppercase">Ref: #{displayId}</span>
                          {iss.taskId && (
                            <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-sm uppercase italic tracking-tighter">Task Reference: {iss.taskId}</span>
                          )}
                        </div>
                        <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-tight">{iss.title}</h3>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-[8px] font-bold text-slate-400 uppercase mb-1">Status</span>
                        <div className={`px-2 py-0.5 rounded-full border text-[8px] font-black uppercase ${statusStr === 'OPEN' ? 'text-red-500 border-red-100 bg-red-50' : 'text-blue-500 border-blue-100 bg-blue-50'}`}>
                          {statusStr}
                        </div>
                      </div>
                      <ChevronRight className="text-slate-200 group-hover:text-blue-500 transition-colors" size={16} />
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">No logged track issues found</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: INSPECTION SIDEBAR */}
        <aside className="col-span-12 lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedIssue ? (
              <motion.div 
                key={selectedIssue.id || selectedIssue._id}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm sticky top-10"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Issue Context</h2>
                  <button onClick={() => setSelectedIssue(null)} className="p-1 hover:bg-slate-100 rounded text-slate-400"><X size={14}/></button>
                </div>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-[9px] font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5">
                      <LayoutGrid size={10}/> Technical Summary
                    </h4>
                    <p className="text-[11px] font-medium leading-relaxed text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-100 italic">
                      "{selectedIssue.description}"
                    </p>
                  </div>

                  {/* DISPLAY IMAGE IF ATTACHED TO RECORD */}
                  {(selectedIssue.issueImage || selectedIssue.image) && (
                    <div className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                      <img 
                        src={selectedIssue.issueImage || selectedIssue.image} 
                        alt="Technical verification reference" 
                        className="w-full h-auto max-h-40 object-cover"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                     <DataPoint label="Criticality" value={selectedIssue.taskPriority || selectedIssue.priority || "Routine"} />
                     <DataPoint label="Logged On" value={selectedIssue.createdAt ? new Date(selectedIssue.createdAt).toLocaleDateString('en-GB') : selectedIssue.date || "N/A"} />
                  </div>

                  {selectedIssue.history && Array.isArray(selectedIssue.history) && (
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-[9px] font-black uppercase text-slate-400 mb-3 flex items-center gap-1.5">
                        <History size={10}/> Chain of Custody
                      </h4>
                      <div className="space-y-3">
                        {selectedIssue.history.map((log, i) => (
                          <div key={i} className="flex gap-3 text-[10px] text-slate-500 font-medium">
                            <div className="w-0.5 bg-slate-100" />
                            <p>{log}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-64 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-300 gap-2">
                <ClipboardCheck size={32} strokeWidth={1} />
                <p className="text-[8px] font-black uppercase tracking-widest">Awaiting Selection</p>
              </div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {/* MODAL SYSTEM */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.97, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.97, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.45, bounce: 0.1 }}
              className="bg-white rounded-[24px] w-full max-w-[540px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.2)] border border-slate-100 relative overflow-hidden max-h-[calc(100vh-2rem)] flex flex-col"
            >
              <div className="flex items-center justify-between px-8 pt-8 pb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Manual Entry: Site Issue</span>
                <button 
                  type="button"
                  onClick={() => setShowLogModal(false)} 
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <X size={18} strokeWidth={2.5}/>
                </button>
              </div>

              <form onSubmit={handleLogIssue} className="px-8 pb-8 pt-2 sm:px-10 sm:pb-10 space-y-5 overflow-y-auto">
                
                {/* SELECT RELATED TASK */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Related Task Context</label>
                  <select
                    required
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 text-[12px] font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                    value={newIssue.relatedTaskId}
                    onChange={(e) => setNewIssue({...newIssue, relatedTaskId: e.target.value})}
                  >
                    <option value="">-- Choose Assigned System Task Reference --</option>
                    {tasks.map(task => (
                      <option key={task.id || task._id} value={task.id || task._id}>
                        [{task.project?.projectName || "Sector"}] {task.taskTitle}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ISSUE TITLE */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Issue Title</label>
                  <input 
                    required
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 text-[12px] font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300"
                    placeholder="Short summary of the problem"
                    value={newIssue.title}
                    onChange={(e) => setNewIssue({...newIssue, title: e.target.value})}
                  />
                </div>

                {/* FULL DESCRIPTION */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Full Description</label>
                  <textarea 
                    required
                    className="w-full bg-white border border-slate-200/80 rounded-xl px-4 py-3.5 text-[12px] font-medium text-slate-800 outline-none h-28 resize-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all placeholder:text-slate-300"
                    placeholder="Detail the technical specifications or site conditions..."
                    value={newIssue.desc}
                    onChange={(e) => setNewIssue({...newIssue, desc: e.target.value})}
                  />
                </div>

                {/* PRIORITY SELECTION */}
                <div className="space-y-2">
                  <label className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">Priority Level</label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {['Routine', 'High', 'Critical'].map(lvl => (
                      <button 
                        key={lvl} type="button"
                        onClick={() => setNewIssue({...newIssue, priority: lvl})}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                          newIssue.priority === lvl 
                            ? 'bg-[#0B132B] border-[#0B132B] text-white shadow-sm' 
                            : 'bg-white border-slate-200/70 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HIDDEN RAW FILE INPUT */}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden" 
                />

                {/* ACTIONS */}
                <div className="flex flex-col gap-2 pt-2">
                  {uploadedImageUrl && (
                    <div className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100 truncate">
                      ✓ Media attached: {uploadedImageUrl.split('/').pop()}
                    </div>
                  )}
                  
                  <div className="flex gap-3">
                    <button 
                      type="button" 
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 bg-[#F1F5F9] hover:bg-slate-200 disabled:bg-slate-100 text-slate-600 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      {isUploading ? (
                        <Loader2 size={15} className="animate-spin text-slate-400" />
                      ) : (
                        <Camera size={15} strokeWidth={2.5}/>
                      )}
                      {isUploading ? "Uploading..." : uploadedImageUrl ? "Change Media" : "Add Media"}
                    </button>
                     
                    <button 
                      type="submit" 
                      disabled={isSubmitting || isUploading}
                      className="flex-[1.8] bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                    >
                      {isSubmitting ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <Send size={15} strokeWidth={2.5}/>
                      )}
                      Log to Registry
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DataPoint({ label, value }) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <p className="text-[8px] font-black uppercase text-slate-400 mb-1">{label}</p>
      <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">{value}</p>
    </div>
  );
}