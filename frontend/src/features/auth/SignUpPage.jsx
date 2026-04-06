'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  User, Building2, Mail, Lock, ArrowRight, 
  ShieldCheck, Globe, Phone, MapPin, CheckCircle2,
  KeyRound, RefreshCcw, X
} from 'lucide-react';
import Link from 'next/link';

const SignUpPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Register, 2: Verification
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreed: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setIsSubmitting(true);
    
    // Simulate API registration & Email sending
    setTimeout(() => {
        setIsSubmitting(false);
        setStep(2); // Gara Verification Mode tti jijjiri
    }, 2000);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate OTP Validation
    setTimeout(() => {
        setIsSubmitting(false);
        router.push('/login'); // Gara login si geessa
    }, 1500);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const containerVars = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-16 px-4 relative overflow-x-hidden selection:bg-slate-900 selection:text-white">
      
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[120px]" 
        />
      </div>

      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center gap-3 mb-8"
      >
        <motion.div whileHover={{ rotate: 180, scale: 1.1 }} className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 cursor-pointer">
          <Globe size={24} className="text-slate-900" />
        </motion.div>
        <h1 className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">Horizon Executive Terminal</h1>
      </motion.header>

      {/* --- MAIN ANIMATED BOX --- */}
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-[700px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-white p-8 md:p-12 relative shadow-2xl overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* --- STEP 1: FORM KEETI (HIN JIJJIIRAMNE) --- */
            <motion.div key="form" exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}>
                <div className="text-center mb-10 relative z-10">
                    <motion.div variants={itemVars} className="inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full mb-4 shadow-lg shadow-slate-900/20">
                        <ShieldCheck size={12} className="animate-pulse" />
                        <span className="text-[8px] font-bold tracking-widest uppercase">Secured Node Registration</span>
                    </motion.div>
                    <motion.h2 variants={itemVars} className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Create Account</motion.h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <motion.div variants={itemVars} className="space-y-4">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex justify-between items-center">
                            Company Details <span className="h-1 w-12 bg-slate-100 rounded-full"/>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Company Name" icon={<Building2 size={16}/>} placeholder="ABC Construction PLC" value={formData.companyName} onChange={(val) => setFormData({...formData, companyName: val})} />
                            <InputField label="Company Email" icon={<Mail size={16}/>} type="email" placeholder="info@abc.com" value={formData.companyEmail} onChange={(val) => setFormData({...formData, companyEmail: val})} />
                            <InputField label="Company Phone" icon={<Phone size={16}/>} placeholder="+2519..." value={formData.companyPhone} onChange={(val) => setFormData({...formData, companyPhone: val})} />
                            <InputField label="Company Address" icon={<MapPin size={16}/>} placeholder="Addis Ababa" value={formData.companyAddress} onChange={(val) => setFormData({...formData, companyAddress: val})} />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVars} className="space-y-4">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex justify-between items-center">
                            Administrator Details <span className="h-1 w-12 bg-slate-100 rounded-full"/>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="First Name" icon={<User size={16}/>} placeholder="Abel" value={formData.firstName} onChange={(val) => setFormData({...formData, firstName: val})} />
                            <InputField label="Last Name" icon={<User size={16}/>} placeholder="Tesfaye" value={formData.lastName} onChange={(val) => setFormData({...formData, lastName: val})} />
                            <div className="md:col-span-2">
                                <InputField label="Personal/Admin Email" icon={<Mail size={16}/>} type="email" placeholder="admin@abc.com" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} />
                            </div>
                            <InputField label="Password" icon={<Lock size={16}/>} type="password" placeholder="••••••••" value={formData.password} onChange={(val) => setFormData({...formData, password: val})} />
                            <InputField label="Confirm Password" icon={<Lock size={16}/>} type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(val) => setFormData({...formData, confirmPassword: val})} />
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl">
                            <p className="text-red-600 text-[10px] font-black uppercase tracking-tighter">{error}</p>
                        </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div variants={itemVars} className="flex items-start gap-3">
                        <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
                        <label htmlFor="terms" className="text-[11px] text-slate-500 leading-tight">
                            I certify that I am an authorized representative of this company and agree to the <span className="font-bold text-slate-900 underline">Governance Protocols</span>.
                        </label>
                    </motion.div>

                    <motion.button
                        variants={itemVars}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 transition-all group"
                    >
                        {isSubmitting ? "Processing..." : ( <> Establish Organization <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /> </> )}
                    </motion.button>
                </form>
            </motion.div>
          ) : (
            /* --- STEP 2: VERIFICATION PAGE (HAARA) --- */
            <motion.div 
                key="verify" 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="text-center py-10 relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-slate-900 rounded-3xl shadow-xl shadow-slate-200">
                        <KeyRound size={32} className="text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 italic">Verify Your Node</h2>
                <p className="text-slate-400 text-xs font-medium mb-8">
                    Security code sent to <span className="text-slate-900 font-bold underline italic">{formData.companyEmail}</span>
                </p>

                <form onSubmit={handleVerifyOTP} className="space-y-10">
                    <div className="flex justify-center gap-2 md:gap-4">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-10 h-14 md:w-14 md:h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-xl font-black text-slate-900 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 outline-none transition-all"
                                value={data}
                                onChange={e => handleOtpChange(e.target, index)}
                                onFocus={e => e.target.select()}
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
                        >
                            {isSubmitting ? "Authenticating..." : <> Finalize Registration <CheckCircle2 size={16} /> </>}
                        </motion.button>

                        <div className="flex flex-col items-center gap-3">
                            <button type="button" className="text-[10px] font-black text-slate-400 hover:text-slate-900 flex items-center gap-2 uppercase tracking-widest transition-all">
                                <RefreshCcw size={12} /> Resend Access Code
                            </button>
                            <button 
                                onClick={() => setStep(1)}
                                className="text-[10px] font-bold text-slate-300 hover:text-red-500 uppercase tracking-tighter"
                            >
                                Edit registration details
                            </button>
                        </div>
                    </div>
                </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-10 text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase"
      >
        © 2026 CONWISE GLOBAL // SECURED NODE
      </motion.footer>
    </div>
  );
};

const InputField = ({ label, icon, placeholder, type = "text", value, onChange }) => (
  <motion.div whileHover={{ x: 3 }} className="flex flex-col gap-1.5 transition-all">
    <label className="text-[9px] font-black tracking-widest text-slate-900 uppercase ml-1 flex items-center gap-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors z-10">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-300 relative z-0"
        required
      />
    </div>
  </motion.div>
);

export default SignUpPage;