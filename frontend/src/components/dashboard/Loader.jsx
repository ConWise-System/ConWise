"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ message = "Loading system records..." }) {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-8 font-sans antialiased select-none">
      {/* Structural Minimalist Spinner Engine */}
      <div className="relative flex items-center justify-center text-slate-900">
        <Loader2 className="animate-spin stroke-[2.5]" size={28} />
      </div>
      
      {/* Normalized Description Subtext */}
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 animate-pulse text-center">
        {message}
      </span>
    </div>
  );
}