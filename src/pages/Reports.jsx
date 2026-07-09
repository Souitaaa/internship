import React from 'react';
import { FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-400 mt-2 text-sm font-semibold">System performance charts, audit logs, and efficiency metrics.</p>
      </div>
      
      {/* Main Glass Block */}
      <div className="bg-[#161f30] border border-[#232f48] p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Reports Generated</h3>
        <p className="text-slate-400 text-center max-w-md text-sm leading-relaxed">
          The reports engine is currently aggregating historical telemetry data. Once compiled, visual PDF reports and industrial efficiency sheets will be downloadable here.
        </p>
      </div>
    </div>
  );
}