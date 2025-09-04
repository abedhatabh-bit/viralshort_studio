import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import AnalyticsDashboard from './pages/analytics-dashboard';
import TemplateLibrary from './pages/template-library';
import LoginPage from './pages/login';
import Dashboard from './pages/dashboard';
import EnhancedDashboard from './pages/dashboard/EnhancedDashboard';
import VideoCreator from './pages/video-creator';
import EnhancedVideoCreator from './pages/video-creator/EnhancedVideoCreator';
import FixedVideoCreator from './pages/video-creator/FixedVideoCreator';
import DeepDebuggedCreator from './pages/video-creator/DeepDebuggedCreator';
import FeaturesShowcase from './pages/FeaturesShowcase';
import FacelessStudio from './pages/FacelessStudio';
import Register from './pages/register';
import BatchCreator from './pages/batch-creator';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<EnhancedDashboard />} />
        <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />
        <Route path="/template-library" element={<TemplateLibrary />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard-enhanced" element={<EnhancedDashboard />} />
        <Route path="/video-creator" element={<DeepDebuggedCreator />} />
        <Route path="/video-creator-enhanced" element={<EnhancedVideoCreator />} />
        <Route path="/video-creator-original" element={<VideoCreator />} />
        <Route path="/features" element={<FeaturesShowcase />} />
        <Route path="/faceless-studio" element={<FacelessStudio />} />
        <Route path="/batch-creator" element={<BatchCreator />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
