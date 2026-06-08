import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ searchTerm, onSearch }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative transition-all duration-300 ${isFocused || searchTerm ? 'w-64' : 'w-10 overflow-hidden'}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
      <input
        type="text"
        placeholder={isFocused ? "Search equipment..." : ""}
        className={`control-input w-full pl-9 transition-all duration-300 ${
          isFocused || searchTerm ? 'pr-4 cursor-text' : 'pr-0 bg-transparent cursor-pointer'
        }`}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}