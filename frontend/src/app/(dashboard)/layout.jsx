'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, UserCircle, Settings, LogOut } from 'lucide-react';
import Sidebar from '../../components/sidebar' // Ensure this path matches your project
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Helper for Profile Menu Buttons
  const ProfileMenuButton = ({ icon, label, onClick, isRed }) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl transition-colors ${
        isRed ? 'text-rose-500 hover:bg-rose-50' : 'text-slate-500 hover:bg-slate-50 hover:text-black'
      }`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
      
      {/* 1. PERSISTENT SIDEBAR */}
      <aside className="h-full shrink-0 z-[100] shadow-2xl shadow-slate-200">
        <Sidebar />
      </aside>

      <main className="flex-1 h-full overflow-y-auto p-8 scroll-smooth relative z-0">
        
        {/* 2. PERSISTENT NAVBAR */}
        <div className="flex justify-between items-center mb-10 relative z-[60]">
          <div className="flex items-center gap-6">
            {/* Search Bar - Matching the "Sovereign Exec" style */}
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm w-80 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none shadow-sm font-medium" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* System Status Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 mr-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
            </div>

            {/* Notification Bell */}
            <button className="p-3 bg-white text-slate-500 hover:text-blue-600 rounded-2xl shadow-sm border border-slate-200 relative transition-all active:scale-95">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 cursor-pointer p-1.5 pr-5 bg-[#0a1120] rounded-2xl shadow-xl border border-slate-800 transition-transform active:scale-95"
              >
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-black text-sm">
                  AS
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white leading-none">A. Sterling</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Admin</span>
                </div>
              </div>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    {/* Backdrop to close menu */}
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-[110] overflow-hidden"
                    >
                      <div className="p-8 pb-4 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-3xl mx-auto mb-3 flex items-center justify-center text-slate-800 border-2 border-white shadow-md">
                          <UserCircle size={32} />
                        </div>
                        <p className="text-sm font-black text-slate-900 leading-none">Alexander Sterling</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Executive Access</p>
                      </div>
                      <div className="p-4 pt-0 space-y-1">
                        <ProfileMenuButton icon={<Settings size={16} />} label="Settings" onClick={() => {}} />
                        <ProfileMenuButton icon={<LogOut size={16} />} label="Logout" isRed onClick={() => router.push('/login')} />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC CONTENT AREA */}
        <div className="relative z-0">
          {children}
        </div>

        {/* Persistent Footer */}
        <footer className="mt-20 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] py-12 border-t border-slate-100">
          <p>© 2026 CONWISE // ARCHITECTURE.V3</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Documentation</span>
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Support</span>
          </div>
        </footer>
      </main>
    </div>
  );
}