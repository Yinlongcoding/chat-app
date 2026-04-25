import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sidebar } from '../components/Sidebar';
import { ChatArea } from '../components/ChatArea';
import { Menu } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { state, dispatch } = useApp();
  const { theme, sidebarOpen, activeChat } = state;
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  // 同步初始化，避免先渲染桌面版再切移动版导致闪烁
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  // 移动端默认展开抽屉（显示聊天列表）
  const [drawerInitialized, setDrawerInitialized] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setShowMobileDrawer(false);
      }
    };

    // 移动端首次加载时自动展开抽屉
    if (!drawerInitialized && isMobile) {
      setShowMobileDrawer(true);
      setDrawerInitialized(true);
    }

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile, drawerInitialized]);

  // 移动端：选中聊天时自动关闭抽屉，显示聊天区
  useEffect(() => {
    if (activeChat && isMobile) {
      setShowMobileDrawer(false);
    }
  }, [activeChat, isMobile]);

  // 移动端：切换聊天时关闭详情面板
  useEffect(() => {
    setShowChatInfo(false);
  }, [activeChat]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const openMobileDrawer = () => {
    setShowMobileDrawer(true);
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: null });
  };

  // Aurora colors
  const colors = isDark ? {
    bg: '#0D0B14',
    sidebarBg: '#110F1B',
    menuBg: 'rgba(20, 17, 35, 0.8)',
    menuText: '#E8E4F0',
    overlay: 'rgba(0, 0, 0, 0.5)',
  } : {
    bg: '#F8F6FF',
    sidebarBg: '#F3F0FA',
    menuBg: 'rgba(255, 255, 255, 0.85)',
    menuText: '#1E1B2E',
    overlay: 'rgba(0, 0, 0, 0.3)',
  };

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ backgroundColor: colors.bg, color: colors.menuText }}
    >
      {/* Mobile: Floating menu button */}
      {isMobile && activeChat && (
        <button
          onClick={openMobileDrawer}
          className="fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-lg cursor-pointer transition-all duration-200"
          style={{
            background: colors.menuBg,
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(124, 58, 237, 0.15)',
            boxShadow: '0 0 15px rgba(124, 58, 237, 0.1), 0 4px 12px rgba(0,0,0,0.15)',
            color: colors.menuText,
          }}
        >
          <Menu size={20} />
        </button>
      )}

      {/* Mobile: Drawer Overlay */}
      {isMobile && showMobileDrawer && (
        <div
          className="fixed inset-0 z-40 drawer-overlay"
          style={{ backgroundColor: colors.overlay }}
          onClick={() => setShowMobileDrawer(false)}
        />
      )}

      {/* Mobile: Drawer Sidebar (Right side) */}
      {isMobile && (
        <div
          className={`fixed top-0 right-0 h-full z-50 drawer-content transition-transform duration-300 ease-in-out ${
            showMobileDrawer ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{
            width: '100vw',
            backgroundColor: colors.sidebarBg,
          }}
        >
          <Sidebar />
        </div>
      )}

      {/* Desktop: Sidebar */}
      {!isMobile && (
        <div
          className={`
            flex-shrink-0 transition-all duration-200 ease-in-out
            ${sidebarOpen ? 'w-80 lg:w-96' : 'w-0'}
            h-full overflow-hidden
            ${activeChat ? 'hidden lg:flex' : 'flex'}
          `}
          style={{ minWidth: sidebarOpen ? undefined : 0 }}
        >
          <Sidebar />
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 h-full overflow-hidden flex-col">
        <ChatArea
          onShowInfo={isMobile ? setShowChatInfo : undefined}
        />
      </div>
    </div>
  );
};
