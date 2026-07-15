import React, { createContext, useState, useEffect, useContext } from 'react';

const MachineContext = createContext();

const API_BASE_URL = 'http://localhost:3000/machines';

export function MachineProvider({ children }) {
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch machines from NestJS backend on mount
  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Failed to fetch machines');
      const data = await res.json();
      setMachines(data);
    } catch (err) {
      console.error('Error fetching machines from backend:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addMachine = async (machine) => {
    try {
      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machine),
      });
      if (!res.ok) throw new Error('Failed to create machine');
      const newMachine = await res.json();
      setMachines(prev => [...prev, newMachine]);
    } catch (err) {
      console.error('Error adding machine to backend:', err);
    }
  };

  const editMachine = async (updatedMachine) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${updatedMachine.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMachine),
      });
      if (!res.ok) throw new Error('Failed to update machine');
      const savedMachine = await res.json();
      setMachines(prev => prev.map(m => m.id === savedMachine.id ? savedMachine : m));
    } catch (err) {
      console.error('Error editing machine on backend:', err);
    }
  };

  const deleteMachine = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete machine');
      setMachines(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error('Error deleting machine on backend:', err);
    }
  };

  return (
    <MachineContext.Provider value={{ machines, searchTerm, setSearchTerm, isLoading, addMachine, editMachine, deleteMachine, refetchMachines: fetchMachines }}>
      {children}
    </MachineContext.Provider>
  );
}

export function useMachines() {
  return useContext(MachineContext);
}
