import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { Shell } from './layouts/Shell';
import { Landing } from './pages/Landing';
import { EmployeeHome } from './pages/employee/EmployeeHome';
import { ActiveListener } from './pages/employee/ActiveListener';
import { SeneschalIncubator } from './pages/employee/SeneschalIncubator';
import { ForgivenessWeaver } from './pages/manager/ForgivenessWeaver';
import { OpportunityForge } from './pages/manager/OpportunityForge';
import { StrengthsPortrait } from './pages/manager/StrengthsPortrait';
import { ServiceVanguard } from './pages/manager/ServiceVanguard';

export default function App() {
  const role = useAppStore(s => s.role);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Landing />} />

          <Route path="employee" element={role === 'employee' ? <Outlet /> : <Navigate to="/" replace />}>
            <Route path="home" element={<EmployeeHome />} />
            <Route path="listener" element={<ActiveListener />} />
            <Route path="incubator" element={<SeneschalIncubator />} />
          </Route>

          <Route path="manager" element={role === 'manager' ? <Outlet /> : <Navigate to="/" replace />}>
            <Route path="strengths" element={<StrengthsPortrait />} />
            <Route path="forgiveness" element={<ForgivenessWeaver />} />
            <Route path="forge" element={<OpportunityForge />} />
            <Route path="service" element={<ServiceVanguard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
