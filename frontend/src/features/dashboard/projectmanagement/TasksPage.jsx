'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Rocket, CheckSquare, ChevronRight,
  ArrowLeft, DollarSign, Box, Loader2, Hash, Calendar, Clock, AlertCircle
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['projectId', 'taskAssigneeID', 'taskBudget'];
    setFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value
    }));
  };

  const handleTaskSubmission = async(e) => {
    e.preventDefault();
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
          <span className="text-[10px] text-slate-400 font-medium">System ID: {row.id}</span>
        </div>
      )
    },
    {
      header: "Task Assigned",
      accessor: "projectProgress.totalTasks",
      cell: (row) => {
        const taskCount = row.projectProgress?.totalTasks ?? 0;
        
        return (
          <span className="text-xs font-semibold text-slate-700">
            {taskCount} {taskCount <= 1 ? 'Task' : 'Tasks'}
          </span>
        );
      }
      
    },
    {
      header: "Action",
      align: "right",
      width: "80px",
      cell: (row) => (
        <button 
          onClick={(e) => { e.stopPropagation(); handleProjectClick(row); }}
          className="p-1.5 hover:bg-slate-100 rounded border border-slate-200 text-slate-500 transition-colors inline-flex items-center gap-1 text-[11px] font-bold"
        >
          View Tasks <ChevronRight size={13} />
        </button>
      )
    }
  ];

  // --- Column Configuration 2: Task Details Manifest ---
  const taskColumns = [
    {
      header: "No.",
      width: "60px",
      align: "center",
      cell: (_, rowNumber) => <span className="text-slate-400 font-bold font-mono">{rowNumber}</span>
    },
    {
      header: "Title & Scope",
      accessor: "taskTitle",
      cell: (row) => (
        <div>
          <span className="font-bold text-slate-900 block text-xs">{row.taskTitle}</span>
          <span className="text-[10px] text-slate-400 font-medium line-clamp-1 max-w-sm">{row.taskDescription}</span>
        </div>
      )
    },
    {
      header: "Priority Label",
      accessor: "taskPriority",
      align: "center",
      cell: (row) => (
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
          row.taskPriority === 'HIGH' 
            ? 'bg-red-50 text-red-700 border-red-200' 
            : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          {row.taskPriority}
        </span>
      )
    },
    {
      header: "Timeline",
      accessor: "startDate",
      cell: (row) => (
        <div className="flex flex-col gap-0.5 font-mono text-[10px]">
          <span className="text-slate-500 font-medium">Start: {new Date(row.startDate).toLocaleDateString()}</span>
          <span className="text-red-600 font-semibold">Due: {new Date(row.dueDate).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: "Workflow Status",
      accessor: "taskStatus",
      align: "right",
      cell: (row) => (
        <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
          {row.taskStatus}
        </span>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] p-4 md:p-8 text-slate-900 font-sans antialiased text-left">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: PROJECTS HUB VIEW */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1300px] mx-auto space-y-6">
            <div className="flex justify-between items-center border-b border-slate-200 pb-5">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Task Assignment Center</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">Select an active project infrastructure asset node below to manage workflows.</p>
              </div>
              <button onClick={() => setView('create')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-slate-800 flex items-center gap-1.5 shadow-sm">
                <Plus size={14} /> New Assignment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <MiniMetric label="Total Active Projects" value={projectList.length} sub="Monitored Systems" />
              <MiniMetric label="System Resource Capacity" value="94%" progress={94} />
              <div className="bg-slate-900 rounded-xl p-4 text-white flex justify-between items-center border border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Operations Console</p>
                  <p className="text-xs font-medium text-slate-300">Clicking actions syncs target task schema arrays instantly.</p>
                </div>
                <Rocket size={18} className="text-slate-400" />
              </div>
            </div>
          
             {
              isLoadingTasks ? (
                <Loader message="Loading Tasks..."/>
              ):(
                <Table 
              columns={projectColumns}
              data={projectList}
              searchPlaceholder="Filter managed systems..."
            />
              )
             }

            
          </motion.div>
        )}

        {/* VIEW 2: DRILL-DOWN TASK LIST VIEW */}
        {view === 'tasks' && selectedProject && (
          <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1300px] mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
              <div className="space-y-1">
                <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                    <ArrowLeft size={14} /> Back to Asset Directory
                </button>
                <h2 className="text-xl font-bold text-slate-900 uppercase">{selectedProject.projectName}</h2>
                <p className="text-xs text-slate-400 font-medium">Displaying tasks belonging to Project ID Node: {selectedProject.id}</p>
              </div>
              <button 
                onClick={() => { setFormData(prev => ({...prev, projectId: selectedProject.id})); setView('create'); }}
                className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
              >
                <Plus size={14} /> Assign New Task
              </button>
            </div>

            {isLoadingTasks ? (
              <Loader message="Loading Task Details..." />
            ) : (
              <Table 
                columns={taskColumns}
                data={tasksForProject}
                searchPlaceholder="Search assigned tasks..."
              />
            )}
          </motion.div>
        )}

        {/* VIEW 3: CREATE ASSIGNMENT FORM */}
        {view === 'create' && (
          <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[850px] mx-auto">
            <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-6 transition-colors">
              <ArrowLeft size={14} /> Cancel Assigning
            </button>

            <form onSubmit={handleTaskSubmission} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
              <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-900 uppercase">Task Assignment Form</h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Input precise workflow parameters to commit database modifications.</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-400 shadow-sm"><Hash size={18} /></div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Select Project</label>
                    <select name="projectId" value={formData.projectId} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400">
                      <option value={0}>SELECT RECORD ID</option>
                      {projectList.map(p => <option key={p.id} value={p.id}>{p.id} - {p.projectName.toUpperCase()}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Select Task Assignee User</label>
                    <select name="taskAssigneeID" value={formData.taskAssigneeID} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400">
                      <option value={0}>SELECT DEPLOYMENT TARGET</option>
                      {userList.map(u => <option key={u.id || u._id} value={u.id || u._id}>{u.id || u._id} - {(u.name || u.firstName || "").toUpperCase()}</option>)}
                    </select>
                  </div>

                  <FormInput label="Task Title" name="taskTitle" value={formData.taskTitle} onChange={handleInputChange} colSpan="md:col-span-2" />
                  
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Task Objective Description</label>
                    <textarea name="taskDescription" value={formData.taskDescription} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 h-24 resize-none" />
                  </div>

                  <FormInput label="Operation Start Date" name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" />
                  <FormInput label="Operation Due Date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} type="date" />
                  <FormInput label="Task Allocated Fiscal Budget ($)" name="taskBudget" value={formData.taskBudget} onChange={handleInputChange} type="number" />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Severity Priority Tier</label>
                    <select name="taskPriority" value={formData.taskPriority} onChange={handleInputChange} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400">
                      <option value="LOW">LOW</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HIGH">HIGH</option>
                    </select>
                  </div>
                </div>

                {/* MATERIALS INVENTORY LOGIC SECTION */}
                <div className="pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5"><Box size={14} /> Required Resource Allocations</h3>
                    <button type="button" onClick={() => setFormData(p => ({...p, materials: [...p.materials, 0]}))} className="text-xs font-bold text-slate-900 hover:text-slate-700 flex items-center gap-1 transition-colors"><Plus size={14} /> Add Resource Row</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {formData.materials.map((matId, idx) => (
                      <div key={idx} className="flex gap-2 bg-slate-50 p-2 border border-slate-200 rounded-lg items-center">
                        <select 
                          value={matId} 
                          onChange={(e) => {
                            const newMats = [...formData.materials];
                            newMats[idx] = Number(e.target.value);
                            setFormData(p => ({...p, materials: newMats}));
                          }} 
                          className="flex-1 bg-white border border-slate-200 rounded-md px-2 py-1.5 text-xs font-medium text-slate-800 outline-none"
                        >
                          <option value={0}>SELECT SYSTEM MATERIAL</option>
                          {materialList.map(m => (
                            <option key={m.id} value={m.id}>{m.id} - {(m.materialName || m.name).toUpperCase()}</option>
                          ))}
                        </select>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, materials: p.materials.filter((_, i) => i !== idx) }))} className="text-red-500 p-1.5 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider flex justify-center items-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50">
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><CheckSquare size={14} />Assign Task</>}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// Normalized Reusable Sub Components Input Form Standard
function FormInput({ label, name, value, onChange, placeholder, type = "text", colSpan = "" }) {
  return (
    <div className={`space-y-1.5 ${colSpan}`}>
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      <input 
        name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} 
        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-all" 
      />
    </div>
  );
}

function MiniMetric({ label, value, sub, progress }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-2">
        <h4 className="text-xl font-bold text-slate-900">{value}</h4>
        {progress ? (
          <div className="h-1.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden border border-slate-200/50">
            <div className="h-full bg-slate-800" style={{ width: `${progress}%` }} />
          </div>
        ) : <p className="text-[10px] font-medium text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}