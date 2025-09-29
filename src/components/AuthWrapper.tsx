import { useEffect, type ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from '@/stores/auth-store';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
import { Loader2 } from 'lucide-react';
export function AuthWrapper({ children }: { children: ReactNode }) {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0();
  const { setSession, clearSession, isAuthenticated: isStoreAuthenticated } = useAuthStore();
  useEffect(() => {
    const syncUser = async () => {
      if (isAuthenticated && user) {
        try {
          const token = await getAccessTokenSilently();
          // Sync with backend to create/get user profile
          const appUser = await api<User>('/api/auth/sync', { method: 'POST' });
          setSession(appUser, token);
        } catch (error) {
          console.error('Error syncing user:', error);
          clearSession();
        }
      } else if (!isAuthenticated && !isLoading) {
        if (isStoreAuthenticated) {
          clearSession();
        }
      }
    };
    syncUser();
  }, [isAuthenticated, user, getAccessTokenSilently, setSession, clearSession, isLoading, isStoreAuthenticated]);
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }
  return <>{children}</>;
}