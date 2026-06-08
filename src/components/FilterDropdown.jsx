import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterDropdown({ options, selected, onChange, label }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Filter className="w-4 h-4 text-slate-400" />
      </div>
      <select
        className="control-input pl-9 pr-8 appearance-none bg-white cursor-pointer"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}