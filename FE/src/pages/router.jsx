import { lazy } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from '@components/Layout';
import ProtectedRoute from '@components/ProtectedRoute';

// Pages - Lazy load for code splitting
const HomePage = lazy(() => import('@pages/Home'));
const LoginPage = lazy(() => import('@pages/auth/Login'));
const RegisterPage = lazy(() => import('@pages/auth/Register'));
const AccessoriesPage = lazy(() => import('@pages/Accessories'));
const NotFoundPage = lazy(() => import('@pages/NotFound'));

// Protected pages
const DashboardPage = lazy(() => import('@pages/Dashboard'));

/**
 * Application router configuration
 */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* Public routes */}
      <Route index element={<HomePage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="accessories" element={<AccessoriesPage />} />

      {/* Protected routes */}
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
  )
);

export default router;
