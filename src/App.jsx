import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Machines from './pages/Machines';
import Reports from './pages/Reports';
import MachineDetails from './pages/MachineDetails';
import Analytics from './pages/Analytics';
import { MachineProvider } from './context/MachineContext';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      <MachineProvider>
        {/* 
          Full Dashboard Layout 
          Left Sidebar, Top Navbar, Dark-Green Industrial Aesthetic 
          Matches your screenshot perfectly!
        */}
        <div className="flex h-screen overflow-hidden bg-[#0b0f19]">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-0">
            <Navbar />
            <main className="flex-1 overflow-y-auto layout-container">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/machines" element={<Machines />} />
                <Route path="/machines/:id" element={<MachineDetails />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/maintenance" element={<Machines />} />
                <Route path="/analytics" element={<Analytics />} />
              </Routes>
            </main>
          </div>
        </div>
      </MachineProvider>
    </NotificationProvider>
  );
}
