import { Routes, Route, Navigate } from 'react-router-dom';
import { Home, ReceiptText, Boxes, Store, WalletCards, Bell } from 'lucide-react';
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import PurchaseRecordsPage from './pages/PurchaseRecordsPage';
import StockManagementPage from './pages/StockManagementPage';
import RetailShopsPage from './pages/RetailShopsPage';
import CreditTrackingPage from './pages/CreditTrackingPage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';

export const navigation = [
  { section: 'Overview', items: [{ label: 'Dashboard', path: '/dashboard', icon: Home }] },
  { section: 'Operations', items: [{ label: 'Purchase Records', path: '/purchases', icon: ReceiptText }, { label: 'Stock Management', path: '/stock', icon: Boxes }] },
  { section: 'Customers', items: [{ label: 'Retail Shops', path: '/shops', icon: Store }, { label: 'Credit Tracking', path: '/credit', icon: WalletCards, badge: 3 }] },
  { section: 'System', items: [{ label: 'Notifications', path: '/notifications', icon: Bell, badge: 5 }] },
];

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell navigation={navigation} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/purchases" element={<PurchaseRecordsPage />} />
          <Route path="/stock" element={<StockManagementPage />} />
          <Route path="/shops" element={<RetailShopsPage />} />
          <Route path="/credit" element={<CreditTrackingPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
