import React from 'react';
import MachineTable from '../components/MachineTable';
import { useMachines } from '../context/MachineContext';

export default function Machines() {
  const { machines } = useMachines();

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">All Machines</h1>
        <p className="text-slate-400 mt-2 text-sm font-semibold">Complete inventory of registered industrial equipment.</p>
      </div>

      <MachineTable machines={machines} />
    </div>
  );
}