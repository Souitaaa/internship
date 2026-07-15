import React, { createContext, useState, useEffect, useContext } from 'react';
import defaultMachines from '../data/machines.json';

const MachineContext = createContext();

const API_BASE_URL = 'http://localhost:3000/machines';
const MACHINES_CACHE_KEY = 'machines_cache_v1';

export function MachineProvider({ children }) {
  const [machines, setMachines] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const saveMachinesCache = (machinesToSave) => {
    try {
      localStorage.setItem(MACHINES_CACHE_KEY, JSON.stringify(machinesToSave));
    } catch (err) {
      console.error('Error saving machines cache:', err);
    }
  };

  const loadMachinesCache = () => {
    try {
      const raw = localStorage.getItem(MACHINES_CACHE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Error loading machines cache:', err);
      return [];
    }
  };

  const getNextLocalId = (list) => {
    const maxId = list.reduce((max, machine) => {
      const numericId = Number(machine.id);
      return Number.isFinite(numericId) && numericId > max ? numericId : max;
    }, 0);
    return maxId + 1;
  };

  const seedDefaultsIfNeeded = async () => {
    try {
      // Create backend records from test data when backend returns an empty list.
      await Promise.all(defaultMachines.map(async (machine) => {
        const payload = {
          uid: machine.uid,
          name: machine.name,
          ip: machine.ip,
          zone: machine.zone,
          type: machine.type,
          protocol: machine.protocol,
          voltage: machine.voltage,
          energy: machine.energy,
          totalEnergyConsumed: machine.totalEnergyConsumed,
          reparationTime: machine.reparationTime,
          responsible: machine.responsible,
          tags: machine.tags,
          status: machine.status,
          description: machine.description,
        };

        try {
          await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.error(`Error seeding machine ${machine.uid}:`, err);
        }
      }));
    } catch (err) {
      console.error('Error while seeding default machines:', err);
    }
  };

  const setMachinesAndCache = (nextMachines) => {
    setMachines(nextMachines);
    saveMachinesCache(nextMachines);
  };

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

      if (Array.isArray(data) && data.length > 0) {
        setMachinesAndCache(data);
        return;
      }

      await seedDefaultsIfNeeded();

      const seededRes = await fetch(API_BASE_URL);
      if (!seededRes.ok) throw new Error('Failed to fetch seeded machines');
      const seededData = await seededRes.json();

      if (Array.isArray(seededData) && seededData.length > 0) {
        setMachinesAndCache(seededData);
      } else {
        setMachinesAndCache(defaultMachines);
      }
    } catch (err) {
      console.error('Error fetching machines from backend:', err);

      const cachedMachines = loadMachinesCache();
      if (cachedMachines.length > 0) {
        setMachines(cachedMachines);
      } else {
        setMachinesAndCache(defaultMachines);
      }
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
      setMachines(prev => {
        const next = [...prev, newMachine];
        saveMachinesCache(next);
        return next;
      });
    } catch (err) {
      console.error('Error adding machine to backend:', err);
      setMachines(prev => {
        const fallbackMachine = {
          ...machine,
          id: machine.id ?? getNextLocalId(prev),
        };
        const next = [...prev, fallbackMachine];
        saveMachinesCache(next);
        return next;
      });
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
      setMachines(prev => {
        const next = prev.map(m => m.id === savedMachine.id ? savedMachine : m);
        saveMachinesCache(next);
        return next;
      });
    } catch (err) {
      console.error('Error editing machine on backend:', err);
      setMachines(prev => {
        const next = prev.map(m => m.id === updatedMachine.id ? updatedMachine : m);
        saveMachinesCache(next);
        return next;
      });
    }
  };

  const deleteMachine = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete machine');
      setMachines(prev => {
        const next = prev.filter(m => m.id !== id);
        saveMachinesCache(next);
        return next;
      });
    } catch (err) {
      console.error('Error deleting machine on backend:', err);
      setMachines(prev => {
        const next = prev.filter(m => m.id !== id);
        saveMachinesCache(next);
        return next;
      });
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
