import React, { createContext, useState, useContext } from 'react';
import initialMachines from '../data/machines.json';

const MachineContext = createContext();

export function MachineProvider({ children }) {
  const [machines, setMachines] = useState(initialMachines);
  const [searchTerm, setSearchTerm] = useState('');

  const addMachine = (machine) => {
    setMachines(prev => [...prev, { ...machine, id: Date.now() }]);
  };

  const editMachine = (updatedMachine) => {
    setMachines(prev => prev.map(m => m.id === updatedMachine.id ? updatedMachine : m));
  };

  const deleteMachine = (id) => {
    setMachines(prev => prev.filter(m => m.id !== id));
  };

  return (
    <MachineContext.Provider value={{ machines, searchTerm, setSearchTerm, addMachine, editMachine, deleteMachine }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachines() {
  return useContext(MachineContext);
}
