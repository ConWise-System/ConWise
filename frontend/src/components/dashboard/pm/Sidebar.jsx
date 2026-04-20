"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Construction, ClipboardCheck, 
  AlertTriangle, Users, BarChart3, 
  MessageSquare, ShieldCheck, LogOut, ChevronRight,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/projectmanagement/dashboardHome' },
    { icon: <Construction size={18} />, label: 'Projects', path: '/projectmanagement/projects' },
    { icon: <ClipboardCheck size={18} />, label: 'Task Center', path: '/projectmanagement/tasks' },
    { icon: <AlertTriangle size={18} />, label: 'Issue Tracking', path: '/projectmanagement/issueTracking' },
    { icon: <Users size={18} />, label: 'Team Intel', path: '/projectmanagement/team' },
    { icon: <BarChart3 size={18} />, label: 'Analytics & Reports', path: '/projectmanagement/analytics' },
    { icon: <MessageSquare size={18} />, label: 'Messaging', path: '/projectmanagement/messages' },
    { icon: <ShieldCheck size={18} />, label: 'Security', path: '#' },
  ];

  return (
    <aside className="w-[280px] bg-[#070912] text-slate-400 flex flex-col h-screen fixed left-0 top-0 border-r border-white/5 z-50 overflow-hidden">
      
      {/* 1. Brand Header */}
      <div className="p-8 mb-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <ShieldAlert size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black text-white tracking-tighter italic leading-none uppercase">Sovereign</h1>
            <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1.5">Project Manager</p>
          </div>
        </div>
      </div>

      {/* 2. Navigation Links (Scrollbar hidden) */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar scroll-smooth">
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
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
              <span className="text-[11px] font-bold tracking-widest uppercase">{item.label}</span>
              
              {isActive && (
                <motion.div 
                  layoutId="activeGlow" 
                  className="ml-auto w-1 h-1 rounded-full bg-white shadow-[0_0_8px_#fff]" 
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Compact Profile & Logout Section (Height Hir'ifame) */}
      <div className="p-4 mt-auto shrink-0 border-t border-white/5">
        <div className="bg-white/[0.03] rounded-2xl p-2 space-y-1 backdrop-blur-md">
          
          {/* User Info (Minimized) */}
          <button className="flex items-center gap-3 p-1.5 w-full rounded-xl hover:bg-white/5 transition-all group">
            <div className="relative shrink-0">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center border border-slate-800 overflow-hidden">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" 
                  alt="avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border border-[#070912] rounded-full" />
            </div> 

            <div className="overflow-hidden flex-1">
              <p className="text-[10px] font-black text-white truncate leading-none">Alexander</p>
              <p className="text-[7px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">Chief Manager</p>
            </div>
            <LogOut 
              size={14} 
              className="text-slate-600 hover:text-rose-500 transition-colors ml-2" 
              onClick={(e) => {
                e.stopPropagation();
                router.push('/login');
              }}
            />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;