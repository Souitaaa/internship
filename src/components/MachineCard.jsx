import React from 'react';
import { MapPin, Cpu, Lightbulb, Zap, Battery, Calendar, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MachineCard({ machine }) {
  const isOnline = machine.status === 'Online';
  const isAlert = machine.energy > 150;
  
  // Custom status capsule styling - High Overload values show in high-impact Pulsing Red!
  let statusBadgeClasses = "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold shadow-sm ";
  if (isAlert) {
    statusBadgeClasses += "bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse";
  } else if (isOnline) {
    statusBadgeClasses += "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
  } else {
    statusBadgeClasses += "bg-slate-800 text-slate-400 border border-slate-700/50";
  }

  // Energy & Voltage icon helper
  const getVoltageStr = () => {
    if (machine.type === 'Pump') return '230V';
    if (machine.type === 'Conveyor') return '380V';
    return '11kV';
  };

  return (
    <div className={`surface-card p-6 flex flex-col justify-between h-[260px] relative overflow-hidden group transition-all duration-300 ${
      isAlert ? 'border-red-500/30 hover:border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'hover:border-primary-500/50'
    }`}>
      <div>
        {/* Card Header matching screen */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="text-base font-extrabold text-slate-100 tracking-tight group-hover:text-primary-500 transition-colors">
              {machine.name}
            </h4>
            <span className="text-[10px] font-semibold text-slate-400 block leading-none">
              {machine.uid}
            </span>
          </div>
          
          <div className={statusBadgeClasses}>
            <span className={`w-1.5 h-1.5 rounded-full ${isAlert ? 'bg-red-400 animate-pulse' : isOnline ? 'bg-emerald-400' : 'bg-slate-500'}`}></span>
            <span>{isAlert ? 'OVERLOAD' : machine.status}</span>
          </div>
        </div>

        {/* Info Grid with Icons */}
        <div className="mt-5 space-y-2.5 text-xs">
          
          {/* Row 1: Zone */}
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-2 font-medium text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Zone</span>
            </span>
            <span className="font-bold text-slate-200">Zone {machine.zone}</span>
          </div>

          {/* Row 2: Type */}
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-2 font-medium text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-slate-500" />
              <span>Type</span>
            </span>
            <span className="font-bold text-slate-200">{machine.type}</span>
          </div>

          {/* Row 3: Voltage */}
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-2 font-medium text-slate-400">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              <span>Voltage</span>
            </span>
            <span className="font-bold text-slate-200">{getVoltageStr()}</span>
          </div>

          {/* Row 4: Energy / Load - If exceeded threshold (>150), highlighted in red! */}
          <div className="flex justify-between items-center text-slate-300">
            <span className="flex items-center gap-2 font-medium text-slate-400">
              <Battery className="w-3.5 h-3.5 text-slate-500" />
              <span>Energy</span>
            </span>
            <span className={`font-black ${isAlert ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
              {machine.energy} kWh
            </span>
          </div>

        </div>
      </div>

      {/* Floating Action Link overlay to machine detail page */}
      <Link 
        to={`/machines/${machine.id}`}
        className="absolute inset-0 z-10 cursor-pointer"
        title={`View ${machine.name} details`}
      />
    </div>
  );
}