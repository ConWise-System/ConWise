"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"
import {
  Mail,
  Lock,
  ArrowRight,
  Globe,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import Axios from "../../../utils/Axios";
import summeryApi from "../../common/summeryApi";
import { useUser } from "../../context/UserContext";

export default function LoginForm() {

  // Redirect to backend Google OAuth endpoint
  const handleGoogleLogin = () => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
};
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { fetchUserDetails } = useUser();
  const { user, setUser } = useUser();

  // 1. Logic: Form State
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. Logic: API Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await Axios({
        ...summeryApi.login,
        data: data, // Ensure 'data' contains your email/password state
      });

      if (response.data.success) {
        // Based on your console log: response.data.data.user exists
        const resData = response.data.data;
        const userData = resData.user;
        const accessToken = resData.accessToken;
        const refreshToken = resData.refreshToken;

        // 1. Validate role exists before proceeding
        if (!userData?.role) {
          throw new Error("User role is missing from account data.");
        }

        const userRole = userData.role.toLowerCase();

        // 2. Storage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // 3. Set Cookies (Critical for the Middleware to work)
        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${userRole}; path=/; max-age=86400; SameSite=Lax`;

        // 4. Update Global State
        setUser(userData);

        // 5. Role-Based Routing
        // Note: Use .includes() if the role might have spaces or underscores
        if (userRole === "company_admin") {
          router.push("/admin/dashboardHome");
        } else if (
          userRole.includes("project") &&
          userRole.includes("manager")
        ) {
          router.push("/projectManager/Home");
        } else if (userRole === "supervisor") {
          router.push("/supervisor/Home");
        } else if (userRole === "site_engineer") {
          router.push("/siteEngineer/dashboardHome");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      console.error("Login Client Error:", err);

      // If the error was thrown by our 'throw new Error', it shows here.
      // Otherwise, it shows the backend error message.
      setError(err.response?.data?.message || err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animations
  const containerVars = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-between py-12 px-4 font-sans selection:bg-[#0a1120] selection:text-white overflow-hidden">
      {/* Ambient Background */}
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
          <motion.div
            variants={itemVars}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full mb-6"
          >
            <ShieldCheck size={12} />
            <span className="text-[9px] font-bold tracking-widest uppercase">
              Secured Access
            </span>
          </motion.div>
          <motion.h2
            variants={itemVars}
            className="text-4xl font-black text-[#0a1120] tracking-tighter mb-2"
          >
            Welcome Back
          </motion.h2>
          <motion.p
            variants={itemVars}
            className="text-slate-500 text-sm font-medium"
          >
            Authorized personnel only. Initialize session.
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={itemVars}>
            <InputField
              label="Executive Email"
              icon={<Mail size={18} />}
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="name@conwise.com"
            />
          </motion.div>

          <motion.div variants={itemVars}>
            <div className="flex justify-between mb-2 px-1">
              <label className="text-[10px] font-black tracking-widest text-[#0a1120] uppercase">
                Password
              </label>
              <button
                type="button"
                className="text-[10px] font-bold text-slate-400 hover:text-black uppercase transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-all">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4.5 pl-14 pr-6 text-sm text-black font-medium focus:ring-4 focus:ring-slate-900/5 focus:border-black focus:bg-white transition-all outline-none"
                required
              />
            </div>
          </motion.div>

          {error && (
            <p className="text-red-500 text-[10px] font-bold uppercase text-center">
              {error}
            </p>
          )}

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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    Authorizing
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em]">
                    Enter Terminal
                  </span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        {/* --- HERE IS THE PART YOU WERE MISSING --- */}
        <motion.div variants={itemVars} className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">
            <span className="bg-white/80 backdrop-blur-md px-4">
              New Personnel
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="mt-4">

          {/* // google login button */}
      <motion.button
        type="button"
        onClick={handleGoogleLogin}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white border border-slate-200 text-[#0a1120] py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group shadow-sm hover:shadow-md"
      >
        {/* Google SVG icon */}
        <svg width="18" height="18" viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          <path fill="none" d="M0 0h48v48H0z"/>
        </svg>
        <span className="text-xs font-black uppercase tracking-[0.2em]">
          Continue with Google
        </span>
      </motion.button>
      </motion.div>

        <motion.div variants={itemVars}>
          <Link href="/register" className="block">
            <motion.button
              whileHover={{ y: -2, backgroundColor: "#f1f5f9" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-slate-50 border border-slate-200 text-[#0a1120] py-4.5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 group"
            >
              <UserPlus
                size={18}
                className="text-slate-400 group-hover:text-[#0a1120] transition-colors"
              />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Create Executive Account
              </span>
              <ArrowRight
                size={16}
                className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
              />
            </motion.button>
          </Link>
        </motion.div>
        {/* --- END OF RESTORED SECTION --- */}

        <motion.div
          variants={itemVars}
          className="mt-10 pt-8 border-t border-slate-50 text-center"
        >
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            System Security Protocol v4.0.2
          </p>
        </motion.div>
      </motion.div>

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

const InputField = ({
  label,
  icon,
  placeholder,
  type = "text",
  name,
  value,
  onChange,
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black tracking-widest text-[#0a1120] uppercase ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-all">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-4.5 pl-14 pr-6 text-sm text-black font-medium focus:ring-4 focus:ring-slate-900/5 focus:border-black focus:bg-white transition-all outline-none"
        required
      />
    </div>
  </div>
);
