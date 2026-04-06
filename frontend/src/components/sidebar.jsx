'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, FolderRoot, CheckSquare, 
  ShieldAlert, BarChart3, MessageSquare, Bell, 
  Settings, LogOut, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';


const menuItems = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard Home', path: '/dashboardHome' },
  { icon: <Users size={16} />, label: 'User Management', path: '/userManagement' },
  { icon: <FolderRoot size={16} />, label: 'Project Management', path: '/projectManagement' },
  { icon: <CheckSquare size={16} />, label: 'Task Management', path: '/taskManagement' },
  { icon: <ShieldAlert size={16} />, label: 'Issue Management', path: '/issueManagement' },
  { icon: <BarChart3 size={16} />, label: 'Reports & Analytics', path: '/report' },
  { icon: <MessageSquare size={16} />, label: 'Messaging', path: '/messaging' },
  { icon: <Bell size={16} />, label: 'Notifications', path: '/notification' },
  { icon: <Settings size={16} />, label: 'Settings', path: '/setting' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-72 bg-[#070912] text-slate-400 flex flex-col h-screen sticky top-0 border-r border-white/5 z-50 overflow-hidden">
      

      <div className="p-6 mb-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldAlert size={18} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black text-white tracking-tighter italic leading-none">SOVEREIGN</h1>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-0.5 overflow-hidden py-2">
        {menuItems.map((item, idx) => {
          const isActive = pathname === item.path;

          return (
            <Link 
              key={idx} 
              href={item.path}
              className={`relative flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 hover:text-slate-100'
              }`}
            >
              <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-bold tracking-wide uppercase">{item.label}</span>
              
              {isActive && (
                <motion.div layoutId="activeTab" className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#fff]" />
              )}
            </Link>
          );
        })}
      </nav>


      <div className="p-4 mt-auto">
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-3 space-y-2">
          
          <button 
            onClick={() => router.push('/setting')}
            className="flex items-center gap-3 p-2 w-full rounded-2xl hover:bg-white/5 transition-all group text-left"
          >
            <div className="relative shrink-0">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-black text-xs border border-slate-900">
                AS
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#070912] rounded-full" />
            </div> 

            <div className="overflow-hidden flex-1">
              <p className="text-[11px] font-black text-white truncate">Alex Sterling</p>
              <p className="text-[8px] font-bold text-slate-500 uppercase">Lead Ops</p>
            </div>
            <ChevronRight size={12} className="text-slate-700 group-hover:text-white transition-all" />
          </button>

          <button 
            onClick={() => router.push('/login')}
            className="flex items-center justify-center gap-2 py-3 w-full text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all active:scale-95"
          >
            <LogOut size={14} strokeWidth={2.5} /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}