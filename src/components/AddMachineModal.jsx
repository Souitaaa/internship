import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useMachines } from '../context/MachineContext';
import { X } from 'lucide-react';

export default function AddMachineModal({ isOpen, onClose }) {
  const { addMachine } = useMachines();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    uid: '',
    ip: '',
    zone: 'Zone A',
    type: 'Motor',
    protocol: 'Modbus TCP',
    voltage: '400V',
    energy: 100,
    responsible: '',
    tags: '',
    status: 'Online',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMachine = {
      ...formData,
      energy: Number(formData.energy),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    addMachine(newMachine);
    
    addNotification({
      type: 'Add',
      message: `New machine added: ${newMachine.name} (${newMachine.uid})`,
      machine: newMachine,
      timestamp: new Date().toISOString()
    });

    if (newMachine.energy > 150) {
      addNotification({
        type: 'Energy',
        message: `High energy alert! Machine ${newMachine.name} (${newMachine.uid}) is using ${newMachine.energy} kWh.`,
        machine: newMachine,
        timestamp: new Date().toISOString()
      });
    }

    try {
      await fetch(`http://localhost:3000/machines/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Add',
          message: `New machine added: ${newMachine.name} (${newMachine.uid})`,
          machine: newMachine
        })
      });
    } catch (err) {
      console.error("Backend unreachable for notification", err);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Add New Machine</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Machine Name</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Pump A1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal ID (UID)</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.uid} onChange={e => setFormData({...formData, uid: e.target.value})} placeholder="e.g. MT005" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.ip} onChange={e => setFormData({...formData, ip: e.target.value})} placeholder="192.168.1.100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})} placeholder="Zone A" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. Compressor" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Protocol</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.protocol} onChange={e => setFormData({...formData, protocol: e.target.value})} placeholder="e.g. Modbus TCP" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Voltage</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.voltage} onChange={e => setFormData({...formData, voltage: e.target.value})} placeholder="e.g. 400V" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Energy (kWh)</label>
              <input required type="number" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.energy} onChange={e => setFormData({...formData, energy: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsible</label>
              <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.responsible} onChange={e => setFormData({...formData, responsible: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (Comma-separated)</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} placeholder="e.g. Critical, Maintenance" />
            </div>
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
               <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                 <option value="Online">Online</option>
                 <option value="Offline">Offline</option>
               </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all resize-none h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Description details..." />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">Add Machine</button>
          </div>
        </form>
      </div>
    </div>
  );
}
