import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage.jsx';
import ProtectedRoute from './components/Common/ProtectedRoute.jsx';
import POSPage from './pages/POSPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/menu"
        element={
          <ProtectedRoute>
            <POSPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/menu" replace />} />
    </Routes>
  );
}
