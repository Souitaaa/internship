import React, { useState, useMemo } from 'react';
import { useMachines } from '../context/MachineContext';
import { BarChart2, Calendar, Zap, Activity, Info, ShieldAlert } from 'lucide-react';

export default function Analytics() {
  const { machines } = useMachines();
  const [selectedMachineId, setSelectedMachineId] = useState('all'); // 'all' or specific ID
  const [interval, setInterval] = useState('7d'); // '24h', '7d', '30d'
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Generate realistic, consistent energy data points depending on selections
  const chartData = useMemo(() => {
    // Basic machine multiplier based on size/energy
    let baseEnergy = 240; 
    let fluctuationSeed = 0.5;

    if (selectedMachineId !== 'all') {
      const machine = machines.find(m => m.id === parseInt(selectedMachineId));
      if (machine) {
        baseEnergy = machine.energy;
        fluctuationSeed = machine.type === 'Pump' ? 0.3 : machine.type === 'Compressor' ? 0.2 : 0.6;
      }
    } else {
      // Whole system: combine energy of all registered machines
      baseEnergy = machines.reduce((acc, m) => acc + m.energy, 0);
    }

    // Interval counts
    let pointsCount = 7;
    let labelPrefix = "Day ";
    let timeLabels = [];

    if (interval === '24h') {
      pointsCount = 12; // Every 2 hours
      labelPrefix = ":00";
      const currentHour = new Date().getHours();
      for (let i = pointsCount - 1; i >= 0; i--) {
        let hr = (currentHour - i * 2 + 24) % 24;
        timeLabels.push(`${hr}${labelPrefix}`);
      }
    } else if (interval === '7d') {
      pointsCount = 7;
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date().getDay();
      for (let i = pointsCount - 1; i >= 0; i--) {
        timeLabels.push(days[(today - i + 7) % 7]);
      }
    } else if (interval === '30d') {
      pointsCount = 15; // Every 2 days
      labelPrefix = "Jul ";
      for (let i = pointsCount - 1; i >= 0; i--) {
        timeLabels.push(`${labelPrefix}${10 - i * 2}`);
      }
    }

    // Build the coordinates array
    const points = [];
    let cumulativeSum = 0;

    for (let i = 0; i < pointsCount; i++) {
      // Create a deterministic pseudo-random curve centered around base energy
      const sinWave = Math.sin(i * 1.2) * 15;
      const cosWave = Math.cos(i * 0.8) * 10;
      const randomFluctuation = (Math.sin(i * 3) + 1.2) * baseEnergy * fluctuationSeed * 0.15;
      
      const value = Math.max(10, Math.round((baseEnergy / pointsCount) + sinWave + cosWave + randomFluctuation));
      cumulativeSum += value;

      points.push({
        label: timeLabels[i] || `${labelPrefix}${i + 1}`,
        value: value
      });
    }

    return {
      points,
      cumulativeSum,
      average: Math.round(cumulativeSum / pointsCount)
    };
  }, [selectedMachineId, interval, machines]);

  // Build SVG data path coordinates based on viewport of 500x150
  const maxChartValue = useMemo(() => {
    const maxVal = Math.max(...chartData.points.map(p => p.value));
    return maxVal * 1.2; // Add 20% padding to top
  }, [chartData]);

  const svgCoordinates = useMemo(() => {
    const width = 600;
    const height = 200;
    const count = chartData.points.length;
    
    return chartData.points.map((p, idx) => {
      const x = (idx / (count - 1)) * (width - 60) + 40;
      const y = height - 40 - (p.value / maxChartValue) * (height - 60);
      return { x, y, value: p.value, label: p.label };
    });
  }, [chartData, maxChartValue]);

  // Generate SVG path string
  const pathD = useMemo(() => {
    if (svgCoordinates.length === 0) return '';
    return svgCoordinates.reduce((acc, coord, idx) => {
      return idx === 0 ? `M ${coord.x} ${coord.y}` : `${acc} L ${coord.x} ${coord.y}`;
    }, '');
  }, [svgCoordinates]);

  // Generate SVG closed gradient area path string
  const areaD = useMemo(() => {
    if (svgCoordinates.length === 0) return '';
    const first = svgCoordinates[0];
    const last = svgCoordinates[svgCoordinates.length - 1];
    return `${pathD} L ${last.x} 160 L ${first.x} 160 Z`;
  }, [svgCoordinates, pathD]);

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">System Analytics</h1>
        <p className="text-slate-400 mt-2 text-sm font-semibold">Track power utilization and operational efficiency of individual machines or the total factory load.</p>
      </div>

      {/* Control Strip Row */}
      <section className="bg-[#161f30] p-4 rounded-2xl border border-[#232f48] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Machine Selector */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">Target Asset</span>
            <select
              value={selectedMachineId}
              onChange={(e) => setSelectedMachineId(e.target.value)}
              className="h-10 px-4 bg-[#1a243a] border border-[#232f48] rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] cursor-pointer min-w-[180px]"
            >
              <option value="all">Whole System (All Equipment)</option>
              {machines.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.uid})</option>
              ))}
            </select>
          </div>

          {/* Time Interval Selector */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 ml-1">Time Interval</span>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="h-10 px-4 bg-[#1a243a] border border-[#232f48] rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#10b981] cursor-pointer min-w-[150px]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>

        </div>

        {/* Aggregate Stats Cards */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Cumulative Load</p>
            <p className="text-2xl font-black text-white mt-1">{chartData.cumulativeSum} <span className="text-xs text-slate-500 font-semibold">kWh</span></p>
          </div>
          <div className="w-px h-10 bg-[#232f48]"></div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Avg Utilization</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{chartData.average} <span className="text-xs text-slate-500 font-semibold">kWh</span></p>
          </div>
        </div>
      </section>

      {/* Main Interactive Chart Canvas */}
      <section className="bg-[#161f30] border border-[#232f48] p-6 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Chart Header details */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-[#10b981] animate-pulse" />
            <span>Energy Spent Curve (kWh)</span>
          </h3>
          <div className="text-xs text-slate-500 font-semibold">
            {selectedMachineId === 'all' ? 'Whole System Combined Load' : 'Selected Equipment Metrics'}
          </div>
        </div>

        {/* Responsive Chart Area */}
        <div className="relative h-64 w-full">
          <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
            <defs>
              <linearGradient id="neon-glow-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.18"/>
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            <line x1="40" y1="40" x2="580" y2="40" stroke="#232f48" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="40" y1="100" x2="580" y2="100" stroke="#232f48" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="40" y1="160" x2="580" y2="160" stroke="#232f48" strokeWidth="0.8" />

            {/* Area Path */}
            <path d={areaD} fill="url(#neon-glow-area)" />

            {/* Line Path */}
            <path d={pathD} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

            {/* Hover Vertical Guide Line */}
            {hoveredIndex !== null && svgCoordinates[hoveredIndex] && (
              <line 
                x1={svgCoordinates[hoveredIndex].x} 
                y1="40" 
                x2={svgCoordinates[hoveredIndex].x} 
                y2="160" 
                stroke="#10b981" 
                strokeWidth="1" 
                strokeDasharray="2 2" 
              />
            )}

            {/* Grid Coordinates / Interactive Anchor Dots */}
            {svgCoordinates.map((coord, idx) => (
              <g key={idx}>
                {/* Transparent wider target for easy hover hover */}
                <circle 
                  cx={coord.x} 
                  cy={coord.y} 
                  r="12" 
                  fill="transparent" 
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                
                {/* Glowing Core anchor */}
                <circle 
                  cx={coord.x} 
                  cy={coord.y} 
                  r={hoveredIndex === idx ? "5.5" : "3.5"} 
                  fill={hoveredIndex === idx ? "#ffffff" : "#10b981"} 
                  stroke="#10b981" 
                  strokeWidth="2"
                  className="transition-all duration-200 pointer-events-none"
                />

                {/* X Axis Labels */}
                <text 
                  x={coord.x} 
                  y="180" 
                  textAnchor="middle" 
                  fill="#64748b" 
                  fontSize="9" 
                  fontWeight="bold"
                >
                  {coord.label}
                </text>
              </g>
            ))}
          </svg>

          {/* Interactive Absolute Tooltip Bubble */}
          {hoveredIndex !== null && svgCoordinates[hoveredIndex] && (
            <div 
              className="absolute bg-[#1a243a] border border-[#232f48] rounded-xl px-3 py-2 shadow-2xl z-20 pointer-events-none text-left space-y-0.5 animate-slide-in"
              style={{
                left: `${(svgCoordinates[hoveredIndex].x / 600) * 100}%`,
                top: `${(svgCoordinates[hoveredIndex].y / 200) * 100 - 25}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <p className="text-[8px] font-black text-slate-500 uppercase tracking-wider">{svgCoordinates[hoveredIndex].label}</p>
              <p className="text-xs font-black text-white">{svgCoordinates[hoveredIndex].value} <span className="text-[10px] font-bold text-emerald-400">kWh</span></p>
            </div>
          )}
        </div>
      </section>

      {/* Helpful Telemetry Alert Banner */}
      <section className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-3">
        <Info className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-200">Continuous Logging Active</h4>
          <p className="text-[11px] leading-relaxed text-slate-400 font-semibold">
            Telemetry metrics are registered on each machine. If a machine exceeds load parameters (such as energy surpassing 150 kWh), a notification will trigger immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
