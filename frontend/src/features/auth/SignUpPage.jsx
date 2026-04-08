'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  User, Building2, Mail, Lock, ArrowRight, 
  ShieldCheck, Globe, Phone, MapPin, CheckCircle2,
  KeyRound, RefreshCcw 
} from 'lucide-react';
import Axios from '../../../utils/Axios'; 
import summeryApi from '../../common/summeryApi';

const SignUpPage = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); 
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

  // --- API INTEGRATION: REGISTER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await Axios({
        ...summeryApi.register,
        data: formData
      });
      
      if (response.data.success) {
        // We keep the email in formData state to use in the next step
        setStep(2); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- API INTEGRATION: VERIFY OTP ---
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const verificationCode = otp.join('');

    try {
      const response = await Axios({
        ...summeryApi.verifyAccount,
        data: {
          // email: formData.email, // Passing email silently to identify the user
          code: verificationCode
        }
      });
      
      if (response.data.success) {
        router.push('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Auto-focus logic
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center py-16 px-4 relative overflow-x-hidden">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div animate={{ x: [0, 30, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[120px]" />
      </div>

      <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="z-10 flex flex-col items-center gap-3 mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
          <Globe size={24} className="text-slate-900" />
        </div>
        <h1 className="text-[10px] font-black tracking-[0.5em] text-slate-400 uppercase">ConWise Executive Terminal</h1>
      </motion.header>

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
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex justify-between items-center">Company Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Company Name" icon={<Building2 size={16}/>} placeholder="ABC Construction" value={formData.companyName} onChange={(val) => setFormData({...formData, companyName: val})} />
                            <InputField label="Company Email" icon={<Mail size={16}/>} type="email" placeholder="corp@company.com" value={formData.companyEmail} onChange={(val) => setFormData({...formData, companyEmail: val})} />
                            <InputField label="Company Phone" icon={<Phone size={16}/>} placeholder="+251..." value={formData.companyPhone} onChange={(val) => setFormData({...formData, companyPhone: val})} />
                            <InputField label="Address" icon={<MapPin size={16}/>} placeholder="Addis Ababa" value={formData.companyAddress} onChange={(val) => setFormData({...formData, companyAddress: val})} />
                        </div>
                    </motion.div>

                    <motion.div variants={itemVars} className="space-y-4">
                        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest border-b pb-2 flex justify-between items-center">Administrator Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="First Name" icon={<User size={16}/>} placeholder="John" value={formData.firstName} onChange={(val) => setFormData({...formData, firstName: val})} />
                            <InputField label="Last Name" icon={<User size={16}/>} placeholder="Doe" value={formData.lastName} onChange={(val) => setFormData({...formData, lastName: val})} />
                            <div className="md:col-span-2">
                                <InputField label="Admin Email" icon={<Mail size={16}/>} type="email" placeholder="admin@email.com" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} />
                            </div>
                            <InputField label="Password" icon={<Lock size={16}/>} type="password" placeholder="••••••••" value={formData.password} onChange={(val) => setFormData({...formData, password: val})} />
                            <InputField label="Confirm Password" icon={<Lock size={16}/>} type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(val) => setFormData({...formData, confirmPassword: val})} />
                        </div>
                    </motion.div>

                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl">
                          <p className="text-red-600 text-[10px] font-black uppercase tracking-tighter">{error}</p>
                      </motion.div>
                    )}

                    <motion.button
                        variants={itemVars}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        disabled={isSubmitting}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? "Processing Node..." : ( <> Establish Organization <ArrowRight size={16} /> </> )}
                    </motion.button>
                </form>
            </motion.div>
          ) : (
            <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-10 relative z-10">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-slate-900 rounded-3xl shadow-xl">
                        <KeyRound size={32} className="text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2 italic">Verify Your Node</h2>
                <p className="text-slate-400 text-xs font-medium mb-8">
                    Security code sent to <span className="text-slate-900 font-bold underline italic">{formData.email}</span>
                </p>

                <form onSubmit={handleVerifyOTP} className="space-y-10">
                    <div className="flex justify-center gap-2">
                        {otp.map((data, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                className="w-10 h-14 md:w-14 md:h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-xl font-black text-slate-900 focus:border-slate-900 outline-none transition-all"
                                value={data}
                                onChange={e => handleOtpChange(e.target, index)}
                                onFocus={e => e.target.select()}
                                required
                            />
                        ))}
                    </div>

                    <div className="space-y-4">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            disabled={isSubmitting}
                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl disabled:opacity-50"
                        >
                            {isSubmitting ? "Authenticating..." : "Finalize Registration"}
                        </motion.button>

                        <button 
                            type="button"
                            onClick={() => setStep(1)}
                            className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest"
                        >
                            Edit registration details
                        </button>
                    </div>
                </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <footer className="mt-10 text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase">
        © 2026 CONWISE GLOBAL // SECURED NODE
      </footer>
    </div>
  );
};

const InputField = ({ label, icon, placeholder, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[9px] font-black tracking-widest text-slate-900 uppercase ml-1">
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
        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-slate-900 transition-all"
        required
      />
    </div>
  </div>
);

export default SignUpPage;