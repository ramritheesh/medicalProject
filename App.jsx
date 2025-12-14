import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MedicationProvider } from './context/MedicationContext';
import Layout from './components/Layout';

import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import Shop from './pages/Shop';
import Reminders from './pages/Reminders';

function App() {
  return (
    <MedicationProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/reminders" element={<Reminders />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </MedicationProvider>
  );
}

export default App;
