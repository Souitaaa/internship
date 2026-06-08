import React, { useState, useMemo } from 'react';
import FilterDropdown from '../components/FilterDropdown';
import MachineCard from '../components/MachineCard';
import MachineTable from '../components/MachineTable';
import Stats from '../components/Stats';
import { useMachines } from '../context/MachineContext';
import AddMachineModal from '../components/AddMachineModal';
import StatDetailsModal from '../components/StatDetailsModal';
import { LayoutGrid, List, Plus } from 'lucide-react';

export default function Dashboard() {
  const { machines, searchTerm } = useMachines();
  const [selectedZone, setSelectedZone] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [statModalData, setStatModalData] = useState({ isOpen: false, category: '' });

  const zones = useMemo(() => {
    if (!machines) return [];
    return [...new Set(machines.map(m => m.zone))];
  }, [machines]);

  const filteredMachines = useMemo(() => {
    if (!machines) return [];
    return machines.filter((machine) => {
      const matchesSearch = 
        machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.uid.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesZone = selectedZone === '' || machine.zone === selectedZone;
      
      return matchesSearch && matchesZone;
    });
  }, [searchTerm, selectedZone, machines]);

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
    <div className="layout-container space-y-8">
      {/* Stats row */}
      <section>
        <Stats machines={machines} onStatClick={(title) => setStatModalData({ isOpen: true, category: title })} />
      </section>

      {/* Unified Control Strip */}
      <section className="bg-white p-4 rounded-xl shadow-sm ring-1 ring-slate-900/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <FilterDropdown
            label="Zones"
            options={zones}
            selected={selectedZone}
            onChange={setSelectedZone}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          <button onClick={() => setIsAddModalOpen(true)} className="flex md:w-auto w-full justify-center items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors shadow-sm font-medium text-sm">
            <Plus className="w-4 h-4" />
            Add Machine
          </button>
          
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
               onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-primary-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Data View */}
      <section>
        {filteredMachines.length === 0 ? (
           <div className="flex items-center justify-center py-24 surface-card text-slate-500 text-sm">
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