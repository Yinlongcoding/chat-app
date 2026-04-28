import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './layouts/MainLayout';

const AppIndexRedirect: React.FC = () => {
  const { state } = useApp();
  return <Navigate to={state.currentUser ? '/app/chats' : '/login'} replace />;
};

const LoginRoute: React.FC = () => {
  const { state } = useApp();
  return state.currentUser ? <Navigate to="/app/chats" replace /> : <LoginPage />;
};

const ProtectedAppRoute: React.FC = () => {
  const { state } = useApp();
  return state.currentUser ? <MainLayout /> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppIndexRedirect />} />
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/app/chats" element={<ProtectedAppRoute />} />
      <Route path="/app/chats/:chatId" element={<ProtectedAppRoute />} />
      <Route path="/app/chats/:chatId/info" element={<ProtectedAppRoute />} />
      <Route path="/app/wallet" element={<ProtectedAppRoute />} />
      <Route path="/app/settings" element={<ProtectedAppRoute />} />
      <Route path="/app/contacts/:userId" element={<ProtectedAppRoute />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
