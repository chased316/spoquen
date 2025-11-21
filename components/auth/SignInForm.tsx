'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const { signIn, sendMagicLink } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (useMagicLink) {
        await sendMagicLink(email);
        toast.success('Magic link sent! Check your email.');
      } else {
        await signIn(email, password);
        toast.success('Signed in successfully!');
        router.push('/feed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In to Spoquen</CardTitle>
        <CardDescription>
          {useMagicLink
            ? 'Enter your email to receive a magic link'
            : 'Enter your credentials to sign in'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!useMagicLink && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : useMagicLink ? 'Send Magic Link' : 'Sign In'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => setUseMagicLink(!useMagicLink)}
          >
            {useMagicLink ? 'Use password instead' : 'Use magic link instead'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

