'use client';

import React, { useEffect, useState } from 'react';
import { 
  Shield, User, Save, Bell, Smartphone, 
  ShieldCheck, LogOut, Globe, Fingerprint,
  RefreshCw, Lock, Eye, EyeOff, KeyRound
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import summeryApi from '@/common/summeryApi';
import Axios from '../../../../utils/Axios';

export default function SovereignExecutiveSettings() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showPassword, setShowPassword] = useState(false);
  const {user,setUser} = useUser();
  

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    twoFactor: false,
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Sync global user data to local form when page loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        twoFactor: user.twoFactor || false,
      });
    }
  }, [user]);

  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const commitChanges = async () => {
    // Basic Validation
    if (passwordData.new && passwordData.new !== passwordData.confirm) {
      console.log("New passwords do not match");
      return;
    }

    setIsSyncing(true);

    try {
      // 1. Construct dynamic URL from your SummaryApi
      const url = `/api/auth/users/${user.id}/profile`;
      // 2. Prepare Payload
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        twoFactor: formData.twoFactor,
        ...(passwordData.new && { 
          currentPassword: passwordData.current, 
          newPassword: passwordData.new 
        })
      };
      // 3. API Call
      const response = await Axios({
        method:summeryApi.updateProfile.method,
        url:url,
        data: payload,
        withCredentials: true
      });

      if (response.data.success) {
        console.log("Profile synchronized successfully");
        // Update the global context so the Navbar initials etc. update immediately
        setUser(response.data.data); 
        // Clear sensitive fields
        setPasswordData({ current: "", new: "", confirm: "" });
      }
    } catch (error) {
      console.error(error);
      console.log(error.response?.data?.message || "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const getStrength = () => {
    if (passwordData.new.length === 0) return 0;
    if (passwordData.new.length < 6) return 33;
    if (passwordData.new.length < 10) return 66;
    return 100;
  };

  const getInitials = (firstName) => {
    if (!firstName) return "??";
    return firstName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">
      
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-xs">S</div>
            <div>
              <h2 className="text-[8px] font-black tracking-[0.2em] uppercase text-slate-400 leading-none mb-1">Command</h2>
              <h1 className="text-sm font-black text-slate-900 leading-none tracking-tight">System Settings</h1>
            </div>
          </div>

          <button 
            onClick={commitChanges}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95 shadow-lg shadow-slate-200'
            }`}
          >
            {isSyncing ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
            {isSyncing ? "Syncing..." : "Update Profile"}
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
       
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-[1.8rem] mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white shadow-xl">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : `${getInitials(user?.firstName)}${getInitials(user?.lastName)}`}
            </div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight">{user.firstName} {user.lastName}</h3>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{user.position}</p>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h4 className="font-black text-[9px] uppercase tracking-[0.2em] text-slate-500">Security Score</h4>
              <ShieldCheck className="text-emerald-400" size={18} />
            </div>
            <div className="text-3xl font-black mb-2 relative z-10 tracking-tighter">98%</div>
            <div className="w-full bg-white/10 h-1 rounded-full mb-3 overflow-hidden">
              <div className="bg-emerald-400 h-full w-[98%] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
            </div>
            <p className="text-[10px] text-slate-500 font-medium italic">Advanced encryption active.</p>
          </div>
        </div>

       {/** Input form */}
        <div className="lg:col-span-8 space-y-6">
          
          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
              <User size={16} className="text-slate-900" />
              <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Identity Details</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Change user.firstName to profile.firstName (or formData.firstName) */}
              <InputGroup 
                label="First Name" 
                value={formData.firstName} 
                onChange={(v) => handleUpdate('firstName', v)} 
              />
              <InputGroup 
                label="Last Name" 
                value={formData.lastName} 
                onChange={(v) => handleUpdate('lastName', v)} 
              />
            </div>
         </section>

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <KeyRound size={16} className="text-slate-900" />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Security Credentials</h3>
              </div>
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="text-[9px] font-black text-slate-300 flex items-center gap-1.5 hover:text-slate-900 transition-colors uppercase tracking-widest"
              >
                {showPassword ? <EyeOff size={12} /> : <Eye size={12} />} 
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <InputGroup 
                    label="Current Password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••••••"
                    value={passwordData.current}
                    onChange={(v) => setPasswordData({...passwordData, current: v})}
                  />
                </div>
                <div className="space-y-2">
                  <InputGroup 
                    label="New Password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="New code"
                    value={passwordData.new}
                    onChange={(v) => setPasswordData({...passwordData, new: v})}
                  />
                  <div className="h-0.5 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-700 ${getStrength() < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${getStrength()}%` }}
                    />
                  </div>
                </div>
                <InputGroup 
                  label="Confirm Password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Repeat code"
                  value={passwordData.confirm}
                  onChange={(v) => setPasswordData({...passwordData, confirm: v})}
                />
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex gap-3">
                <Lock size={14} className="text-slate-900 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  Changing credentials will terminate all active sessions across devices.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <ProtocolToggle 
                icon={<Smartphone size={18}/>} 
                title="Multi-Factor Auth" 
                desc="Extra verification layer for system access."
                active={formData.twoFactor}
                onToggle={() => handleUpdate('twoFactor', !formData.twoFactor)}
              />
          </section>

        </div>
      </main>
    </div>
  );
}


function InputGroup({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black uppercase text-slate-400 tracking-[0.15em] ml-1">{label}</label>
      <input 
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[12px] font-semibold text-slate-700 outline-none focus:ring-4 ring-slate-900/5 focus:bg-white focus:border-slate-900 transition-all placeholder:text-slate-200"
      />
    </div>
  );
}


function ProtocolToggle({ icon, title, desc, active, onToggle }) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-100 text-slate-900 rounded-xl">{icon}</div>
        <div>
          <h4 className="text-[12px] font-black text-slate-800 tracking-tight">{title}</h4>
          <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-10 h-5 rounded-full transition-all relative ${active ? 'bg-slate-900 shadow-inner' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${active ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}