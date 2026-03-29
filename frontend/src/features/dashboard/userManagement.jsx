"use client";
import React, { useState, useMemo } from 'react';
import { 
  Search, UserPlus, Filter, MoreHorizontal, 
  ChevronLeft, ChevronRight, Edit3, Trash2 
} from 'lucide-react';

// --- Professional Data Schema ---
const INITIAL_USERS = [
  { id: 1, name: 'Julian Sterling', email: 'j.sterling@sovereign.exec', role: 'MANAGER', status: 'Active', sessions: 14 },
  { id: 2, name: 'Elena Novak', email: 'novak.e@sovereign.exec', role: 'ENGINEER', status: 'Active', sessions: 8 },
  { id: 3, name: 'Marcus Kane', email: 'm.kane@sovereign.exec', role: 'SUPERVISOR', status: 'Deactivated', sessions: 0 },
  { id: 4, name: 'Sarah Chen', email: 's.chen@sovereign.exec', role: 'ENGINEER', status: 'Active', sessions: 22 },
];

export default function UserManagement() {
  // 1. STATE MANAGEMENT
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRoleFilter, setActiveRoleFilter] = useState("All");

  // 2. DERIVED STATE (The "Engine" of the UI)
  // This automatically updates the table and metrics whenever filters change
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = activeRoleFilter === "All" || user.role === activeRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, activeRoleFilter]);

  // Dynamic Metrics based on filtered data
  const stats = useMemo(() => ({
    total: filteredUsers.length,
    active: filteredUsers.filter(u => u.status === 'Active').length,
    deactivated: filteredUsers.filter(u => u.status === 'Deactivated').length
  }), [filteredUsers]);

  // 3. ACTION HANDLERS (Business Logic)
  const handleDeleteUser = (id) => {
    if(window.confirm("Are you sure?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === 'Active' ? 'Deactivated' : 'Active' } : u
    ));
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 font-medium mt-2">Administer organizational access and hierarchical roles.</p>
        </div>
        <button className="bg-[#0F172A] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
          <UserPlus size={18} /> Create New User
        </button>
      </div>

      {/* --- DYNAMIC METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Filtered Workforce" value={stats.total} trend="+4.2%" />
        <MetricCard label="Active Now" value={stats.active} hasPulse />
        <MetricCard label="Deactivated" value={stats.deactivated} isWarning />
      </div>

      {/* --- FILTER BAR --- */}
      <div className="bg-white border border-slate-200 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-2 bg-slate-50 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 outline-none transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          {['All', 'MANAGER', 'ENGINEER', 'SUPERVISOR'].map(role => (
            <button
              key={role}
              onClick={() => setActiveRoleFilter(role)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                activeRoleFilter === role ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Identity</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-8 py-5">
                   <button 
                    onClick={() => handleToggleStatus(user.id)}
                    className={`mx-auto flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase transition-all ${
                      user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                    }`}
                   >
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                    {user.status}
                   </button>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"><Edit3 size={16}/></button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="p-20 text-center text-slate-400 font-medium">
                  No users found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Dynamic Sub-Components ---

function MetricCard({ label, value, trend, hasPulse, isWarning }) {
  return (
    <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-4xl font-black ${isWarning ? 'text-rose-500' : 'text-slate-900'}`}>{value}</span>
          {hasPulse && <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />}
        </div>
        {trend && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const colors = {
    MANAGER: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    ENGINEER: 'bg-sky-50 text-sky-600 border-sky-100',
    SUPERVISOR: 'bg-amber-50 text-amber-600 border-amber-100'
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] font-black border tracking-widest ${colors[role] || colors.ENGINEER}`}>
      {role}
    </span>
  );
}