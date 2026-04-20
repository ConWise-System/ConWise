'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, FolderRoot, CheckSquare, 
  ShieldAlert, BarChart3, MessageSquare, Bell, 
  Settings, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard Home', path: '/admin/dashboardHome' },
  { icon: <Users size={16} />, label: 'User Management', path: '/admin/userManagement' },
  { icon: <FolderRoot size={16} />, label: 'Project Management', path: '/admin/projectManagement' },
  { icon: <CheckSquare size={16} />, label: 'Task Management', path: '/admin/taskManagement' },
  { icon: <ShieldAlert size={16} />, label: 'Issue Management', path: '/admin/issueManagement' },
  { icon: <BarChart3 size={16} />, label: 'Reports & Analytics', path: '/admin/report' },
  { icon: <MessageSquare size={16} />, label: 'Messaging', path: '/admin/messaging' },
  { icon: <Bell size={16} />, label: 'Notifications', path: '/admin/notification' },
  { icon: <Settings size={16} />, label: 'Settings', path: '/admin/setting' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-72 bg-[#070912] text-slate-400 flex flex-col h-screen sticky top-0 border-r border-white/5 z-50 overflow-hidden">
      
      {/* 1. Brand Header */}
      <div className="p-8 mb-1 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldAlert size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black text-white tracking-tighter italic leading-none uppercase">SOVEREIGN</h1>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1.5">Admin Control</p>
          </div>
        </div>
      </div>

      {/* 2. Navigation (Scroll Disabled) */}
      <nav className="flex-1 px-4 space-y-1 overflow-hidden py-2">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.path;

          return (
            <Link 
              key={idx} 
              href={item.path}
              className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/10' : 'hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} transition-colors`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-black tracking-[0.15em] uppercase whitespace-nowrap">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab" 
                  className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#fff]" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. COMPACT PROFILE & LOGOUT SECTION */}
      <div className="p-4 mt-auto shrink-0 border-t border-white/5">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-2 flex items-center justify-between backdrop-blur-md">
          
          <button 
            onClick={() => router.push('/admin/setting')}
            className="flex items-center gap-3 overflow-hidden group flex-1 p-1 hover:bg-white/5 rounded-xl transition-all text-left"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center text-[10px] text-white font-black border border-slate-900 shadow-inner overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-[#070912] rounded-full shadow-sm" />
            </div> 

            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white truncate leading-none uppercase">Alex Sterling</p>
              <p className="text-[7px] font-black text-slate-500 uppercase mt-1 tracking-tighter">Lead Ops</p>
            </div>
          </button>

          <div className="w-[1px] h-6 bg-white/5 mx-1" />

          <button 
            onClick={() => router.push('/login')}
            className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all active:scale-90"
            title="Sign Out"
          >
            <LogOut size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}