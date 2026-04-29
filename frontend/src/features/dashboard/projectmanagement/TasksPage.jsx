'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, MoreHorizontal, Filter, Trash2,
  Clock, Rocket, CheckSquare,ChevronRight ,
  ArrowLeft, User, DollarSign, Box, Loader2, Hash
} from 'lucide-react';
import Axios from '../../../../utils/Axios'
import summeryApi from '../../../common/summeryApi';

export default function TaskCenter() {
  const [view, setView] = useState('list'); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tasks, setTasks] = useState([]); // To hold tasks fetched from DB
  const [projectList, setProjectList] = useState([])
  const [user,setUser] = useState([])

  const loadProjects = async () => {
    const res = await Axios({...summeryApi.getAllProjects});
    
    setProjectList(res.data.data);
  };

  const loadTasks = async () => {
    try {
      // Replace with your actual list task API endpoint
      const response = await Axios({ ...summeryApi.getTasks }); 
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const loadUsers = async()=>{
    const response = await Axios({...summeryApi.getUsers})
    setUser(response.data.data.users)
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(()=>{
    loadUsers()
  },[])

  // --- 1. STATE ALIGNED WITH YOUR JSON BODY ---
  const [formData, setFormData] = useState({
    projectId: 0,
    assigneeUserId: 0,
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

  // --- 2. LOGIC HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['projectId', 'assigneeUserId', 'taskAssigneeID', 'taskBudget'];
    setFormData(prev => ({ 
      ...prev, 
      [name]: numericFields.includes(name) ? Number(value) : value 
    }));
  };

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
    // Validation: Don't submit if IDs are 0
    if (formData.projectId === 0 || formData.assigneeUserId === 0) {
      alert("Please select a Project and an Assignee");
      return;
    }
    setIsSubmitting(true);
    // Integrate your Axios call here similar to how we did the Project Creation
    try{
      const response = await Axios({
        ...summeryApi.assignTask,
        data:formData
      })
      if(response.data.success){
        setFormData({projectId: 0,
          assigneeUserId: 0,
          taskAssigneeID: 0,
          taskTitle: '',
          taskDescription: '',
          startDate: '',
          dueDate: '',
          taskBudget: 0,
          taskPriority: 'HIGH',
          taskStatus: 'TODO',
          materials: [] 
        })
        alert("Task Created Successfully!")
      }
    }catch (error) {
      console.error("Submission Error Details:", error.response?.data);
      alert(error.response?.data?.message || "Check console for 400 details");
    } finally {
      setIsSubmitting(false);
    }
    
    
    console.log("Final Task Payload:", formData);
    setTimeout(() => {
      setIsSubmitting(false);
      setView('list');
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#F9FAFB] p-4 md:p-10">
      <AnimatePresence mode="wait">
        
        {view === 'list' ? (
          /* --- YOUR ORIGINAL DASHBOARD VIEW --- */
          <motion.div 
            key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="max-w-[1300px] mx-auto space-y-6"
          >
            <div className="flex justify-between items-end">
              <div>
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

            <div className="bg-white rounded-[1.5rem] border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="p-5 flex justify-between items-center border-b border-slate-50 bg-slate-50/30">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Ongoing Assignments</h3>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[8px] font-black uppercase text-slate-400">
                  <Filter size={12} /> Filter
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr className="text-[8px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                      <th className="px-6 py-3">Task Details</th>
                      <th className="px-6 py-3 text-center">Engineers</th>
                      <th className="px-6 py-3">Priority</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {/* Placeholder for real data mapping later */}
                    <TaskRow 
                      title="Cloud Infrastructure" project="Project #102" 
                      status="HIGH" color="blue" 
                    />
                    <TaskRow 
                      title="OAuth Integration" project="Project #105" 
                      status="MEDIUM" color="amber" 
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

        ) : (
          /* --- THE UPDATED CREATE TASK PAGE --- */
          <motion.div key="create" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-[850px] mx-auto">
            <button onClick={() => setView('list')} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 mb-8 hover:text-black">
              <ArrowLeft size={14} /> Return to Center
            </button>

            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden text-left">
              <div className="p-10 border-b border-slate-50 bg-slate-50/50">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-[#111827]">Create Task</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Assign deployment parameters & estimate logistics</p>
              </div>

              <form onSubmit={handleTaskSubmission} className="p-10 space-y-8">
                {/* ID GRID */}
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  {/** Selection */}
                  <select name="projectId" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all">
                    <option value="">Select Target Project</option>
                    {projectList.map(p => (
                      <option key={p.id} value={p.id}>{p.projectName}</option>
                    ))}
                   </select>
                   <select name="assigneeUserId" onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 text-[11px] font-bold outline-none focus:border-blue-500 focus:bg-white transition-all">
                    <option value="">Assign User</option>
                    {user.map(p => (
                      <option key={p.id} value={p.id}>{p.firstName}{` ( ${p.role} ) `}</option>
                    ))}
                   </select>
                  <FormInput label="Task Assignee ID" name="taskAssigneeID" type="number" value={formData.taskAssigneeID} onChange={handleInputChange} icon={<User size={12}/>} />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormInput label="Task Title" name="taskTitle" colSpan="col-span-2" placeholder="e.g. Server Hardening" value={formData.taskTitle} onChange={handleInputChange} />
                  <FormInput label="Start Date" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} />
                  <FormInput label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={handleInputChange} />
                  <FormInput label="Task Budget" name="taskBudget" type="number" value={formData.taskBudget} onChange={handleInputChange} icon={<DollarSign size={12}/>} />
                  
                  <div className="space-y-1.5 text-left">
                    <label className="text-[8px] font-black uppercase text-slate-400 ml-1">Task Priority</label>
                    <select name="taskPriority" value={formData.taskPriority} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[11px] font-black outline-none appearance-none">
                      <option value="HIGH">HIGH</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </select>
                  </div>
                </div>

                {/* MATERIALS LOGIC */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Materials & Resources</h3>
                    <button type="button" onClick={addMaterial} className="text-[9px] font-black text-blue-600 flex items-center gap-1">
                      <Plus size={12} strokeWidth={3}/> Add Item
                    </button>
                  </div>
                  {formData.materials.map((mat, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-slate-50/50 rounded-2xl relative">
                      <div className="col-span-5">
                        <FormInput label="Material Name" value={mat.materialName} onChange={(e) => updateMaterial(index, 'materialName', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <FormInput label="Quantity" type="number" value={mat.quantityUsed} onChange={(e) => updateMaterial(index, 'quantityUsed', e.target.value)} />
                      </div>
                      <div className="col-span-3">
                        <FormInput label="Unit" placeholder="kg/pcs" value={mat.unit} onChange={(e) => updateMaterial(index, 'unit', e.target.value)} />
                      </div>
                      <button type="button" onClick={() => removeMaterial(index)} className="col-span-1 flex items-end pb-3 text-slate-300 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Task Description</label>
                  <textarea 
                    name="taskDescription" value={formData.taskDescription} onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[11px] font-medium outline-none h-24" 
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-[#111827] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all">
                  {isSubmitting ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Initialize Deployment"}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function TaskRow({ title, project, status, color }) {
  const themes = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };
  return (
    <tr className="hover:bg-slate-50/80 transition-all cursor-pointer">
      <td className="px-6 py-4 text-left">
        <h4 className="text-[10px] font-black text-[#111827] uppercase tracking-tight">{title}</h4>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Ref: {project}</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center -space-x-1.5">
          {[1, 2].map((i) => (
            <div key={i} className="w-6 h-6 rounded-lg bg-slate-200 border-2 border-white overflow-hidden shadow-sm">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + title}`} alt="Avatar" />
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`text-[8px] font-black px-2.5 py-1 rounded-full border uppercase tracking-tighter ${themes[color]}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <MoreHorizontal size={14} className="inline text-slate-300 hover:text-black" />
      </td>
    </tr>
  );
}

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