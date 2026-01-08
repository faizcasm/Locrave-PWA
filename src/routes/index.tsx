import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { RoleBasedRoute } from './RoleBasedRoute';
import { UserRole } from '../types/global.types';
import { Loader } from '../components/common/Loader/Loader';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';

// Lazy load pages
const LoginPage = lazy(() => import('../pages/Auth/LoginPage'));
const FeedPage = lazy(() => import('../pages/Feed/FeedPage'));
const ServicesPage = lazy(() => import('../pages/Services/ServicesPage'));
const MarketplacePage = lazy(() => import('../pages/Marketplace/MarketplacePage'));
const EmergencyPage = lazy(() => import('../pages/Emergency/EmergencyPage'));
const ChatPage = lazy(() => import('../pages/Chat/ChatPage'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/Settings/SettingsPage'));
const ModerationPage = lazy(() => import('../pages/Moderation/ModerationPage'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage'));

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader fullScreen text="Loading..." />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Private Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/feed" replace />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:roomId" element={<ChatPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/settings" element={<SettingsPage />} />

              {/* Role-based Routes */}
              <Route
                element={
                  <RoleBasedRoute
                    allowedRoles={[UserRole.MODERATOR, UserRole.ADMIN]}
                  />
                }
              >
                <Route path="/moderation" element={<ModerationPage />} />
              </Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;
