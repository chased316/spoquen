'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/feed');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary px-4">
      <main className="flex flex-col items-center justify-center text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Spoquen
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground">
            Daily audio thoughts in 20 seconds
          </p>
        </div>

        <div className="space-y-4 max-w-md">
          <p className="text-muted-foreground">
            Share your authentic voice. One daily prompt. One 20-second take. 
            No editing. No filters. Just you.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link href="/auth/signup" className="flex-1">
            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </Link>
          <Link href="/auth/signin" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="pt-8 space-y-2 text-sm text-muted-foreground">
          <p>✓ One daily prompt</p>
          <p>✓ 20-second audio clips</p>
          <p>✓ Autoplay feed</p>
          <p>✓ No editing, no filters</p>
        </div>
      </main>
    </div>
  );
}
