import { create } from 'zustand';
import type { WalletState, WalletTransaction } from '@/types';

interface WalletStoreState {
  wallet: WalletState;
  hydrated: boolean;
  hydrate: (wallet: WalletState) => void;
  deposit: (payload: { amount: number; note?: string }) => void;
  withdraw: (payload: { amount: number; note?: string }) => void;
}

const emptyWallet: WalletState = {
  balance: 0,
  currency: 'USD',
  transactions: [],
};

export const useWalletStore = create<WalletStoreState>(set => ({
  wallet: emptyWallet,
  hydrated: false,
  hydrate: wallet => set({ wallet, hydrated: true }),
  deposit: payload =>
    set(state => {
      const transaction: WalletTransaction = {
        id: `wd_${Date.now()}`,
        type: 'deposit',
        amount: payload.amount,
        timestamp: new Date(),
        note: payload.note,
      };

      return {
        wallet: {
          ...state.wallet,
          balance: state.wallet.balance + payload.amount,
          transactions: [transaction, ...state.wallet.transactions],
        },
      };
    }),
  withdraw: payload =>
    set(state => {
      if (payload.amount > state.wallet.balance) {
        return state;
      }

      const transaction: WalletTransaction = {
        id: `ww_${Date.now()}`,
        type: 'withdraw',
        amount: payload.amount,
        timestamp: new Date(),
        note: payload.note,
      };

      return {
        wallet: {
          ...state.wallet,
          balance: state.wallet.balance - payload.amount,
          transactions: [transaction, ...state.wallet.transactions],
        },
      };
    }),
}));
