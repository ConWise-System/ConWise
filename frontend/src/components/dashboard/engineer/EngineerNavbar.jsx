"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Calendar, HelpCircle, Sun } from 'lucide-react';

const EngineerNavbar = () => {"use client";

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex justify-between items-center mb-10 sticky top-0 z-40 bg-[#F8F9FB]/80 backdrop-blur-md py-4"
    >
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-[400px]">
          <Search className="text-slate-400 mr-2" size={18} />
          <input 
            type="text" 
            placeholder="Search projects, files, or teams..." 
            className="bg-transparent border-none outline-none text-sm w-full font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-400 bg-slate-50 border rounded-lg">
            <Command size={10} /> K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
        </motion.button>
        
        <div className="h-10 w-[1px] bg-slate-200 mx-2"></div>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-800 leading-none">Alexander</p>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter mt-1">Project Manager</p>
          </div>
          <motion.div 
            whileHover={{ ring: 4 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 cursor-pointer shadow-lg"
          >
            <div className="w-full h-full rounded-[10px] bg-white overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alexander" alt="avatar" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default EngineerNavbar;