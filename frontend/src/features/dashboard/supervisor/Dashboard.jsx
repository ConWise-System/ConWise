"use client";
import React from 'react';
import { 
  Users, Sun, AlertTriangle, CheckCircle, 
  Map as MapIcon, Plus, FileText, MoreVertical,
  ChevronRight, ZoomIn, ZoomOut, Layers
} from 'lucide-react';

export default function SupervisorDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 font-sans text-slate-900">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Overview</h1>
          <p className="text-slate-500 font-medium">Precision Terminal 04 • Sector 7G Development</p>
        </div>
       
      </header>

      {/* TOP ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Active Personnel" value="142" total="150" trend="+12% vs Yesterday" icon={<Users size={20}/>} />
        <StatCard label="Weather Status" value="24°C" subtext="Clear Skies" detail="Optimal Working Conditions" icon={<Sun size={20}/>} />
        <StatCard label="Hazard Alerts" value="02" subtext="High Risk" detail="Immediate Action Required" icon={<AlertTriangle size={20} className="text-red-500"/>} highlight />
        <StatCard label="Task Completion" value="68%" progress={68} detail="On Schedule" icon={<CheckCircle size={20}/>} />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT COLUMN: MAP & RESOURCE SNAPSHOT */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* INTERACTIVE MAP PLACEHOLDER */}
          <div className="relative bg-slate-200 rounded-3xl overflow-hidden h-[500px] shadow-inner border border-slate-200">
            {/* Map Overlay UI */}
            <div className="absolute top-6 left-6 flex gap-2">
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm flex items-center gap-2 border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-tight">Sector 7G Active</span>
              </div>
              <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Updated 2m ago</span>
              </div>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <MapControl icon={<Plus size={20}/>} />
              <MapControl icon={<ZoomOut size={20}/>} />
              <MapControl icon={<Layers size={20}/>} />
            </div>

            {/* Simulated Satellite Background */}
            <div className="w-full h-full bg-[#1e293b] flex items-center justify-center">
               <MapIcon size={48} className="text-slate-700 opacity-20" />
            </div>
          </div>

          {/* PRIORITY TASKS TABLE */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Priority Tasks</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500 uppercase">On Hold (2)</span>
                <span className="px-3 py-1 bg-blue-50 rounded-lg text-[10px] font-bold text-blue-600 uppercase">In Progress (14)</span>
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-[10px] font-black uppercase tracking-[0.1em] text-slate-400 border-b border-slate-100">
                  <th className="pb-4">Task ID & Description</th>
                  <th className="pb-4">Assigned Team</th>
                  <th className="pb-4">Priority</th>
                  <th className="pb-4">Deadline</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <TaskRow id="#TK-4091" title="Foundation Waterproofing" subtitle="Sector 7G • Grid A-M" priority="Critical" deadline="Today, 5:00 PM" />
                <TaskRow id="#TK-4102" title="HVAC System Mockup" subtitle="Block C • Level 2" priority="Medium" deadline="Tomorrow" />
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: RESOURCE & LOGS */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Resource Snapshot</h3>
              <MoreVertical size={18} className="text-slate-400 cursor-pointer" />
            </div>
            <div className="space-y-6">
              <ResourceItem label="Concrete Supply" value={82} />
              <ResourceItem label="Generator Fuel" value={24} warning />
              <ResourceItem label="Steel Girders" value={45} />
              <button className="w-full py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                Manage Inventory
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Daily Log</h3>
              <button className="text-[10px] font-black uppercase text-blue-600 tracking-widest">View All</button>
            </div>
            <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              <LogEntry time="09:15 AM" type="Shift Start" title="Shift handover complete." desc="Night crew reports all sector 4 foundation pads poured." />
              <LogEntry time="11:30 AM" type="Safety Alert" title="External inspection failed." desc="Safety harness anchors in Block C require re-certification." alert />
              <LogEntry time="01:45 PM" type="Logistics" title="Steel delivery delayed." desc="Truck ID #882 stuck in traffic. ETA revised to 3:00 PM." />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SUB-COMPONENTS
function StatCard({ label, value, total, trend, subtext, detail, icon, progress, highlight }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        <div className="p-2 bg-slate-50 rounded-xl text-slate-400">{icon}</div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className={`text-4xl font-bold ${highlight ? 'text-red-500' : ''}`}>{value}</span>
        {total && <span className="text-slate-400 font-bold">/ {total}</span>}
        {subtext && <span className="ml-2 text-sm font-bold text-slate-900">{subtext}</span>}
      </div>
      {trend && <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">↗ {trend}</p>}
      {detail && <p className={`text-[10px] font-bold uppercase tracking-tight ${highlight ? 'text-red-500' : 'text-slate-400'}`}>{detail}</p>}
      {progress && (
        <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-slate-900 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function ResourceItem({ label, value, warning }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[11px] font-bold">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900">{value}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${warning ? 'bg-red-500' : 'bg-slate-900'}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TaskRow({ id, title, subtitle, priority, deadline }) {
  return (
    <tr className="group cursor-pointer">
      <td className="py-5">
        <p className="text-xs font-bold text-slate-400">{id}</p>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-[10px] font-medium text-slate-500">{subtitle}</p>
      </td>
      <td>
         <div className="flex -space-x-2">
           {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white" />)}
           <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">+4</div>
         </div>
      </td>
      <td>
        <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-tighter ${priority === 'Critical' ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
          {priority}
        </span>
      </td>
      <td className="text-xs font-bold text-slate-600">{deadline}</td>
      <td className="text-right"><ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900" /></td>
    </tr>
  );
}

function LogEntry({ time, type, title, desc, alert }) {
  return (
    <div className="relative pl-8 space-y-1">
      <div className={`absolute left-0 top-1 w-[24px] h-[24px] rounded-full border-4 border-white shadow-sm z-10 ${alert ? 'bg-red-500' : 'bg-slate-200'}`} />
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{time} • <span className={alert ? 'text-red-500' : ''}>{type}</span></p>
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function MapControl({ icon }) {
  return (
    <button className="p-2 bg-white rounded-xl shadow-md border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
      {icon}
    </button>
  );
}