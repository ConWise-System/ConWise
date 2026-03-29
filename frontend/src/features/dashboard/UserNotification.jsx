"use client";
import React, { useState } from 'react';
import { 
  ShieldAlert, FileText, MessageSquare, 
  CheckCircle, Trash2, ChevronRight, X 
} from 'lucide-react';

// Simulated API Data
const INITIAL_NOTIFICATIONS = [
  { 
    id: 1, 
    type: 'SECURITY', 
    title: 'Critical System Breach Attempt', 
    description: 'Unauthorized access attempt detected from IP: 192.168.1.104. Firewall has successfully mitigated the request.', 
    time: '14:24 PM', 
    date: 'Today', 
    badges: ['SECURITY ALERT', 'HIGH PRIORITY'] 
  },
  { 
    id: 2, 
    type: 'TASK', 
    title: 'New Project Milestone Assigned', 
    description: "The 'Q4 Sovereign Growth' project has been updated with 4 new sub-tasks.", 
    time: '09:15 AM', 
    date: 'Today', 
    badges: ['TASK UPDATE'] 
  },
  { 
    id: 3, 
    type: 'MESSAGE', 
    title: 'Message from Executive Suite', 
    description: 'Sarah Jenkins: "We need the final compliance report by EOD Friday."', 
    time: '08:45 AM', 
    date: 'Today', 
    badges: ['MESSAGE'] 
  },
  { 
    id: 4, 
    type: 'SYSTEM', 
    title: 'Database Backup Successful', 
    description: 'Daily snapshot completed for "Production-Cluster-A". Size: 42.4GB.', 
    time: '03:00 AM', 
    date: 'Yesterday', 
    badges: [] 
  }
];

export default function NotificationCenter() {
  // --- STATE MANAGEMENT ---
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // --- HANDLERS ---
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // --- DERIVED DATA ---
  const hasNotifications = notifications.length > 0;
  const todayAlerts = notifications.filter(n => n.date === 'Today');
  const yesterdayAlerts = notifications.filter(n => n.date === 'Yesterday');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notification Center</h1>
            <p className="text-slate-500 font-medium mt-1">Stay updated with real-time system alerts.</p>
          </div>
          {hasNotifications && (
            <button 
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
            >
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </header>

        {/* Empty State */}
        {!hasNotifications && (
          <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-20 text-center">
            <CheckCircle size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold">All caught up! No new notifications.</p>
          </div>
        )}

        {/* Notification List */}
        <div className="space-y-12">
          {/* Today Group */}
          {todayAlerts.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-2">Today</h3>
              <div className="space-y-3">
                {todayAlerts.map(n => (
                  <NotificationItem key={n.id} data={n} onDismiss={() => removeNotification(n.id)} />
                ))}
              </div>
            </section>
          )}

          {/* Yesterday Group */}
          {yesterdayAlerts.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-2">Yesterday</h3>
              <div className="space-y-3">
                {yesterdayAlerts.map(n => (
                  <NotificationItem key={n.id} data={n} onDismiss={() => removeNotification(n.id)} />
                ))}
              </div>
            </section>
          )}
        </div>

        {hasNotifications && (
          <button className="w-full mt-10 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
            View Archived Notifications <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

// Sub-component for clean rendering
function NotificationItem({ data, onDismiss }) {
  const iconMap = {
    SECURITY: { icon: <ShieldAlert size={20} />, color: 'bg-rose-50 text-rose-600' },
    TASK: { icon: <FileText size={20} />, color: 'bg-blue-50 text-blue-600' },
    MESSAGE: { icon: <MessageSquare size={20} />, color: 'bg-amber-50 text-amber-600' },
    SYSTEM: { icon: <CheckCircle size={20} />, color: 'bg-slate-50 text-slate-400' },
  };

  const theme = iconMap[data.type] || iconMap.SYSTEM;

  return (
    <div className="group relative bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex gap-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${theme.color}`}>
        {theme.icon}
      </div>
      
      <div className="flex-1 pr-8">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-slate-900">{data.title}</h4>
          <span className="text-[10px] font-bold text-slate-300 uppercase">{data.time}</span>
        </div>
        <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{data.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {data.badges.map(b => (
            <span key={b} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              {b}
            </span>
          ))}
        </div>
      </div>

      <button 
        onClick={onDismiss}
        className="absolute top-4 right-4 p-1 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={18} />
      </button>
    </div>
  );
}