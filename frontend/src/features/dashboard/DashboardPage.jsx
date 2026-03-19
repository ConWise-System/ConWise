'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../../components/Sidebar';
import { 
  Users, Share2, FileText, Bug, Search, 
  Bell, UserCircle, Settings, LogOut, ArrowUpRight, Zap 
} from 'lucide-react';
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Jan', value: 400, top: 100 },
  { name: 'Feb', value: 300, top: 150 },
  { name: 'Mar', value: 200, top: 80 },
  { name: 'Apr', value: 500, top: 120 },
  { name: 'May', value: 450, top: 90 },
  { name: 'Jun', value: 550, top: 110 },
  { name: 'Jul', value: 480, top: 130 },
  { name: 'Aug', value: 600, top: 100 },
  { name: 'Sep', value: 520, top: 140 },
  { name: 'Oct', value: 700, top: 160 },
  { name: 'Nov', value: 650, top: 110 },
  { name: 'Dec', value: 800, top: 200 },
];

const containerVars = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring", damping: 20, stiffness: 100 } 
  }
};

const menuVars = {
  hidden: { opacity: 0, y: -20, scale: 0.9, filter: "blur(8px)" },
  visible: { 
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)", 
    transition: { type: "spring", damping: 15, stiffness: 200 } 
  },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }
};

export default function DashboardPage() {
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
      
      <aside className="h-full shrink-0 z-[100] shadow-2xl shadow-slate-200">
        <Sidebar />
      </aside>
      
      <motion.main 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="flex-1 h-full overflow-y-auto p-8 scroll-smooth custom-scrollbar relative z-0"
      >
        {/* NAVBAR - z-index ol kaafameera */}
        <motion.div 
          variants={itemVars} 
          className="flex justify-between items-center mb-10 relative z-[60]"
        >
          <div className="flex items-center gap-6">
            <div className="relative group">
              <motion.div 
                initial={{ width: 0 }} animate={{ width: "100%" }}
                transition={{ duration: 1, ease: "circOut" }}
                className="absolute -bottom-1 left-0 h-1 bg-blue-600 rounded-full"
              />
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Overview</h1>
            </div>
            
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search everything..." 
                className="bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-6 text-sm w-80 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all outline-none shadow-sm" 
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 mr-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Live</span>
            </div>

            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="p-3 bg-white text-slate-500 hover:text-blue-600 rounded-2xl shadow-sm border border-slate-200 relative"
              >
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
              </motion.button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    variants={menuVars} initial="hidden" animate="visible" exit="exit"
                    className="absolute right-0 mt-4 w-80 bg-white border border-slate-100 rounded-[2rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-[110] p-6"
                  >
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 text-center">Live Intelligence</h4>
                    <div className="space-y-3">
                      <NotificationItem text="Project 'Titan' reached 80% completion" time="Just now" color="bg-emerald-500" />
                      <NotificationItem text="Anomalous login detected in London" time="14m ago" color="bg-rose-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <motion.div 
                whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className="flex items-center gap-3 cursor-pointer p-1.5 pr-5 bg-[#0a1120] rounded-2xl shadow-xl border border-slate-800"
              >
                <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-xl flex items-center justify-center text-white font-black text-sm">
                  AS
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-white leading-none">A. Sterling</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Admin</span>
                </div>
              </motion.div>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    variants={menuVars} initial="hidden" animate="visible" exit="exit"
                    className="absolute right-0 mt-4 w-64 bg-white border border-slate-100 rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-[110] overflow-hidden"
                  >
                    <div className="p-8 pb-4 text-center">
                       <div className="w-16 h-16 bg-slate-100 rounded-3xl mx-auto mb-3 flex items-center justify-center text-slate-800 border-2 border-white shadow-md">
                          <UserCircle size={32} />
                       </div>
                       <p className="text-sm font-black text-slate-900 leading-none">Alexander Sterling</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-2">Executive Access</p>
                    </div>
                    <div className="p-4 pt-0 space-y-1">
                      <ProfileMenuButton icon={<Settings size={16} />} label="Security Settings" onClick={() => router.push('/settings')} />
                      <ProfileMenuButton icon={<LogOut size={16} />} label="Terminate Session" isRed onClick={() => router.push('/login')} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="pb-20 space-y-10 relative z-0">
          <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCardWithHover title="Total Users" value="12,842" trend="+8.2%" icon={<Users size={20} />} color="blue" />
            <StatCardWithHover title="Active Nodes" value="148" trend="+12.5%" icon={<Zap size={20} />} color="emerald" />
            <StatCardWithHover title="Documentation" value="3,204" trend="+2.4%" icon={<FileText size={20} />} color="indigo" />
            <StatCardWithHover title="Security Alerts" value="24" badge="Urgent" icon={<Bug size={20} />} color="rose" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              variants={itemVars} whileHover={{ scale: 1.01 }}
              className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Share2 size={120} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Annual Node Growth</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest mb-12">Full 12-Month Telemetry</p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <Tooltip 
                      cursor={{fill: '#f8fafc', radius: 12}} 
                      contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', padding: '15px' }} 
                    />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 900, fill: '#cbd5e1'}} dy={10} />
                    <Bar dataKey="value" fill="#0f172a" radius={[8, 8, 8, 8]} barSize={18} />
                    <Bar dataKey="top" fill="#e2e8f0" radius={[8, 8, 8, 8]} barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVars} whileHover={{ scale: 1.01 }}
              className="bg-[#0a1120] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden"
            >
              <h3 className="text-lg font-black mb-1">Task Velocity</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-12">Optimization: High</p>
              <div className="relative flex justify-center mb-12">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                  <motion.circle 
                    cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray="440"
                    initial={{ strokeDashoffset: 440 }}
                    animate={{ strokeDashoffset: 440 - (440 * 0.82) }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                    className="text-blue-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black">82%</span>
                  <span className="text-[9px] font-black text-slate-500 uppercase">Sync</span>
                </div>
              </div>
              <div className="space-y-4">
                <StatusRow color="bg-blue-500" label="Deploying" value="1,240" isDark />
                <StatusRow color="bg-slate-700" label="Standby" value="842" isDark />
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={itemVars}
            className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tighter">System Activity</h3>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Real-time Telemetry Data</p>
              </div>
              <motion.button whileHover={{ rotate: 180, scale: 1.1 }} className="p-4 bg-slate-50 rounded-full text-slate-400">
                <ArrowUpRight size={20} />
              </motion.button>
            </div>
            <div className="grid grid-cols-1 gap-12">
              <ActivityItem title="Alpha Node Encryption" desc="Quantum-resistant layers applied to all core databases." time="2h ago" />
              <ActivityItem title="Neural Network Training" desc="Phase 4 of customer behavior model completed." time="5h ago" isUrgent />
            </div>
          </motion.div>
        </div>

        <motion.footer variants={itemVars} className="flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] py-12 border-t border-slate-100">
          <p>© 2026 CONWISE // ARCHITECTURE.V3</p>
        </motion.footer>
      </motion.main>
    </div>
  );
}

// --- HELPERS (Animated) ---

function StatCardWithHover({ title, value, trend, icon, color, badge }) {
  const colors = {
    blue: "group-hover:text-blue-600 bg-blue-50",
    emerald: "group-hover:text-emerald-600 bg-emerald-50",
    indigo: "group-hover:text-indigo-600 bg-indigo-50",
    rose: "group-hover:text-rose-600 bg-rose-50"
  };
  return (
    <motion.div whileHover={{ y: -12, scale: 1.02 }} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm group cursor-pointer transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl transition-colors duration-500 ${colors[color] || 'bg-slate-50'}`}>{icon}</div>
        {badge ? <span className="bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full animate-bounce">{badge}</span> : <span className="text-[11px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>}
      </div>
      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
      <p className="text-3xl font-black text-slate-900 mt-2 tracking-tighter">{value}</p>
    </motion.div>
  );
}

function StatusRow({ color, label, value, isDark }) {
  return (
    <motion.div whileHover={{ x: 10 }} className="flex justify-between items-center group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-3 h-3 rounded-full ${color} shadow-lg shadow-${color}/50`} />
        <span className={`text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-black'} transition-colors`}>{label}</span>
      </div>
      <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</span>
    </motion.div>
  );
}

function ActivityItem({ title, desc, time, isUrgent }) {
  return (
    <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="flex gap-10 relative group">
      <div className="w-14 h-14 rounded-3xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
         <div className={`w-3 h-3 rounded-full ${isUrgent ? 'bg-rose-500' : 'bg-blue-500'}`} />
      </div>
      <div className="flex-1 border-b border-slate-50 pb-8 group-last:border-none">
        <div className="flex justify-between items-start">
          <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h4>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{time}</span>
        </div>
        <p className="text-sm text-slate-500 mt-2 font-medium leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function NotificationItem({ text, time, color }) {
  return (
    <motion.div whileHover={{ x: 8, backgroundColor: "#f8fafc" }} className="flex items-start gap-4 p-4 rounded-[1.5rem] cursor-pointer border border-transparent hover:border-slate-100">
      <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${color}`} />
      <div>
        <p className="text-xs font-bold text-slate-800 leading-snug">{text}</p>
        <p className="text-[9px] font-black text-slate-400 uppercase mt-2">{time}</p>
      </div>
    </motion.div>
  );
}

function ProfileMenuButton({ icon, label, onClick, isRed }) {
  return (
    <motion.button whileHover={{ x: 8, backgroundColor: isRed ? '#fff1f2' : '#f8fafc' }} onClick={onClick} className={`w-full flex items-center gap-4 px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] rounded-2xl ${isRed ? 'text-rose-500' : 'text-slate-500 hover:text-black'}`}>
      {icon} {label}
    </motion.button>
  );
}