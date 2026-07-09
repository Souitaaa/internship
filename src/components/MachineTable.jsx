import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MachineTable({ machines }) {
  return (
    <div className="bg-[#161f30] border border-[#232f48] rounded-2xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#232f48] text-slate-400 bg-[#111927] font-bold text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Machine Name</th>
              <th className="px-6 py-4">Zone</th>
              <th className="px-6 py-4">Equipment Type</th>
              <th className="px-6 py-4">Telemetry (Energy)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#232f48]/50">
            {machines.map((machine) => {
              const isOnline = machine.status === 'Online';
              const isAlert = machine.energy > 150;

              // Action Badge styling - High overload shows in red!
              let statusBadge = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ";
              if (isAlert) {
                statusBadge += "bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse";
              } else if (isOnline) {
                statusBadge += "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
              } else {
                statusBadge += "bg-slate-800 text-slate-400 border border-slate-700/50";
              }

              return (
                <tr key={machine.id} className="hover:bg-[#1a253a] transition-colors">
                  {/* Name column */}
                  <td className="px-6 py-4">
                    <div className="font-extrabold text-slate-100">{machine.name}</div>
                    <div className="text-[10px] font-semibold text-slate-400">{machine.uid}</div>
                  </td>
                  
                  {/* Zone column */}
                  <td className="px-6 py-4 font-semibold text-slate-300">
                    Zone {machine.zone}
                  </td>
                  
                  {/* Type column */}
                  <td className="px-6 py-4 font-semibold text-slate-400">
                    {machine.type}
                  </td>
                  
                  {/* Telemetry column - Red energy value and tag if overloaded */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className={isAlert ? 'text-red-400 font-black animate-pulse' : 'text-slate-200'}>
                        {machine.energy} kWh
                      </span>
                      {isAlert && <span className="text-red-400 text-[9px] font-black uppercase tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">Overload</span>}
                    </div>
                  </td>
                  
                  {/* Status Badge */}
                  <td className="px-6 py-4">
                    <span className={statusBadge}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-red-400 animate-pulse' : isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
                      <span>{isAlert ? 'OVERLOAD' : machine.status}</span>
                    </span>
                  </td>
                  
                  {/* Actions column */}
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/machines/${machine.id}`}
                      className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 bg-[#161f30] hover:bg-slate-800 text-[#10b981] hover:text-emerald-400 border border-[#232f48] hover:border-[#10b981]/50 rounded-lg text-xs font-bold transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}