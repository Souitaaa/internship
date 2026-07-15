import React, { useState, useEffect } from 'react';
import { useMachines } from '../context/MachineContext';
import { useNotifications } from '../context/NotificationContext';
import { X } from 'lucide-react';

export default function EditMachineModal({ isOpen, onClose, machine }) {
  const { editMachine } = useMachines();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState(machine || {});

  useEffect(() => {
    if (machine) {
      setFormData({
        ...machine,
        tags: machine.tags ? machine.tags.join(', ') : ''
      });
    }
  }, [machine]);

  if (!isOpen || !machine) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedMachine = {
      ...formData,
      energy: Number(formData.energy),
      totalEnergyConsumed: Number(formData.totalEnergyConsumed || 0),
      reparationTime: formData.reparationTime || '0h',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    editMachine(updatedMachine);
    onClose();
  };

  const inputClasses = "w-full px-4 py-2 bg-[#1a243a] border border-[#232f48] text-white rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm";
  const labelClasses = "block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#161f30] border border-[#232f48] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-[#232f48]/50">
          <h2 className="text-xl font-bold text-white">Edit Machine</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#1a243a] rounded-xl transition-all text-slate-400 hover:text-white border border-transparent hover:border-[#232f48]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Machine Name</label>
              <input required type="text" className={inputClasses} value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Internal ID (UID)</label>
              <input required type="text" className={inputClasses} value={formData.uid || ''} onChange={e => setFormData({...formData, uid: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>IP Address</label>
              <input required type="text" className={inputClasses} value={formData.ip || ''} onChange={e => setFormData({...formData, ip: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Zone</label>
              <input required type="text" className={inputClasses} value={formData.zone || ''} onChange={e => setFormData({...formData, zone: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Type</label>
              <input required type="text" className={inputClasses} value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Protocol</label>
              <input required type="text" className={inputClasses} value={formData.protocol || ''} onChange={e => setFormData({...formData, protocol: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Voltage</label>
              <input required type="text" className={inputClasses} value={formData.voltage || ''} onChange={e => setFormData({...formData, voltage: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Operational Energy (kWh)</label>
              <input required type="number" className={inputClasses} value={formData.energy || ''} onChange={e => setFormData({...formData, energy: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Total Energy Consumed (kWh)</label>
              <input required type="number" className={inputClasses} value={formData.totalEnergyConsumed || ''} onChange={e => setFormData({...formData, totalEnergyConsumed: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Reparation Time Left (e.g. 2h 15m, 0h if Online)</label>
              <input required type="text" className={inputClasses} value={formData.reparationTime || ''} onChange={e => setFormData({...formData, reparationTime: e.target.value})} />
            </div>
            <div>
              <label className={labelClasses}>Responsible</label>
              <input required type="text" className={inputClasses} value={formData.responsible || ''} onChange={e => setFormData({...formData, responsible: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Tags (Comma-separated)</label>
              <input type="text" className={inputClasses} value={formData.tags || ''} onChange={e => setFormData({...formData, tags: e.target.value})} />
            </div>
            <div className="md:col-span-2">
               <label className={labelClasses}>Status</label>
               <select className={inputClasses} value={formData.status || 'Online'} onChange={e => setFormData({...formData, status: e.target.value})}>
                 <option value="Online">Online</option>
                 <option value="Offline">Offline</option>
               </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Description</label>
              <textarea className={`${inputClasses} resize-none h-24`} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-5 border-t border-[#232f48]/50">
            <button type="button" onClick={onClose} className="px-5 py-2.5 bg-[#1a243a] hover:bg-[#232f48] text-slate-300 hover:text-white border border-[#232f48] rounded-xl transition-all font-semibold text-sm cursor-pointer">Cancel</button>
            <button type="submit" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-all shadow-[0_0_12px_rgba(37,99,235,0.2)] font-semibold text-sm cursor-pointer">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
