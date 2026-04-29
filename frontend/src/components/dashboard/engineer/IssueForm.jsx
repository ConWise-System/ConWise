import React from 'react';

const IssueForm = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Report New Issue</h3>
      <form className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Issue Title</label>
          <input type="text" className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-500" placeholder="e.g. Water Leakage" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
          <select className="w-full p-2 border border-gray-200 rounded-md text-sm">
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
          </select>
        </div>
        <button className="w-full bg-red-600 text-white py-2 rounded-md text-sm font-bold hover:bg-red-700 transition-colors">
          Submit Issue
        </button>
      </form>
    </div>
  );
};

export default IssueForm;