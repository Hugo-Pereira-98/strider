import { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { SessionProvider } from '../contexts/SessionContext';
import '../styles/globals.css';

import { ToastProvider } from '@/contexts/ToastContext';
import { ThemeProvider } from 'next-themes';
import { SidebarProvider } from '../contexts/SidebarContext';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
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
              <ToastProvider>
                <Component {...pageProps} />
              </ToastProvider>
            </main>
          </SidebarProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}
