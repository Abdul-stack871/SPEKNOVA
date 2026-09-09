import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SplashPage } from './pages/SplashPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MainLayout } from './layouts/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { LiveSessionPage } from './pages/LiveSessionPage';
import { ReportPage } from './pages/ReportPage';
import { MultiplayerPage } from './pages/MultiplayerPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/Placeholders';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Splash */}
          <Route path="/" element={<SplashPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/practice" element={<LiveSessionPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/reports" element={<ReportPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/multiplayer" element={<MultiplayerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
