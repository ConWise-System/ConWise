import React from 'react';
import { Clock, FileText, ShieldCheck, AlertTriangle, BarChart3 } from 'lucide-react';

export default function SiteEngineerReport() {
  const reports = [
    { id: 1, type: 'Daily Report', title: 'Floor 02 Grid', date: 'Sept 24, 2023', status: 'VERIFIED', reporter: 'Sarah Miller' },
    { id: 2, type: 'Issue Log', title: 'Crane Calibration', date: 'Sept 24, 2023', status: 'IN REVIEW', reporter: 'John Doe' }
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Report</h1>
          <p className="text-slate-500">Daily status and anomaly tracking: Phase 4</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg text-amber-700 text-xs font-bold uppercase tracking-wider">
          Read-Only Access
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Metrics Section */}
        <div className="col-span-12 md:col-span-8 grid grid-cols-3 gap-4">
          <MetricCard label="Daily Completion" value="94%" trend="+2.4% vs LW" />
          <MetricCard label="Active Blockers" value="03" sub="Action Required" isAlert />
          <MetricCard label="Man Hours" value="1.2k" sub="Across 14 sub-contractors" />
        </div>

        {/* Timeline Table */}
        <div className="col-span-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 uppercase text-sm tracking-tight">Engineering Log Timeline</h2>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors">View All Records</button>
          </div>
          
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3">Submission</th>
                <th className="px-6 py-3">Reporter</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
                      {report.type === 'Issue Log' ? <AlertTriangle size={16}/> : <FileText size={16}/>}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{report.type}: {report.title}</p>
                      <p className="text-[10px] text-slate-400">{report.date}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{report.reporter}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                      report.status === 'VERIFIED' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, sub, isAlert }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{label}</p>
      <p className={`text-4xl font-bold tracking-tighter ${isAlert ? 'text-rose-600' : 'text-slate-900'}`}>{value}</p>
      {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">{trend}</span>}
      {sub && <p className="text-[10px] font-bold text-slate-400 mt-2">{sub}</p>}
    </div>
  );
}