"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Axios from '../../../../utils/Axios'; // Adjust path
import summeryApi from '../../../common/summeryApi'
import { 
  Search, UserPlus, Edit3, Trash2, Shield, User, 
  Upload, Mail, Briefcase, Phone, Lock, X, ShieldCheck,
  Building2, AlignLeft, Calendar
} from 'lucide-react';

const INITIAL_USERS = [
  { id: 1, firstName: 'Julian', lastName: 'Sterling', email: 'j.sterling@sovereign.exec', role: 'PROJECT MANAGER', status: 'Active' },
  { id: 2, firstName: 'Elena', lastName: 'Novak', email: 'novak.e@sovereign.exec', role: 'SITE ENGINEER', status: 'Active' },
];

export default function UserManagementSystem() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("All");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true)

  //function to fetch personnel from the backend
  const fetchPersonnel = async () => {
    setIsLoading(true);
    try {
      // Assuming you have a getPersonnel endpoint in summeryApi
      const response = await Axios({...summeryApi.getUsers});
      console.log(response.data.data)
      if(response.data.success) {
        setUsers(response.data.data.users);
      }
    } catch (error) {
      console.error("Failed to load personnel", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);
  
  const handleCreateSuccess = () => {
    setIsCreating(false);
    fetchPersonnel(); // Refresh the list to show the new user
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      const matchesRole = activeRoleFilter === "All" || user.role === activeRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, activeRoleFilter]);

  const stats = useMemo(() => ({
    total: filteredUsers.length,
    active: filteredUsers.filter(u => u.status === 'Active').length,
    deactivated: filteredUsers.filter(u => u.status === 'Deactivated').length
  }), [filteredUsers]);

  if (isCreating) return (
    <CreateUserPage 
      onCancel={() => setIsCreating(false)} 
      onSuccess={handleCreateSuccess} 
    />
  )

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-600 h-1 w-4 rounded-full"></span>
            <span className="text-[8px] font-black tracking-[0.25em] text-blue-600 uppercase">Identity Access</span>
          </div>
          <h1 className="text-xl  tracking-tight text-slate-900 uppercase">Personnel Directory</h1>
        </div>
        <button 
          onClick={() => setIsCreating(true)} 
          className="bg-[#0F172A] text-white px-5 py-2.5 rounded-xl font-bold text-[11px] flex items-center gap-2 hover:bg-blue-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          <UserPlus size={14} strokeWidth={3} /> Authorize Personnel
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Workforce" value={stats.total} icon={<User size={14}/>} />
        <MetricCard label="Authenticated" value={stats.active} hasPulse icon={<ShieldCheck size={14}/>} />
        <MetricCard label="Revoked" value={stats.deactivated} isWarning icon={<Lock size={14}/>} />
      </div>

      <div className="bg-white p-2 rounded-xl border border-slate-200 flex flex-col xl:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full xl:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" placeholder="Search Identity..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border-none rounded-lg text-xs font-bold outline-none focus:bg-white transition-all"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {['All', 'ADMIN', 'PROJECT_MANAGER', 'SITE_ENGINEER'].map(role => (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${
                activeRoleFilter === role ? 'bg-slate-900 text-white' : 'text-slate-400 hover:bg-slate-50'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[1.5rem] shadow-sm overflow-hidden text-[11px]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity Details</th>
              <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Auth Status</th>
              <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 uppercase">{user.firstName[0]}{user.lastName[0]}</div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{user.firstName} {user.lastName}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{user.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[8px] font-black uppercase tracking-tighter ${
                    user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                  }`}>
                    <div className={`w-1 h-1 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-100 transition-opacity text-slate-400">
                    <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-900 transition-colors"><Edit3 size={12}/></button>
                    <button className="p-1.5 hover:bg-rose-50 rounded hover:text-rose-600 transition-colors"><Trash2 size={12}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateUserPage({ onCancel,onSuccess }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "SITE_ENGINEER",
    status: "PENDING_VERIFICATION",
    isVerified: false,
    createdAt: new Date().toISOString()
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Basic Validation
    if(!formData.firstName || !formData.email) {
      return console.log("Essential Identity Details Missing");
    }

    setIsSubmitting(true);
    try {
      const response = await Axios({
        ...summeryApi.addPersonnel,
        data: formData
      });

      if (response.data.success) {
        onSuccess();
      }
    } catch (error) {
      console.log("Authorization Protocol Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-[#F8FAFC] flex items-center justify-center animate-in zoom-in-98 selection:bg-blue-600 selection:text-white">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row">
        
      
        <div className="flex-1 p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">New Personnel Auth</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">Protocol ID: {formData.createdAt.split('T')[0]}</p>
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={18}/></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InputGroup label="First Name" value={formData.firstName} onChange={(v) => handleChange('firstName', v)} icon={<User size={12}/>} />
            <InputGroup label="Last Name" value={formData.lastName} onChange={(v) => handleChange('lastName', v)} icon={<User size={12}/>} />
            <InputGroup label="Professional Email" value={formData.email} onChange={(v) => handleChange('email', v)} type="email" icon={<Mail size={12}/>} />
            <InputGroup label="Phone Number" value={formData.phone} onChange={(v) => handleChange('phone', v)} icon={<Phone size={12}/>} />
            
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">System Role</label>
              <div className="relative group">
                <Briefcase size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-slate-50 border-none rounded-xl font-bold text-[11px] outline-none focus:ring-2 focus:ring-blue-100 appearance-none cursor-pointer"
                >
                  <option value="PLATFORM_ADMIN">Platform Admin</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="SITE_ENGINEER">Site Engineer</option>
                  <option value="SITE_SUPERVISOR">Site Supervisor</option>
                </select>
              </div>
            </div>
          </div>

          

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="isVerified"
                  checked={formData.isVerified}
                  onChange={(e) => handleChange('isVerified', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <label htmlFor="isVerified" className="text-[10px] font-black text-slate-600 uppercase tracking-tighter cursor-pointer">Verification Status</label>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${formData.status.includes('PENDING') ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{formData.status.replace('_', ' ')}</span>
              </div>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={onCancel} 
                disabled={isSubmitting}
                className="px-6 py-3 bg-white border border-slate-200 text-slate-500 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Discard
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 md:flex-none px-10 py-3 bg-[#0F172A] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-slate-200 hover:bg-blue-600 active:scale-95 transition-all disabled:bg-slate-400"
              >
                {isSubmitting ? "Processing..." : "Finalize Auth"}
              </button>
            </div>
          </div>
        </div>

        
        <div className="w-full lg:w-72 bg-[#0F172A] p-8 flex flex-col justify-between items-center text-center text-white">
          <div className="space-y-4 w-full">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mx-auto overflow-hidden relative group">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover transition-opacity group-hover:opacity-50" />
              ) : (
                <Shield size={32} className="text-blue-500" />
              )}
              <div 
                onClick={() => fileInputRef.current.click()}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Upload size={20} />
              </div>
            </div>
            <div>
              <p className="font-black text-sm tracking-tight">{formData.firstName} {formData.lastName}</p>
              <p className="text-blue-500 font-black text-[8px] uppercase tracking-[0.2em] mt-1">Personnel Identity</p>
            </div>
            
            <div className="pt-6 space-y-3 text-left">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Access Node</p>
                <p className="text-[10px] font-bold mt-1">ConWise Central Terminal</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Security Clearance</p>
                <p className="text-[10px] font-bold mt-1 text-emerald-400">Level 4-Executive</p>
              </div>
            </div>
          </div>

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => setImagePreview(URL.createObjectURL(e.target.files[0]))} 
            className="hidden" 
            accept="image/*" 
          />
          
          <div className="mt-8 pt-6 border-t border-white/5 w-full">
             <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">© 2026 Sovereign Auth</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", icon }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? 'pl-9' : 'px-4'} pr-3 py-3 bg-slate-50 border-none rounded-xl font-bold text-[11px] outline-none focus:bg-white focus:ring-2 focus:ring-blue-50 transition-all placeholder:text-slate-300 text-slate-800`} 
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, hasPulse, isWarning, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
      <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xl font-black tracking-tighter ${isWarning ? 'text-rose-500' : 'text-slate-900'}`}>{value}</span>
          {hasPulse && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
        </div>
      </div>
      <div className="p-2 rounded-lg bg-slate-50 text-slate-400">{icon}</div>
    </div>
  );
}