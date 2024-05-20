import { useRouter } from 'next/router';
import { useSessionContext } from '../contexts/SessionContext';
import { useCallback, useEffect, useState } from 'react';
import { setCookie, getCookie } from 'cookies-next';

interface RefreshTokenData {
  token: string;
  expiresAt: number;
}

interface SignInForm {
  email: string;
  password: string;
}

interface Session {
  name: string;
  email: string;
}

interface SessionProps {
  isSessionActive: boolean;
  refreshTokenData: RefreshTokenData | null;
  signOut: () => void;
  signIn: (values: SignInForm) => Promise<string | null>;
  checkSessionActive: () => Promise<boolean>;
  refreshToken: () => Promise<void>;
  session: any;
  updateSessionInfo: (
    themePreference?: string,
    sidebarCollapsed?: boolean
  ) => void;
}

export function useSession(): SessionProps {
  const { isSessionActive, setIsSessionActive } = useSessionContext();
  const [refreshTokenData, setRefreshTokenData] =
    useState<RefreshTokenData | null>(null);
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);

  const signIn = useCallback(
    async (values: SignInForm): Promise<string | null> => {
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          body: JSON.stringify(values),
          credentials: 'include',
        });

        if (response.ok) {
          setIsSessionActive(true);
          router.push('/feed');
          return null;
        } else {
          const errorData = await response.json();
          return errorData.message || 'An error occurred';
        }
      } catch (error) {
        console.error('Error during sign in:', error);
        return 'Sign in failed';
      }
    },
    [router, setIsSessionActive]
  );

  const updateSessionInfo = useCallback(
    (themePreference?: string, sidebarCollapsed?: boolean) => {
      const currentSession = getCookie('posterr-id')
        ? JSON.parse(getCookie('posterr-id') as string)
        : null;

      if (currentSession) {
        const updatedSession = {
          ...currentSession,

          themePreference,
          sidebarCollapsed:
            sidebarCollapsed !== undefined
              ? sidebarCollapsed
              : currentSession.sidebarCollapsed,
        };

        setSession(updatedSession);
        setCookie('posterr-id', JSON.stringify(updatedSession), { path: '/' });
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
      } else {
        throw new Error('Failed to sign out');
      }
    } catch (error) {}

    router.push('/');
  }, [router]);

  const checkSessionActive = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });
      const { session } = await response.json();

      if (session && session.expiresAt > Math.floor(Date.now() / 1000)) {
        setIsSessionActive(true);
        setRefreshTokenData(session);
        return true;
      } else {
        signOut();
        return false;
      }
    } catch (error) {
      console.error('Error checking session status:', error);
      setIsSessionActive(false);
      return false;
    }
  }, [signOut]);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh access token');
      }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      signOut();
    }
  }, [signOut]);

  useEffect(() => {
    const cookies = getCookie('posterr-id');

    if (cookies) {
      setSession(JSON.parse(cookies as string));
    }
  }, []);

  return {
    isSessionActive,
    refreshTokenData,
    signIn,
    signOut,
    checkSessionActive,
    refreshToken,
    session,
    updateSessionInfo,
  };
}
