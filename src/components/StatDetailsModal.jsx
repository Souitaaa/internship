import React from 'react';
import { X } from 'lucide-react';
import MachineTable from './MachineTable';

export default function StatDetailsModal({ isOpen, onClose, title, machines }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in transition-all">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col overflow-hidden ring-1 ring-slate-900/5"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title} Equipment</h2>
            <p className="text-small text-slate-500 mt-1">Showing {machines.length} records</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors focus:ring-2 focus:ring-primary-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto bg-slate-100/50 p-6">
          {machines.length > 0 ? (
            <div className="block [&>div]:hidden">
              {/* Force the table to be visible, since previously it had 'hidden md:block' */}
              <div className="!block">
                <MachineTable machines={machines} />
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-500 font-medium">No machines found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
