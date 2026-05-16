'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, UserCircle, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUser } from '../../../context/UserContext';
import { useNotifications } from '../../../context/NotificationContext'; // Imported Notification Context
import ProjectManagerSideBar from '../../../components/projectManagerSideBar';

export function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
}

export default function DashboardLayout({ children }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, loading, handleLogout } = useUser();
  
  // Destructure the live real-time unread count from the socket stream provider
  const { unreadCount } = useNotifications();
  
  const router = useRouter();
  const menuRef = useRef(null);
  
  useClickOutside(menuRef, () => setShowProfileMenu(false));

  if (loading) return <div className="h-screen w-full bg-[#f8fafc] animate-pulse" />;

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
      {/* SIDEBAR */}
      <aside className="h-full shrink-0 z-[100] shadow-2xl shadow-slate-200">
        <ProjectManagerSideBar/>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative">
        
        {/* FIXED TOP NAVBAR */}
        <header className="h-24 min-h-[96px] px-8 flex justify-between items-center bg-[#f8fafc]/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-[60]">
          <div className="flex items-center gap-6">
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
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 mr-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
            </div>

            {/* NOTIFICATION BELL WITH SOCIAL MEDIA STYLE UNREAD COUNTER */}
            <button 
              onClick={() => router.push('/notifications')} // Adjust link destination to match your routing folder name
              className="p-3 bg-white text-slate-500 hover:text-slate-900 rounded-2xl shadow-sm border border-slate-200 relative transition-all active:scale-95"
            >
              <Bell size={20} />
              
              <AnimatePresence>
                {unreadCount > 0 && (
                  <motion.span 
                    key={unreadCount} // Key binding triggers micro-animations on every new incoming socket push
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 bg-red-500 text-white rounded-full text-[9px] font-black tracking-tight flex items-center justify-center border-2 border-white shadow-sm unselectable"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* PROFILE SECTION */}
            <div className="relative">
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 cursor-pointer p-1.5 pr-5 bg-[#0a1120] rounded-2xl shadow-xl border border-slate-800 transition-transform active:scale-95"
              >
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-black text-sm overflow-hidden">
                  {user?.firstName ? user.firstName[0].toUpperCase() : "?"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white leading-none">
                    {user?.firstName || "Guest User"}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                    {user?.role || "Staff"}
                  </span>
                </div>
              </div>

              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowProfileMenu(false)} />
                    <motion.div 
                      ref={menuRef}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-[1.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-[110] overflow-hidden"
                    >
                      <div className="p-8 pb-4 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-3xl mx-auto mb-3 flex items-center justify-center text-slate-800 border-2 border-white shadow-md overflow-hidden">
                           {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" /> : <UserCircle size={32} />}
                        </div>
                        <p className="text-sm font-black text-slate-900 leading-none">{user?.firstName}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">{user?.email}</p>
                      </div>
                      <div className="p-4 pt-0 space-y-1">
                        <ProfileMenuButton icon={<Settings size={16} />} label="Settings" onClick={() => router.push('/admin/setting')} />
                        <ProfileMenuButton icon={<LogOut size={16} />} label="Logout" isRed onClick={handleLogout} />
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 pt-2 scroll-smooth">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}