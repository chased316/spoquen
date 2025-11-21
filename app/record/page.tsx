'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { AudioRecorder } from '@/components/recorder/AudioRecorder';
import { getTodayPrompt, hasUserPostedToday } from '@/lib/api';
import { DailyPrompt } from '@/lib/types';

export default function RecordPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
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
      const [promptData, posted] = await Promise.all([
        getTodayPrompt(),
        hasUserPostedToday(user!.uid),
      ]);

      setPrompt(promptData);
      setHasPosted(posted);
    } catch (error) {
      console.error('Error loading prompt:', error);
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

  if (hasPosted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-secondary rounded-lg p-8 text-center space-y-4">
              <h2 className="text-2xl font-semibold">
                You&apos;ve already posted today!
              </h2>
              <p className="text-muted-foreground">
                Come back tomorrow for a new prompt and your next Spoque.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-secondary rounded-lg p-8 text-center space-y-4">
              <h2 className="text-2xl font-semibold">No prompt available</h2>
              <p className="text-muted-foreground">
                The daily prompt hasn&apos;t been set yet. Check back soon!
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <AudioRecorder
            prompt={prompt}
            onSuccess={() => router.push('/feed')}
          />
        </div>
      </main>
    </div>
  );
}

