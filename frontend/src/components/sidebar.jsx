'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Users, FolderRoot, CheckSquare, 
  ShieldAlert, BarChart3, MessageSquare, Bell, 
  Settings, ChevronLeft, LogOut 
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative sticky top-0 h-screen z-50">
      
      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3.5 top-12 w-7 h-7 bg-blue-600 rounded-full border-[3px] border-[#070912] 
                   flex items-center justify-center text-white z-[70] transition-all duration-300
                   hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)] active:scale-90"
      >
        <motion.div
          animate={{ rotate: isCollapsed ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronLeft size={14} strokeWidth={3} />
        </motion.div>
      </button>

      <motion.aside 
        animate={{ width: isCollapsed ? 84 : 288 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-[#070912] text-slate-400 flex flex-col h-full border-r border-white/5 overflow-hidden"
      >

        {/* Header */}
        <div className="p-6 mb-1">
          <div className="flex items-center gap-3">
            <div className="min-w-[36px] h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <ShieldAlert size={18} className="text-white" strokeWidth={2.5} />
            </div>

            {!isCollapsed && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="flex flex-col whitespace-nowrap"
              >
                <h1 className="text-base font-black text-white tracking-tighter leading-none">ConWise</h1>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Admin</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* 2. Navigation (Scroll Disabled) */}
      <nav className="flex-1 px-4 space-y-1 py-4 overflow-hidden">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.path;

            return (
              <Link 
                key={idx} 
                href={item.path}
                className={`relative flex items-center rounded-xl transition-all duration-200 group ${
                  isCollapsed ? 'justify-center px-0 h-11' : 'px-4 py-2.5 gap-3'
                } ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/10' : 'hover:bg-white/5 hover:text-slate-100'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'}`}>
                  {item.icon}
                </span>
                
                {!isCollapsed && (
                  <span className="text-[11px] font-bold tracking-wide uppercase whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                
                {!isCollapsed && isActive && (
                  <motion.div layoutId="activeTab" className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#fff]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Profile + Logout */}
        <div className="p-4 mt-auto border-t border-white/5">
          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3 flex items-center justify-between">

            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-white/10">
                  <img 
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gifti"
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-[11px] font-bold text-white uppercase">
                    Firomsa Hika
                  </p>
                  <p className="text-[9px] text-slate-500 uppercase">
                    Admin
                  </p>
                </div>
              </div>
            )}

            <button 
              onClick={() => router.push('/login')}
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
              title="Logout"
            >
              <LogOut size={16} />
            </button>

          </div>
        </div>

      </motion.aside>
    </div>
  );
}