"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import Axios from "../../../utils/Axios";
import summeryApi from "../../common/summeryApi";
import { useUser } from "../../context/UserContext";

export default function LoginForm() {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
  };

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await Axios({
        ...summeryApi.login,
        data: data,
      });

      if (response.data.success) {
        const resData = response.data.data;
        const userData = resData.user;
        const accessToken = resData.accessToken;
        const refreshToken = resData.refreshToken;

        if (!userData?.role) {
          throw new Error("User role is missing from account data.");
        }

        const userRole = userData.role.toLowerCase();

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
        document.cookie = `role=${userRole}; path=/; max-age=86400; SameSite=Lax`;

        setUser(userData);

        if (userRole === "company_admin") {
          router.push("/admin/dashboardHome");
        } else if (userRole.includes("project") && userRole.includes("manager")) {
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
      setError(err.response?.data?.message || err.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVars = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.05 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="h-screen w-screen bg-[#f8fafc] flex flex-col items-center justify-between py-6 px-4 font-sans selection:bg-slate-900 selection:text-white overflow-hidden select-none">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-slate-100/50 rounded-full blur-[90px]" />
      </div>

      {/* Brand Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center gap-1.5 mt-2"
      >
        <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">
          <Globe size={22} className="text-slate-900" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-900">ConWise</h1>
      </motion.header>

      {/* Main Login Card */}
      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="z-10 w-full max-w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-100 p-8 relative flex flex-col justify-center my-auto max-h-[85vh]"
      >
        <div className="text-center mb-6">
          <motion.h2 variants={itemVars} className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
            Sign In
          </motion.h2>
          <motion.p variants={itemVars} className="text-slate-500 text-xs font-medium">
            Access your project management workspace
          </motion.p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div variants={itemVars}>
            <InputField
              label="Email Address"
              icon={<Mail size={16} />}
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="name@conwise.com"
            />
          </motion.div>

          <motion.div variants={itemVars}>
            <div className="flex justify-between mb-1.5 px-0.5">
              <label className="text-[11px] font-semibold text-slate-700 tracking-wide uppercase">
                Password
              </label>
              <button
                type="button"
                className="btn-link"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-all">
                <Lock size={16} />
              </div>
              <input
                type="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all outline-none"
                required
              />
            </div>
          </motion.div>

          {error && (
            <p className="text-red-500 text-xs font-medium text-center bg-red-50/50 py-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <motion.button
            variants={itemVars}
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            disabled={isSubmitting}
            className="btn btn-primary w-full py-3.5 gap-2 shadow-sm transition-all group overflow-hidden disabled:opacity-50"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span className="text-xs font-semibold tracking-wide">Signing in...</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-xs font-semibold tracking-wide">Sign In</span>
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </form>

        <motion.div variants={itemVars} className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[10px] font-medium text-slate-400">
            <span className="bg-white px-3">or</span>
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-muted w-full py-3 gap-2.5 text-xs font-semibold disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <Link href="/register" className="block">
            <button className="btn btn-muted w-full py-3 text-xs font-semibold">
              Create an account
            </button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Minimal Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="z-10 text-[10px] font-medium text-slate-400 mb-2"
      >
        © {new Date().getFullYear()} ConWise. All rights reserved.
      </motion.footer>
    </div>
  );
}

const InputField = ({ label, icon, placeholder, type = "text", name, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] font-semibold text-slate-700 tracking-wide uppercase ml-0.5">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-all">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 focus:bg-white transition-all outline-none"
        required
      />
    </div>
  </div>
);