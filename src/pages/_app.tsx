import { PrivateLayout } from '@/layouts/PrivateLayout';
import Cookies from 'js-cookie';
import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import { SessionProvider } from '../contexts/SessionContext';
import '../styles/globals.css';

import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '../contexts/SidebarContext';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [theme, setTheme] = useState('system');
  const PrivateLayoutContainer =
    !router.pathname.includes('/') || !router.pathname.includes('signup')
      ? PrivateLayout
      : Fragment;

  useEffect(() => {
    const posterrIdCookie = Cookies.get('posterr-id');
    if (posterrIdCookie) {
      const session = JSON.parse(posterrIdCookie);
      const themePreference = session.themePreference?.toLowerCase();
      if (
        themePreference === 'dark' ||
        themePreference === 'light' ||
        themePreference === 'system'
      ) {
        setTheme(themePreference);
      }
    }
  }, []);

  return (
    <>
      <meta
        name="viewport"
        content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
      />
      <SessionProvider>
        <ThemeProvider enableSystem={true} attribute="class">
          <SidebarProvider>
            <main className={`${inter.className} h-screen`}>
              <PrivateLayoutContainer>
                <ToastProvider>
                  <Component {...pageProps} />
                </ToastProvider>
              </PrivateLayoutContainer>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
