'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { AutoplayFeed } from '@/components/feed/AutoplayFeed';
import { Button } from '@/components/ui/button';
import { getTodaySpoques, getTodayPrompt, hasUserPostedToday } from '@/lib/api';
import { Spoque, DailyPrompt } from '@/lib/types';
import { Mic } from 'lucide-react';
import Link from 'next/link';

export default function FeedPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [spoques, setSpoques] = useState<Spoque[]>([]);
  const [prompt, setPrompt] = useState<DailyPrompt | null>(null);
  const [hasPosted, setHasPosted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      loadData();
    }
  }, [user, authLoading, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [spoquesData, promptData, posted] = await Promise.all([
        getTodaySpoques(),
        getTodayPrompt(),
        hasUserPostedToday(user!.uid),
      ]);

      setSpoques(spoquesData);
      setPrompt(promptData);
      setHasPosted(posted);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/* Today's Prompt */}
        {prompt && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-primary/10 rounded-lg p-6 text-center space-y-4">
              <h2 className="text-sm font-medium text-muted-foreground">
                Today&apos;s Prompt
              </h2>
              <p className="text-2xl font-semibold">{prompt.prompt}</p>
              {!hasPosted && (
                <Link href="/record">
                  <Button size="lg">
                    <Mic className="w-5 h-5 mr-2" />
                    Record Your Spoque
                  </Button>
                </Link>
              )}
              {hasPosted && (
                <p className="text-sm text-muted-foreground">
                  You&apos;ve already posted today! Come back tomorrow.
                </p>
              )}
            </div>
          </div>
        )}

        {!prompt && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-secondary rounded-lg p-6 text-center">
              <p className="text-muted-foreground">
                No prompt set for today yet. Check back soon!
              </p>
            </div>
          </div>
        )}

        {/* Feed */}
        <AutoplayFeed spoques={spoques} />
      </main>
    </div>
  );
}

