"use client";
import React, { useState, useEffect } from 'react';
import {
  Clock, FileText, ShieldCheck, AlertTriangle,
  BarChart3, User, MapPin, CloudRain, Loader2,
  Calendar
} from 'lucide-react';
import Axios from "../../../../utils/Axios";
import summeryApi from "../../../common/summeryApi";

export default function SiteEngineerReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await Axios({ ...summeryApi.reports });
      if (response.data.success) {
        setReports(response.data.data);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 min-h-screen bg-[#FDFDFD]">
        <Loader2 className="animate-spin mb-2" size={30} />
        <span className="text-[10px] font-black uppercase tracking-widest">Loading Reports...</span>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans antialiased">
      {/* --- HEADER --- */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
            Site <span className="text-blue-600">Reports</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Daily status and supervisor analytics across all active projects.</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-xl text-amber-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
          Read-Only Archive Access
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* --- METRICS --- */}
        <div className="col-span-12 md:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
          <MetricCard label="Total Submissions" value={reports.length.toString().padStart(2, '0')} sub="Documented Logs" />
          <MetricCard label="Weather Impact" value="Rainy" sub="Condition reported today" isAlert />
          <MetricCard label="Work Force" value="10" sub="Personnel Present" />
          <MetricCard label="Last Submission" value={reports[0] ? new Date(reports[0].submittedAt).toLocaleDateString() : 'N/A'} sub="Latest log sync" />
        </div>

        {/* --- REPORT TABLE --- */}
        <div className="col-span-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
            <h2 className="font-black text-slate-800 uppercase text-xs tracking-[0.15em]">Supervisor Documentation Ledger</h2>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
               <span className="text-[10px] font-black text-slate-400 uppercase">Live Data Sync</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-4">Ref</th>
                  <th className="px-8 py-4">Report Details</th>
                  <th className="px-8 py-4">Assigned Project</th>
                  <th className="px-8 py-4">Supervisor</th>
                  <th className="px-8 py-4 text-center">Weather</th>
                  <th className="px-8 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reports.map((report, index) => (
                  <tr key={report.id} className="hover:bg-blue-50/20 transition-all cursor-default group">
                    {/* 1. Reference */}
                    <td className="px-8 py-5">
                      <span className="text-[11px] font-black text-slate-300 group-hover:text-blue-500">
                        #{String(index + 1).padStart(3, '0')}
                      </span>
                    </td>

                    {/* 2. Title & Type */}
                    <td className="px-8 py-5 min-w-[280px]"> {/* Defined min-width prevents premature wrapping */}
                      <div className="flex items-start gap-4"> {/* items-start is better for wrapping text */}
                        <div className="flex-shrink-0 mt-0.5 p-2.5 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <FileText size={16}/>
                        </div>

                        <div className="flex flex-col">
                          <p className="text-[13px] font-black text-slate-800 uppercase tracking-tight leading-[1.2] break-words">
                            {report.reportTitle}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                            {report.reportType.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* 3. Project Name */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-slate-300"/>
                        <p className="text-[11px] font-black text-slate-600 uppercase tracking-tighter truncate max-w-[200px]">
                          {report.project?.projectName}
                        </p>
                      </div>
                    </td>

                    {/* 4. Supervisor */}
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <User size={12} className="text-slate-300"/>
                        <p className="text-[11px] font-bold text-slate-700">
                          {report.user?.firstName} {report.user?.lastName}
                        </p>
                      </div>
                    </td>

                    {/* 5. Weather */}
                    <td className="px-8 py-5 text-center">
                       <div className="flex items-center justify-center gap-2 bg-slate-50 py-1 px-3 rounded-full w-fit mx-auto border border-slate-100">
                          <CloudRain size={12} className="text-blue-400"/>
                          <span className="text-[10px] font-black text-slate-500 uppercase">{report.weatherCondition}</span>
                       </div>
                    </td>

                    {/* 6. Submission Date */}
                    <td className="px-8 py-5 text-right">
                       <div className="flex flex-col items-end">
                          <p className="text-[11px] font-black text-slate-800 tracking-tighter">
                            {new Date(report.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Log</p>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, trend, sub, isAlert }) {
  return (
    <div className="bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3">{label}</p>
      <p className={`text-3xl font-black tracking-tighter ${isAlert ? 'text-blue-600' : 'text-slate-900'}`}>{value}</p>
      {trend && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg mt-3 inline-block">{trend}</span>}
      {sub && <p className="text-[10px] font-bold text-slate-400 mt-2 italic">"{sub}"</p>}
    </div>
  );
}
