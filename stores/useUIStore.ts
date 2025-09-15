import { create } from 'zustand';

type StatusBarStyle = 'auto' | 'inverted' | 'light' | 'dark';

interface UIState {
  isSidebarOpen: boolean;
  isNotificationsOpen: boolean;
  isChatbotOpen: boolean;
  statusBarStyle: StatusBarStyle;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  toggleNotifications: () => void;
  setNotificationsOpen: (open: boolean) => void;
  toggleChatbot: () => void;
  setStatusBarStyle: (style: StatusBarStyle) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isNotificationsOpen: false,
  isChatbotOpen: false,
  statusBarStyle: 'auto',
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  toggleNotifications: () => set((s) => ({ isNotificationsOpen: !s.isNotificationsOpen })),
  setNotificationsOpen: (open: boolean) => set({ isNotificationsOpen: open }),
  toggleChatbot: () => set((s) => ({ isChatbotOpen: !s.isChatbotOpen })),
  setStatusBarStyle: (style: StatusBarStyle) => set({ statusBarStyle: style }),
}));


