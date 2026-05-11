'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  ShieldCheck, User, Save, Bell, Smartphone,
  RefreshCw, Lock, Globe, Fingerprint,
  Eye, EyeOff, KeyRound, Activity, Camera
} from 'lucide-react';
import { useUser } from '../../../context/UserContext';
import summeryApi from '../../../common/summeryApi';
import Axios from '../../../../utils/Axios';

export default function SovereignExecutiveSettings() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, setUser } = useUser();
  const fileInputRef = useRef(null); // Ref for hidden input

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    twoFactor: false,
    avatar: "" // Added avatar to form state
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        twoFactor: user.twoFactor || false,
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  const handleUpdate = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // --- IMAGE UPLOAD LOGIC ---
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate('avatar', reader.result); // Sets base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  // --------------------------

  const commitChanges = async () => {
    if (passwordData.new && passwordData.new !== passwordData.confirm) {
      console.log("New passwords do not match");
      return;
    }

    setIsSyncing(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        twoFactor: formData.twoFactor,
        avatar: formData.avatar, // Including avatar in payload
        ...(passwordData.new && {
          currentPassword: passwordData.current,
          newPassword: passwordData.new
        })
      };

      const response = await Axios({
        method: summeryApi.updateProfile.method,
        url: summeryApi.updateProfile.url,
        data: payload,
        withCredentials: true
      });

      if (response.data.success) {
        console.log("Profile synchronized successfully");
        setUser(response.data.data);
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

  const getInitials = () => {
    if (!user?.firstName && !user?.lastName) return "??";
    const first = user?.firstName?.[0] || "";
    const last = user?.lastName?.[0] || "";
    return `${first}${last}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white">

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarChange}
        accept="image/*"
        className="hidden"
      />

      <main className="max-w-7xl mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm text-center relative overflow-hidden transition-all hover:shadow-md">

            {/* Clickable Profile Image Area */}
            <div
              onClick={triggerFileInput}
              className="group cursor-pointer relative w-24 h-24 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-[1.8rem] mx-auto mb-6 flex items-center justify-center text-3xl font-black text-white shadow-2xl border-4 border-white overflow-hidden"
            >
                {formData.avatar
                  ? <img src={formData.avatar} className="w-full h-full object-cover" alt="User Avatar" />
                  : getInitials()}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <Camera size={24} className="text-white" />
                </div>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-1">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{user?.position || "Staff Member"}</p>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-7 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 flex-row-reverse">
                <ShieldCheck className="text-emerald-400" size={20} />
                <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-500">System Integrity</h4>
              </div>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-black tracking-tighter">98</span>
                <span className="text-xl font-bold text-slate-500">%</span>
              </div>
              <div className="w-full bg-white/10 h-1 rounded-full mb-3 overflow-hidden">
                <div className="bg-emerald-400 h-full w-[98%] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Advanced Encryption: Enabled</p>
            </div>
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-slate-700/30 blur-[60px] rounded-full" />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-8">

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3 bg-slate-50/30">
              <User size={18} className="text-slate-900" />
              <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Identity Details</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup
                label="Legal First Name"
                value={formData.firstName}
                onChange={(v) => handleUpdate('firstName', v)}
                placeholder="Enter first name"
              />
              <InputGroup
                label="Legal Last Name"
                value={formData.lastName}
                onChange={(v) => handleUpdate('lastName', v)}
                placeholder="Enter last name"
              />
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-3">
                <KeyRound size={18} className="text-slate-900" />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">Security Credentials</h3>
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-[9px] font-black text-slate-300 flex items-center gap-1.5 hover:text-slate-900 transition-colors uppercase tracking-widest"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                {showPassword ? "Hide Details" : "Reveal Details"}
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <InputGroup
                    label="Current Authorization Key"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={passwordData.current}
                    onChange={(v) => setPasswordData({...passwordData, current: v})}
                  />
                </div>
                <div className="space-y-3">
                  <InputGroup
                    label="New Secure Key"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new key"
                    value={passwordData.new}
                    onChange={(v) => setPasswordData({...passwordData, new: v})}
                  />
                  <div className="h-1 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${getStrength() < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${getStrength()}%` }}
                    />
                  </div>
                </div>
                <InputGroup
                  label="Confirm Secure Key"
                  type={showPassword ? "text" : "password"}
                  placeholder="Repeat new key"
                  value={passwordData.confirm}
                  onChange={(v) => setPasswordData({...passwordData, confirm: v})}
                />
              </div>

              <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4">
                <Lock size={18} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[12px] text-blue-900/70 font-medium leading-relaxed italic">
                  Critical security update: Modifying these credentials will terminate all active sessions across devices immediately.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
              <ProtocolToggle
                icon={<Smartphone size={18}/>}
                title="Multi-Factor Authentication"
                desc="Deploy an additional verification layer for all system access attempts."
                active={formData.twoFactor}
                onToggle={() => handleUpdate('twoFactor', !formData.twoFactor)}
              />
          </section>

          {/* ADDED SUBMIT BUTTON FOR COMPLETENESS */}
          <div className="flex justify-end">
             <button
                onClick={commitChanges}
                disabled={isSyncing}
                className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
             >
                {isSyncing ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>}
                Update Settings
             </button>
          </div>

        </div>
      </main>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 text-[13px] font-bold text-slate-700 outline-none focus:ring-4 ring-slate-900/5 focus:bg-white focus:border-slate-900 transition-all placeholder:text-slate-200 shadow-sm"
      />
    </div>
  );
}

function ProtocolToggle({ icon, title, desc, active, onToggle }) {
  return (
    <div className="p-7 flex items-center justify-between hover:bg-slate-50/30 transition-colors">
      <div className="flex items-center gap-5">
        <div className="p-3 bg-slate-100 text-slate-900 rounded-xl">{icon}</div>
        <div>
          <h4 className="text-[13px] font-black text-slate-800 tracking-tight">{title}</h4>
          <p className="text-[11px] text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-slate-900 shadow-inner' : 'bg-slate-200'}`}
      >
        <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all ${active ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );
}
