'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

export function Navigation() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              PPM App
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
                Dashboard
              </Link>
              <Link href="/dashboard/projects" className="text-sm font-medium hover:text-blue-600">
                Projects
              </Link>
              <Link href="/dashboard/budget" className="text-sm font-medium hover:text-blue-600">
                Budget
              </Link>
              <Link href="/dashboard/resources" className="text-sm font-medium hover:text-blue-600">
                Resources
              </Link>
              <Link href="/dashboard/risks" className="text-sm font-medium hover:text-blue-600">
                Risks
              </Link>
              <Link href="/dashboard/milestones" className="text-sm font-medium hover:text-blue-600">
                Milestones
              </Link>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}
