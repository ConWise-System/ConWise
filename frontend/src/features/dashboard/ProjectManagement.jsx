"use client"
import React, { useState } from 'react';
import { 
  Info, FileText, Settings, UploadCloud, AlertTriangle, 
  X, Search, UserPlus, Edit3, ChevronRight 
} from 'lucide-react';

export default function ProjectManagement() {
  // 1. FORM STATE
  const [projectData, setProjectData] = useState({
    name: '',
    category: 'Market Expansion',
    dueDate: '',
    summary: '',
    visibility: true,
    priority: 'High',
    budget: '0.00',
    costCenter: 'CC-9042-HQ'
  });

  // 2. TEAM STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Jameson Duarte', role: 'Analyst', color: 'bg-blue-500' },
    { id: 2, name: 'Lila Kozlov', role: 'Legal Counsel', color: 'bg-green-500' },
    { id: 3, name: 'Marcus Knight', role: 'CTO', color: 'bg-orange-500' },
  ]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  const toggleVisibility = () => {
    setProjectData(prev => ({ ...prev, visibility: !prev.visibility }));
  };

  const removeMember = (id) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  const handleInitiate = () => {
    console.log("Submitting to Backend:", { projectData, teamMembers });
    alert(`Initiating Project: ${projectData.name || 'New Project'}`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 pt-4 font-sans text-slate-900">
      
      {/* --- Page Header --- */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Projects</span> <ChevronRight size={10} /> <span className="text-slate-600">Initiate New Project</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Create New Project</h1>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            Establish a new strategic initiative. Define parameters, assign executive leadership, and allocate preliminary resources.
          </p>
        </div>
        <div className="flex items-center gap-4 pt-4 md:pt-8">
          <button className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors">Save as Draft</button>
          <button 
            onClick={handleInitiate}
            className="bg-[#0F172A] text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            Initiate Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* --- MAIN FORM COLUMN --- */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Project Basics */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Info size={18} /></div>
              <h2 className="text-lg font-bold text-slate-800">Project Basics</h2>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Project Name</label>
                <input 
                  name="name"
                  value={projectData.name}
                  onChange={handleInputChange}
                  type="text" 
                  placeholder="e.g. Horizon Expansion Phase II" 
                  className="w-full p-4 bg-slate-50 rounded-xl border-none text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all" 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Strategic Category</label>
                  <select 
                    name="category"
                    value={projectData.category}
                    onChange={handleInputChange}
                    className="w-full p-4 bg-slate-50 rounded-xl border-none text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 appearance-none"
                  >
                    <option>Market Expansion</option>
                    <option>Product Development</option>
                    <option>Internal Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Target Completion</label>
                  <input 
                    name="dueDate"
                    value={projectData.dueDate}
                    onChange={handleInputChange}
                    type="date" 
                    className="w-full p-4 bg-slate-50 rounded-xl border-none text-sm outline-none focus:ring-2 focus:ring-blue-100" 
                  />
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">Executive Summary</label>
                <textarea 
                  name="summary"
                  value={projectData.summary}
                  onChange={handleInputChange}
                  rows={4} 
                  placeholder="Outline the primary objectives..." 
                  className="w-full p-4 bg-slate-50 rounded-xl border-none text-sm resize-none outline-none focus:ring-2 focus:ring-blue-100"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Section: Configuration & Metrics */}
          <section className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Settings size={18} /></div>
              <h2 className="text-lg font-bold">Configuration & Metrics</h2>
            </div>
            
            <div className="space-y-8">
              {/* Toggle Switch */}
              <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">Global Visibility</p>
                  <p className="text-xs text-slate-400">Restrict project visibility to department heads.</p>
                </div>
                <button 
                  onClick={toggleVisibility}
                  className={`w-12 h-6 rounded-full transition-colors relative ${projectData.visibility ? 'bg-slate-900' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${projectData.visibility ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {/* Priority Selector */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-4">Strategic Priority</label>
                <div className="grid grid-cols-4 gap-3">
                  {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                    <button 
                      key={level}
                      onClick={() => setProjectData(prev => ({ ...prev, priority: level }))}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${projectData.priority === level ? 'bg-[#0F172A] text-white border-slate-900' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* --- SIDEBAR COLUMN --- */}
        <aside className="space-y-8">
          
          {/* Team Allocation Card */}
          <div className="bg-[#0F172A] text-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 overflow-hidden relative">
            <div className="flex items-center gap-3 mb-8 opacity-60">
              <UserPlus size={18} />
              <h2 className="text-sm font-bold uppercase tracking-widest">Team Allocation</h2>
            </div>

            <div className="space-y-6">
              {/* Executive Lead */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Project Executive Lead</p>
                <div className="bg-slate-800/40 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center font-bold text-xs">SC</div>
                    <div>
                      <p className="text-xs font-bold">Sarah Chen</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">SR. Director</p>
                    </div>
                  </div>
                  <Edit3 size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                </div>
              </div>

              {/* Members List with Search */}
              <div>
                <div className="relative mb-4">
                  <Search size={14} className="absolute left-3 top-3.5 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Filter team..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-slate-800/30 rounded-xl border border-white/5 text-xs outline-none focus:bg-slate-800/50 transition-all" 
                  />
                </div>
                
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {teamMembers
                    .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((member) => (
                    <div key={member.id} className="flex items-center justify-between group animate-in fade-in slide-in-from-right-1">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${member.color} rounded-lg flex items-center justify-center text-[10px] font-bold shadow-lg shadow-black/20`}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{member.name}</p>
                          <p className="text-[9px] text-slate-500 font-bold uppercase">{member.role}</p>
                        </div>
                      </div>
                      <button onClick={() => removeMember(member.id)}>
                        <X size={14} className="text-slate-600 hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
             <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Resource Load</span>
                    <span className="text-[10px] font-bold">64%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[64%] h-full bg-slate-900 transition-all duration-1000"></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic leading-relaxed">
                  System load reflects current EMER region strategic allocation.
                </p>
             </div>
          </div>
        </aside>

      </div>
    </div>
  );
}