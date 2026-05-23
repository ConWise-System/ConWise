'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, FolderRoot, CheckSquare, 
  ShieldAlert, BarChart3, MessageSquare, Bell, 
  Settings, ChevronLeft,Milestone
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { icon: <LayoutDashboard size={16} />, label: 'Project Manager Home', path: '/projectManager/Home' },
  { icon: <Users size={16} />, label: 'Projects', path: '/projectManager/projects' },
  {icon: <Milestone size={16} />, label: 'Project Milestone', path: '/projectManager/projectMilestone' },
  { icon: <FolderRoot size={16} />, label: 'Task Center', path: '/projectManager/taskCenter' },
  { icon: <CheckSquare size={16} />, label: 'Issue Tracking', path: '/projectManager/issueTracking' },
  { icon: <BarChart3 size={16} />, label: 'Reports', path: '/projectManager/reports' },
  { icon: <MessageSquare size={16} />, label: 'Messages', path: '/projectManager/messages' },
  { icon: <Bell size={16} />, label: 'Notifications', path: '/projectManager/notification' },
  { icon: <Bell size={16} />, label: 'Settings', path: '/projectManager/settings' },
];

export default function ProjectManagerSideBar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="relative sticky top-0 h-screen z-50">
      {/* ENHANCED TOGGLE BUTTON 
          - backdrop-blur: makes it look like glass
          - hover:shadow: adds a blue glow on interaction
      */}
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

        <div className="p-4 mt-auto">
          <div className="flex bg-white/[0.03] border border-white/5 rounded-xl justify-center p-3">
            {!isCollapsed ? (
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                ConWise System v1.0
              </div>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            )}
          </div>
        </div>
      </motion.aside>
    </div>
  );
}