import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Zap, Server, MapPin, Battery, AlertTriangle } from 'lucide-react';

export default function MachineTable({ machines }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hidden md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Server className="w-4 h-4" />
                  <span>Machine</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>IP Address</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                 <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Zone</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                 <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Voltage</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                 <div className="flex items-center space-x-2">
                  <Battery className="w-4 h-4" />
                  <span>Energy</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                 <div className="flex items-center space-x-2">
                  <span>Responsible</span>
                </div>
              </th>
               <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {machines.map((machine) => (
              <tr 
                key={machine.id} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => navigate(`/machine/${machine.id}`)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4 min-w-0">
                      <div className="text-sm font-medium text-slate-900 group-hover:text-primary-700 max-w-xs xl:max-w-sm truncate">
                        {machine.name}
                      </div>
                      <div className="text-sm text-slate-500 group-hover:text-primary-500 truncate">
                        ID: {machine.uid}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 font-mono">{machine.ip}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{machine.zone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {machine.voltage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {machine.energy !== undefined && (
                    <div className="flex items-center space-x-2">
                       <span className={`text-sm font-semibold ${machine.energy > 150 ? 'text-amber-600' : 'text-gray-700'}`}>
                         {machine.energy} kWh
                       </span>
                       {machine.energy > 150 && (
                         <span title="High Energy Alert">
                           <AlertTriangle className="w-4 h-4 text-amber-500" />
                         </span>
                       )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{machine.responsible}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    machine.status === 'Online' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {machine.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}