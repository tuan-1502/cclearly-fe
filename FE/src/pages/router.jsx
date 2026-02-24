import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from '@components/Layout';
import AdminLayout from '@components/AdminLayout';
import ProtectedRoute from '@components/ProtectedRoute';

// Pages - Lazy load for code splitting
const HomePage = lazy(() => import('@pages/Home'));
const LoginPage = lazy(() => import('@pages/auth/Login'));
const RegisterPage = lazy(() => import('@pages/auth/Register'));
const ForgotPasswordPage = lazy(() => import('@pages/auth/ForgotPassword'));
const VerifyEmailPage = lazy(() => import('@pages/auth/VerifyEmail'));
const AccessoriesPage = lazy(() => import('@pages/Accessories'));
const LensesPage = lazy(() => import('@pages/Lenses'));
const FramesPage = lazy(() => import('@pages/Frames'));
const NotFoundPage = lazy(() => import('@pages/NotFound'));

// Protected pages
const DashboardPage = lazy(() => import('@pages/Dashboard'));

// Admin pages
const AdminDashboard = lazy(() => import('@pages/Admin/Dashboard'));

/**
 * Application router configuration
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Layout */}
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="frames" element={<FramesPage />} />
        <Route path="lenses" element={<LensesPage />} />
        <Route path="accessories" element={<AccessoriesPage />} />

        {/* Protected routes for customers */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Layout - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        {/* Placeholder routes for future pages */}
        <Route path="users" element={<AdminDashboard />} />
        <Route path="roles" element={<AdminDashboard />} />
        <Route path="config" element={<AdminDashboard />} />
        <Route path="banners" element={<AdminDashboard />} />
        <Route path="logs" element={<AdminDashboard />} />
      </Route>
    </>
  )
);

export default router;
