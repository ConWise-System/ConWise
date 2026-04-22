'use client';

import React, { useState } from 'react';
import { 
  User, Save, Smartphone, ShieldCheck, 
  RefreshCw, Lock, Eye, EyeOff, KeyRound,
  ShieldAlert
} from 'lucide-react';

/**
 * SOVEREIGN EXECUTIVE SETTINGS
 * Optimized for ProjectManagementLayout
 */
export default function Setting() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: "Alexander",
    lastName: "Sterling",
    position: "Chief Manager",
    twoFactor: true,
  });

  const [passwordData, setPasswordData] = useState({ 
    current: "", 
    new: "", 
    confirm: "" 
  });

  const commitChanges = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSyncing(false);
  };

  const getStrength = () => {
    if (passwordData.new.length === 0) return 0;
    if (passwordData.new.length < 6) return 33;
    if (passwordData.new.length < 10) return 66;
    return 100;
  };

  return (
    // Removed ml-[280px] because your layout.jsx already handles this
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* --- HEADER SECTION --- */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <ShieldAlert size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-[9px] font-black tracking-[0.25em] uppercase text-slate-400 leading-none mb-1.5">Command Center</h2>
              <h1 className="text-lg font-black text-slate-900 leading-none tracking-tight">System Settings</h1>
            </div>
          </div>

          <button 
            onClick={commitChanges}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all shadow-xl ${
              isSyncing 
                ? 'bg-slate-100 text-slate-400' 
                : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 shadow-blue-600/10'
            }`}
          >
            {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {isSyncing ? "Syncing..." : "Update Vault"}
          </button>
        </div>
      </nav>

      {/* --- MAIN CONTENT GRID --- */}
      <main className="max-w-6xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[2.2rem] mx-auto mb-6 flex items-center justify-center text-3xl font-black text-white shadow-2xl rotate-3 border-4 border-white overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">{profile.firstName} {profile.lastName}</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-1">{profile.position}</p>
          </div>

          <div className="bg-[#070912] rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Security Score</h4>
                <ShieldCheck className="text-blue-400 group-hover:rotate-12 transition-transform" size={22} />
              </div>
              <div className="text-4xl font-black mb-3 tracking-tighter">98%</div>
              <div className="w-full bg-white/10 h-1.5 rounded-full mb-4 overflow-hidden">
                <div 
                  className="bg-blue-500 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)] transition-all duration-1000" 
                  style={{ width: '98%' }}
                />
              </div>
              <p className="text-[11px] text-slate-500 font-medium italic">Advanced encryption active.</p>
            </div>
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-600/20 blur-[60px] rounded-full" />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300">
            <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
              <User size={18} className="text-blue-600" />
              <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400 italic">Identity Details</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup label="First Name" value={profile.firstName} onChange={(v) => setProfile({...profile, firstName: v})} />
              <InputGroup label="Last Name" value={profile.lastName} onChange={(v) => setProfile({...profile, lastName: v})} />
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300">
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <KeyRound size={18} className="text-blue-600" />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400 italic">Security Credentials</h3>
              </div>
              <button onClick={() => setShowPassword(!showPassword)} className="text-[10px] font-black text-slate-300 flex items-center gap-2 hover:text-blue-600 transition-colors uppercase tracking-widest">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} {showPassword ? "Hide Details" : "Show Details"}
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputGroup label="Current Password" type={showPassword ? "text" : "password"} placeholder="••••••••••••" value={passwordData.current} onChange={(v) => setPasswordData({...passwordData, current: v})} />
                </div>
                <div className="space-y-2">
                  <InputGroup label="New Password" type={showPassword ? "text" : "password"} placeholder="Enter new code" value={passwordData.new} onChange={(v) => setPasswordData({...passwordData, new: v})} />
                  <div className="h-1 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full transition-all duration-700 ${getStrength() < 50 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${getStrength()}%` }} />
                  </div>
                </div>
                <InputGroup label="Confirm Password" type={showPassword ? "text" : "password"} placeholder="Repeat new code" value={passwordData.confirm} onChange={(v) => setPasswordData({...passwordData, confirm: v})} />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <ProtocolToggle 
              icon={<Smartphone size={20}/>} 
              title="Multi-Factor Authentication" 
              desc="Requirement of an secondary device verification."
              active={profile.twoFactor}
              onToggle={() => setProfile({...profile, twoFactor: !profile.twoFactor})}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

// Sub-components inside the same file to prevent "Element type is invalid" errors
function InputGroup({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">{label}</label>
      <input 
        type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-[13px] font-bold text-slate-700 outline-none focus:ring-4 ring-blue-600/5 focus:bg-white focus:border-blue-600 transition-all placeholder:text-slate-200 shadow-sm"
      />
    </div>
  );
}

function ProtocolToggle({ icon, title, desc, active, onToggle }) {
  return (
    <div className="p-8 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
      <div className="flex items-center gap-5">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">{icon}</div>
        <div>
          <h4 className="text-[14px] font-black text-slate-800 tracking-tight">{title}</h4>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{desc}</p>
        </div>
      </div>
      <button onClick={onToggle} className={`w-14 h-7 rounded-full transition-all relative ${active ? 'bg-blue-600' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${active ? 'left-8' : 'left-1'}`} />
      </button>
    </div>
  );
}