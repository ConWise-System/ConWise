"use client";

import React from "react";
import {
  ShieldAlert,
  FileText,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../../context/NotificationContext";

export default function NotificationCenter() {
  // Pull live values, loading state, and handlers directly from your custom socket context
  const { notifications, loading, markAsRead, markAllAsRead } =
    useNotifications();

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-12 font-sans selection:bg-indigo-50">
      <div className="max-w-3xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
              Notification Center
            </h1>
            <p className="text-[13px] text-slate-500 font-medium mt-1">
              Real-time system monitoring & alerts.
            </p>
          </div>

          {/* Only render "Mark All as Read" if there are actual unread logs in the local array */}
          {notifications.some((n) => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
            >
              Mark All As Read
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-6 h-6 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
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
                  {/* Passing markAsRead to dismiss button */}
                  <NotificationItem
                    data={n}
                    onDismiss={() => markAsRead(n.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {notifications.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                <CheckCircle
                  size={40}
                  className="mx-auto text-slate-200 mb-4"
                />
                <p className="text-[13px] font-bold text-slate-400">
                  System is up to date.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ data, onDismiss }) {
  const iconMap = {
    SECURITY: {
      icon: <ShieldAlert size={20} />,
      color: "bg-rose-50 text-rose-600",
    },
    TASK: {
      icon: <FileText size={20} />,
      color: "bg-indigo-50 text-indigo-600",
    },
    MESSAGE: {
      icon: <MessageSquare size={20} />,
      color: "bg-amber-50 text-amber-600",
    },
  };

  const theme = iconMap[data.type] || {
    icon: <CheckCircle size={20} />,
    color: "bg-slate-50 text-slate-400",
  };

  return (
    <div
      className={`group relative border p-6 rounded-[2rem] transition-all flex gap-6 items-start ${
        data.isRead
          ? "bg-white/50 border-slate-100 opacity-65 shadow-none"
          : "bg-white border-slate-200/80 shadow-sm hover:shadow-md ring-1 ring-slate-900/[0.02]"
      }`}
    >
      {/* Dynamic Notification Icon Badge */}
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${theme.color}`}
      >
        {theme.icon}
      </div>

      <div className="flex-1">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 gap-4">
          <div className="flex items-center gap-2">
            <h4
              className={`font-black tracking-tight text-[15px] ${
                data.isRead
                  ? "text-slate-600 line-through decoration-slate-300"
                  : "text-slate-800"
              }`}
            >
              {data.title}
            </h4>

            {/* Blue status circle for immediate unread visual tracking */}
            {!data.isRead && (
              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 animate-pulse" />
            )}
          </div>

          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest shrink-0">
            {data.time}
          </span>
        </div>

        {/* Description */}
        <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
          {data.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 mt-5 flex-wrap">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {data.badges?.map((b) => (
              <span
                key={b}
                className="
                  px-2.5 py-1
                  bg-slate-50
                  border border-slate-100
                  rounded-lg
                  text-[9px]
                  font-black
                  text-slate-400
                  uppercase
                  tracking-tighter
                "
              >
                {b}
              </span>
            ))}
          </div>

          {/* Professional Mark As Read Button */}
          {!data.isRead && (
            <button
              onClick={onDismiss}
              title="Mark as read"
              className="
                group/button
                flex items-center gap-2
                px-4 py-2
                rounded-xl
                bg-slate-900
                hover:bg-slate-800
                text-white
                text-[10px]
                font-black
                uppercase
                tracking-[0.15em]
                transition-all duration-200
                shadow-sm hover:shadow-lg
                active:scale-[0.98]
              "
            >
              <CheckCircle
                size={14}
                className="transition-transform duration-200 group-hover/button:scale-110"
              />

              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}