import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import MachineDetails from './pages/MachineDetails';
import Machines from './pages/Machines';
import Reports from './pages/Reports';
import { MachineProvider } from './context/MachineContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <MachineProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 relative">
            <Navbar />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/machines" element={<Machines />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/machine/:id" element={<MachineDetails />} />
                    <Route path="*" element={
                      <div className="text-center py-20">
                        <h2 className="text-2xl font-bold text-gray-800">Page Not Found</h2>
                      </div>
                    } />
                  </Routes>
                </div>
              </main>
            </div>
          </div>
        </Router>
      </MachineProvider>
    </NotificationProvider>
  );
}

export default App;
