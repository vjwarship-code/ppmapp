'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { LoadingPage } from '@/components/ui/loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      
      if (session) {
        // If logged in, go to dashboard
        router.push('/dashboard');
      } else {
        // If not logged in, go to login
        router.push('/auth/login');
      }
    };
    
    checkAuth();
  }, [router]);

  return <LoadingPage />;
}
