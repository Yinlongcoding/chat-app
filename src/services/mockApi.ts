import { MOCK_CHATS, MOCK_MESSAGES, MOCK_USERS, MOCK_WALLET } from '@/data/mockData';
import type { Chat, Message, User, WalletState } from '@/types';

export interface AppBootstrapPayload {
  users: User[];
  chats: Chat[];
  messages: Record<string, Message[]>;
  wallet: WalletState;
}

const sleep = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms));

const cloneUser = (user: User): User => ({
  ...user,
  lastSeen: user.lastSeen ? new Date(user.lastSeen) : undefined,
});

const cloneMessage = (message: Message): Message => ({
  ...message,
  timestamp: new Date(message.timestamp),
});

const cloneChat = (chat: Chat): Chat => ({
  ...chat,
  members: [...chat.members],
  createdAt: new Date(chat.createdAt),
  lastMessage: chat.lastMessage ? cloneMessage(chat.lastMessage) : undefined,
});

const cloneWallet = (wallet: WalletState): WalletState => ({
  ...wallet,
  transactions: wallet.transactions.map(transaction => ({
    ...transaction,
    timestamp: new Date(transaction.timestamp),
  })),
});

export async function fetchAppBootstrap(): Promise<AppBootstrapPayload> {
  await sleep(120);

  return {
    users: MOCK_USERS.map(cloneUser),
    chats: MOCK_CHATS.map(cloneChat),
    messages: Object.fromEntries(
      Object.entries(MOCK_MESSAGES).map(([chatId, chatMessages]) => [
        chatId,
        chatMessages.map(cloneMessage),
      ]),
    ),
    wallet: cloneWallet(MOCK_WALLET),
  };
}
