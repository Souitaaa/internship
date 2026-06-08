import React from 'react';
import { Server, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

export default function Stats({ machines, onStatClick }) {
  const total = machines.length;
  const online = machines.filter(m => m.status === 'Online').length;
  const offline = total - online;
  const highEnergy = machines.filter(m => m.energy > 150).length;

  const statCards = [
    { title: 'Total Machines', value: total, icon: Server },
    { title: 'Online', value: online, icon: CheckCircle, isStatus: true, statusClass: 'text-emerald-600' },
    { title: 'Offline', value: offline, icon: AlertCircle, isStatus: true, statusClass: 'text-red-600' },
    { title: 'High Energy', value: highEnergy, icon: AlertTriangle, isStatus: true, statusClass: 'text-amber-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        const isClickable = true;
        
        return (
          <div 
            key={idx} 
            onClick={() => isClickable && onStatClick(stat.title)}
            className={`surface-card p-5 transition-all flex flex-col gap-3 
              ${isClickable ? 'cursor-pointer hover:border-primary-400 hover:ring-1 hover:ring-primary-400 hover:shadow-md hover:scale-[1.02]' : 'opacity-80'}`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-small font-medium uppercase tracking-wider text-slate-500`}>
                {stat.title}
              </span>
              <Icon className={`w-4 h-4 ${stat.isStatus ? stat.statusClass : 'text-slate-400'}`} />
            </div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight">
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}