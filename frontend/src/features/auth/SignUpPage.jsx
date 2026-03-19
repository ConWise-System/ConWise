'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, Building2, Mail, Lock, ArrowRight, ShieldCheck, Globe, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const SignUpPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    organization: '',
    email: '',
    password: '',
    agreed: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- MAGNETIC TILT LOGIC ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Asitti API call kee dabalatta
    setTimeout(() => {
        setIsSubmitting(false);
        // Fake success: 
        // router.push('/dashboard');
    }, 2000);
  };

  const containerVars = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden selection:bg-slate-900 selection:text-white">
      
      {/* Background Motion Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-slate-200/50 rounded-full blur-[100px]" />
      </div>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center gap-3 mb-8"
      >
        <motion.div whileHover={{ rotate: 180 }} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 ring-4 ring-slate-50/50">
          <Globe size={24} className="text-slate-900" />
        </motion.div>
        <h1 className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">
          Horizon Executive Terminal
        </h1>
      </motion.header>

      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-[500px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-12 relative"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-900 rounded-t-[2.5rem]" />

        <div className="text-center mb-10">
          <motion.div variants={itemVars} className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full mb-4">
            <ShieldCheck size={12} />
            <span className="text-[8px] font-bold tracking-widest uppercase">Secured Registration</span>
          </motion.div>
          <motion.h2 variants={itemVars} className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
            Sign Up
          </motion.h2>
          <motion.p variants={itemVars} className="text-slate-500 text-sm font-medium">
            Initialize your executive workspace.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={itemVars}>
            <InputField
              label="Full Name"
              icon={<User size={18} />}
              placeholder="Alexander Sterling"
              value={formData.fullName}
              onChange={(val) => setFormData({ ...formData, fullName: val })}
            />
          </motion.div>
          <motion.div variants={itemVars}>
            <InputField
              label="Organization"
              icon={<Building2 size={18} />}
              placeholder="Global Ops"
              value={formData.organization}
              onChange={(val) => setFormData({ ...formData, organization: val })}
            />
          </motion.div>
          <motion.div variants={itemVars}>
            <InputField
              label="Email"
              icon={<Mail size={18} />}
              type="email"
              placeholder="name@conwise.com"
              value={formData.email}
              onChange={(val) => setFormData({ ...formData, email: val })}
            />
          </motion.div>
          <motion.div variants={itemVars}>
            <InputField
              label="Password"
              icon={<Lock size={18} />}
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(val) => setFormData({ ...formData, password: val })}
            />
          </motion.div>

          <motion.div variants={itemVars} className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
            />
            <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight">
              I agree to the <span className="font-bold text-slate-900">Governance Protocols</span>.
            </label>
          </motion.div>

          <motion.button
            variants={itemVars}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 transition-all"
          >
            {isSubmitting ? "Authorizing..." : <>Establish Account <ArrowRight size={16} /></>}
          </motion.button>
        </form>

        <motion.div variants={itemVars} className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs">
            Already a member?{' '}
            <Link href="/login" className="text-slate-900 font-black uppercase tracking-tighter hover:underline">
              Sign In
            </Link>
          </p>
        </motion.div>
      </motion.div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10 text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase"
      >
        © 2026 CONWISE GLOBAL // SECURED NODE
      </motion.footer>
    </div>
  );
};

const InputField = ({ label, icon, placeholder, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black tracking-widest text-slate-900 uppercase ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
        required
      />
    </div>
  </div>
);

export default SignUpPage;