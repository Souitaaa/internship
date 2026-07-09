import React, { useState, useMemo, useEffect } from 'react';
import MachineCard from '../components/MachineCard';
import MachineTable from '../components/MachineTable';
import Stats from '../components/Stats';
import { useMachines } from '../context/MachineContext';
import { useNotifications } from '../context/NotificationContext';
import AddMachineModal from '../components/AddMachineModal';
import StatDetailsModal from '../components/StatDetailsModal';
import { LayoutGrid, List, Plus, Filter, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const { machines, searchTerm } = useMachines();
  const { addNotification, notifications } = useNotifications();
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statModalData, setStatModalData] = useState({ isOpen: false, category: '' });

  // Automatic scanner loop: raise alert if machine energy > 150
  useEffect(() => {
    if (!machines || !addNotification) return;
    machines.forEach(machine => {
      if (machine.energy > 150) {
        const exists = notifications && notifications.some(n => n.id === `alarm-${machine.id}`);
        if (!exists) {
          addNotification({
            id: `alarm-${machine.id}`,
            text: `⚠️ Overload: ${machine.name} (${machine.energy} kWh)`,
            time: "Just now",
            type: "warning"
          });
        }
      }
    });
  }, [machines, notifications, addNotification]);

  // Filter lists dynamically from current equipment
  const zones = useMemo(() => {
    if (!machines) return [];
    return [...new Set(machines.map(m => m.zone))].sort();
  }, [machines]);

  const statuses = useMemo(() => {
    if (!machines) return [];
    return [...new Set(machines.map(m => m.status))].sort();
  }, [machines]);

  // Combined Filters matching all choices
  const filteredMachines = useMemo(() => {
    if (!machines) return [];
    return machines.filter((machine) => {
      const matchesSearch = 
        machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.uid.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesZone = selectedZone === '' || machine.zone === selectedZone || 
        (selectedZone.length === 1 && machine.zone.endsWith(selectedZone));
      
      const matchesStatus = selectedStatus === '' || machine.status === selectedStatus;
      
      return matchesSearch && matchesZone && matchesStatus;
    });
  }, [searchTerm, selectedZone, selectedStatus, machines]);

  // Stat Category Modal mapping
  const modalMachines = useMemo(() => {
    if (!machines) return [];
    const cat = statModalData.category;
    if (cat === 'Online') return machines.filter(m => m.status === 'Online');
    if (cat === 'Offline') return machines.filter(m => m.status !== 'Online');
    if (cat === 'High Energy') return machines.filter(m => m.energy > 150);
    if (cat === 'Total Machines') return machines;
    return [];
  }, [statModalData.category, machines]);

  return (
    <div className="space-y-6">
      {/* 
        =========================================================
        TOP STATS KPI MODULE
        =========================================================
      */}
      <section>
        <Stats machines={machines} onStatClick={(title) => setStatModalData({ isOpen: true, category: title })} />
      </section>

      {/* 
        =========================================================
        UNIFIED CONTROLS TOOLBAR (Filters & Quick Actions)
        =========================================================
      */}
      <section className="bg-[#161f30] p-4 rounded-2xl border border-[#232f48] flex flex-col gap-4 relative z-20 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Filters on the Left */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Zone Filter Select */}
            <div className="relative">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="h-10 pl-10 pr-8 bg-[#1a243a] border border-[#232f48] rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] appearance-none cursor-pointer hover:border-slate-500 transition-all min-w-[140px]"
              >
                <option value="">Filter Zone</option>
                {zones.map(z => (
                  <option key={z} value={z}>{z}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            </div>

            {/* Status Filter Select */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 pl-10 pr-8 bg-[#1a243a] border border-[#232f48] rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] appearance-none cursor-pointer hover:border-slate-500 transition-all min-w-[140px]"
              >
                <option value="">Filter Status</option>
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
            </div>
          </div>
          
          {/* Main Action Buttons on the Right */}
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)} 
              className="h-10 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Machine</span>
            </button>
            
            {/* Grid/List View Toggles */}
            <div className="flex items-center bg-[#1a243a] p-1 rounded-xl border border-[#232f48]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-[#10b981] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === 'table' ? 'bg-[#10b981] text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        =========================================================
        MAIN DISPLAY CANVAS (Grid/Table views)
        =========================================================
      */}
      <section className="relative z-10">
        {filteredMachines.length === 0 ? (
           <div className="flex items-center justify-center py-24 bg-[#161f30] border border-[#232f48] rounded-2xl text-slate-400 text-sm font-semibold animate-fade-in">
             No equipment found matching criteria.
           </div>
        ) : (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMachines.map((machine) => (
                <MachineCard key={machine.id} machine={machine} />
              ))}
            </div>
          ) : (
            <MachineTable machines={filteredMachines} />
          )
        )}
      </section>

      <AddMachineModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      
      <StatDetailsModal 
        isOpen={statModalData.isOpen} 
        onClose={() => setStatModalData({ ...statModalData, isOpen: false })} 
        title={statModalData.category} 
        machines={modalMachines} 
      />
    </div>
  );
}