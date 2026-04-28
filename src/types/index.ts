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
  users: User[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  wallet: WalletState;
  activeChat: string | null;
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  searchQuery: string;
  activeFilter: 'all' | 'private' | 'group' | 'channel';
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  timestamp: Date;
  note?: string;
}

export interface WalletState {
  balance: number;
  currency: 'USD' | 'CNY';
  transactions: WalletTransaction[];
}

export type AppAction =
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
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
  | { type: 'WALLET_DEPOSIT'; payload: { amount: number; note?: string } }
  | { type: 'WALLET_WITHDRAW'; payload: { amount: number; note?: string } };
