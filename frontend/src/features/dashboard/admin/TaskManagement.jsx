'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Rocket, CheckSquare, ChevronRight,
  ArrowLeft, DollarSign, Box, Loader2, Hash, Calendar, 
  Clock, AlertCircle, Layout, User, Briefcase, ChevronDown, X
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';
import Table from '../../../components/dashboard/Table';
import Loader from '../../../components/dashboard/Loader';

export default function TaskCenter() {
  const [view, setView] = useState('list'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]); 
  const [materialList, setMaterialList] = useState([]);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasksForProject, setTasksForProject] = useState([]); 

  const [formData, setFormData] = useState({
    projectId: 0,
    taskAssigneeID: 0, 
    taskTitle: '',
    taskDescription: '',
    startDate: '',
    dueDate: '',
    taskBudget: 0,
    taskPriority: 'HIGH',
    taskStatus: 'TODO',
    materials: [] 
  });

  const loadInitialData = async () => {
    try {
      isLoadingTasks(true);
      const [projRes, userRes, matRes] = await Promise.all([
        Axios({...summeryApi.getAllProjects}),
        Axios({...summeryApi.getUsers}),
        Axios({...summeryApi.getAllMaterial}) 
      ]);
      setProjectList(projRes.data.data || []);
      const allUsers = userRes.data.data.users || userRes.data.data || [];
      setUserList(allUsers.filter(u => u && (u.id || u._id)));
      setMaterialList(matRes.data.data || []); 
    } catch (error) {
      console.error("Initial Load Error:", error);
    } finally{
      isLoadingTasks(false);
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const handleProjectClick = async (project) => {
    setSelectedProject(project);
    setView('tasks');
    setIsLoadingTasks(true);
    setTasksForProject([]); 

    try {
      const response = await Axios({
        method: summeryApi.getTasks.method,
        url: summeryApi.getTasks.url.replace("{projectId}", project.id)
      });
      if (response.data.success) {
        setTasksForProject(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const handleInputChange = (field, value) => {
    const numericFields = ['projectId', 'taskAssigneeID', 'taskBudget'];
    setFormData(prev => ({
      ...prev,
      [field]: numericFields.includes(field) ? Number(value) : value
    }));
  };

  const handleTaskSubmission = async(e) => {
    e.preventDefault();
    if (formData.projectId === 0 || formData.taskAssigneeID === 0 || !formData.taskTitle.trim()) {
      alert("Please ensure Project, Assignee User, and Task Title fields are accurately filled out.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };

      const response = await Axios({ ...summeryApi.assignTask, data: payload });

      if (response.data.success) {
        alert("Task Successfully Assigned");
        await loadInitialData(); 
        setView('list');
        setFormData({
          projectId: 0, taskAssigneeID: 0, taskTitle: '', taskDescription: '',
          startDate: '', dueDate: '', taskBudget: 0, taskPriority: 'HIGH',
          taskStatus: 'TODO', materials: []
        });
      }
    } catch (error) {
      alert(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Column Configuration 1: Project List Directory ---
  const projectColumns = [
    {
      header: "Project Details",
      accessor: "projectName",
      cell: (row) => (
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/40">
            <Briefcase size={14} />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs truncate uppercase">{row.projectName}</span>
            <span className="text-[10px] text-slate-400 font-medium block">System ID: {row.id}</span>
          </div>
        </div>
      )
    },
    {
      header: "Task Distribution Density",
      accessor: "projectProgress.totalTasks",
      cell: (row) => {
        const taskCount = row.projectProgress?.totalTasks ?? 0;
        return (
          <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
            {taskCount} {taskCount === 1 ? 'Task Assigned' : 'Tasks Assigned'}
          </span>
        );
      }
    },
    {
      header: "Action Node",
      align: "right",
      width: "120px",
      cell: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleProjectClick(row); }}
          className="p-1.5 hover:bg-slate-100 rounded border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-tight shadow-2xs"
        >
          View Tasks <ChevronRight size={12} />
        </button>
      )
    }
  ];

  // --- Column Configuration 2: Task Details Manifest ---
  const taskColumns = [
    {
      header: "Task Title & Scope",
      accessor: "taskTitle",
      cell: (row) => (
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/40">
            <Layout size={14} />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-xs uppercase">{row.taskTitle}</span>
            <span className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-sm block">{row.taskDescription || "No objective descriptions specified."}</span>
          </div>
        </div>
      )
    },
    {
      header: "Priority Metric",
      accessor: "taskPriority",
      align: "center",
      cell: (row) => {
        const isHigh = row.taskPriority === 'HIGH';
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase ${
            isHigh ? 'bg-rose-50 text-rose-700 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'
          }`}>
            <span className={`w-1 h-1 rounded-full ${isHigh ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
            {row.taskPriority}
          </span>
        );
      }
    },
    {
      header: "Timeline Framework",
      accessor: "startDate",
      cell: (row) => (
        <div className="flex flex-col text-[10px] text-left font-semibold">
          <span className="text-slate-400">Start: {row.startDate ? new Date(row.startDate).toLocaleDateString() : 'N/A'}</span>
          <span className="text-slate-900 mt-0.5">Limit: {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : 'N/A'}</span>
        </div>
      )
    },
    {
      header: "Status",
      accessor: "taskStatus",
      align: "right",
      cell: (row) => (
        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight">
          {row.taskStatus || "TODO"}
        </span>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans antialiased text-left">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: PROJECTS HUB DIRECTORY LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-[1300px] mx-auto space-y-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Task Assignment Center</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">Select an active project infrastructure asset node below to manage workflows.</p>
              </div>
              <button onClick={() => setView('create')} className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
                <Plus size={14} /> New Assignment
              </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MiniMetric label="Total Active Projects" value={projectList.length} subtext="Registered Framework Systems" icon={<Briefcase size={14}/>} />
              <MiniMetric label="System Matrix Pipeline" value="Operational" subtext="All context routers online" icon={<Rocket size={14}/>} />
              <MiniMetric label="Global Resource Pools" value={`${materialList.length} Nodes`} subtext="Inventory structural units" icon={<Box size={14}/>} />
            </div>
          
            {isLoadingTasks ? (
              <Loader message="Loading tasks ..." />
            ) : (
              <Table 
                columns={projectColumns}
                data={projectList}
                searchPlaceholder="Filter managed systems..."
              />
            )}
          </motion.div>
        )}

        {/* VIEW 2: PROJECTS EXPANDED GRID TASK DETAIL WORKPLACE */}
        {view === 'tasks' && selectedProject && (
          <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-[1300px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
              <div>
                <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 mb-2 transition-colors">
                    <ArrowLeft size={12} /> Back to Directory
                </button>
                <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">{selectedProject.projectName}</h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Displaying operational workflows mapping to Project Context ID: {selectedProject.id}</p>
              </div>
              <button 
                onClick={() => { setFormData(prev => ({...prev, projectId: selectedProject.id})); setView('create'); }}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
              >
                <Plus size={14} /> Assign New Task
              </button>
            </div>

            {isLoadingTasks ? (
              <div className="w-full min-h-[350px] flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm">
                <Loader2 size={24} className="animate-spin text-slate-700" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loading project tasks metadata...</span>
              </div>
            ) : (
              <Table 
                columns={taskColumns}
                data={tasksForProject}
                searchPlaceholder="Search assigned workflows..."
              />
            )}
          </motion.div>
        )}

        {/* VIEW 3: EXACT TASK DYNAMIC CREATION FORM PRESET */}
        {view === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.99 }} className="max-w-[900px] mx-auto py-4">
            <form onSubmit={handleTaskSubmission} className="bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden space-y-6">
              
              {/* Form Branding Top Header Header Bar */}
              <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <button 
                    type="button" 
                    onClick={() => setView('list')} 
                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 mb-1.5 transition-colors"
                  >
                    <ArrowLeft size={12} /> Cancel Assigning Workflow
                  </button>
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Layout size={16} className="text-slate-900" /> Operational Task Assignment Form
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Input precise runtime data values to initialize deployment pipeline records.</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-400 shadow-sm"><Hash size={16} /></div>
              </div>

              {/* Form Structural Elements Grid Section */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* DYNAMIC COMPONENT 1: SELECT PROJECT PIPELINE ARRAY */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Project Target Framework</label>
                    <div className="relative">
                      <Briefcase size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                      <select 
                        name="projectId" 
                        value={formData.projectId} 
                        onChange={(e) => handleInputChange('projectId', e.target.value)} 
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs outline-none focus:border-slate-400 focus:bg-white appearance-none cursor-pointer text-slate-800 transition-all"
                      >
                        <option value={0}>SELECT ENTERPRISE PROJECT NODE</option>
                        {projectList.map(p => (
                          <option key={p.id} value={p.id}>ID: {p.id} — {p.projectName.toUpperCase()}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* DYNAMIC COMPONENT 2: SELECT USER ASSIGNEE POOL */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Task Assignee Operational User</label>
                    <div className="relative">
                      <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                      <select 
                        name="taskAssigneeID" 
                        value={formData.taskAssigneeID} 
                        onChange={(e) => handleInputChange('taskAssigneeID', e.target.value)} 
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs outline-none focus:border-slate-400 focus:bg-white appearance-none cursor-pointer text-slate-800 transition-all"
                      >
                        <option value={0}>SELECT WORKFORCE TARGET OPERATOR</option>
                        {userList.map(u => (
                          <option key={u.id || u._id} value={u.id || u._id}>ID: {u.id || u._id} — {(u.name || u.firstName || "").toUpperCase()}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <FormInputGroup 
                      label="Task Identifier Title" 
                      name="taskTitle" 
                      value={formData.taskTitle} 
                      onChange={(v) => handleInputChange('taskTitle', v)} 
                      icon={<Layout size={13} />} 
                      placeholder="e.g. Integrate Structural Engineering Schematics Framework"
                    />
                  </div>
                  
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Task Objective Scope Description</label>
                    <textarea 
                      name="taskDescription" 
                      value={formData.taskDescription} 
                      onChange={(e) => handleInputChange('taskDescription', e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition-all h-24 resize-none" 
                      placeholder="Describe target goals, sprint criteria and execution bounds..."
                    />
                  </div>

                  <FormInputGroup 
                    label="Operation Execution Start Date" 
                    name="startDate" 
                    value={formData.startDate} 
                    onChange={(v) => handleInputChange('startDate', v)} 
                    type="date" 
                    icon={<Calendar size={13} />}
                  />
                  
                  <FormInputGroup 
                    label="Operation Execution Limit Due Date" 
                    name="dueDate" 
                    value={formData.dueDate} 
                    onChange={(v) => handleInputChange('dueDate', v)} 
                    type="date" 
                    icon={<Calendar size={13} />}
                  />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allocated Fiscal Capital Budget (ETB)</label>
                    <div className="relative">
                      <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="number" 
                        name="taskBudget" 
                        value={formData.taskBudget} 
                        onChange={(e) => handleInputChange('taskBudget', e.target.value)} 
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs outline-none focus:border-slate-400 focus:bg-white text-slate-800 transition-all" 
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Severity Priority Metric Tier</label>
                    <div className="relative">
                      <AlertCircle size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                      <select 
                        name="taskPriority" 
                        value={formData.taskPriority} 
                        onChange={(e) => handleInputChange('taskPriority', e.target.value)} 
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs outline-none focus:border-slate-400 focus:bg-white appearance-none cursor-pointer text-slate-800 transition-all"
                      >
                        <option value="LOW font-bold">LOW DEPLOYMENT VALUE</option>
                        <option value="MEDIUM font-bold">MEDIUM STANDARD RUNTIME</option>
                        <option value="HIGH font-bold">HIGH CRITICAL SEVERITY PATH</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* MATERIALS MANAGEMENT SYSTEM SECTOR SUBSYSTEM LAYER */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Box size={13} /> Required Logistical Material Assets
                    </h3>
                    <button 
                      type="button" 
                      onClick={() => setFormData(p => ({...p, materials: [...p.materials, 0]}))} 
                      className="text-[10px] font-bold text-slate-900 hover:text-slate-600 flex items-center gap-1 transition-colors uppercase tracking-wider"
                    >
                      <Plus size={12} /> Add Allocation Row
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.materials.map((matId, idx) => (
                      <div key={idx} className="flex gap-2 bg-slate-50 p-2 border border-slate-200 rounded-lg items-center animate-in fade-in duration-700">
                        <div className="relative flex-1">
                          <Box size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 z-10" />
                          <select 
                            value={matId} 
                            onChange={(e) => {
                              const newMats = [...formData.materials];
                              newMats[idx] = Number(e.target.value);
                              setFormData(p => ({...p, materials: newMats}));
                            }} 
                            className="w-full pl-8 pr-8 py-1.5 bg-white border border-slate-200 rounded-md text-[11px] font-semibold text-slate-800 outline-none focus:border-slate-300 appearance-none cursor-pointer"
                          >
                            <option value={0}>SELECT INVENTORY MATERIAL</option>
                            {materialList.map(m => (
                              <option key={m.id} value={m.id}>ID: {m.id} — {(m.materialName || m.name || '').toUpperCase()}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <button 
                          type="button" 
                          onClick={() => setFormData(p => ({ ...p, materials: p.materials.filter((_, i) => i !== idx) }))} 
                          className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-rose-50 rounded border border-transparent hover:border-rose-100 transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lower Layout Interaction Processing Layer */}
                <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-end p-4 bg-slate-50 border border-slate-200/60 rounded-xl">
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button 
                      type="button"
                      onClick={() => setView('list')} 
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg font-bold text-xs hover:bg-slate-50 hover:text-slate-800 transition-all disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="flex-1 sm:flex-none px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex justify-center items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-sm"
                    >
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><CheckSquare size={14} /> Assign Workflow Task</>}
                    </button>
                  </div>
                </div>

              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// Shared Form Component Atom standard layout
function FormInputGroup({ label, name, value, onChange, placeholder, type = "text" , icon }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input 
          name={name} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          type={type} 
          placeholder={placeholder} 
          className={`w-full ${icon ? 'pl-9' : 'px-3'} pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-xs text-slate-800 outline-none focus:border-slate-400 focus:bg-white transition-all`} 
        />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, subtext, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <span className="text-base font-bold tracking-tight text-slate-900 block">{value}</span>
        <span className="text-[10px] text-slate-400 font-medium block">{subtext}</span>
      </div>
      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 shrink-0">{icon}</div>
    </div>
  );
}