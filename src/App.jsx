import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/MainLayout'
import { AuthLayout } from './components/layout/AuthLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute, AdminRoute, SalesRoute, OperationsRoute, ManagerRoute } from './components/ProtectedRoute'

// Customer Pages
import HomePage from './pages/customer/HomePage'
import ProductListPage from './pages/customer/ProductListPage'
import ProductDetailPage from './pages/customer/ProductDetailPage'
import PrescriptionFormPage from './pages/customer/PrescriptionFormPage'
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrderHistoryPage from './pages/customer/OrderHistoryPage'
import ProfilePage from './pages/customer/ProfilePage'
import WishlistPage from './pages/customer/WishlistPage'
import ReturnPage from './pages/customer/ReturnPage'
import NotificationPage from './pages/customer/NotificationPage'
import BestSellerPage from './pages/customer/BestSellerPage'
import StoresPage from './pages/customer/StoresPage'
import BlogPage from './pages/customer/BlogPage'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Admin/System Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'
import AdminReportsPage from './pages/admin/AdminReportsPage'
import RolePermissionPage from './pages/admin/RolePermissionPage'
import AdminPolicyPage from './pages/admin/PolicyPage'
import IntegrationPage from './pages/admin/IntegrationPage'
import SystemLogsPage from './pages/admin/SystemLogsPage'
import BannerPage from './pages/admin/BannerPage'

// Sales Pages
import SalesDashboardPage from './pages/sales/SalesDashboardPage'
import SalesOrdersPage from './pages/sales/SalesOrdersPage'
import SalesReturnsPage from './pages/sales/SalesReturnsPage'
import SalesCustomersPage from './pages/sales/SalesCustomersPage'

// Manager Pages
import ManagerDashboardPage from './pages/manager/ManagerDashboardPage'
import ManagerOrdersPage from './pages/manager/ManagerOrdersPage'
import ManagerProductsPage from './pages/manager/ManagerProductsPage'
import LensManagementPage from './pages/manager/LensManagementPage'
import ManagerPolicyPage from './pages/admin/PolicyPage'
import PromotionPage from './pages/manager/PromotionPage'
import StaffPage from './pages/manager/StaffPage'
import ManagerReportsPage from './pages/manager/ManagerReportsPage'
import ManagerInventoryPage from './pages/manager/InventoryPage'

// Operations Pages
import OperationsDashboardPage from './pages/operations/OperationsDashboardPage'
import OperationsBoardPage from './pages/operations/OperationsBoardPage'
import OperationsOrdersPage from './pages/operations/OperationsOrdersPage'
import OperationsLensLabPage from './pages/operations/OperationsLensLabPage'
import OperationsShippingPage from './pages/operations/OperationsShippingPage'
import PreorderReceivePage from './pages/operations/PreorderReceivePage'
import InventoryPage from './pages/operations/InventoryPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/prescription-form" element={<PrescriptionFormPage />} />
          <Route path="/frames" element={<ProductListPage type="frame" />} />
          <Route path="/lenses" element={<ProductListPage type="lens" />} />
          <Route path="/best-sellers" element={<BestSellerPage />} />
          <Route path="/accessories" element={<ProductListPage type="accessory" />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/faq" element={<BlogPage />} />
          <Route path="/contact" element={<BlogPage />} />
          <Route path="/about" element={<BlogPage />} />
          <Route path="/careers" element={<BlogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrderHistoryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/returns" element={<ReturnPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* System Admin Routes - Full Access */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/promotions" element={<PromotionPage />} />
          <Route path="/admin/staff" element={<StaffPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/logs" element={<SystemLogsPage />} />
          <Route path="/admin/banners" element={<BannerPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/roles" element={<RolePermissionPage />} />
          <Route path="/admin/policies" element={<AdminPolicyPage />} />
          <Route path="/admin/integrations" element={<IntegrationPage />} />
        </Route>

        {/* Manager Routes */}
        <Route
          element={
            <ManagerRoute>
              <AdminLayout />
            </ManagerRoute>
          }
        >
          <Route path="/manager" element={<ManagerDashboardPage />} />
          <Route path="/manager/orders" element={<ManagerOrdersPage />} />
          <Route path="/manager/products" element={<ManagerProductsPage />} />
          <Route path="/manager/inventory" element={<ManagerInventoryPage />} />
          <Route path="/manager/lenses" element={<LensManagementPage />} />
          <Route path="/manager/policies" element={<ManagerPolicyPage />} />
          <Route path="/manager/promotions" element={<PromotionPage />} />
          <Route path="/manager/staff" element={<StaffPage />} />
          <Route path="/manager/reports" element={<ManagerReportsPage />} />
        </Route>

        {/* Sales Routes */}
        <Route
          element={
            <SalesRoute>
              <AdminLayout />
            </SalesRoute>
          }
        >
          <Route path="/sales" element={<SalesDashboardPage />} />
          <Route path="/sales/orders" element={<SalesOrdersPage />} />
          <Route path="/sales/returns" element={<SalesReturnsPage />} />
          <Route path="/sales/customers" element={<SalesCustomersPage />} />
        </Route>

        {/* Operations Routes */}
        <Route
          element={
            <OperationsRoute>
              <AdminLayout />
            </OperationsRoute>
          }
        >
          <Route path="/operations" element={<OperationsDashboardPage />} />
          <Route path="/operations/board" element={<OperationsBoardPage />} />
          <Route path="/operations/orders" element={<OperationsOrdersPage />} />
          <Route path="/operations/inventory" element={<InventoryPage />} />
          <Route path="/operations/lens-lab" element={<OperationsLensLabPage />} />
          <Route path="/operations/shipping" element={<OperationsShippingPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
