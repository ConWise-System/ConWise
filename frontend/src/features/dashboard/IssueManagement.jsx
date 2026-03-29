"use client";
import React, { useState, useMemo } from 'react';
import { Plus, User, Search } from 'lucide-react';

const INITIAL_ISSUES = [
  { id: 'TKT-8842', title: 'Security Breach: Node 7', reporter: 'Marcus Chen', system: 'Server Infrastructure', status: 'OPEN', priority: 'HIGH' },
  { id: 'TKT-8839', title: 'Database Latency Spike', reporter: 'Sarah Jenkins', system: 'Core API', status: 'IN PROGRESS', priority: 'MEDIUM' },
  { id: 'TKT-8831', title: 'UI Glitch: Mobile Sidebar Overlay', reporter: 'David Miller', system: 'Frontend', status: 'RESOLVED', priority: 'LOW' },
  { id: 'TKT-8828', title: 'Payment Gateway Timeout', reporter: 'Elena Rodriguez', system: 'Financial Systems', status: 'OPEN', priority: 'HIGH' },
];

export default function IssueManagement() {
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('Open');

  // Logic: Derived State (Filtering)
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const pMatch = priorityFilter === 'All' || issue.priority === priorityFilter.toUpperCase();
      const sMatch = statusFilter === 'All' || issue.status === statusFilter.toUpperCase() || (statusFilter === 'In Progress' && issue.status === 'IN PROGRESS');
      return pMatch && sMatch;
    });
  }, [issues, priorityFilter, statusFilter]);

  // Handler: Update Status
  const updateStatus = (id, newStatus) => {
    setIssues(prev => prev.map(issue => issue.id === id ? { ...issue, status: newStatus } : issue));
  };

  return (
    <div className="p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      {/* Filter Bar with State Bindings */}
      <section className="bg-white p-2 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm">
        <div className="flex gap-6 px-4">
          <FilterTab label="PRIORITY" options={['All', 'High', 'Medium', 'Low']} active={priorityFilter} onChange={setPriorityFilter} />
          <FilterTab label="STATUS" options={['Open', 'In Progress', 'Resolved']} active={statusFilter} onChange={setStatusFilter} />
        </div>
        <button className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:opacity-90">
          <Plus size={18} /> Report New Issue
        </button>
      </section>

      {/* Reactive Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="grid grid-cols-12 p-6 border-b border-slate-50 items-center hover:bg-slate-50/50 transition-colors">
            <div className="col-span-4">
              <h4 className="font-bold text-slate-900">{issue.title}</h4>
              <p className="text-xs text-slate-400">{issue.id} • {issue.system}</p>
            </div>
            <div className="col-span-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-100" />
              <span className="text-sm font-bold text-slate-700">{issue.reporter}</span>
            </div>
            <div className="col-span-2 text-center">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-black border ${issue.status === 'OPEN' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                {issue.status}
              </span>
            </div>
            <div className="col-span-3 text-right">
              {issue.status !== 'RESOLVED' && (
                <button 
                  onClick={() => updateStatus(issue.id, 'RESOLVED')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-900 px-4 py-2"
                >
                  Close Issue
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterTab({ label, options, active, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[10px] font-black text-slate-300 tracking-widest">{label}</span>
      <div className="flex bg-slate-50 p-1 rounded-lg">
        {options.map(opt => (
          <button 
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${active === opt ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}