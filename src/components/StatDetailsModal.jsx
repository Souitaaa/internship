import React from 'react';
import { X } from 'lucide-react';
import MachineTable from './MachineTable';

export default function StatDetailsModal({ isOpen, onClose, title, machines }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
      <div 
        className="bg-[#161f30] border border-[#232f48] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#232f48]/50 flex justify-between items-center bg-[#1a243a]">
          <div>
            <h2 className="text-xl font-bold text-white">{title} Equipment</h2>
            <p className="text-xs text-slate-400 mt-1">Showing {machines.length} records</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-[#232f48] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-[#0b0f19] p-6">
          {machines.length > 0 ? (
            <div className="block [&>div]:hidden">
              {/* Force the table to be visible, since previously it had 'hidden md:block' */}
              <div className="!block">
                <MachineTable machines={machines} />
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-[#161f30] rounded-2xl border border-[#232f48]">
              <p className="text-slate-400 font-medium">No machines found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
