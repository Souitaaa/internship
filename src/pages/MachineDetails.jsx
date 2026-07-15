import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share, MapPin, Activity, Shield, Link2, Tag, ArrowLeft, Clock, Info, AlertTriangle, Zap, Battery, Edit, Trash2 } from 'lucide-react';
import { useMachines } from '../context/MachineContext';
import { useNotifications } from '../context/NotificationContext';
import EditMachineModal from '../components/EditMachineModal';

export default function MachineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { machines, deleteMachine } = useMachines();
  const { addNotification } = useNotifications();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const machine = useMemo(() => {
    return machines.find((m) => m.id === parseInt(id));
  }, [id, machines]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this machine?")) {
      deleteMachine(machine.id);
      navigate('/');
    }
  };

  if (!machine) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold text-white mb-4">Machine Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all flex items-center shadow-lg font-bold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  const isOnline = machine.status === 'Online';
  const hasAlert = machine.energy > 150;

  return (
    <div className="max-w-5xl mx-auto py-4 px-2 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-[#10b981] hover:text-emerald-400 transition-colors flex items-center font-bold text-sm cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </button>

      {/* Main Glass Detail Container */}
      <div className="bg-[#161f30] border border-[#232f48] rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Header Header Info Panel */}
        <div className="bg-[#1a243a] border-b border-[#232f48] px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 pr-4">
            <h1 className="text-2xl font-black text-white tracking-tight truncate">{machine.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-400 font-mono text-[11px] mt-2">
               <span className="flex items-center min-w-0"><Shield className="w-4 h-4 mr-1.5 text-slate-500 shrink-0"/> <span className="truncate">UID: {machine.uid}</span></span>
               <span className="flex items-center min-w-0"><Link2 className="w-4 h-4 mr-1.5 text-slate-500 shrink-0"/> <span className="truncate">IP: {machine.ip}</span></span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 shrink-0">
             {hasAlert && (
               <span className="flex items-center px-4 py-1.5 rounded-full text-xs font-bold tracking-wide bg-amber-500/10 text-amber-400 border border-amber-500/20">
                 <AlertTriangle className="w-4 h-4 mr-1.5 animate-pulse" />
                 High Energy Alert
               </span>
             )}
             <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border
                ${isOnline ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                {machine.status}
              </span>
             
             {/* Edit Action */}
             <button 
               onClick={() => setIsEditModalOpen(true)} 
               title="Edit Machine" 
               className="p-2.5 bg-[#161f30] hover:bg-slate-800 text-emerald-400 hover:text-white border border-[#232f48] hover:border-[#10b981]/50 rounded-2xl transition-all cursor-pointer shadow-md"
             >
                <Edit className="w-4.5 h-4.5" />
             </button>
             
             {/* Delete Action */}
             <button 
               onClick={handleDelete} 
               title="Delete Machine" 
               className="p-2.5 bg-[#161f30] hover:bg-red-950/20 text-red-400 hover:text-red-300 border border-[#232f48] hover:border-red-500/50 rounded-2xl transition-all cursor-pointer shadow-md"
             >
                <Trash2 className="w-4.5 h-4.5" />
             </button>
          </div>
        </div>

        {/* Content Details Grid */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12 bg-[#161f30]">
          
          {/* Information Section */}
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center border-b border-[#232f48] pb-2">
                 <Info className="w-4.5 h-4.5 mr-2 text-[#10b981]"/> Machine Information
              </h3>
              <ul className="space-y-3.5">
                <li className="flex justify-between items-center py-2 border-b border-[#232f48]/40 text-xs">
                  <span className="text-slate-400 flex items-center"><MapPin className="w-4 h-4 mr-2.5 text-slate-500"/> Zone</span>
                  <span className="font-bold text-white">Zone {machine.zone}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-[#232f48]/40 text-xs">
                  <span className="text-slate-400 flex items-center"><Activity className="w-4 h-4 mr-2.5 text-slate-500"/> Type</span>
                  <span className="font-bold text-white">{machine.type}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-[#232f48]/40 text-xs">
                  <span className="text-slate-400 flex items-center"><Info className="w-4 h-4 mr-2.5 text-slate-500"/> Responsible Personnel</span>
                  <span className="font-bold text-white">{machine.responsible}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-[#232f48]/40 text-xs">
                  <span className="text-slate-400 flex items-center"><Clock className="w-4 h-4 mr-2.5 text-slate-500"/> Internal ID</span>
                  <span className="font-mono font-bold text-slate-300">{machine.id}</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex justify-between items-center border-b border-[#232f48] pb-2">
                Log Description
              </h3>
              <p className="text-slate-300 leading-relaxed bg-[#1a243a]/60 border border-[#232f48]/50 p-4 rounded-2xl text-xs">
                {machine.description || "No log notes added. Please click the edit action button to document custom notes, maintenance events, and operation logs for this registered equipment."}
              </p>
            </section>
          </div>

          {/* Real-time Telemetry Section */}
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center border-b border-[#232f48] pb-2">
                 <Zap className="w-4.5 h-4.5 mr-2 text-[#10b981]"/> Real-time Status
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#1a243a]/60 border border-[#232f48]/50 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Energy</div>
                  <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1">
                    <span>{machine.energy}</span>
                    <span className="text-xs font-semibold text-slate-500">kWh/h</span>
                  </div>
                </div>
                <div className="p-4 bg-[#1a243a]/60 border border-[#232f48]/50 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Consumed Energy</div>
                  <div className="text-2xl font-black text-white mt-1 flex items-baseline gap-1">
                    <span>{machine.totalEnergyConsumed || (machine.energy * 10)}</span>
                    <span className="text-xs font-semibold text-slate-500">kWh</span>
                  </div>
                </div>
                <div className="p-4 bg-[#1a243a]/60 border border-[#232f48]/50 rounded-2xl col-span-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Temps Restant pour Réparation</div>
                  <div className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                    {machine.status === 'Offline' ? (
                      <span className="text-amber-400 flex items-center gap-1.5">
                        <Clock className="w-4 h-4 animate-pulse" />
                        {machine.reparationTime || '1h 30m'}
                      </span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        Aucune réparation requise
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-4 flex items-center border-b border-[#232f48] pb-2">
                 <Activity className="w-4.5 h-4.5 mr-2 text-[#10b981]"/> Telemetry Activity logs
              </h3>
              <div className="p-4 bg-[#1a243a]/60 border border-[#232f48]/50 rounded-2xl text-xs space-y-2 text-slate-300">
                <div className="flex justify-between border-b border-[#232f48]/30 pb-1">
                  <span>Current load state:</span>
                  <span className="font-bold text-emerald-400">Normal</span>
                </div>
                <div className="flex justify-between">
                  <span>Data reporting frequency:</span>
                  <span className="font-mono text-slate-400">Every 5 seconds</span>
                </div>
              </div>
            </section>
          </div>

        </div>
      </div>

      <EditMachineModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} machine={machine} />
    </div>
  );
}