import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './layouts/MainLayout';

const AppContent: React.FC = () => {
  const { state } = useApp();
  console.log('AppContent currentUser:', state.currentUser);
  return state.currentUser ? <MainLayout /> : <LoginPage />;
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
