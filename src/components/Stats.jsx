import React from 'react';
import { Server, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

export default function Stats({ machines, onStatClick }) {
  const total = machines.length;
  const online = machines.filter(m => m.status === 'Online').length;
  const offline = machines.filter(m => m.status === 'Offline').length;
  const alerts = machines.filter(m => m.energy > 150).length;
  
  // Find a critical machine to show in the critical alert panel
  const criticalMachine = machines.find(m => m.energy > 150) || machines.find(m => m.status === 'Offline') || { name: 'Generator', energy: 160 };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* 1. TOTAL ASSETS */}
      <div 
        onClick={() => onStatClick('Total Machines')}
        className="bg-[#161f30] rounded-2xl border border-[#232f48] p-5 hover:border-primary-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between h-36"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Assets</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-1">{total}</div>
          </div>
          <span className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path>
            </svg>
            <span>5% this month</span>
          </span>
        </div>
        <div className="text-[10px] text-slate-500">
          <span>Active inventory</span>
        </div>
      </div>

      {/* 2. OPERATIONAL */}
      <div 
        onClick={() => onStatClick('Online')}
        className="bg-[#161f30] rounded-2xl border border-[#232f48] p-5 hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between h-36"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Operational</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-1">{online}</div>
          </div>
          <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500">
          <span>Utilization</span>
          <span className="text-emerald-400 font-bold">94% Uptime</span>
        </div>
      </div>

      {/* 3. ATTENTION REQUIRED */}
      <div 
        onClick={() => onStatClick('Offline')}
        className="bg-[#161f30] rounded-2xl border border-[#232f48] p-5 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between h-36"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attention Required</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-1">{offline + alerts}</div>
          </div>
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="flex gap-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span>
            <span className="text-slate-400">Offline ({offline})</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block"></span>
            <span className="text-slate-400">Alerts ({alerts})</span>
          </div>
        </div>
      </div>

      {/* 4. CRITICAL ALERTS */}
      <div 
        onClick={() => onStatClick('High Energy')}
        className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 hover:border-red-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between h-36 relative overflow-hidden"
      >
        {/* Glow backdrop inside the card */}
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-start justify-between relative z-10">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400/80">Critical Alerts</span>
            <div className="text-3xl font-extrabold text-white tracking-tight mt-1">{alerts > 0 ? alerts : 1}</div>
          </div>
          
          <div className="p-2 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl animate-pulse-glow">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="border-t border-red-900/30 pt-1.5 relative z-10">
          <p className="text-[9px] text-red-400 font-bold uppercase tracking-wide leading-none">High Energy:</p>
          <p className="text-xs font-bold text-white mt-1 truncate uppercase">
            {criticalMachine.name}
          </p>
        </div>
      </div>
    </div>
  );
}