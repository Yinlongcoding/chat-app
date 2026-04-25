import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { AppState, Chat, Message, User } from '@/types';
import { MOCK_CHATS, MOCK_MESSAGES, MOCK_USERS } from '../data/mockData';

const STORAGE_KEY = 'telechat_user';

type Action =
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_ACTIVE_CHAT'; payload: string | null }
  | { type: 'SEND_MESSAGE'; payload: { chatId: string; content: string; replyTo?: string } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER'; payload: AppState['activeFilter'] }
  | { type: 'PIN_CHAT'; payload: string }
  | { type: 'MUTE_CHAT'; payload: string }
  | { type: 'MARK_READ'; payload: string }
  | { type: 'CREATE_GROUP'; payload: { name: string; members: string[]; description?: string } }
  | { type: 'CREATE_CHANNEL'; payload: { name: string; description?: string } }
  | { type: 'LOAD_USER'; payload: User | null };

// 从 localStorage 恢复用户状态
const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('loadUserFromStorage stored:', stored);
    if (stored) {
      const user = JSON.parse(stored);
      console.log('loadUserFromStorage parsed:', user);
      // 验证用户数据结构
      if (user && user.id && user.username) {
        console.log('loadUserFromStorage valid user');
        return user;
      } else {
        console.warn('loadUserFromStorage invalid user structure:', user);
      }
    } else {
      console.log('loadUserFromStorage no stored user');
    }
  } catch (e) {
    console.warn('Failed to load user from localStorage:', e);
  }
  return null;
};

// 保存用户到 localStorage
const saveUserToStorage = (user: User | null) => {
  try {
    if (user) {
      console.log('saveUserToStorage saving:', user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      console.log('saveUserToStorage removing user');
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to save user to localStorage:', e);
  }
};

const initialState: AppState = {
  currentUser: null,
  chats: MOCK_CHATS,
  messages: MOCK_MESSAGES,
  activeChat: null,
  theme: 'dark',
  sidebarOpen: true,
  searchQuery: '',
  activeFilter: 'all',
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_USER':
      // 仅当当前没有用户时加载，避免覆盖已登录用户
      if (state.currentUser) return state;
      return { ...state, currentUser: action.payload };
    case 'SET_USER':
      saveUserToStorage(action.payload);
      return { ...state, currentUser: action.payload };
    case 'LOGOUT':
      saveUserToStorage(null);
      return { ...state, currentUser: null, activeChat: null };
    case 'SET_ACTIVE_CHAT':
      return {
        ...state,
        activeChat: action.payload,
        chats: action.payload
          ? state.chats.map(c => c.id === action.payload ? { ...c, unreadCount: 0 } : c)
          : state.chats,
      };
    case 'SEND_MESSAGE': {
      const { chatId, content, replyTo } = action.payload;
      const newMsg: Message = {
        id: `msg_${Date.now()}`,
        chatId,
        senderId: state.currentUser!.id,
        content,
        type: 'text',
        timestamp: new Date(),
        status: 'sent',
        replyTo,
      };
      const updatedMessages = {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMsg],
      };
      const updatedChats = state.chats.map(c =>
        c.id === chatId ? { ...c, lastMessage: newMsg } : c
      );
      return { ...state, messages: updatedMessages, chats: updatedChats };
    }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload };
    case 'SET_FILTER':
      return { ...state, activeFilter: action.payload };
    case 'PIN_CHAT':
      return {
        ...state,
        chats: state.chats.map(c => c.id === action.payload ? { ...c, pinned: !c.pinned } : c),
      };
    case 'MUTE_CHAT':
      return {
        ...state,
        chats: state.chats.map(c => c.id === action.payload ? { ...c, muted: !c.muted } : c),
      };
    case 'MARK_READ':
      return {
        ...state,
        chats: state.chats.map(c => c.id === action.payload ? { ...c, unreadCount: 0 } : c),
      };
    case 'CREATE_GROUP': {
      const newChat: Chat = {
        id: `g_${Date.now()}`,
        type: 'group',
        name: action.payload.name,
        avatarColor: '#2AABEE',
        members: ['me', ...action.payload.members],
        unreadCount: 0,
        pinned: false,
        muted: false,
        description: action.payload.description,
        createdAt: new Date(),
      };
      const sysMsg: Message = {
        id: `sys_${Date.now()}`,
        chatId: newChat.id,
        senderId: 'system',
        content: '群组已创建',
        type: 'system',
        timestamp: new Date(),
        status: 'read',
      };
      return {
        ...state,
        chats: [newChat, ...state.chats],
        messages: { ...state.messages, [newChat.id]: [sysMsg] },
        activeChat: newChat.id,
      };
    }
    case 'CREATE_CHANNEL': {
      const newChannel: Chat = {
        id: `ch_${Date.now()}`,
        type: 'channel',
        name: action.payload.name,
        avatarColor: '#9C27B0',
        members: ['me'],
        unreadCount: 0,
        pinned: false,
        muted: false,
        description: action.payload.description,
        subscriberCount: 1,
        createdAt: new Date(),
      };
      const sysMsg: Message = {
        id: `sys_${Date.now()}`,
        chatId: newChannel.id,
        senderId: 'system',
        content: '频道已创建',
        type: 'system',
        timestamp: new Date(),
        status: 'read',
      };
      return {
        ...state,
        chats: [newChannel, ...state.chats],
        messages: { ...state.messages, [newChannel.id]: [sysMsg] },
        activeChat: newChannel.id,
      };
    }
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  users: User[];
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // 组件挂载后从 localStorage 加载用户
  React.useEffect(() => {
    const loadedUser = loadUserFromStorage();
    console.log('AppProvider useEffect loadedUser:', loadedUser);
    if (loadedUser) {
      dispatch({ type: 'LOAD_USER', payload: loadedUser });
    }
  }, []);
  
  return (
    <AppContext.Provider value={{ state, dispatch, users: MOCK_USERS }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
