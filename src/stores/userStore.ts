import { create } from 'zustand';
import type { User } from '@/types';

const STORAGE_KEY = 'telechat_user';

const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const user = JSON.parse(stored) as User;
    return user && user.id && user.username ? user : null;
  } catch {
    return null;
  }
};

const saveUserToStorage = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore storage failures in demo mode
  }
};

interface UserStoreState {
  currentUser: User | null;
  users: User[];
  hydrated: boolean;
  setUsers: (users: User[]) => void;
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  logout: () => void;
  markHydrated: () => void;
}

export const useUserStore = create<UserStoreState>(set => ({
  currentUser: loadUserFromStorage(),
  users: [],
  hydrated: false,
  setUsers: users => set({ users }),
  setCurrentUser: user => {
    saveUserToStorage(user);
    set({ currentUser: user });
  },
  updateCurrentUser: updates =>
    set(state => {
      if (!state.currentUser) return state;
      const currentUser = { ...state.currentUser, ...updates };
      saveUserToStorage(currentUser);
      return {
        currentUser,
        users: state.users.map(user => (user.id === currentUser.id ? { ...user, ...updates } : user)),
      };
    }),
  logout: () => {
    saveUserToStorage(null);
    set({ currentUser: null });
  },
  markHydrated: () => set({ hydrated: true }),
}));
