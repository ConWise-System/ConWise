"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Axios from '../../../../utils/Axios'; 
import summeryApi from '../../../common/summeryApi'
import { 
  Search, UserPlus, Edit3, Trash2, Shield, User, 
  Upload, Mail, Briefcase, Phone, Lock, X, ShieldCheck,
  Loader2, ArrowLeft, AlertTriangle
} from 'lucide-react';
import Table from '../../../components/dashboard/Table';
import Loader from '../../../components/dashboard/Loader';

export default function UserManagementSystem() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("All");
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // --- DELETE MODAL STATE LAYERS ---
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- FETCH PERSONNEL ---
  const fetchPersonnel = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({...summeryApi.getUsers});
      if(response.data.success) {
        setUsers(response.data.data.users || []);
      }
    } catch (error) {
      console.error("Authorization Protocol: Failed to load personnel", error);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, []);
  
  const handleCreateSuccess = () => {
    setIsCreating(false);
    fetchPersonnel();
  };

  // --- TRIGGER DELETE CONFIRMATION INTERCEPTOR ---
  const triggerDeleteConfirmation = (user) => {
    setUserToDelete(user);
    setDeleteModal(true);
  };

  // --- EXECUTE BACKEND DELETION ---
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const response = await Axios({
        url: summeryApi.deleteUser.url(userToDelete.id),
        method: summeryApi.deleteUser.method
      });

      if (response.data.success) {
        // Optimistically clean up local UI array layout instantly
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setDeleteModal(false);
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Deletion Protocol Fault: Unable to purge user asset", error);
      alert(error?.response?.data?.message || "Failed to complete deletion routine.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FILTER LOGIC ---
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const firstName = user.firstName || "";
      const lastName = user.lastName || "";
      const email = user.email || "";
      
      const fullName = `${firstName} ${lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                            email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRole = activeRoleFilter === "All" || user.role === activeRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, activeRoleFilter]);

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    deactivated: users.filter(u => u.status === 'Deactivated' || u.status === 'Revoked').length
  }), [users]);

  // --- SYSTEM TABLE COLUMN DEFINITIONS ---
  const columns = [
    {
      header: "No.",
      width: "60px",
      align: "center",
      cell: (_, rowIndex) => <span className="text-slate-400 font-bold font-mono">{rowIndex + 1}</span>
    },
    {
      header: "Identity Details",
      accessor: "firstName",
      cell: (row) => (
        <div className="flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 uppercase shrink-0 border border-slate-200/40">
            {row.firstName?.[0] || '?'}{row.lastName?.[0] || '?'}
          </div>
          <div className="min-w-0">
            <span className="font-bold text-slate-900 block text-xs truncate">{row.firstName} {row.lastName}</span>
            <span className="text-[10px] text-slate-400 font-medium block truncate">{row.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "System Role",
      accessor: "role",
      cell: (row) => (
        <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
          {row.role?.replace('_', ' ')}
        </span>
      )
    },
    {
      header: "Auth Status",
      accessor: "status",
      align: "center",
      width: "140px",
      cell: (row) => {
        const isActive = row.status === 'Active';
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-tight ${
            isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            {row.status || 'Pending'}
          </span>
        );
      }
    },
    {
      header: "Actions",
      align: "right",
      width: "100px",
      cell: (row) => (
        <div className="flex justify-end gap-1.5 text-slate-400" onClick={(e) => e.stopPropagation()}>
          <button className="p-1.5 hover:bg-slate-100 rounded border border-slate-200/60 hover:text-slate-900 transition-colors shadow-2xs">
            <Edit3 size={12}/>
          </button>
          <button 
            onClick={() => triggerDeleteConfirmation(row)}
            className="p-1.5 hover:bg-rose-50 rounded border border-slate-200/60 hover:text-rose-600 hover:border-rose-100 transition-colors shadow-2xs"
          >
            <Trash2 size={12}/>
          </button>
        </div>
      )
    }
  ];

  if (isCreating) return (
    <CreateUserPage 
      onCancel={() => setIsCreating(false)} 
      onSuccess={handleCreateSuccess} 
    />
  )

  return (
    <div className="p-4 md:p-8 max-w-[1300px] mx-auto space-y-6 text-left relative">
      {/* --- HEADER --- */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl tracking-tight text-slate-900 uppercase font-bold">User Directory</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">Manage Company Users .</p> 
        </div>
        <button 
          onClick={() => setIsCreating(true)} 
          className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
        >
          <UserPlus size={14} /> Create Staff User
        </button>
      </header>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard label="Total Company Users" value={stats.total} icon={<User size={14}/>} />
        <MetricCard label="Authenticated Terminals" value={stats.active} hasPulse icon={<ShieldCheck size={14}/>} />
        <MetricCard label="Revoked / Pending Users" value={stats.deactivated} isWarning icon={<Lock size={14}/>} />
      </div>

      {/* --- CONTROLS --- */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input 
            type="text" placeholder="Search Identity details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/50 rounded-lg text-xs font-medium outline-none focus:bg-white focus:border-slate-300 transition-all text-slate-800"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-1">
          {['All','PROJECT_MANAGER', 'SITE_ENGINEER', 'SITE_SUPERVISOR'].map(role => (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md border transition-all ${
                activeRoleFilter === role 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                  : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              {role.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* --- CENTRALIZED DATA TABLE LAYOUT --- */}
      {isLoading ? (
        <div className="w-full min-h-[350px] flex flex-col items-center justify-center gap-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <Loader2 size={24} className="animate-spin text-slate-700" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loading User Profiles...</span>
        </div>
      ) : (
        <Table 
          columns={columns}
          data={filteredUsers}
          searchPlaceholder="Filter personnel identities..."
        />
      )}

      {/* --- CLEAN ENTERPRISE CONFIRMATION MODAL --- */}
      {deleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-tight">Revoke Account Access?</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Are you sure you want to completely purge <span className="font-bold text-slate-800">{userToDelete?.firstName} {userToDelete?.lastName}</span> from the system records? This operational action cannot be undone.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col gap-y-0.5 text-[11px]">
              <span className="text-slate-400 font-semibold uppercase tracking-wider">Identity Details Mapping</span>
              <span className="font-bold text-slate-700 truncate">{userToDelete?.email}</span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button 
                onClick={() => { setDeleteModal(false); setUserToDelete(null); }}
                disabled={isDeleting}
                className="px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all disabled:bg-rose-400"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Purging...
                  </>
                ) : "Confirm Deletion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function CreateUserPage({ onCancel, onSuccess }) {
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
    if(!formData.firstName || !formData.email) {
      alert("Essential Identity Details Missing");
      return;
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
      console.error("Authorization Protocol Failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-[#F8FAFC] flex justify-center animate-in zoom-in-98 text-left">
      <div className="w-full max-w-5xl bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row">
        <div className="flex-1 p-6 md:p-8 space-y-6">
          <button onClick={onCancel} className="p-1.5 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex gap-x-3 text-slate-400 text-xs font-bold items-center">
            <ArrowLeft size={14}/> Return back
          </button>

          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 uppercase tracking-tight">New User Authentication Token</h2>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Filing Date: {formData.createdAt.split('T')[0]}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InputGroup label="First Name" value={formData.firstName} onChange={(v) => handleChange('firstName', v)} icon={<User size={12}/>} />
            <InputGroup label="Last Name" value={formData.lastName} onChange={(v) => handleChange('lastName', v)} icon={<User size={12}/>} />
            <InputGroup label="Professional Email" value={formData.email} onChange={(v) => handleChange('email', v)} type="email" icon={<Mail size={12}/>} />
            <InputGroup label="Phone Number" value={formData.phone} onChange={(v) => handleChange('phone', v)} icon={<Phone size={12}/>} />
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Role Profile</label>
              <div className="relative">
                <Briefcase size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg font-semibold text-xs outline-none focus:border-slate-400 appearance-none cursor-pointer text-slate-800"
                >
                  <option value="COMPANY_ADMIN">Company Admin</option>
                  <option value="PROJECT_MANAGER">Project Manager</option>
                  <option value="SITE_ENGINEER">Site Engineer</option>
                  <option value="SITE_SUPERVISOR">Site Supervisor</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isVerified"
                checked={formData.isVerified}
                onChange={(e) => handleChange('isVerified', e.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500 cursor-pointer" 
              />
              <label htmlFor="isVerified" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Verify Profile Automatically</label>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={onCancel} disabled={isSubmitting} className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg font-bold text-xs hover:bg-slate-50 transition-all disabled:opacity-50">Discard</button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all disabled:bg-slate-400"
              >
                {isSubmitting ? "Committing Entry..." : "Finalize Authorization"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-64 bg-slate-900 p-6 flex flex-col justify-between items-center text-center text-white border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="space-y-4 w-full my-auto">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 mx-auto overflow-hidden relative group shadow-inner">
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <Shield size={24} className="text-slate-400" />
              )}
              <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity bg-black/50">
                <Upload size={16} />
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-xs truncate max-w-[200px] mx-auto">{formData.firstName || 'Identity'} {formData.lastName || 'Node'}</p>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Unsaved Profile Buffer</p>
            </div>
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => setImagePreview(URL.createObjectURL(e.target.files[0]))} className="hidden" accept="image/*" />
          <div className="pt-4 border-t border-white/5 w-full hidden lg:block">
             <p className="text-[9px] font-medium tracking-wider text-slate-500">© 2026 Platform System Module</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", icon }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</div>}
        <input 
          type={type} 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full ${icon ? 'pl-9' : 'px-3'} pr-3 py-2 bg-white border border-slate-200 rounded-lg font-medium text-xs outline-none focus:border-slate-400 transition-all text-slate-800`} 
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, hasPulse, isWarning, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
      <div className="space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold tracking-tight ${isWarning ? 'text-rose-600' : 'text-slate-900'}`}>{value}</span>
          {hasPulse && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
        </div>
      </div>
      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400">{icon}</div>
    </div>
  );
}