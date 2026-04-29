import React from 'react';
import { MoreHorizontal, Clock } from 'lucide-react';

const TaskCard = ({ title, time, isPriority = false }) => {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg border-l-4 border-gray-900 shadow-sm mb-3">
      <div className="flex flex-col">
        <h4 className="text-sm font-bold text-gray-800">{title}</h4>
        <div className="flex items-center text-xs text-gray-400 mt-1">
          <Clock size={12} className="mr-1" />
          <span>{time}</span>
        </div>
      </div>
      <button className="text-gray-300 hover:text-gray-600">
        <MoreHorizontal size={18} />
      </button>
    </div>
  );
};

export default TaskCard;