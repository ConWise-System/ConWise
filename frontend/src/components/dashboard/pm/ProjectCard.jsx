"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Calendar, Target } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ProjectCard = ({ project }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 relative overflow-hidden group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 transition-colors">
          <span className="text-2xl">{project.logo || '🏗️'}</span>
        </div>
        <button className="text-slate-400 hover:text-slate-900 transition-colors p-1">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className="text-lg font-black text-slate-800 tracking-tight">{project.name}</h3>
        <p className="text-xs text-slate-400 font-medium">{project.location}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <StatusBadge status={project.status} />
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-500 border border-slate-100">
          <Calendar size={12} /> {project.deadline}
        </div>
      </div>

      <div className="pt-6 border-t border-slate-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Completion</span>
          <span className="text-xs font-black text-blue-600">{project.progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-[#111827] rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;