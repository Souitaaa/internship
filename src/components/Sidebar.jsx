import React from 'react';
import { Home, Server, FileText } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const linkClasses = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
      isActive
        ? 'bg-primary-50 text-primary-700 font-medium'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-[calc(100vh-73px)] sticky top-[73px] p-4 flex flex-col space-y-2">
      <NavLink to="/" className={linkClasses}>
        <Home className="w-5 h-5" />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/machines" className={linkClasses}>
        <Server className="w-5 h-5" />
        <span>Machines</span>
      </NavLink>
      <NavLink to="/reports" className={linkClasses}>
        <FileText className="w-5 h-5" />
        <span>Reports</span>
      </NavLink>
    </aside>
  );
}