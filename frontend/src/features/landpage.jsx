"use client";
import React, { useMemo, useState }  from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import { 
  Layers, Activity, Building2, HardHat, 
  MonitorCheck, Cpu, ArrowRight, ArrowUpRight,
  Phone, Mail
} from 'lucide-react';

// --- ADVANCED ANIMATION LAYERS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 80, damping: 15 } 
  }
};

const buttonHover = {
  hover: {
    scale: 1.03,
    boxShadow: "0px 10px 25px rgba(37, 99, 235, 0.3)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.98 }
};

const navItems = [
  { label: "Home", target: "hero" },
  { label: "Ecosystem", target: "ecosystem" },
  { label: "Capabilities", target: "capabilities" },
  { label: "Standards", target: "standards" },
  { label: "Audit", target: "audit" }
];

const scrollToSection = (target) => {
  const section = document.getElementById(target);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default function ConWiseLanding() {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] text-[#0F172A] font-sans antialiased overflow-x-hidden">
      
      {/* 0. UTILITY TOP METADATA BAR */}
      <div className="w-full bg-slate-900 text-white/60 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 py-2 px-6 md:px-12 hidden sm:block">
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone size={11} className="text-blue-500" /> +1 (800) 555-WISE</span>
            <span className="flex items-center gap-1.5"><Mail size={11} className="text-blue-500" /> ops@conwise.com</span>
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <span className="hover:text-blue-500 transition-colors cursor-pointer">Sovereign Core v4.1</span>
          </div>
        </div>
      </div>
      {/* 1. SOLID WHITE PROFESSIONAL NAVBAR */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 transition-all duration-300 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
          
          {/* Logo Brand Primitive */}
          <motion.div 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 cursor-pointer group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20 transition-transform">
              <Layers size={18} />
            </div>
            <span className="text-lg font-black uppercase tracking-tighter text-slate-900">ConWise</span>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            {navItems.map((item) => (
              <motion.button
                key={item.target}
                type="button"
                onClick={() => scrollToSection(item.target)}
                whileHover={{ y: -1, color: "#1D4ED8" }}
                className="text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Connected Identity Route Actions */}
          <div className="flex items-center gap-4">
            <motion.button 
              onClick={() => router.push('/login')} 
              className="btn-link px-3 py-2"
              whileHover={{ y: -1 }}
            >
              Sign In
            </motion.button>
            <motion.button 
              onClick={() => router.push('/register')} 
              className="btn btn-primary px-5 py-2.5"
              variants={buttonHover}
              whileHover="hover"
              whileTap="tap"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </header>

      {/* 2. LEFT-ALIGNED HERO CANVAS */}
  <section 
    id="hero"
    className="relative text-white min-h-screen flex items-center justify-center py-6 px-6 md:px-12 border-b border-slate-900 overflow-hidden bg-cover bg-center select-none"
    style={{ 
      backgroundImage: `linear-gradient(to right, rgba(7, 12, 30, 0.96) 20%, rgba(15, 23, 42, 0.7)), url('/image/home.jpg')` 
    }}
  >
  {/* Advanced Blueprint Digital Grid Overlay */}
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-10 [mask-image:radial-gradient(ellipse_60%_50%_at_0%_0%,#000_70%,transparent_100%)] pointer-events-none" />
  
  {/* Ambient Premium Cyber Lighting Effects */}
  <motion.div 
    animate={{ opacity: [0.1, 0.15, 0.1] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" 
  />
  <div className="absolute bottom-5 right-5 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

  {/* Staggered Container for Content Modules */}
  <motion.div 
    variants={{
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
      }
    }}
    initial="hidden"
    animate="visible"
    className="w-full max-w-[1100px] mx-auto text-left relative z-10 space-y-5 md:space-y-6"
  >
    {/* Micro System Pill Tag with Entry Sliding Animation */}
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
      }}
    >
      <span className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-400 px-3 py-1 rounded-full text-[8.5px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
        <span className="h-1.5 w-1.5 bg-blue-400 rounded-full animate-pulse" />
        ConWise Sovereign Architecture
      </span>
    </motion.div>
    
    {/* Refined & Streamlined Header Layout */}
    <motion.h1 
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl leading-[1.12]"
    >
      Synchronize Site Assets <br className="hidden sm:block" />
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400">
        With Absolute Precision
      </span>
    </motion.h1>
    
    {/* Optimized Compact Feature Copy */}
    <motion.p 
      variants={{
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
      }}
      className="text-xs md:text-[13px] text-slate-300 max-w-lg font-medium leading-relaxed drop-shadow-sm"
    >
      A high-performance workspace engineered for <span className="text-white font-bold">Managers</span>, <span className="text-white font-bold">Engineers</span>, and <span className="text-white font-bold">Supervisors</span>. Orchestrate dynamic workflows, real-time metrics, and verified daily matrix reports.
    </motion.p>

    {/* Interactive Animated Core System Nodes */}
    <motion.div 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
      }}
      className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl pt-1 border-t border-white/5"
    >
      {[
        { label: "Role Management", desc: "Access Restrictions" },
        { label: "Task Scheduling", desc: "Milestone Pipelines" },
        { label: "Daily Site Feeds", desc: "Instant Telemetry Sync" },
        { label: "Issue Resolution", desc: "Lifecycle Verification" }
      ].map((feat, index) => (
        <motion.div 
          key={index}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1 }
          }}
          whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(59, 130, 246, 0.3)" }}
          className="space-y-0.5 bg-white/5 border border-white/10 p-2.5 rounded-xl backdrop-blur-sm cursor-default transition-colors duration-200"
        >
          <p className="text-[8.5px] font-black text-blue-400 uppercase tracking-wider">{feat.label}</p>
          <p className="text-[8px] text-slate-400 font-medium">{feat.desc}</p>
        </motion.div>
      ))}
    </motion.div>
    
    {/* Micro Actions Panel */}
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
      }}
      className="flex flex-col sm:flex-row justify-start items-center gap-3 pt-2"
    >
      <motion.button 
        onClick={() => router.push('/register')} 
        className="btn btn-primary w-full sm:w-auto px-5 py-2.5 gap-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Initialize Platform <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform duration-200" />
      </motion.button>
      
      <motion.button 
        onClick={() => router.push('/login')} 
        className="btn btn-secondary w-full sm:w-auto px-5 py-2.5 gap-2"
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
        whileTap={{ scale: 0.98 }}
      >
        Access Terminal
      </motion.button>

      <motion.button
        type="button"
        onClick={() => scrollToSection('ecosystem')}
        className="btn btn-link w-full sm:w-auto px-5 py-2.5"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Explore Ecosystem
      </motion.button>
    </motion.div>
  </motion.div>
</section>

      {/* HORIZONTAL ACCENT SPLIT STRIP */}
      <div className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest text-[11px] py-4 px-6 md:px-12 border-y border-slate-800">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="text-slate-400">Enterprise Infrastructure Sovereignty Platform</span>
          <motion.span 
            className="flex items-center gap-1 text-[10px] text-blue-400 opacity-90 cursor-pointer" 
            onClick={() => router.push('/register')}
            whileHover={{ scale: 1.02, x: 2 }}
          >
            Explore System Specifications <ArrowUpRight size={12} />
          </motion.span>
        </div>
      </div>

  {/* 3. UNIFIED ECOSYSTEM SECTIONS */}
<section id="ecosystem" className="py-24 px-6 md:px-12 max-w-[1200px] mx-auto select-none">
  {/* Header Section */}
  <div className="text-center md:text-left mb-16 space-y-3">
    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Sovereign Workflow Canvas</span>
    <div className="space-y-2">
      <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 relative inline-block">
        Unified Ecosystem.
        <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-600 rounded-full" />
      </h2>
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest max-w-xl pt-1">
      Precision modules engineered for every role tier of your infrastructure operations.
    </p>
  </div>

  {/* Top Grid Block: Executive Suite & Management Terminal */}
  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
    
    {/* Tier 01: Project Manager / Executive Suite */}
    <motion.div 
      className="group col-span-1 md:col-span-7 bg-[#0B132B] text-white rounded-[2.5rem] p-8 md:p-12 min-h-[440px] flex flex-col justify-between relative overflow-hidden shadow-xl border border-slate-800 cursor-pointer"
      whileHover={{ y: -6, boxShadow: "0px 25px 50px rgba(7, 12, 30, 0.25)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-10" />
      
      <div className="flex justify-between items-center relative z-20">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full backdrop-blur-sm">Tier 01</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Project Manager Core</span>
      </div>

      <div className="absolute inset-0 w-full h-full opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700 ease-out">
        <img src="/image/unif.jpg" alt="Executive Suite Blueprint" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-20 mt-auto space-y-3">
        <h3 className="text-2xl md:text-3xl font-black flex items-center gap-2 group-hover:text-blue-400 transition-colors tracking-tight">
          Executive Suite & Creation <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </h3>
        <p className="text-xs md:text-sm text-slate-400 max-w-md font-medium leading-relaxed">
          Initialize new construction operations, allocate estimated project budgets, and assign authorized site engineers to isolated telemetry lines.
        </p>
        <div className="flex items-center gap-2 pt-1 text-[9px] font-black uppercase tracking-wider text-slate-300">
          <span>Budget Matrix</span> • <span>Member Allocation</span> • <span>SLA Governance</span>
        </div>
      </div>
    </motion.div>

    {/* Tier 02: Site Engineer Terminal */}
    <motion.div 
      className="group col-span-1 md:col-span-5 bg-slate-50 border border-slate-200 rounded-[2.5rem] p-8 md:p-12 flex flex-col justify-between cursor-pointer transition-all duration-300"
      whileHover={{ y: -6, backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', boxShadow: "0px 20px 40px rgba(0,0,0,0.04)" }}
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="h-10 w-10 bg-blue-600/10 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <MonitorCheck size={20} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">Site Engineer Node</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Management Terminal</h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Process microtask scheduling, track pending/in-progress lifecycles, and submit verified milestones for structural management approval.
        </p>
      </div>

      {/* Dynamic Animated Activity Indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl mt-6 p-4 flex flex-col gap-2.5 justify-center relative overflow-hidden shadow-sm">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-400">
          <span>Task Approval Flow</span>
          <span className="text-blue-600 animate-pulse">Syncing Live</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600 rounded-full" 
            animate={{ width: ["30%", "85%", "60%", "95%", "30%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="h-1 w-1/2 bg-slate-100 rounded-full" />
      </div>
    </motion.div>
  </div>

  {/* Bottom Block: Field Ops Hub / Site Supervisor */}
  <motion.div 
    className="group w-full bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-[2.5rem] p-8 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xl border border-slate-800 relative overflow-hidden cursor-pointer"
    whileHover={{ y: -6, boxShadow: "0px 30px 60px rgba(0,0,0,0.3)" }}
    transition={{ duration: 0.3, ease: "easeOut" }}
  >
    {/* Background Decorative Element */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px)] bg-[size:6rem] opacity-10 pointer-events-none" />
    
    <div className="col-span-1 md:col-span-6 space-y-6 relative z-10">
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Tier 03</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">• Site Supervisor Pipeline</span>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-3xl font-black tracking-tight">Field Ops Hub</h3>
        <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed max-w-md">
          Empower onsite supervisors to commit daily site logs, track real-time material usage metrics, update weather logs, and broadcast immediate incident issue reports.
        </p>
      </div>

      {/* Mini Feature Stats */}
      <div className="flex gap-3">
        <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center backdrop-blur-md">
          <p className="text-xs font-black text-blue-400">Telemetry</p>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Daily Reports</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-center backdrop-blur-md">
          <p className="text-xs font-black text-emerald-400">Isolated</p>
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Issue Logger</p>
        </div>
      </div>
    </div>

    {/* Right Column: Visual Component Mapping */}
    <div className="col-span-1 md:col-span-6 h-64 rounded-2xl flex items-center justify-center relative overflow-hidden border border-white/10 shadow-inner bg-slate-950">
      <img src="/image/field.jpg" alt="Field Site Operations" className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700 ease-out" />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/20 to-transparent md:block hidden" />
      
      {/* Absolute Badge */}
      <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-white/10 text-blue-400 shadow-lg">
        <Cpu size={16} className="animate-spin" style={{ animationDuration: '8s' }} />
      </div>
    </div>
  </motion.div>
</section>

{/* 4. METRIC DATA GRID WITH CONTINOUS ROTATING IMAGE & MOTION */}
<section id="capabilities" className="bg-slate-50 border-y border-slate-200 py-24 px-6 md:px-12 relative overflow-hidden select-none">
  
  {/* Continuous 360° Seamless Rotating Background Layout */}
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden flex items-center justify-center">
    <motion.img 
      src="/image/unif.jpg" 
      alt="Rotating Core Tech Engine" 
      className="w-[1000px] h-[1000px] object-cover rounded-full filter blur-[1px]"
      animate={{ rotate: 360 }}
      transition={{ ease: "linear", duration: 45, repeat: Infinity }}
    />
  </div>

  {/* System Capabilities Matrix Grid - Staggered Entry */}
  <motion.div 
    className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.05 }
      }
    }}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-80px" }}
  >
    
    {/* Capability 1: Multi-Role Matrix */}
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
      }}
      whileHover={{ y: -8, backgroundColor: "#FFFFFF", borderColor: "rgba(59, 130, 246, 0.25)", boxShadow: "0px 20px 40px rgba(0,0,0,0.04)" }}
      className="space-y-4 p-6 rounded-3xl transition-all duration-300 border border-slate-200/40 bg-white/40 backdrop-blur-sm group cursor-default"
    >
      <div className="h-11 w-11 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Building2 size={20} className="group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-base font-black tracking-tight text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">Role Governance</h4>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Isolated terminal layers enforcing strict data permissions across Project Managers, Site Engineers, and Supervisors.
        </p>
      </div>
    </motion.div>

    {/* Capability 2: Cost & Material Analytics */}
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
      }}
      whileHover={{ y: -8, backgroundColor: "#FFFFFF", borderColor: "rgba(59, 130, 246, 0.25)", boxShadow: "0px 20px 40px rgba(0,0,0,0.04)" }}
      className="space-y-4 p-6 rounded-3xl transition-all duration-300 border border-slate-200/40 bg-white/40 backdrop-blur-sm group cursor-default"
    >
      <div className="h-11 w-11 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Cpu size={20} className="group-hover:rotate-45 transition-transform duration-300" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-base font-black tracking-tight text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">Resource Telemetry</h4>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Log estimated vs. actual expenses and manual job-site material usage values synced straight to budget summaries.
        </p>
      </div>
    </motion.div>

    {/* Capability 3: Daily Site Reporting */}
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
      }}
      whileHover={{ y: -8, backgroundColor: "#FFFFFF", borderColor: "rgba(59, 130, 246, 0.25)", boxShadow: "0px 20px 40px rgba(0,0,0,0.04)" }}
      className="space-y-4 p-6 rounded-3xl transition-all duration-300 border border-slate-200/40 bg-white/40 backdrop-blur-sm group cursor-default"
    >
      <div className="h-11 w-11 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Layers size={20} className="group-hover:scale-110 transition-transform duration-300" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-base font-black tracking-tight text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">Operational Feeds</h4>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Commit structured supervisor logs tracking active labor tallies, micro-weather impacts, and spatial progress photography.
        </p>
      </div>
    </motion.div>

    {/* Capability 4: Issue Identification & Tracker */}
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 25 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
      }}
      whileHover={{ y: -8, backgroundColor: "#FFFFFF", borderColor: "rgba(59, 130, 246, 0.25)", boxShadow: "0px 20px 40px rgba(0,0,0,0.04)" }}
      className="space-y-4 p-6 rounded-3xl transition-all duration-300 border border-slate-200/40 bg-white/40 backdrop-blur-sm group cursor-default"
    >
      <div className="h-11 w-11 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center mb-1 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
        <Activity size={20} className="group-hover:animate-pulse transition-transform duration-300" />
      </div>
      <div className="space-y-1.5">
        <h4 className="text-base font-black tracking-tight text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">Resolution Engine</h4>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Instantly register project compliance gaps, allocate tasks to site teams, and maintain ironclad auditing histories.
        </p>
      </div>
    </motion.div>

  </motion.div>
</section>

      {/* 5. STANDARDS INTEGRATION & TESTIMONIAL BLOCK */}
<section id="standards" className="py-28 px-6 md:px-12 max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center relative overflow-hidden">
  
  {/* Left Side: Standards & Integration Logos */}
  <motion.div 
    className="col-span-1 md:col-span-6 space-y-8"
    initial={{ opacity: 0, x: -30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    <div className="space-y-3">
      <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Enterprise Sync Matrix</span>
      <h3 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 leading-tight">
        Seamlessly integrated with the world's leading infrastructure standards.
      </h3>
    </div>
    
    {/* Professional Grid with Images that slowly rotate on Hover */}
    <div className="grid grid-cols-3 gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
      {[
        { name: "Procore", img: "/image/unif.jpg" },
        { name: "Autodesk", img: "/image/unif.jpg" },
        { name: "BIM/ERP", img: "/image/unif.jpg" }
      ].map((platform, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ y: -6, borderColor: "rgba(37,99,235,0.4)", boxShadow: "0px 12px 20px rgba(0,0,0,0.03)" }}
          className="bg-white border border-slate-200 p-5 rounded-2xl text-center shadow-sm hover:border-b-4 hover:border-b-blue-600 transition-all cursor-pointer flex flex-col items-center gap-3 group"
        >
          {/* Small Tech Pattern Image inside Logo box that rotates slowly */}
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 relative border border-slate-100">
            <motion.img 
              src={platform.img} 
              alt={platform.name}
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100"
              animate={platform.name === "BIM/ERP" ? { rotate: 360 } : {}}
              transition={platform.name === "BIM/ERP" ? { ease: "linear", duration: 20, repeat: Infinity } : {}}
              whileHover={{ rotate: 180, transition: { duration: 0.8 } }}
            />
          </div>
          <span className="group-hover:text-slate-900 transition-colors text-[9px] tracking-widest">{platform.name}</span>
        </motion.div>
      ))}
    </div>
  </motion.div>

  {/* Right Side: Professional Testimonial Card with Framer Motion */}
  <motion.div 
    className="col-span-1 md:col-span-6 bg-slate-900 text-white rounded-[2.5rem] p-10 md:p-12 relative overflow-hidden shadow-2xl border border-slate-800 group"
    initial={{ opacity: 0, x: 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
  >
    {/* Continuous Rotating Decorative Background Mesh Image */}
    <div className="absolute -right-20 -top-20 w-64 h-64 opacity-10 pointer-events-none mix-blend-screen">
      <motion.img 
        src="/image/unif.jpg" 
        alt="Decorative Tech Circle" 
        className="w-full h-full object-cover rounded-full"
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration: 40, repeat: Infinity }}
      />
    </div>
    
    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
    
    {/* Large Elegant Quote Mark */}
    <span className="text-6xl font-serif text-blue-500/20 absolute top-6 left-8 select-none">“</span>
    
    <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed italic mb-8 relative z-10 pt-4 pl-4">
      "ConWise didn't just change our reporting; it fundamentally shifted how we perceive risk. The executive intelligence layer gives us a clear path through the noise of billion-dollar infrastructure operations."
    </p>
    
    {/* User Profile Info with Image Integration */}
    <div className="flex items-center gap-4 relative z-10 border-t border-slate-800/60 pt-6 pl-4">
      <div className="h-14 w-14 rounded-xl overflow-hidden border-2 border-slate-700 shadow-lg bg-slate-800 flex-shrink-0">
        <img 
          src="/image/field.jpg" /* Suuraa Marcus Melring */
          alt="Marcus Melring" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div>
        <h4 className="text-sm font-black tracking-tight text-white">Marcus Melring</h4>
        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">
          Chief Project Officer, Sigma Infrastructure
        </p>
      </div>
    </div>
  </motion.div>
</section>

      {/* 6. SYSTEM BOTTOM CTA ACCORDION */}
      <section id="audit" className="bg-[#0B132B] text-white py-24 px-6 md:px-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-transparent" />
        <div className="max-w-[800px] mx-auto relative z-10 space-y-6">
          <h2 className="text-3xl md:text-6xl font-black tracking-tight leading-none">Ready for Absolute <br />Certainty?</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-xs mx-auto">Join the sovereign elite synchronizing the next century of global infrastructure assets.</p>
          <motion.button 
            onClick={() => router.push('/register')} 
            className="btn btn-primary px-8 py-4 text-xs shadow-xl"
            variants={buttonHover}
            whileHover="hover"
            whileTap="tap"
          >
            Schedule A Terminal Audit
          </motion.button>
        </div>
      </section>

      {/* 7. REFINED PLATFORM FOOTER */}
      <footer className="bg-[#070C1E] text-slate-500 text-[11px] py-16 px-6 md:px-12 border-t border-white/5">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-12 gap-8 mb-12">
          <div className="col-span-2 md:col-span-6 space-y-4">
            <div className="text-white font-black uppercase tracking-widest flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Layers size={14} /></div> ConWise
            </div>
            <p className="max-w-xs text-slate-600 leading-relaxed font-medium">Advanced construction management architecture for engineering precision.</p>
          </div>
          <FooterColumn title="Product" items={["Features", "Enterprise Solutions", "Security Matrix"]} />
          <FooterColumn title="Resources" items={["System API Documentation", "Operational Security", "Telemetry Portal"]} />
        </div>
        <div className="max-w-[1200px] mx-auto border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-600 font-bold uppercase tracking-wider text-[9px]">
          <p>© 2026 ConWise Technologies Corporation. All Rights Reserved.</p>
          <div className="flex gap-6"><span>Privacy</span><span>SLA Matrix</span></div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB COMPONENTS USED INSIDE CANVAS ---
const StatMetric = ({ value, label, icon }) => (
  <motion.div 
    className="space-y-2 md:border-l md:border-slate-200 md:pl-6 first:border-l-0 first:pl-0 p-4 rounded-2xl transition-all"
    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.7)", boxShadow: "0px 10px 30px rgba(0,0,0,0.02)" }}
  >
    <div className="flex items-center justify-center md:justify-start gap-2 text-blue-600/70">
      {icon}
      <h3 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">{value}</h3>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed max-w-[180px] mx-auto md:mx-0">
      {label}
    </p>
  </motion.div>
);

const FooterColumn = ({ title, items }) => (
  <div className="col-span-1 md:col-span-3 space-y-3">
    <h4 className="text-white font-black uppercase tracking-widest text-[10px]">{title}</h4>
    <ul className="space-y-2 font-bold text-slate-600 uppercase tracking-wider text-[9px]">
      {items.map((item, idx) => (
        <li key={idx} className="hover:text-blue-500 cursor-pointer transition-colors flex items-center gap-1">
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);