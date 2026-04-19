"use client";
import React, { useState } from 'react';
import { 
  ShieldAlert, FileText, MessageSquare, 
  CheckCircle, Trash2, ChevronRight, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  }
];

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans selection:bg-indigo-50">
      <div className="max-w-3xl mx-auto">
        
        <header className="flex justify-between items-end mb-12">
          <div>
            {/* Removed the 'italic' class here */}
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Notification Center</h1>
            <p className="text-[13px] text-slate-500 font-medium mt-1">Real-time system monitoring & alerts.</p>
          </div>
          {notifications.length > 0 && (
            <button 
              onClick={() => setNotifications([])}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all shadow-sm"
            >
              Clear All
            </button>
          )}
        </header>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {notifications.map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
              >
                <NotificationItem data={n} onDismiss={() => removeNotification(n.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {notifications.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
               <CheckCircle size={40} className="mx-auto text-slate-200 mb-4" />
               <p className="text-[13px] font-bold text-slate-400">System is up to date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ data, onDismiss }) {
  const iconMap = {
    SECURITY: { icon: <ShieldAlert size={20} />, color: 'bg-rose-50 text-rose-600' },
    TASK: { icon: <FileText size={20} />, color: 'bg-indigo-50 text-indigo-600' },
    MESSAGE: { icon: <MessageSquare size={20} />, color: 'bg-amber-50 text-amber-600' },
  };

  const theme = iconMap[data.type] || { icon: <CheckCircle size={20} />, color: 'bg-slate-50 text-slate-400' };

  return (
    <div className="group relative bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex gap-6 items-start">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme.color}`}>
        {theme.icon}
      </div>
      
      <div className="flex-1 pr-6">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-black text-slate-800 tracking-tight text-[15px]">{data.title}</h4>
          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{data.time}</span>
        </div>
        <p className="text-[13px] text-slate-500 font-semibold leading-relaxed mb-4">{data.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {data.badges.map(b => (
            <span key={b} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-tighter">
              {b}
            </span>
          ))}
        </div>
      </div>

      <button 
        onClick={onDismiss}
        className="absolute top-6 right-6 p-1.5 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
}