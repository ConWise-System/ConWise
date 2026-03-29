'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, FolderRoot, CheckSquare, 
  ShieldAlert, BarChart3, MessageSquare, Bell, 
  Settings, LogOut 
} from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard Home', path: '/dashboardHome' },
  { icon: <Users size={18} />, label: 'User Management', path: '/userManagement' },
  { icon: <FolderRoot size={18} />, label: 'Project Management', path: '/projectManagement' },
  { icon: <CheckSquare size={18} />, label: 'Task Management', path: '/taskManagement' },
  { icon: <ShieldAlert size={18} />, label: 'Issue Management', path: '/issueManagement' },
  { icon: <BarChart3 size={18} />, label: 'Reports & Analytics', path: '/report' },
  { icon: <MessageSquare size={18} />, label: 'Messaging', path: '/messaging' },
  { icon: <Bell size={18} />, label: 'Notifications', path: '/notification' },
  { icon: <Settings size={18} />, label: 'Settings', path: '/setting' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a1120] text-slate-400 flex flex-col h-screen sticky top-0 border-r border-slate-800/50">
      {/* Logo Section */}
      <div className="p-6 mb-4">
        <h1 className="text-white font-bold text-lg tracking-tight">Sovereign Exec</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium Admin</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item, idx) => {
          // Check if current path matches the item path
          const isActive = pathname === item.path;

          return (
            <Link 
              key={idx} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' 
                  : 'hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span className={`${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
                {item.icon}
              </span>
              <span className="text-sm font-semibold tracking-wide">{item.label}</span>
              
              {/* Optional Active Indicator Dot */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Section */}
      <div className="p-4 border-t border-slate-800/60 bg-[#0d1526]">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl overflow-hidden border border-slate-700 p-[2px]">
            <div className="w-full h-full bg-[#0a1120] rounded-[9px] flex items-center justify-center text-white text-[10px] font-black">
              AS
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white truncate tracking-tight">Alex Sterling</p>
            <p className="text-[9px] font-bold truncate text-slate-500 uppercase tracking-tighter">Chief Operations</p>
          </div>
        </div>
        
        <button className="flex items-center gap-3 px-3 py-2.5 w-full text-xs font-black uppercase tracking-widest text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}