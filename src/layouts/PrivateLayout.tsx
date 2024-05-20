import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export function PrivateLayout({ children }: PrivateLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const idCookie = getCookie('posterr-id');

    if (!idCookie && !router.pathname.startsWith('/auth')) {
      router.push('/auth/signin');
    }
  }, [router]);

  return <>{children}</>;
}
