"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Construction, ClipboardCheck, 
  AlertTriangle, Users, BarChart3, 
  MessageSquare, ShieldCheck, LogOut 
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/projectmanagement/dashboardHome' },
    { icon: <Construction size={20} />, label: 'Projects', path: '#' },
    { icon: <ClipboardCheck size={20} />, label: 'Task Center', path: '#' },
    { icon: <AlertTriangle size={20} />, label: 'Issue Tracking', path: '#' },
    { icon: <Users size={20} />, label: 'Team Intel', path: '#' },
    { icon: <BarChart3 size={20} />, label: 'Analytics & Reports', path: '#' },
    { icon: <MessageSquare size={20} />, label: 'Messaging', path: '#' },
    { icon: <ShieldCheck size={20} />, label: 'Security', path: '#' },
  ];

  return (
    <aside className="w-[280px] min-h-screen bg-[#0F1522] text-slate-400 p-8 flex flex-col fixed left-0 top-0 z-50">
      {/* Brand Logo */}
      <div className="mb-12 px-2">
        <h2 className="text-white text-xl font-black tracking-tight">Sovereign Admin</h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Executive View</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.path;
          return (
            <motion.a
              key={index}
              href={item.path}
              whileHover={{ x: 5 }}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                ? 'bg-white/10 text-white border-l-4 border-blue-500 shadow-lg shadow-blue-500/10' 
                : 'hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <span className={`${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </motion.a>
          );
        })}
      </nav>

      {/* User Profile Footer (Suuraa kee irratti akka jiruun) */}
      <div className="pt-8 border-t border-white/5 mt-auto">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-xl bg-blue-600 overflow-hidden border border-white/10">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="avatar" />
          </div>
          <div>
            <p className="text-[11px] font-black text-white leading-none">Alexander</p>
            <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Chief Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;