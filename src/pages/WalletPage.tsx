import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletView } from '@/components/WalletView';

export const WalletPage: React.FC = () => {
  const navigate = useNavigate();

  return <WalletView onBack={() => navigate(-1)} />;
};
