'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowRight, Globe, ShieldCheck, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/dashboard');
    }, 1800);
  };

  // Professional Animation Variants
  const containerVars = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: { 
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-between py-12 px-4 font-sans selection:bg-[#0a1120] selection:text-white overflow-hidden">
      
      {/* Advanced Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-blue-100/60 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-slate-200/60 rounded-full blur-[100px]" 
        />
      </div>

      {/* Brand Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center gap-2"
      >
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 ring-4 ring-slate-50/50">
          <Globe size={26} className="text-[#0a1120]" />
        </div>
        <h1 className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase mt-2">
          Horizon Executive Terminal
        </h1>
      </motion.header>

      {/* Main Login Card */}
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-[480px] bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1)] border border-white p-10 md:p-14 relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-[#0a1120] rounded-t-[2.5rem]" />

        <div className="text-center mb-10">
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full mb-6">
            <ShieldCheck size={12} />
            <span className="text-[9px] font-bold tracking-widest uppercase">Secured Access</span>
          </motion.div>
          <motion.h2 variants={itemVars} className="text-4xl font-black text-[#0a1120] tracking-tighter mb-2">
            Welcome Back
          </motion.h2>
          <motion.p variants={itemVars} className="text-slate-500 text-sm font-medium">
            Authorized personnel only. Initialize session.
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={itemVars}>
            <InputField 
              label="Executive Email" 
              icon={<Mail size={18} />} 
              type="email" 
              placeholder="name@conwise.com" 
            />
          </motion.div>

          <motion.div variants={itemVars}>
            <div className="flex justify-between mb-2 px-1">
              <label className="text-[10px] font-black tracking-widest text-[#0a1120] uppercase">Password</label>
              <button type="button" className="text-[10px] font-bold text-slate-400 hover:text-black uppercase transition-colors">Forgot?</button>
            </div>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-all">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4.5 pl-14 pr-6 text-sm text-black font-medium focus:ring-4 focus:ring-slate-900/5 focus:border-black focus:bg-white transition-all outline-none" 
                required 
              />
            </div>
          </motion.div>

          <motion.button
            variants={itemVars}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className="w-full bg-[#0a1120] text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-200 transition-all group overflow-hidden relative"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div 
                  key="loading" 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Authorizing</span>
                </motion.div>
              ) : (
                <motion.div 
                  key="default" 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em]">Enter Terminal</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        {/* Divider */}
        <motion.div variants={itemVars} className="relative my-10">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
          <div className="relative flex justify-center text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
            <span className="bg-white/80 backdrop-blur-md px-4">New Personnel</span>
          </div>
        </motion.div>

        {/* New Advanced Sign Up Button */}
        <motion.div variants={itemVars}>
          <Link href="/register" className="block">
            <motion.button
              whileHover={{ y: -2, backgroundColor: "#f1f5f9" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-50 border border-slate-200 text-[#0a1120] py-4.5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group"
            >
              <UserPlus size={18} className="text-slate-400 group-hover:text-[#0a1120] transition-colors" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Create Executive Account</span>
              <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div variants={itemVars} className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            System Security Protocol v4.0.2
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="z-10 text-[9px] font-black text-slate-400 tracking-[0.4em] uppercase"
      >
        © 2026 CONWISE GLOBAL // ARCHITECTURE NODE
      </motion.footer>
    </div>
  );
}

const InputField = ({ label, icon, placeholder, type = "text" }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black tracking-widest text-[#0a1120] uppercase ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-all">
        {icon}
      </div>
      <input 
        type={type} 
        placeholder={placeholder} 
        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4.5 pl-14 pr-6 text-sm text-black font-medium focus:ring-4 focus:ring-slate-900/5 focus:border-black focus:bg-white transition-all outline-none" 
        required 
      />
    </div>
  </div>
);