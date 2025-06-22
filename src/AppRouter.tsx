import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router';

import History from './pages/History';

import Home from '@/pages/Home/Home';
import Profile from '@/pages/Profile/Profile';
import Header from '@/components/Header/Header';
import { Toaster } from '@/components/ui/sonner';
import IssuerDashboard from './pages/Dashboards/IssuerDashboard/IssuerDashboard';
import HomePage from './pages/Home/HomePageBrand';
import Marketplace from './pages/Marketplace/Marketplace';

function AppRouter() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/issuer/dashboard" element={<IssuerDashboard />} />
        <Route path="/setting" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default AppRouter;
