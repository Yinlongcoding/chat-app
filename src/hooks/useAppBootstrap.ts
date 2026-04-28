import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAppBootstrap } from '@/services/mockApi';
import { useChatStore } from '@/stores/chatStore';
import { useUserStore } from '@/stores/userStore';
import { useWalletStore } from '@/stores/walletStore';

export const useAppBootstrap = () => {
  const userHydrated = useUserStore(state => state.hydrated);
  const chatHydrated = useChatStore(state => state.hydrated);
  const walletHydrated = useWalletStore(state => state.hydrated);

  const setUsers = useUserStore(state => state.setUsers);
  const markUserHydrated = useUserStore(state => state.markHydrated);
  const hydrateChat = useChatStore(state => state.hydrate);
  const hydrateWallet = useWalletStore(state => state.hydrate);

  const query = useQuery({
    queryKey: ['app-bootstrap'],
    queryFn: fetchAppBootstrap,
  });

  useEffect(() => {
    if (!query.data) return;

    if (!userHydrated) {
      setUsers(query.data.users);
      markUserHydrated();
    }

    if (!chatHydrated) {
      hydrateChat({ chats: query.data.chats, messages: query.data.messages });
    }

    if (!walletHydrated) {
      hydrateWallet(query.data.wallet);
    }
  }, [chatHydrated, hydrateChat, hydrateWallet, markUserHydrated, query.data, setUsers, userHydrated, walletHydrated]);

  return {
    ...query,
    isReady: userHydrated && chatHydrated && walletHydrated,
  };
};
