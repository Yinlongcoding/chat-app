import type { Chat, ChatType, Message, User, WalletState } from '@/types';
import mockData from './mockData.json';

type UserStatus = User['status'];
type MessageStatus = Message['status'];
type MessageType = Message['type'];

interface RawUser {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  avatarColor: string;
  status: UserStatus;
  lastSeenOffsetMinutes?: number;
  bio?: string;
  phone?: string;
}

interface RawMessage {
  id: string;
  senderId: string;
  content: string;
  offsetMinutes: number;
  status: MessageStatus;
  type?: MessageType;
  replyTo?: string;
  edited?: boolean;
}

interface RawChat {
  id: string;
  type: ChatType;
  name: string;
  avatar?: string;
  avatarColor: string;
  members: string[];
  unreadCount: number;
  pinned: boolean;
  muted: boolean;
  description?: string;
  subscriberCount?: number;
  isAdmin?: boolean;
  createdOffsetDays: number;
}

interface RawWalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  offsetMinutes: number;
  note?: string;
}

interface RawMockData {
  users: RawUser[];
  messages: Record<string, RawMessage[]>;
  chats: RawChat[];
  wallet: {
    balance: number;
    currency: WalletState['currency'];
    transactions: RawWalletTransaction[];
  };
}

const raw = mockData as RawMockData;
const now = new Date();
const minutesAgo = (n: number) => new Date(now.getTime() - n * 60000);
const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000);

export const MOCK_USERS: User[] = raw.users.map(user => ({
  id: user.id,
  username: user.username,
  displayName: user.displayName,
  avatar: user.avatar,
  avatarColor: user.avatarColor,
  status: user.status,
  bio: user.bio,
  phone: user.phone,
  lastSeen: user.lastSeenOffsetMinutes === undefined ? undefined : minutesAgo(user.lastSeenOffsetMinutes),
}));

export const MOCK_MESSAGES: Record<string, Message[]> = Object.fromEntries(
  Object.entries(raw.messages).map(([chatId, messages]) => [
    chatId,
    messages.map(message => ({
      id: message.id,
      chatId,
      senderId: message.senderId,
      content: message.content,
      type: message.type || 'text',
      timestamp: minutesAgo(message.offsetMinutes),
      status: message.status,
      replyTo: message.replyTo,
      edited: message.edited,
    })),
  ])
);

export const MOCK_CHATS: Chat[] = raw.chats.map(chat => {
  const chatMessages = MOCK_MESSAGES[chat.id] || [];

  return {
    id: chat.id,
    type: chat.type,
    name: chat.name,
    avatar: chat.avatar,
    avatarColor: chat.avatarColor,
    members: chat.members,
    lastMessage: chatMessages[chatMessages.length - 1],
    unreadCount: chat.unreadCount,
    pinned: chat.pinned,
    muted: chat.muted,
    description: chat.description,
    subscriberCount: chat.subscriberCount,
    isAdmin: chat.isAdmin,
    createdAt: daysAgo(chat.createdOffsetDays),
  };
});

export const MOCK_WALLET: WalletState = {
  balance: raw.wallet.balance,
  currency: raw.wallet.currency,
  transactions: raw.wallet.transactions.map(transaction => ({
    id: transaction.id,
    type: transaction.type,
    amount: transaction.amount,
    timestamp: minutesAgo(transaction.offsetMinutes),
    note: transaction.note,
  })),
};

export const getUserById = (id: string): User | undefined =>
  MOCK_USERS.find(user => user.id === id);

export const getInitials = (name: string): string =>
  name.split(' ').map(part => part[0]).join('').toUpperCase().slice(0, 2);

export const formatTime = (date: Date): string => {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);

  if (days === 0) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  if (days === 1) {
    return 'Yesterday';
  }

  if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatFullTime = (date: Date): string =>
  date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
