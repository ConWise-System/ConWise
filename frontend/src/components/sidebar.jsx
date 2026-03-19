'use client';
import { LayoutDashboard, Users, FolderRoot, CheckSquare, ShieldAlert, BarChart3, MessageSquare, Bell, Settings, LogOut } from 'lucide-react';

const menuItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard Home', active: true },
  { icon: <Users size={18} />, label: 'User Management' },
  { icon: <FolderRoot size={18} />, label: 'Project Management' },
  { icon: <CheckSquare size={18} />, label: 'Task Management' },
  { icon: <ShieldAlert size={18} />, label: 'Issue Management' },
  { icon: <BarChart3 size={18} />, label: 'Reports & Analytics' },
  { icon: <MessageSquare size={18} />, label: 'Messaging' },
  { icon: <Bell size={18} />, label: 'Notifications' },
  { icon: <Settings size={18} />, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0a1120] text-slate-400 flex flex-col h-screen sticky top-0">
      <div className="p-6 mb-4">
        <h1 className="text-white font-bold text-lg tracking-tight">Sovereign Exec</h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium Admin</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-all ${item.active ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/50 hover:text-slate-200'}`}>
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 mb-4">
          <div className="w-9 h-9 bg-slate-700 rounded-full overflow-hidden border border-slate-600">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="avatar" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">Alex Sterling</p>
            <p className="text-[10px] truncate text-slate-500">Chief Operations Officer</p>
          </div>
        </div>
        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm hover:text-white transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}