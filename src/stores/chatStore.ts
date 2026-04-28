import { create } from 'zustand';
import type { AppState, Chat, Message, WalletTransaction } from '@/types';

type ChatFilter = AppState['activeFilter'];

interface ChatStoreState {
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChat: string | null;
  searchQuery: string;
  activeFilter: ChatFilter;
  hydrated: boolean;
  hydrate: (payload: { chats: Chat[]; messages: Record<string, Message[]> }) => void;
  setActiveChat: (chatId: string | null) => void;
  setSearch: (value: string) => void;
  setFilter: (value: ChatFilter) => void;
  sendMessage: (payload: { chatId: string; content: string; senderId: string; replyTo?: string }) => void;
  pinChat: (chatId: string) => void;
  muteChat: (chatId: string) => void;
  markRead: (chatId: string) => void;
  createGroup: (payload: { name: string; members: string[]; description?: string }) => string;
  createChannel: (payload: { name: string; description?: string }) => string;
}

export const useChatStore = create<ChatStoreState>((set, get) => ({
  chats: [],
  messages: {},
  activeChat: null,
  searchQuery: '',
  activeFilter: 'all',
  hydrated: false,
  hydrate: payload => set({ chats: payload.chats, messages: payload.messages, hydrated: true }),
  setActiveChat: chatId =>
    set(state => {
      const targetChat = chatId ? state.chats.find(chat => chat.id === chatId) : null;
      const shouldMarkRead = Boolean(targetChat && targetChat.unreadCount > 0);

      if (state.activeChat === chatId && !shouldMarkRead) {
        return state;
      }

      return {
        activeChat: chatId,
        chats: shouldMarkRead
          ? state.chats.map(chat => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat))
          : state.chats,
      };
    }),
  setSearch: value => set({ searchQuery: value }),
  setFilter: value => set({ activeFilter: value }),
  sendMessage: payload =>
    set(state => {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        chatId: payload.chatId,
        senderId: payload.senderId,
        content: payload.content,
        type: 'text',
        timestamp: new Date(),
        status: 'sent',
        replyTo: payload.replyTo,
      };

      return {
        messages: {
          ...state.messages,
          [payload.chatId]: [...(state.messages[payload.chatId] || []), newMessage],
        },
        chats: state.chats.map(chat => (chat.id === payload.chatId ? { ...chat, lastMessage: newMessage } : chat)),
      };
    }),
  pinChat: chatId => set(state => ({ chats: state.chats.map(chat => (chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat)) })),
  muteChat: chatId => set(state => ({ chats: state.chats.map(chat => (chat.id === chatId ? { ...chat, muted: !chat.muted } : chat)) })),
  markRead: chatId => set(state => ({ chats: state.chats.map(chat => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)) })),
  createGroup: payload => {
    const id = `g_${Date.now()}`;
    const createdAt = new Date();
    const newChat: Chat = {
      id,
      type: 'group',
      name: payload.name,
      avatarColor: '#2AABEE',
      members: ['me', ...payload.members],
      unreadCount: 0,
      pinned: false,
      muted: false,
      description: payload.description,
      createdAt,
    };
    const systemMessage: Message = {
      id: `sys_${Date.now()}`,
      chatId: id,
      senderId: 'system',
      content: 'Group created',
      type: 'system',
      timestamp: createdAt,
      status: 'read',
    };
    set(state => ({
      chats: [newChat, ...state.chats],
      messages: { ...state.messages, [id]: [systemMessage] },
      activeChat: id,
    }));
    return id;
  },
  createChannel: payload => {
    const id = `ch_${Date.now()}`;
    const createdAt = new Date();
    const newChannel: Chat = {
      id,
      type: 'channel',
      name: payload.name,
      avatarColor: '#9C27B0',
      members: ['me'],
      unreadCount: 0,
      pinned: false,
      muted: false,
      description: payload.description,
      subscriberCount: 1,
      createdAt,
    };
    const systemMessage: Message = {
      id: `sys_${Date.now()}`,
      chatId: id,
      senderId: 'system',
      content: 'Channel created',
      type: 'system',
      timestamp: createdAt,
      status: 'read',
    };
    set(state => ({
      chats: [newChannel, ...state.chats],
      messages: { ...state.messages, [id]: [systemMessage] },
      activeChat: id,
    }));
    return id;
  },
}));
