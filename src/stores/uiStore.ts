import { create } from 'zustand';

interface UiStoreState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiStoreState>(set => ({
  theme: 'dark',
  sidebarOpen: true,
  toggleTheme: () => set(state => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
}));
