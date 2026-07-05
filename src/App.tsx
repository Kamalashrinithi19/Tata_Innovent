import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RoleProvider } from './context/RoleContext';
import ShellBar from './components/ShellBar';
import Launchpad from './pages/Launchpad';
import VesselList from './pages/vessels/VesselList';
import VesselDetail from './pages/vessels/VesselDetail';
import Optimizer from './pages/optimizer/Optimizer';
import RailList from './pages/rail/RailList';
import RailDetail from './pages/rail/RailDetail';
import Stockyard from './pages/stockyard/Stockyard';
import Dust from './pages/dust/Dust';
import Batch from './pages/batch/Batch';
import Reports from './pages/reports/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <RoleProvider>
        <div className="min-h-screen bg-app-bg flex flex-col">
          <ShellBar />
          <main className="flex-1 mt-12 overflow-auto">
            <Routes>
              <Route path="/"            element={<Launchpad />} />
              <Route path="/vessels"     element={<VesselList />} />
              <Route path="/vessels/:id" element={<VesselDetail />} />
              <Route path="/optimizer"   element={<Optimizer />} />
              <Route path="/rail"        element={<RailList />} />
              <Route path="/rail/:id"    element={<RailDetail />} />
              <Route path="/stockyard"   element={<Stockyard />} />
              <Route path="/dust"        element={<Dust />} />
              <Route path="/batch"       element={<Batch />} />
              <Route path="/reports"     element={<Reports />} />
              <Route path="*"            element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </RoleProvider>
    </BrowserRouter>
  );
}
