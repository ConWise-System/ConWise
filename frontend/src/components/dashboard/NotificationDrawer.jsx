'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert, FileText, MessageSquare, CheckCircle } from 'lucide-react';
import {useNotifications}   from '../../context/NotificationContext';   

export default function NotificationDrawer({ isOpen, onClose }) {
  const { 
    notifications, 
    loading: loadingNotifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backing structural background mask */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-[200]"
          />

          {/* Side Panel Canvas Frame Container */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 260 }}
            className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-white border-l border-slate-200 z-[201] flex flex-col shadow-[0_0_50px_rgba(15,23,42,0.08)] text-left"
          >
            {/* Header System Layout */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                  SYstem Notifications 
                  {unreadCount > 0 && (
                    <span className="bg-slate-900 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {unreadCount}
                    </span>
                  )}
                </h2>
                <p className="text-[11px] font-medium text-slate-400 mt-0.5">Real-time asynchronous operation logs.</p>
              </div>
              <div className="flex items-center gap-2">
                {notifications.some((n) => !n.isRead) && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 px-2.5 py-1.5 bg-white border border-slate-200 rounded-md transition-all shadow-2xs"
                  >
                    Clear All
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-slate-900 transition-colors shadow-2xs"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Content Stream Array Box */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
              {loadingNotifications ? (
                <div className="h-full w-full flex flex-col items-center justify-center gap-2 text-slate-400">
                  <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Polling Stream Logs...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-100 rounded-xl my-auto">
                  <CheckCircle size={32} className="text-slate-200 mb-2" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">System Matrix Integrity Nominal</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Zero unhandled exception tokens detected.</p>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {notifications.map((n) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                    >
                      <NotificationPanelItem 
                        data={n} 
                        onMarkRead={() => markAsRead(n.id)} 
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// --- HIGH-DENSITY SIDE PANEL LIST COMPONENT ITEM ---
function NotificationPanelItem({ data, onMarkRead }) {
  const iconMap = {
    SECURITY: { icon: <ShieldAlert size={14} />, color: "bg-rose-50 text-rose-600 border-rose-100" },
    TASK: { icon: <FileText size={14} />, color: "bg-blue-50 text-blue-600 border-blue-100" },
    MESSAGE: { icon: <MessageSquare size={14} />, color: "bg-amber-50 text-amber-600 border-amber-100" },
  };

  const theme = iconMap[data.type] || { icon: <CheckCircle size={14} />, color: "bg-slate-50 text-slate-500 border-slate-200" };

  return (
    <div className={`p-4 rounded-xl border transition-all flex gap-3 items-start relative overflow-hidden group ${
      data.isRead 
        ? 'bg-slate-50/40 border-slate-100 opacity-60' 
        : 'bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
    }`}>
      {!data.isRead && <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-slate-900" />}

      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${theme.color}`}>
        {theme.icon}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex justify-between items-start gap-2">
          <span className={`text-xs font-bold truncate block ${data.isRead ? 'text-slate-500 font-medium' : 'text-slate-900'}`}>
            {data.title}
          </span>
          <span className="text-[9px] font-medium font-mono text-slate-400 tracking-tight shrink-0 mt-0.5">
            {data.time}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 font-medium leading-normal break-words">
          {data.description}
        </p>

        <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
          <div className="flex flex-wrap gap-1">
            {data.badges?.map((b) => (
              <span key={b} className="bg-slate-100 border border-slate-200/60 px-1.5 py-0.5 rounded text-[8px] font-bold text-slate-500 uppercase tracking-tight">
                {b}
              </span>
            ))}
          </div>

          {!data.isRead && (
            <button 
              onClick={onMarkRead}
              className="text-[9px] font-bold uppercase tracking-wider text-slate-900 hover:text-slate-600 inline-flex items-center gap-1 transition-colors bg-slate-50 border border-slate-200 px-2 py-1 rounded"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}