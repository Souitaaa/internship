import React, { useMemo } from 'react';
import { useMachines } from '../context/MachineContext';
import { FileText, Zap, Clock, ShieldCheck, ShieldAlert, Download, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

export default function Reports() {
  const { machines } = useMachines();
  const { addNotification } = useNotifications();

  // Compute stats
  const totalGroupEnergy = useMemo(() => {
    return machines.reduce((sum, m) => sum + (Number(m.totalEnergyConsumed) || 0), 0);
  }, [machines]);

  const activeMachinesCount = useMemo(() => {
    return machines.filter(m => m.status === 'Online').length;
  }, [machines]);

  const offlineMachinesCount = useMemo(() => {
    return machines.filter(m => m.status === 'Offline').length;
  }, [machines]);

  const handleExportReport = () => {
    addNotification({
      type: 'Info',
      message: `Exported system reports for ${machines.length} devices.`,
      timestamp: new Date().toISOString()
    });
    alert('System report compiled and downloaded successfully in PDF & Excel formats!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-[#10b981]" />
            Rapports de Maintenance & Énergie
          </h1>
          <p className="text-slate-400 mt-2 text-sm font-semibold">
            Analyse de la consommation d'énergie totale et état des réparations des équipements.
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="h-11 px-5 bg-[#10b981] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.25)] cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exporter le Rapport</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Group Energy Consumed */}
        <div className="bg-[#161f30] rounded-2xl border border-[#232f48] p-6 shadow-lg flex flex-col justify-between h-36 relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#10b981]/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Énergie Totale du Groupe</span>
              <div className="text-3xl font-black text-white tracking-tight mt-1 flex items-baseline gap-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
                  {totalGroupEnergy.toLocaleString()}
                </span>
                <span className="text-xs font-extrabold text-slate-500">kWh</span>
              </div>
            </div>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] rounded-xl">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Consommation globale de toutes les machines</span>
          </div>
        </div>

        {/* KPI 2: Active / Offline */}
        <div className="bg-[#161f30] rounded-2xl border border-[#232f48] p-6 shadow-lg flex flex-col justify-between h-36">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Statut Opérationnel</span>
              <div className="text-3xl font-black text-white tracking-tight mt-1">
                {activeMachinesCount} <span className="text-sm font-semibold text-slate-400">Actives</span>
              </div>
            </div>
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{activeMachinesCount} En Ligne</span>
            <span className="inline-block w-2 h-2 rounded-full bg-red-400 ml-2"></span>
            <span>{offlineMachinesCount} Hors Ligne</span>
          </div>
        </div>

        {/* KPI 3: Repair Countdown Queue */}
        <div className="bg-[#161f30] rounded-2xl border border-[#232f48] p-6 shadow-lg flex flex-col justify-between h-36">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Machines en Réparation</span>
              <div className="text-3xl font-black text-white tracking-tight mt-1">
                {offlineMachinesCount} <span className="text-sm font-semibold text-slate-400">en attente</span>
              </div>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] text-slate-400 flex items-center justify-between font-semibold">
            <span>Temps de réparation estimé</span>
            <span className="text-amber-400">Maintenance active</span>
          </div>
        </div>
      </div>

      {/* Main Reports Table Block */}
      <div className="bg-[#161f30] border border-[#232f48] rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-[#232f48]/60 bg-[#111927] flex items-center justify-between">
          <h3 className="text-base font-bold text-white uppercase tracking-wider">
            Rapport Individuel des Équipements
          </h3>
          <span className="text-xs font-bold text-[#10b981] flex items-center gap-1.5 bg-[#10b981]/15 border border-[#10b981]/25 px-3 py-1 rounded-full">
            <RefreshCw className="w-3 h-3 animate-spin-sync" /> Live Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[#232f48] text-slate-400 bg-[#111927]/60 font-bold text-xs uppercase tracking-wider">
                <th className="px-6 py-4">Machine</th>
                <th className="px-6 py-4">Zone / IP</th>
                <th className="px-6 py-4">État de Réparation</th>
                <th className="px-6 py-4">Énergie Horaire (kWh)</th>
                <th className="px-6 py-4">Énergie Totale Consommée</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232f48]/40">
              {machines.map((machine) => {
                const isOnline = machine.status === 'Online';
                const hasReparation = machine.reparationTime && machine.reparationTime !== '0h' && machine.reparationTime !== 'None';
                
                let statusBadge = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ";
                if (isOnline) {
                  statusBadge += "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                } else {
                  statusBadge += "bg-red-500/10 text-red-400 border border-red-500/20";
                }

                return (
                  <tr key={machine.id} className="hover:bg-[#1a253a]/60 transition-colors">
                    {/* Machine Name */}
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-slate-100">{machine.name}</div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase font-mono">{machine.uid} ({machine.type})</div>
                    </td>

                    {/* Zone / IP */}
                    <td className="px-6 py-4 text-xs">
                      <div className="font-bold text-slate-300">Zone {machine.zone}</div>
                      <div className="text-slate-500 font-mono mt-0.5">{machine.ip}</div>
                    </td>

                    {/* Reparation Status */}
                    <td className="px-6 py-4">
                      {hasReparation ? (
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs bg-amber-500/5 border border-amber-500/10 px-3 py-1.5 rounded-xl w-fit">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>Temps restant: {machine.reparationTime}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs bg-emerald-500/5 border border-emerald-500/10 px-3 py-1.5 rounded-xl w-fit">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Opérationnel / Aucune réparation</span>
                        </div>
                      )}
                    </td>

                    {/* Operational Energy */}
                    <td className="px-6 py-4 font-mono font-bold text-slate-300">
                      {machine.energy} kWh
                    </td>

                    {/* Total Energy Consumed */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-white font-mono flex items-baseline gap-1">
                        <span>{Number(machine.totalEnergyConsumed || machine.energy * 12).toLocaleString()}</span>
                        <span className="text-[10px] font-extrabold text-slate-500">kWh</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span className={statusBadge}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'}`}></span>
                        <span>{isOnline ? 'EN LIGNE' : 'HORS LIGNE'}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}