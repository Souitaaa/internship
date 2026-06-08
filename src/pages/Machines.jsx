import React from 'react';
import MachineTable from '../components/MachineTable';
import { useMachines } from '../context/MachineContext';

export default function Machines() {
  const { machines } = useMachines();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">All Machines</h1>
        <p className="text-gray-500 mt-2 text-lg">Complete list of registered industrial machines.</p>
      </div>
      <MachineTable machines={machines} />
    </div>
  );
}