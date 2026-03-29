'use client'; // CRITICAL: This allows React state to work in Next.js

import React, { useState } from 'react';
import { Shield, ChevronRight, LogOut, User, Check, Save } from 'lucide-react';

export default function SettingsPage() {
  // 1. State Management
  const [formData, setFormData] = useState({
    fullName: "Alexander Sterling",
    email: "a.sterling@sovereign.exec",
    pushAlerts: true,
    emailDigest: false,
    smsReports: true,
    interfaceMode: 'light',
    density: 'Standard (Editorial)'
  });

  const [isSaving, setIsSaving] = useState(false);

  // 2. Functional Handlers
  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API Call
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 800);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 p-6 md:p-12 font-sans ${formData.interfaceMode === 'dark' ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-slate-900'}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header with Save Button */}
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">Configure your workspace preferences and security protocols.</p>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 shadow-lg shadow-indigo-200"
          >
            {isSaving ? "Saving..." : <><Save size={18} /> Save Changes</>}
          </button>
        </header>

        <div className="space-y-10">
          
          {/* Account Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="font-bold text-base">Account</aside>
            <div className={`md:col-span-2 rounded-xl border p-6 shadow-sm ${formData.interfaceMode === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-white">
                  <User size={32} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Profile Photo</h4>
                  <button className="text-xs text-indigo-500 font-semibold mt-1 hover:underline">Change Photo</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${formData.interfaceMode === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-50 text-slate-900'}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Section - Toggle Logic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="font-bold text-base">Notifications</aside>
            <div className={`md:col-span-2 rounded-xl border p-6 shadow-sm space-y-6 ${formData.interfaceMode === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
              {[
                { id: 'pushAlerts', label: 'Push Alerts' },
                { id: 'emailDigest', label: 'Email Digest' },
                { id: 'smsReports', label: 'SMS Urgent Reports' }
              ].map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.label}</span>
                  <button 
                    onClick={() => handleToggle(item.id)}
                    className={`w-12 h-6 rounded-full transition-all relative ${formData[item.id] ? 'bg-indigo-600' : 'bg-slate-300'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData[item.id] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Display Section - Mode Logic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <aside className="font-bold text-base">Display</aside>
            <div className={`md:col-span-2 rounded-xl border p-6 shadow-sm ${formData.interfaceMode === 'dark' ? 'bg-[#1E293B] border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-3 block">Interface Mode</label>
                  <div className="flex gap-3">
                    {['light', 'dark'].map((mode) => (
                      <button 
                        key={mode}
                        onClick={() => handleInputChange('interfaceMode', mode)}
                        className={`flex-1 p-3 rounded-lg border-2 capitalize text-xs font-bold transition-all ${formData.interfaceMode === mode ? 'border-indigo-500 bg-indigo-50/10' : 'border-transparent bg-slate-100/50'}`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-center">
            <p className="text-xs text-slate-500 italic uppercase tracking-tighter">System Version 2.4.1-EXEC</p>
            <button 
              onClick={() => confirm("Are you sure you want to sign out?")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}