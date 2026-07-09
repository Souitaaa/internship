import React, { useState } from 'react';
import { Home, Server, FileText, Wrench, BarChart2, Factory } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';

export default function Sidebar() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  const linkClasses = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 border border-transparent ${
      isActive
        ? 'bg-[#10b981]/15 text-[#10b981] font-bold'
        : 'text-slate-400 hover:bg-[#161f30] hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-[#121b2d] border-r border-[#1e293b] h-screen p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-8">
        {/* Brand Logo Header */}
        <div className="flex items-center space-x-3 pb-3 border-b border-[#232f48]/50">
          <div className="p-2 bg-[#10b981]/10 rounded-xl border border-[#10b981]/20 shadow-[0_0_10px_rgba(16,185,129,0.08)]">
            <Factory className="w-5 h-5 text-[#10b981]" />
          </div>
          <Link to="/" className="text-xl font-extrabold text-white tracking-tight hover:opacity-90">
            MachinesInfos
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-1.5">
          <NavLink to="/" className={linkClasses}>
            <div className="flex items-center space-x-3">
              <Home className="w-4.5 h-4.5" />
              <span className="text-sm">Dashboard</span>
            </div>
          </NavLink>
          
          <NavLink to="/machines" className={linkClasses}>
            <div className="flex items-center space-x-3">
              <Server className="w-4.5 h-4.5" />
              <span className="text-sm">Machines</span>
            </div>
          </NavLink>
          
          <NavLink to="/reports" className={linkClasses}>
            <div className="flex items-center space-x-3">
              <FileText className="w-4.5 h-4.5" />
              <span className="text-sm">Reports</span>
            </div>
          </NavLink>

          <NavLink to="/maintenance" className={linkClasses}>
            <div className="flex items-center space-x-3">
              <Wrench className="w-4.5 h-4.5" />
              <span className="text-sm">Maintenance</span>
            </div>
          </NavLink>

          <NavLink to="/analytics" className={linkClasses}>
            <div className="flex items-center space-x-3">
              <BarChart2 className="w-4.5 h-4.5" />
              <span className="text-sm">Analytics</span>
            </div>
          </NavLink>
        </nav>
      </div>

      {/* Clean Bottom Space (Footer Removed) */}
      <div className="pt-4"></div>
    </aside>
  );
}