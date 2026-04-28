import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MobilePageStack } from '../components/MobilePageStack';
import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';
import { WalletPage } from '../pages/WalletPage';
import { ContactDetailPage } from '../pages/ContactDetailPage';
import { SettingsPage } from '../pages/SettingsPage';
import { Menu } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { state, dispatch } = useApp();
  const { theme, sidebarOpen, activeChat } = state;
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

  const isDark = theme === 'dark';
  const routeChatId = getRouteChatId(location.pathname);
  const isWalletRoute = location.pathname === '/app/wallet';
  const isSettingsRoute = location.pathname === '/app/settings';
  const isContactRoute = /^\/app\/contacts\/[^/]+$/.test(location.pathname);
  const isRootChatsRoute = location.pathname === '/app/chats';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isWalletRoute || isSettingsRoute || isContactRoute) {
      return;
    }

    const nextActiveChat = isRootChatsRoute ? null : routeChatId;

    if (activeChat !== nextActiveChat) {
      dispatch({ type: 'SET_ACTIVE_CHAT', payload: nextActiveChat });
    }
  }, [activeChat, dispatch, isContactRoute, isRootChatsRoute, isSettingsRoute, isWalletRoute, routeChatId]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const handleMobileBack = () => {
    navigate('/app/chats');
  };

  const colors = isDark
    ? {
        bg: '#0D0B14',
        sidebarBg: '#110F1B',
        menuBg: 'rgba(20, 17, 35, 0.8)',
        menuText: '#E8E4F0',
      }
    : {
        bg: '#F8F6FF',
        sidebarBg: '#F3F0FA',
        menuBg: 'rgba(255, 255, 255, 0.85)',
        menuText: '#1E1B2E',
      };

  const detailContent = isWalletRoute ? <WalletPage /> : isSettingsRoute ? <SettingsPage /> : isContactRoute ? <ContactDetailPage /> : <ChatArea isMobile={isMobile} onMobileBack={handleMobileBack} />;
  const mobileContentVisible = !isRootChatsRoute;

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ backgroundColor: colors.bg, color: colors.menuText }}>
      {isMobile ? (
        <MobilePageStack
          activeIndex={mobileContentVisible ? 1 : 0}
          pages={[
            {
              key: 'chat-list',
              backgroundColor: colors.sidebarBg,
              content: <Sidebar isMobile />,
            },
            {
              key: isWalletRoute ? 'wallet-page' : isSettingsRoute ? 'settings-page' : isContactRoute ? 'contact-page' : 'chat-window',
              backgroundColor: colors.bg,
              content: detailContent,
            },
          ]}
        />
      ) : (
        <>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
            className="fixed left-4 top-4 z-50 rounded-xl border p-2.5 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: colors.menuBg,
              backdropFilter: 'blur(16px)',
              borderColor: 'rgba(124, 58, 237, 0.15)',
              boxShadow: '0 0 15px rgba(124, 58, 237, 0.1), 0 4px 12px rgba(0,0,0,0.15)',
              color: colors.menuText,
            }}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>

          <div
            className={`
              flex h-full flex-shrink-0 overflow-hidden transition-all duration-200 ease-in-out
              ${sidebarOpen ? 'w-80 lg:w-96' : 'w-0'}
            `}
            style={{ minWidth: sidebarOpen ? undefined : 0 }}
          >
            <Sidebar isMobile={false} />
          </div>

          <div className="flex-1 h-full overflow-hidden flex-col">
            {detailContent}
          </div>
        </>
      )}
    </div>
  );
};

function getRouteChatId(pathname: string) {
  const match = pathname.match(/^\/app\/chats\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
