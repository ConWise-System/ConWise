"use client";
import React from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

const TaskTable = ({ tasks }) => {
  return (
    <div className="w-full overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Task Details</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Team</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
            <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deadline</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {tasks.map((task, index) => (
            <motion.tr 
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="hover:bg-slate-50/80 transition-colors group"
            >
              <td className="p-6">
                <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{task.title}</p>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{task.project}</p>
              </td>
              <td className="p-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-lg border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/150?u=${task.id + i}`} alt="team" />
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-lg border-2 border-white bg-[#111827] text-white text-[10px] flex items-center justify-center font-bold">
                    +2
                  </div>
                </div>
              </td>
              <td className="p-6">
                <StatusBadge status={task.status} />
              </td>
              <td className="p-6">
                <p className="text-xs font-bold text-slate-700">{task.deadline}</p>
                <p className="text-[9px] font-black text-red-500 uppercase mt-0.5 tracking-tighter">{task.remaining}</p>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;