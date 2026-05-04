'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Trash2, Rocket, CheckSquare, ChevronRight,
  ArrowLeft, DollarSign, Box, Loader2, Hash, Calendar, Clock, ListTodo, AlertCircle
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';

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
        // Reset form
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

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] p-4 md:p-10 text-left">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: PROJECTS HUB (RESTORING METRICS) */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-[1300px] mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Operational Hub</p>
                <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">Task Center</h1>
              </div>
              <button onClick={() => setView('create')} className="bg-[#111827] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl">
                <Plus size={14} strokeWidth={3} /> New Assignment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              <MiniMetric label="Total Projects" value={projectList.length} sub="Active Systems" />
              <MiniMetric label="Resource Load" value="94%" progress={94} />
              <div className="bg-[#111827] rounded-2xl p-5 text-white md:col-span-2 flex justify-between items-center shadow-lg">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">Navigation</p>
                  <p className="text-[11px] font-bold italic text-blue-400">Click a project row to fetch live task manifests from API.</p>
                </div>
                <Rocket size={20} className="text-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50/50">
                  <tr className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-b">
                    <th className="px-6 py-4 text-left">Project Metadata</th>
                    <th className="px-6 py-4 text-left">Internal Count</th>
                    <th className="px-6 py-4 text-right">Drill Down</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[10px]">
                  {projectList.map((p) => (
                    <tr key={p.id} onClick={() => handleProjectClick(p)} className="hover:bg-slate-50 transition-all cursor-pointer group">
                      <td className="px-6 py-5">
                        <h4 className="font-black text-[#111827] uppercase group-hover:text-blue-600">{p.projectName}</h4>
                        <p className="text-[8px] text-slate-400 uppercase tracking-widest">System ID: {p.id}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="bg-slate-100 px-2 py-1 rounded-md font-black">{p.Tasks?.length || 0} LOCAL RECORDS</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <ChevronRight size={14} className="inline text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: TASK TABLE (INTEGRATED & PROFESSIONAL) */}
        {view === 'tasks' && selectedProject && (
          <motion.div key="tasks" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-[1300px] mx-auto space-y-6 text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <button onClick={() => setView('list')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-black mb-2">
                    <ArrowLeft size={14} strokeWidth={3} /> Return to Hub
                </button>
                <h2 className="text-3xl font-black text-[#111827] uppercase italic tracking-tighter leading-none">{selectedProject.projectName}</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">API Request: {summeryApi.getTasks.url.replace("{projectId}", selectedProject.id)}</p>
              </div>
              <button 
                onClick={() => { setFormData(prev => ({...prev, projectId: selectedProject.id})); setView('create'); }}
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-lg hover:bg-black transition-all"
              >
                <Plus size={14} strokeWidth={3} /> Assign New Task
              </button>
            </div>

            <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden min-h-[400px]">
                <table className="w-full">
                    <thead className="bg-[#111827]">
                        <tr className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                            <th className="px-6 py-4 text-left border-r border-slate-800">Title & Status</th>
                            <th className="px-6 py-4 text-left border-r border-slate-800">Description</th>
                            <th className="px-6 py-4 text-left border-r border-slate-800">Priority</th>
                            <th className="px-6 py-4 text-left border-r border-slate-800">Timeline</th>
                            <th className="px-6 py-4 text-right">Budget</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[10px]">
                        {isLoadingTasks ? (
                          <tr>
                            <td colSpan="5" className="px-6 py-20 text-center">
                              <Loader2 size={24} className="animate-spin mx-auto text-blue-600 mb-2" />
                              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono">Status: Awaiting Server Response</p>
                            </td>
                          </tr>
                        ) : tasksForProject.length > 0 ? (
                          tasksForProject.map((task, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-5 border-r border-slate-50 min-w-[200px]">
                                    <h4 className="font-black text-[#111827] uppercase mb-1">{task.taskTitle}</h4>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-tighter">
                                        {task.taskStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-5 border-r border-slate-50 max-w-md">
                                    <p className="text-slate-500 font-medium leading-relaxed italic">{task.taskDescription}</p>
                                </td>
                                <td className="px-6 py-5 border-r border-slate-50 text-center">
                                    <div className={`inline-block px-3 py-1 rounded-full font-black text-[8px] tracking-widest ${
                                        task.taskPriority === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {task.taskPriority}
                                    </div>
                                </td>
                                <td className="px-6 py-5 border-r border-slate-50">
                                    <div className="flex flex-col gap-1">
                                        <span className="flex items-center gap-1 text-slate-400 font-bold uppercase text-[8px]">
                                            <Calendar size={10}/> {new Date(task.startDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1 text-red-400 font-bold uppercase text-[8px]">
                                            <Clock size={10}/> {new Date(task.dueDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-5 text-right font-black text-[#111827]">
                                    ${task.taskBudget?.toLocaleString()}
                                </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="px-6 py-20 text-center">
                              <Box size={32} className="mx-auto text-slate-200 mb-2" />
                              <p className="text-[10px] font-black uppercase text-slate-300 italic tracking-widest">No assigned tasks found in API</p>
                            </td>
                          </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </motion.div>
        )}

        {/* VIEW 3: CREATE FORM (RESTORING FULL LOGIC) */}
        {view === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-[850px] mx-auto text-left">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-8 hover:text-black">
              <ArrowLeft size={14} strokeWidth={3} /> Cancel Assignment
            </button>

            <form onSubmit={handleTaskSubmission} className="bg-white rounded-[2rem] border border-slate-200/60 shadow-2xl p-8 md:p-12 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600 font-mono">POST {summeryApi.assignTask.url}</p>
                  <h2 className="text-3xl font-black text-[#111827] uppercase italic tracking-tighter leading-none">Task Entry</h2>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><Hash size={24} className="text-slate-300" /></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Target Project</label>
                  <select name="projectId" value={formData.projectId} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500">
                    <option value={0}>SELECT ID</option>
                    {projectList.map(p => <option key={p.id} value={p.id}>{p.id} - {p.projectName.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">Assignee</label>
                  <select name="taskAssigneeID" value={formData.taskAssigneeID} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500">
                    <option value={0}>SELECT USER</option>
                    {userList.map(u => <option key={u.id || u._id} value={u.id || u._id}>{u.id || u._id} - {(u.name || u.firstName || "").toUpperCase()}</option>)}
                  </select>
                </div>

                <FormInput label="taskTitle" name="taskTitle" value={formData.taskTitle} onChange={handleInputChange} colSpan="md:col-span-2" icon={<Rocket size={16}/>} />
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">taskDescription</label>
                  <textarea name="taskDescription" value={formData.taskDescription} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500 h-24" />
                </div>

                <FormInput label="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} type="datetime-local" icon={<Calendar size={16}/>} />
                <FormInput label="dueDate" name="dueDate" value={formData.dueDate} onChange={handleInputChange} type="datetime-local" icon={<Clock size={16}/>} />
                <FormInput label="taskBudget" name="taskBudget" value={formData.taskBudget} onChange={handleInputChange} type="number" icon={<DollarSign size={16}/>} />

                <div className="space-y-1.5">
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400">taskPriority</label>
                  <select name="taskPriority" value={formData.taskPriority} onChange={handleInputChange} className="w-full bg-slate-50 border rounded-xl px-4 py-3 text-[11px] font-bold outline-none">
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              {/* MATERIALS SECTION (RESORED) */}
              <div className="pt-8 border-t border-slate-100 text-left">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2"><Box size={14} /> Materials Inventory</h3>
                  <button type="button" onClick={() => setFormData(p => ({...p, materials: [...p.materials, 0]}))} className="text-[9px] font-black uppercase text-blue-600 flex items-center gap-1"><Plus size={14} /> Add Row</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.materials.map((matId, idx) => (
                    <div key={idx} className="flex gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 items-center">
                      <select 
                        value={matId} 
                        onChange={(e) => {
                          const newMats = [...formData.materials];
                          newMats[idx] = Number(e.target.value);
                          setFormData(p => ({...p, materials: newMats}));
                        }} 
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold uppercase outline-none"
                      >
                        <option value={0}>SELECT RESOURCE</option>
                        {materialList.map(m => (
                          <option key={m.id} value={m.id}>{m.id} - {(m.materialName || m.name).toUpperCase()}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => setFormData(p => ({ ...p, materials: p.materials.filter((_, i) => i !== idx) }))} className="text-red-400 p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#111827] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex justify-center items-center gap-3 active:scale-95 transition-all shadow-2xl">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><CheckSquare size={18} strokeWidth={3} /> Commit Assignment</>}
              </button>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

// RESTORED SUB-COMPONENTS
function FormInput({ label, name, value, onChange, placeholder, icon, type = "text", colSpan = "" }) {
  return (
    <div className={`space-y-1.5 ${colSpan} text-left`}>
      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        <input name={name} value={value} onChange={onChange} type={type} placeholder={placeholder} className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${icon ? 'pl-10' : 'px-4'} py-3 text-[11px] font-bold outline-none focus:border-blue-500`} />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, sub, progress }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between text-left group">
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <div className="mt-2">
        <h4 className="text-2xl font-black italic text-[#111827] tracking-tighter">{value}</h4>
        {progress ? (
          <div className="h-1 w-full bg-slate-50 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        ) : <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{sub}</p>}
      </div>
    </div>
  );
}