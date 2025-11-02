import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PassengerLayout, { ChatPage } from './layouts/PassengerLayout';
import DriverLayout from './layouts/DriverLayout';
import PassengerHome from './pages/passenger/PassengerHome';
import PassengerMyRides from './pages/passenger/PassengerMyRides';
import BookRide from './pages/passenger/BookRide';
import GuestBookRide from './pages/GuestBookRide'; // Import the new component
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverAvailability from './pages/driver/DriverAvailability';
import DriverActiveRide from './pages/driver/DriverActiveRide';
import DriverPending from './pages/driver/DriverPending';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const RoleProtectedRoute: React.FC<{ children: React.ReactElement; role: UserRole }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user || user.role !== role) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
};

const MainApp: React.FC = () => {
  const { user } = useAuth();

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={!user ? <AuthPage /> : <Navigate to={user.role === 'passenger' ? '/passenger/home' : '/driver/dashboard'} />} />
        <Route path="/register" element={!user ? <AuthPage isRegister /> : <Navigate to={user.role === 'passenger' ? '/passenger/home' : '/driver/dashboard'} />} />
        <Route path="/book" element={<GuestBookRide />} />

        {/* Passenger Routes */}
        <Route path="/passenger" element={
          <RoleProtectedRoute role={UserRole.PASSENGER}>
            <PassengerLayout />
          </RoleProtectedRoute>
        }>
          <Route path="home" element={<PassengerHome />} />
          <Route path="my-rides" element={<PassengerMyRides />} />
          <Route path="book" element={<BookRide />} />
        </Route>

        {/* Driver Routes */}
        <Route path="/driver" element={
          <RoleProtectedRoute role={UserRole.DRIVER}>
            <DriverLayout />
          </RoleProtectedRoute>
        }>
          <Route path="dashboard" element={<DriverDashboard />} />
          <Route path="availability" element={<DriverAvailability />} />
          <Route path="active" element={<DriverActiveRide />} />
          <Route path="pending" element={<DriverPending />} />
          <Route path="completed" element={<div className="p-4">Completed Rides Page</div>} />
        </Route>

        {/* Shared Routes */}
        <Route path="/chat/:rideId" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;