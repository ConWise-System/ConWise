"use client";
import React, { useState } from 'react';
import { 
  FileText, Settings, X, UserPlus, Edit3, ChevronRight, Target,
  MapPin, Building2
} from 'lucide-react';

export default function ProjectManagement() {
  const [projectData, setProjectData] = useState({
    projectName: 'Adama Office Complex',
    location: 'Adama, Ethiopia',
    startDate: '2026-04-14',
    endDate: '2026-12-31',
    clientName: 'ABC Construction PLC',
    projectBudget: 5000000,
    status: 'PLANNING',
    priority: 'High',
    visibility: true
  });

  const [teamMembers] = useState([
    { id: 1, name: 'Jameson Duarte', role: 'Analyst', color: 'bg-blue-500' },
    { id: 2, name: 'Lila Kozlov', role: 'Legal Counsel', color: 'bg-emerald-500' },
    { id: 3, name: 'Marcus Knight', role: 'CTO', color: 'bg-amber-500' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 max-w-6xl mx-auto space-y-6 font-sans text-slate-900 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-blue-600">
            <span>Portfolio</span> <ChevronRight size={10} strokeWidth={3} /> <span className="text-slate-400">Strategic Initiation</span>
          </nav>
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tight">Create <span className="text-slate-400 font-medium italic">Project</span></h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all">Draft</button>
          <button 
            className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            Initiate System
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        <div className="lg:col-span-8 space-y-6">
          
          <section className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
              <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Target size={14} /></div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Project Parameters</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Name/Identity</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    name="projectName" value={projectData.projectName} onChange={handleInputChange}
                    type="text" placeholder="Project Title" 
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Location Site</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input 
                      name="location" value={projectData.location} onChange={handleInputChange}
                      type="text" placeholder="Location"
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:bg-white transition-all" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Client Organization</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    <input 
                      name="clientName" value={projectData.clientName} onChange={handleInputChange}
                      type="text" placeholder="Client Name"
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Start Date</label>
                  <input 
                    name="startDate" value={projectData.startDate} onChange={handleInputChange}
                    type="date"
                    className="w-full p-3 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Completion Date</label>
                  <input 
                    name="endDate" value={projectData.endDate} onChange={handleInputChange}
                    type="date"
                    className="w-full p-3 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:bg-white" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Project Budget (ETB)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400">ETB</div>
                    <input 
                      name="projectBudget" value={projectData.projectBudget} onChange={handleInputChange}
                      type="number"
                      className="w-full pl-10 pr-3 py-3 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:bg-white transition-all" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-slate-100 rounded-lg text-slate-600"><Settings size={14} /></div>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-800">Operational Logic</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Operational Status</label>
                  <select 
                    name="status" value={projectData.status} onChange={handleInputChange}
                    className="w-full p-3 bg-slate-50 rounded-xl border-none text-[11px] font-bold outline-none focus:bg-white appearance-none cursor-pointer"
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="ACTIVE">Active</option>
                    <option value="ON_HOLD">On Hold</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
                <div className="flex justify-between items-center bg-slate-50/50 px-4 py-2 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Visibility</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter italic">Public/Private</p>
                  </div>
                  <button 
                    onClick={() => setProjectData(p => ({...p, visibility: !p.visibility}))}
                    className={`w-10 h-5 rounded-full transition-all relative ${projectData.visibility ? 'bg-blue-600' : 'bg-slate-200'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${projectData.visibility ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {['Low', 'Medium', 'High', 'Critical'].map((level) => (
                  <button 
                    key={level}
                    type="button"
                    onClick={() => setProjectData(prev => ({ ...prev, priority: level }))}
                    className={`py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${projectData.priority === level ? 'bg-[#0F172A] text-white border-slate-900 shadow-md' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F172A] text-white p-6 rounded-[1.5rem] shadow-xl shadow-slate-200">
            <div className="flex items-center gap-2 mb-6 opacity-50">
              <UserPlus size={14} />
              <h2 className="text-[9px] font-black uppercase tracking-[0.2em]">Team Allocation</h2>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Project Lead</p>
                <div className="bg-white/5 p-3 rounded-xl flex items-center justify-between border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-[10px]">SC</div>
                    <div>
                      <p className="text-[10px] font-black">Sarah Chen</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase">Lead Engineer</p>
                    </div>
                  </div>
                  <Edit3 size={12} className="text-slate-600 group-hover:text-white" />
                </div>
              </div>

              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 ${member.color} rounded flex items-center justify-center text-[9px] font-black shadow-lg shadow-black/20`}>
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[10px] font-black tracking-tight">{member.name}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">{member.role}</p>
                      </div>
                    </div>
                    <X size={12} className="text-slate-700 hover:text-rose-400 cursor-pointer transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[1.5rem] border border-slate-200">
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Financial Load</span>
                  <span className="text-xs font-black text-slate-900">ETB</span>
                </div>
                <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-full h-full bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-slate-700">
                  <span>Total: {Number(projectData.projectBudget).toLocaleString()}</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}