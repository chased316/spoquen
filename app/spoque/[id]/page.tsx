'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getSpoqueById } from '@/lib/api';
import { Spoque } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function SpoquePage() {
  const params = useParams();
  const spoqueId = params.id as string;
  const [spoque, setSpoque] = useState<Spoque | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadSpoque();
  }, [spoqueId]);

  const loadSpoque = async () => {
    try {
      setLoading(true);
      const spoqueData = await getSpoqueById(spoqueId);
      setSpoque(spoqueData);
    } catch (error) {
      console.error('Error loading spoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!spoque) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Spoque not found</h2>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Branding */}
        <div className="text-center">
          <Link href="/">
            <h1 className="text-3xl font-bold">Spoquen</h1>
          </Link>
          <p className="text-sm text-muted-foreground">
            Daily audio thoughts in 20 seconds
          </p>
        </div>

        {/* Spoque Card */}
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={spoque.userPhotoURL} alt={spoque.username} />
                  <AvatarFallback className="text-xl">
                    {spoque.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">@{spoque.username}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(spoque.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Prompt */}
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Prompt
                </p>
                <p className="text-lg">{spoque.promptText}</p>
              </div>

              {/* Audio Player */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handlePlayPause}
                  className="rounded-full w-20 h-20"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </Button>

                <audio
                  ref={audioRef}
                  src={spoque.audioURL}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>

              {/* Caption */}
              {spoque.caption && (
                <div className="text-center">
                  <p className="text-lg">{spoque.caption}</p>
                </div>
              )}

              {/* Likes */}
              <div className="text-center text-sm text-muted-foreground">
                {spoque.likes} {spoque.likes === 1 ? 'like' : 'likes'}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <Link href="/">
            <Button size="lg">
              Join Spoquen
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Share your daily audio thoughts
          </p>
        </div>
      </div>
    </div>
  );
}

