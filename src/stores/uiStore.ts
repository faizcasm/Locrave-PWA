import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  isOnline: boolean;
  installPromptEvent: Event | null;
  showInstallPrompt: boolean;

  // Actions
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  setInstallPromptEvent: (event: Event | null) => void;
  setShowInstallPrompt: (show: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: false,
      isOnline: navigator.onLine,
      installPromptEvent: null,
      showInstallPrompt: false,

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.setAttribute('data-theme', newTheme);
          return { theme: newTheme };
        }),

      setTheme: (theme: 'light' | 'dark') => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),

      setOnlineStatus: (isOnline: boolean) => set({ isOnline }),

      setInstallPromptEvent: (event: Event | null) => set({ installPromptEvent: event }),

      setShowInstallPrompt: (show: boolean) => set({ showInstallPrompt: show }),
    }),
    {
      name: 'locrave-ui',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
