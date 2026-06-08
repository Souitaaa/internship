import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Share, MapPin, Activity, Shield, Link2, Tag, ArrowLeft, Clock, Info, AlertTriangle, Zap, Battery, Edit, Trash2 } from 'lucide-react';
import { useMachines } from '../context/MachineContext';
import { useNotifications } from '../context/NotificationContext';
import EditMachineModal from '../components/EditMachineModal';

export default function MachineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { machines, deleteMachine } = useMachines();
  const { addNotification } = useNotifications();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const machine = useMemo(() => {
    return machines.find((m) => m.id === parseInt(id));
  }, [id, machines]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this machine?")) {
      deleteMachine(machine.id);
      
      addNotification({
        type: 'Delete',
        message: `Machine deleted: ${machine.name} (${machine.uid})`,
        machine: machine,
        timestamp: new Date().toISOString()
      });

      try {
        await fetch(`http://localhost:3000/machines/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'Delete',
            message: `Machine deleted: ${machine.name} (${machine.uid})`,
            machine: machine
          })
        });
      } catch (err) {
        console.error("Backend unreachable for notification", err);
      }
      
      navigate('/');
    }
  };

  if (!machine) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Machine Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 text-primary-600 hover:text-primary-800 transition-colors flex items-center font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="min-w-0 flex-1 pr-4">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 truncate">{machine.name}</h1>
            <div className="flex items-center space-x-4 text-slate-600 font-mono text-sm max-w-full">
               <span className="flex items-center min-w-0"><Shield className="w-4 h-4 mr-1 shrink-0"/> <span className="truncate">{machine.uid}</span></span>
               <span className="flex items-center min-w-0"><Link2 className="w-4 h-4 mr-1 shrink-0"/> <span className="truncate">{machine.ip}</span></span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 shrink-0">
             {machine.energy > 150 && (
               <span className="flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide bg-amber-100 text-amber-700 border border-amber-200">
                 <AlertTriangle className="w-4 h-4 mr-1.5" />
                 High Energy Alert
               </span>
             )}
             <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide
                ${machine.status === 'Online' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                {machine.status}
              </span>
             <button onClick={() => setIsEditModalOpen(true)} title="Edit Machine" className="p-2 bg-white rounded-lg text-primary-600 hover:bg-primary-50 border border-primary-200 transition-colors shadow-sm">
                <Edit className="w-5 h-5" />
             </button>
             <button onClick={handleDelete} title="Delete Machine" className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors shadow-sm">
                <Trash2 className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center border-b border-slate-100 pb-2">
                 <Info className="w-5 h-5 mr-2 text-primary-500"/> Information
              </h3>
              <ul className="space-y-4">
                <li className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center"><MapPin className="w-4 h-4 mr-2"/> Zone</span>
                  <span className="font-medium text-slate-800">{machine.zone}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center"><Activity className="w-4 h-4 mr-2"/> Type</span>
                  <span className="font-medium text-slate-800">{machine.type}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center"><Info className="w-4 h-4 mr-2"/> Responsible</span>
                  <span className="font-medium text-slate-800">{machine.responsible}</span>
                </li>
                <li className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center"><Clock className="w-4 h-4 mr-2"/> Internal ID</span>
                  <span className="font-medium text-slate-800">{machine.id}</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex justify-between items-center border-b border-slate-100 pb-2">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg">
                 {machine.description || 'No description provided.'}
              </p>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center border-b border-slate-100 pb-2">
                 Technical Data
              </h3>
               <div className="grid grid-cols-2 gap-4">
                   <div className="bg-primary-50 rounded-xl p-4 flex flex-col justify-center">
                      <p className="text-primary-600/80 text-sm font-semibold mb-1 uppercase tracking-wide flex items-center"><Zap className="w-4 h-4 mr-1"/> Voltage</p>
                      <p className="text-2xl font-bold text-primary-900">{machine.voltage}</p>
                   </div>
                   {machine.energy !== undefined && (
                     <div className={`rounded-xl p-4 flex flex-col justify-center ${machine.energy > 150 ? 'bg-amber-50' : 'bg-primary-50'}`}>
                        <p className={`text-sm font-semibold mb-1 uppercase tracking-wide flex items-center ${machine.energy > 150 ? 'text-amber-600/80' : 'text-primary-600/80'}`}>
                          <Battery className="w-4 h-4 mr-1"/> Energy
                        </p>
                        <p className={`text-2xl font-bold ${machine.energy > 150 ? 'text-amber-900' : 'text-primary-900'}`}>{machine.energy} kWh</p>
                     </div>
                   )}
                    <div className="bg-slate-50 rounded-xl p-4 flex flex-col justify-center col-span-2">
                      <p className="text-slate-600/80 text-sm font-semibold mb-1 uppercase tracking-wide">Protocol</p>
                      <p className="text-lg font-bold text-slate-900">{machine.protocol}</p>
                   </div>
               </div>
            </section>
            
            <section>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                 <Tag className="w-5 h-5 mr-2 text-green-500"/> Applied Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {machine.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
      <EditMachineModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} machine={machine} />
    </div>
  );
}