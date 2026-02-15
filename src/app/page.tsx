'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingPage } from '@/components/ui/loading';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard by default
    router.push('/dashboard');
  }, [router]);

  return <LoadingPage />;
}
