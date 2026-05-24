'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Building2, Mail, Lock, ArrowRight, 
  ShieldCheck, Globe, Phone, MapPin, KeyRound 
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
    
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  return (
    <div className="w-full h-screen max-h-screen bg-[#F8FAFC] flex flex-col items-center justify-between p-4 md:p-5 text-slate-900 font-sans antialiased overflow-hidden select-none">
      
      {/* Top Professional Header */}
      <header className="w-full max-w-[1100px] flex items-center justify-between border-b border-slate-200 pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <Globe size={16} className="text-slate-700" />
          <span className="text-xs font-bold tracking-wider uppercase text-slate-800">ConWise Platform</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Corporate Portal</span>
      </header>

      {/* Main Container Card Area - Strictly constrained to stop scrolling */}
      <main className="w-full max-w-[1100px] max-h-[calc(100vh-110px)] bg-white border border-slate-200 rounded-xl shadow-2xs flex flex-col md:flex-row my-auto overflow-hidden shrink-0">
        
        {/* Left Side: Premium Construction Visual Panel */}
        <div 
          className="hidden md:flex w-5/12 p-8 flex-col justify-between relative text-white bg-cover bg-center border-r border-slate-200 shrink-0"
          style={{ 
            backgroundImage: `linear-gradient(to right, rgba(7, 12, 30, 0.6) 5%, rgba(15, 23, 42, 0.5)), url('/image/home.jpg')` 
          }}
        >
          <div className="space-y-4">
            <span className="px-2.5 py-0.5 bg-white/10 border border-white/20 text-slate-200 text-[9px] font-bold rounded uppercase tracking-wider inline-block backdrop-blur-xs">
              Onboarding
            </span>
            <h2 className="text-2xl font-bold tracking-tight uppercase leading-snug">
              Register Your Construction Company
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              Manage your architectural workflows, coordinate physical site operations, generate daily safety or progress reports, and communicate directly with your staff engineers in real-time.
            </p>
          </div>
          
          <div className="flex items-center gap-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Secure Enterprise Data Architecture</span>
          </div>
        </div>

        {/* Right Side: Execution Forms Section */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-white min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="register-form-step" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-lg flex text-center justify-center font-bold uppercase text-slate-900 tracking-tight">Create Account</h3>
                  <p className="text-[11px] text-slate-500 flex text-center justify-center  mt-0.5 font-medium">Provide registration attributes below to initialize your company.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Grid Section: Corporate Parameters */}
                  <div className="space-y-2">
                    {/* <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-0.5">
                      Company Profile Settings
                    </span> */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <InputField label="Company Name" icon={<Building2 size={13}/>} placeholder="Example Construction Ltd." value={formData.companyName} onChange={(val) => setFormData({...formData, companyName: val})} />
                      <InputField label="Company Corporate Email" icon={<Mail size={13}/>} type="email" placeholder="corporate@company.com" value={formData.companyEmail} onChange={(val) => setFormData({...formData, companyEmail: val})} />
                      <InputField label="Company Contact Line" icon={<Phone size={13}/>} placeholder="+251..." value={formData.companyPhone} onChange={(val) => setFormData({...formData, companyPhone: val})} />
                      <InputField label="HQ Physical Address" icon={<MapPin size={13}/>} placeholder="Addis Ababa, Ethiopia" value={formData.companyAddress} onChange={(val) => setFormData({...formData, companyAddress: val})} />
                    </div>
                  </div>

                  {/* Grid Section: Admin Parameters */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block border-b border-slate-100 pb-0.5">
                      Primary Administrator Credentials
                    </span>
                    <div className="grid grid-cols-2 gap-2.5">
                      <InputField label="First Name" icon={<User size={13}/>} placeholder="John" value={formData.firstName} onChange={(val) => setFormData({...formData, firstName: val})} />
                      <InputField label="Last Name" icon={<User size={13}/>} placeholder="Doe" value={formData.lastName} onChange={(val) => setFormData({...formData, lastName: val})} />
                      <div className="col-span-2">
                        <InputField label="Account Access Email" icon={<Mail size={13}/>} type="email" placeholder="admin@domain.com" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} />
                      </div>
                      <InputField label="Security Password" icon={<Lock size={13}/>} type="password" placeholder="••••••••" value={formData.password} onChange={(val) => setFormData({...formData, password: val})} />
                      <InputField label="Verify Password" icon={<Lock size={13}/>} type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(val) => setFormData({...formData, confirmPassword: val})} />
                    </div>
                  </div>

                  {/* Operational Status Messages */}
                  {error && (
                    <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg">
                      <p className="text-rose-900 text-[10px] font-bold uppercase tracking-tight">{error}</p>
                    </div>
                  )}

                  {/* Redirection Link & Action Button Block */}
                  <div className="space-y-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      {isSubmitting ? "Compiling System Node..." : ( <> Register Company <ArrowRight size={13} /> </> )}
                    </button>

                    <div className="text-center">
                      <p className="text-xs text-slate-500 font-medium">
                        Already have an operational account?{' '}
                        <button
                          type="button"
                          onClick={() => router.push('/login')}
                          className="text-slate-900 font-bold hover:underline bg-transparent border-none outline-none inline p-0 cursor-pointer"
                        >
                          Sign In Here
                        </button>
                      </p>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="otp-verification-step" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="text-center max-w-sm mx-auto space-y-5 py-4"
              >
                <div className="space-y-1.5">
                  <div className="w-10 h-10 bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center rounded-lg mx-auto mb-1">
                    <KeyRound size={16} />
                  </div>
                  <h3 className="text-sm font-bold uppercase text-slate-900 tracking-tight">Security Code Verification</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    A confirmation string vector has been distributed to <span className="text-slate-900 font-bold font-mono">{formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="flex justify-center gap-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-10 h-12 bg-slate-50 border border-slate-200 rounded-lg text-center text-sm font-bold font-mono text-slate-900 focus:border-slate-400 focus:bg-white outline-none transition-all shadow-2xs"
                        value={data}
                        onChange={e => handleOtpChange(e.target, index)}
                        onFocus={e => e.target.select()}
                        required
                      />
                    ))}
                  </div>

                  <div className="space-y-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                      {isSubmitting ? "Verifying..." : "Finalize Infrastructure Boot"}
                    </button>

                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors bg-transparent border-none outline-none block mx-auto py-1"
                    >
                      Return to configuration parameters
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Low-Contrast Dashboard Footer */}
      <footer className="w-full text-center text-[10px] font-medium text-slate-400 tracking-wide shrink-0 border-t border-slate-200 pt-2.5">
        System Core Metrics Directory // Authorized Corporate Accounts Only
      </footer>
    </div>
  );
};

// Isolated Clean Input Utility Subcomponent with custom py-3 parameters
const InputField = ({ label, icon, placeholder, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-0.5 text-left">
    <label className="text-[10px] font-bold tracking-tight text-slate-500 uppercase pl-0.5">
      {label}
    </label>
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50/60 border border-slate-200/80 rounded-lg py-3 pl-8 pr-3 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white transition-all shadow-2xs"
        required
      />
    </div>
  </div>
);

export default SignUpPage;