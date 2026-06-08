import React from 'react';
import { Tag, MapPin, Zap, Hash, AlertTriangle, Battery } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MachineCard({ machine }) {
  const navigate = useNavigate();

  const isOnline = machine.status === 'Online';
  const hasAlert = machine.energy > 150;

  return (
    <div
      onClick={() => navigate(`/machine/${machine.id}`)}
      className="surface-card group hover:border-primary-500 hover:ring-1 hover:ring-primary-500 cursor-pointer transition-all flex flex-col h-full overflow-hidden"
    >
      {/* Header section */}
      <div className="p-5 border-b border-slate-100 flex justify-between items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {machine.name}
            </h3>
            {hasAlert && (
              <span className="shrink-0 flex items-center text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border border-amber-200">
                Alert
              </span>
            )}
          </div>
          <p className="text-small font-mono text-slate-500 truncate">{machine.ip}</p>
        </div>
        
        {/* Status Indicator */}
        <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold
          ${isOnline ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-red-500'}`} />
          {machine.status}
        </div>
      </div>

      {/* Structured Data List */}
      <div className="p-5 flex-grow">
        <dl className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <dt className="flex items-center text-slate-500">
              <MapPin className="w-4 h-4 mr-2" /> Zone
            </dt>
            <dd className="font-medium text-slate-900">{machine.zone}</dd>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <dt className="flex items-center text-slate-500">
              <Hash className="w-4 h-4 mr-2" /> Type
            </dt>
            <dd className="font-medium text-slate-900">{machine.type}</dd>
          </div>

          <div className="flex justify-between items-center text-sm">
            <dt className="flex items-center text-slate-500">
              <Zap className="w-4 h-4 mr-2" /> Voltage
            </dt>
            <dd className="font-medium text-slate-900">{machine.voltage}</dd>
          </div>

          {machine.energy !== undefined && (
            <div className="flex justify-between items-center text-sm">
              <dt className="flex items-center text-slate-500">
                <Battery className={`w-4 h-4 mr-2 ${hasAlert ? 'text-amber-500' : ''}`} /> Energy
              </dt>
              <dd className={`font-medium ${hasAlert ? 'text-amber-600' : 'text-slate-900'}`}>
                {machine.energy} kWh
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}