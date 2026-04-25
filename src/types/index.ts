export type ChatType = 'private' | 'group' | 'channel';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  avatarColor: string;
  status: 'online' | 'offline' | 'recently';
  lastSeen?: Date;
  bio?: string;
  phone?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  replyTo?: string;
  edited?: boolean;
  reactions?: { emoji: string; count: number; users: string[] }[];
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar?: string;
  avatarColor: string;
  members: string[];
  lastMessage?: Message;
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  description?: string;
  createdAt: Date;
  // For channels
  subscriberCount?: number;
  isAdmin?: boolean;
}

export interface AppState {
  currentUser: User | null;
  chats: Chat[];
  messages: Record<string, Message[]>;
  activeChat: string | null;
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  searchQuery: string;
  activeFilter: 'all' | 'private' | 'group' | 'channel';
}
