import { create } from 'zustand';

export const useAppStore = create((set) => ({
    language: 'EN',
    setLanguage: (language) => set({ language }),

    role: null, // 'employee' | 'manager'
    setRole: (role) => set({ role }),

    isDemoMode: false,
    setDemoMode: (isDemoMode) => set({ isDemoMode }),
}));
