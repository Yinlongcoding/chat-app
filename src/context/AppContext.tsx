import React, { useCallback } from 'react';
import type { AppAction, AppState, User } from '@/types';
import { useAppBootstrap } from '@/hooks/useAppBootstrap';
import { useChatStore } from '@/stores/chatStore';
import { useUiStore } from '@/stores/uiStore';
import { useUserStore } from '@/stores/userStore';
import { useWalletStore } from '@/stores/walletStore';

interface AppContextShape {
  state: AppState;
  dispatch: (action: AppAction) => void;
  users: User[];
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bootstrap = useAppBootstrap();

  if (!bootstrap.isReady) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0D0B14] text-[#E8E4F0]">
        <div className="rounded-3xl border border-[rgba(124,58,237,0.15)] bg-[rgba(20,17,35,0.72)] px-6 py-5 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
          <p className="text-sm font-medium tracking-[0.2em] text-[#8B83A0]">LOADING TELECHAT</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export const useApp = (): AppContextShape => {
  const currentUser = useUserStore(state => state.currentUser);
  const users = useUserStore(state => state.users);
  const chats = useChatStore(state => state.chats);
  const messages = useChatStore(state => state.messages);
  const activeChat = useChatStore(state => state.activeChat);
  const searchQuery = useChatStore(state => state.searchQuery);
  const activeFilter = useChatStore(state => state.activeFilter);
  const wallet = useWalletStore(state => state.wallet);
  const theme = useUiStore(state => state.theme);
  const sidebarOpen = useUiStore(state => state.sidebarOpen);

  const setCurrentUser = useUserStore(state => state.setCurrentUser);
  const updateCurrentUser = useUserStore(state => state.updateCurrentUser);
  const logout = useUserStore(state => state.logout);
  const setActiveChat = useChatStore(state => state.setActiveChat);
  const sendMessage = useChatStore(state => state.sendMessage);
  const setSearch = useChatStore(state => state.setSearch);
  const setFilter = useChatStore(state => state.setFilter);
  const pinChat = useChatStore(state => state.pinChat);
  const muteChat = useChatStore(state => state.muteChat);
  const markRead = useChatStore(state => state.markRead);
  const createGroup = useChatStore(state => state.createGroup);
  const createChannel = useChatStore(state => state.createChannel);
  const deposit = useWalletStore(state => state.deposit);
  const withdraw = useWalletStore(state => state.withdraw);
  const toggleTheme = useUiStore(state => state.toggleTheme);
  const toggleSidebar = useUiStore(state => state.toggleSidebar);

  const state: AppState = {
    currentUser,
    users,
    chats,
    messages,
    wallet,
    activeChat,
    theme,
    sidebarOpen,
    searchQuery,
    activeFilter,
  };

  const dispatch = useCallback((action: AppAction) => {
    switch (action.type) {
      case 'SET_USER':
        setCurrentUser(action.payload);
        return;
      case 'UPDATE_USER':
        updateCurrentUser(action.payload);
        return;
      case 'LOGOUT':
        logout();
        return;
      case 'SET_ACTIVE_CHAT':
        setActiveChat(action.payload);
        return;
      case 'SEND_MESSAGE':
        if (!currentUser) return;
        sendMessage({ ...action.payload, senderId: currentUser.id });
        return;
      case 'TOGGLE_THEME':
        toggleTheme();
        return;
      case 'TOGGLE_SIDEBAR':
        toggleSidebar();
        return;
      case 'SET_SEARCH':
        setSearch(action.payload);
        return;
      case 'SET_FILTER':
        setFilter(action.payload);
        return;
      case 'PIN_CHAT':
        pinChat(action.payload);
        return;
      case 'MUTE_CHAT':
        muteChat(action.payload);
        return;
      case 'MARK_READ':
        markRead(action.payload);
        return;
      case 'CREATE_GROUP':
        createGroup(action.payload);
        return;
      case 'CREATE_CHANNEL':
        createChannel(action.payload);
        return;
      case 'WALLET_DEPOSIT':
        deposit(action.payload);
        return;
      case 'WALLET_WITHDRAW':
        withdraw(action.payload);
        return;
      default:
        return;
    }
  }, [createChannel, createGroup, currentUser, deposit, logout, markRead, muteChat, pinChat, sendMessage, setActiveChat, setCurrentUser, setFilter, setSearch, toggleSidebar, toggleTheme, updateCurrentUser, withdraw]);

  return { state, dispatch, users };
};
