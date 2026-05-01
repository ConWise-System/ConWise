'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MoreHorizontal, Filter, Trash2,
  Clock, Rocket, CheckSquare, ChevronRight,
  ArrowLeft, User, DollarSign, Box, Loader2, Hash, Calendar
} from 'lucide-react';
import Axios from '../../../../utils/Axios';
import summeryApi from '../../../common/summeryApi';

export default function TaskCenter() {
  const [view, setView] = useState('list'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState([]); 
  const [projectList, setProjectList] = useState([]);
  const [userList, setUserList] = useState([]); // Renamed for clarity
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  const [formData, setFormData] = useState({
    projectId: 0,
    assigneeUserId: 0,
    taskAssigneeID: 0, // Often kept in sync with assigneeUserId
    taskTitle: '',
    taskDescription: '',
    startDate: '',
    dueDate: '',
    taskBudget: 0,
    taskPriority: 'HIGH',
    taskStatus: 'TODO',
    materials: [] 
  });

  const loadProjects = async () => {
    try {
      const res = await Axios({...summeryApi.getAllProjects});
      setProjectList(res.data.data || []);
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await Axios({...summeryApi.getUsers});
      // Added safety check for different possible API response structures
      const allUsers = response.data.data.users || response.data.data || [];
      
      // Filtering to ensure we only have users with valid IDs and Names
      const cleanUsers = allUsers.filter(u => u && (u.id || u._id) && (u.name || u.firstName)); 
      setUserList(cleanUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadProjects();
    loadUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['projectId', 'assigneeUserId', 'taskAssigneeID', 'taskBudget'];
    
    setFormData(prev => {
      const newVal = numericFields.includes(name) ? Number(value) : value;
      
      // If we update assigneeUserId, we likely want to keep taskAssigneeID in sync
      if (name === 'assigneeUserId') {
        return { ...prev, [name]: newVal, taskAssigneeID: newVal };
      }
      
      return { ...prev, [name]: newVal };
    });
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setView('taskDetail');
    loadTasksByProject(project.id || project._id); 
  };

  const loadTasksByProject = async (projectId) => {
    setIsLoadingTasks(true);
    try {
      const response = await Axios({
        method: 'GET',
        url: `/api/projects/${projectId}/tasks` 
      });
      if (response.data.success) {
        setTasks(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]); 
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // ... (addMaterial, updateMaterial, removeMaterial remain the same)
  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { 
        materialName: '', quantityUsed: 0, unit: '', usageDescription: '', materialStatus: 'AVAILABLE' 
      }]
    }));
  };

  const updateMaterial = (index, field, value) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index][field] = field.includes('quantity') ? Number(value) : value;
    setFormData(prev => ({ ...prev, materials: updatedMaterials }));
  };

  const removeMaterial = (index) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleTaskSubmission = async(e) => {
    e.preventDefault();
    if (formData.projectId === 0 || formData.assigneeUserId === 0) {
      alert("Please select a Project and an Assignee");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await Axios({
        ...summeryApi.assignTask,
        data: formData
      });
      if (response.data.success) {
        alert("Task Created Successfully!");
        setFormData({
          projectId: 0, assigneeUserId: 0, taskAssigneeID: 0,
          taskTitle: '', taskDescription: '', startDate: '',
          dueDate: '', taskBudget: 0, taskPriority: 'HIGH',
          taskStatus: 'TODO', materials: [] 
        });
        setView('list');
      }
    } catch (error) {
      alert(error.response?.data?.message || "Check console for details");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] p-4 md:p-10">
      <AnimatePresence mode="wait">
        
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-[1300px] mx-auto space-y-6">
            <div className="flex justify-between items-end">
              <div className="text-left">
                <p className="text-[8px] font-black uppercase tracking-[0.4em] text-blue-600 mb-1">Operational Hub</p>
                <h1 className="text-2xl font-black text-[#111827] tracking-tighter uppercase italic leading-none">Task Center</h1>
              </div>
              <button 
                onClick={() => setView('create')}
                className="bg-[#111827] text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all"
              >
                <Plus size={14} strokeWidth={3} /> New Assignment
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MiniMetric label="Active Sprints" value="12" sub="+2 Week" />
              <MiniMetric label="Pending" value="08" badge="Urgent" />
              <MiniMetric label="Resource Load" value="94%" progress={94} />
              <div className="bg-[#111827] rounded-2xl p-5 text-white flex justify-between items-center shadow-lg">
                <div className="space-y-1 text-left">
                  <p className="text-[8px] font-black uppercase opacity-50 tracking-widest">System Engine</p>
                  <p className="text-[11px] font-bold italic">Node-Delta Active</p>
                </div>
                <Rocket size={20} className="text-blue-400" />
              </div>
            </div>

            <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden text-left">
              <div className="p-5 flex justify-between items-center border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Available Projects</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-3">Project Details</th>
                      <th className="px-6 py-3">Budget Allocation</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {projectList.map((p) => (
                      <tr key={p.id || p._id} onClick={() => handleProjectClick(p)} className="hover:bg-slate-50 transition-all cursor-pointer group">
                        <td className="px-6 py-4">
                          <h4 className="text-[10px] font-black text-[#111827] uppercase group-hover:text-blue-600">{p.projectName}</h4>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Client: {p.clientName}</p>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-black text-slate-700">${p.projectBudget}</td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight size={14} className="inline text-slate-300 group-hover:text-blue-600" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'create' && (
          <motion.div key="create" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-[850px] mx-auto text-left">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-8 hover:text-black">
              <ArrowLeft size={14} strokeWidth={3} /> Abort Action
            </button>

            <form onSubmit={handleTaskSubmission} className="space-y-6">
              <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-2xl p-8 md:p-12 space-y-10">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-600">Task Creation Protocol</p>
                    <h2 className="text-3xl font-black text-[#111827] uppercase italic tracking-tighter leading-none">New Assignment</h2>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100"><Hash size={24} className="text-slate-300" /></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PROJECT SELECTION */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Parent Project</label>
                    <select 
                      name="projectId" 
                      value={formData.projectId} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value={0}>SELECT TARGET PROJECT</option>
                      {projectList.map(p => (
                        <option key={p.id || p._id} value={p.id || p._id}>
                          {p.projectName.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* USER / ASSIGNEE SELECTION */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Field Operative (Assignee)</label>
                    <select 
                      name="assigneeUserId" 
                      value={formData.assigneeUserId} 
                      onChange={handleInputChange} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                      <option value={0}>SELECT ASSIGNEE</option>
                      {userList.map(u => (
                        <option key={u.id || u._id} value={u.id || u._id}>
                          {(u.name || `${u.firstName} ${u.lastName}`).toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <FormInput label="Task Designation" name="taskTitle" value={formData.taskTitle} onChange={handleInputChange} placeholder="E.G., FOUNDATION EXCAVATION" colSpan="md:col-span-2" icon={<Rocket size={16}/>} />
                  <FormInput label="Commencement Date" name="startDate" value={formData.startDate} onChange={handleInputChange} type="date" icon={<Calendar size={16}/>} />
                  <FormInput label="Deadline" name="dueDate" value={formData.dueDate} onChange={handleInputChange} type="date" icon={<Clock size={16}/>} />
                  <FormInput label="Resource Allocation (Budget)" name="taskBudget" value={formData.taskBudget} onChange={handleInputChange} type="number" icon={<DollarSign size={16}/>} />
                  
                  <div className="space-y-1.5 text-left">
                    <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Priority Level</label>
                    <select name="taskPriority" value={formData.taskPriority} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-bold outline-none">
                      <option value="LOW">LOW PRIORITY</option>
                      <option value="MEDIUM">MEDIUM PRIORITY</option>
                      <option value="HIGH">CRITICAL STATUS</option>
                    </select>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Box size={14} /> Bill of Materials
                    </h3>
                    <button type="button" onClick={addMaterial} className="text-[9px] font-black uppercase text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <Plus size={14} /> Add Resource
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.materials.map((mat, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative">
                        <input placeholder="MATERIAL NAME" value={mat.materialName} onChange={(e) => updateMaterial(idx, 'materialName', e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none" />
                        <input type="number" placeholder="QTY" value={mat.quantityUsed} onChange={(e) => updateMaterial(idx, 'quantityUsed', e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none" />
                        <input placeholder="UNIT" value={mat.unit} onChange={(e) => updateMaterial(idx, 'unit', e.target.value)} className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none" />
                        <button type="button" onClick={() => removeMaterial(idx)} className="text-red-400 hover:text-red-600 self-center justify-self-end"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full bg-[#111827] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-blue-600 transition-all flex justify-center items-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><CheckSquare size={18} strokeWidth={3} /> Finalize Assignment</>}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components (FormInput, MiniMetric) remain the same as your original code...
function FormInput({ label, name, value, onChange, placeholder, icon, type = "text", colSpan = "" }) {
  return (
    <div className={`space-y-1.5 ${colSpan} text-left`}>
      <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
        <input 
          name={name} value={value} onChange={onChange}
          type={type} placeholder={placeholder}
          className={`w-full bg-slate-50 border border-slate-200 rounded-xl ${icon ? 'pl-10' : 'px-4'} py-3 text-[11px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all`}
        />
      </div>
    </div>
  );
}

function MiniMetric({ label, value, sub, progress, badge }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between text-left group hover:border-blue-100 transition-colors">
      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <div className="mt-2">
        <h4 className="text-2xl font-black italic text-[#111827] tracking-tighter">{value}</h4>
        {progress ? (
          <div className="h-1 w-full bg-slate-50 rounded-full mt-2 overflow-hidden border border-slate-100">
            <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
          </div>
        ) : (
          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{badge || sub}</p>
        )}
      </div>
    </div>
  );
}