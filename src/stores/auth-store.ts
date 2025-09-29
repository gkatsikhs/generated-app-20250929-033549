import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@shared/types';
import { api } from '@/lib/api-client';
import { useEventStore } from './event-store';
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
  updateUser: (data: { name?: string; avatarUrl?: string }) => Promise<void>;
}
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setSession: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },
      clearSession: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: async (data: { name?: string; avatarUrl?: string }) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('User not authenticated');
        const updatedUser = await api<User>(`/api/users/${currentUser.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
        set({ user: updatedUser });
        // Re-fetch events to show updated creator/attendee names
        useEventStore.getState().fetchEvents();
      }
    }),
    {
      name: 'eventide-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);