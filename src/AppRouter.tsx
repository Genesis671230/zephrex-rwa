import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router';

import History from './pages/History';

import Home from '@/pages/Home/Home';
import Profile from '@/pages/Profile/Profile';
import Header from '@/components/Header/Header';
import { Toaster } from '@/components/ui/sonner';
// import IssuerDashboard from './pages/Dashboards/IssuerDashboard/IssuerDashboard';
import HomePage from './pages/Home/HomePageBrand';
import Marketplace from './pages/Marketplace/Marketplace';
import ProjectDetails from './components/TokenCard/ProjectDetails';
import QualificationStart from './components/TokenCard/QualificationStart';
import QualificationStartStep from './pages/Onboarding/QualificationStartStep';
import KYCReviewStatus from './pages/Onboarding/KYCReviewStatus';
import InvestorPortfolio from './pages/Portfolios/InvestorPortfolio/InvestorPortfolio';
import IssuerPortfolio from './pages/Portfolios/IssuerPortfolio/IssuerPortfolio';
import EnhancedQualificationStep from './pages/Portfolios/InvestorPortfolio/EnhancedQualificationStep';
import AdvancedInvestorPortfolio from './pages/Portfolios/InvestorPortfolio/AdvancedInvestorPortfolio';
import ProfilePage from './pages/Dashboards/InvestorDashboard/ProfilePage';
import AnalyticsPage from './pages/Dashboards/InvestorDashboard/Analytics';
import CompliancePage from './pages/Dashboards/InvestorDashboard/CompliancePage';
import DocumentsPage from './pages/Dashboards/InvestorDashboard/DocumentPage';
import IssuerDashboard from './pages/Portfolios/IssuerPortfolio/IssuerDashboard';

function AppRouter() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/qualification/start" element={<QualificationStart />} />
          <Route path="/qualification/kyc-enhanced/:tokensymbol" element={<EnhancedQualificationStep />} />
        
        {/* Qualification Flow Routes */}
        <Route path="/qualification/start-step" element={<QualificationStartStep />} />
        <Route path="/qualification/kyc-status" element={<KYCReviewStatus />} />

        <Route path="/investor/portfolio" element={<InvestorPortfolio />} />
        <Route path="/investor/dashboard" element={<AdvancedInvestorPortfolio />} />
        <Route path="/investor/profile" element={<ProfilePage />} />
        <Route path="/investor/analytics" element={<AnalyticsPage />} />
        <Route path="/investor/documents" element={<DocumentsPage />} />
        <Route path="/investor/compliance" element={<CompliancePage />} />

        {/* <Route path="/issuer/portfolio" element={<IssuerPortfolio />} /> */}
        {/* <Route path="/issuer/dashboard" element={<IssuerDashboard />} /> */}
        <Route path="/setting" element={<Profile />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default AppRouter;
