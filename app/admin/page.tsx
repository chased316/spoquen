'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createPrompt, getTodayPrompt, getPromptByDate, getTodayString } from '@/lib/api';
import { DailyPrompt } from '@/lib/types';
import { toast } from 'sonner';
import { Calendar } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [promptDate, setPromptDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [todayPrompt, setTodayPrompt] = useState<DailyPrompt | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      loadTodayPrompt();
    }
  }, [user, authLoading, router]);

  const loadTodayPrompt = async () => {
    const prompt = await getTodayPrompt();
    setTodayPrompt(prompt);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await createPrompt(prompt, user.uid, promptDate || undefined);
      toast.success('Prompt created successfully!');
      setPrompt('');
      setPromptDate('');
      loadTodayPrompt();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create prompt');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (authLoading) {
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
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage daily prompts</p>
          </div>

          {/* Today's Prompt */}
          {todayPrompt && (
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Prompt</CardTitle>
                <CardDescription>Currently active prompt</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{todayPrompt.prompt}</p>
              </CardContent>
            </Card>
          )}

          {/* Create New Prompt */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Prompt</CardTitle>
              <CardDescription>
                Set a prompt for today or schedule for a future date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt Text</Label>
                  <Input
                    id="prompt"
                    type="text"
                    placeholder="What's the best advice you've ever received?"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    required
                    maxLength={200}
                  />
                  <p className="text-sm text-muted-foreground">
                    {prompt.length}/200 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date (optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={promptDate}
                    onChange={(e) => setPromptDate(e.target.value)}
                    min={getTodayString()}
                  />
                  <p className="text-sm text-muted-foreground">
                    Leave empty for today, or select a future date
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Prompt'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPromptDate(getTomorrowDate())}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Set for Tomorrow
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>• Create prompts in advance by selecting a future date</p>
              <p>• The feed will automatically show only today&apos;s Spoques</p>
              <p>• Users can only post one Spoque per day</p>
              <p>• Set up a cron job to automatically rotate prompts at midnight</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

