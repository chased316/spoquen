'use client';

import { useState, useRef, useEffect } from 'react';
import { Spoque } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Share2, Play, Pause } from 'lucide-react';
import { toggleLike } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';

interface SpoqueCardProps {
  spoque: Spoque;
  autoplay?: boolean;
  onEnded?: () => void;
  onPlay?: () => void;
}

export function SpoqueCard({ spoque, autoplay = false, onEnded, onPlay }: SpoqueCardProps) {
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(spoque.likes);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (user && spoque.likedBy.includes(user.uid)) {
      setIsLiked(true);
    }
  }, [user, spoque.likedBy]);

  useEffect(() => {
    if (autoplay && audioRef.current && !isPlaying) {
      audioRef.current.play().catch(() => {
        // Autoplay was prevented
      });
    }
  }, [autoplay]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      if (onPlay) onPlay();
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like Spoques');
      return;
    }

    try {
      await toggleLike(spoque.id, user.uid, isLiked);
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error('Failed to update like');
    }
  };

  const handleShare = async () => {
    const shareURL = `${window.location.origin}/spoque/${spoque.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Spoque by ${spoque.username}`,
          text: spoque.caption || spoque.promptText,
          url: shareURL,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(shareURL);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <Link href={`/profile/${spoque.username}`}>
            <Avatar className="w-12 h-12">
              <AvatarImage src={spoque.userPhotoURL} alt={spoque.username} />
              <AvatarFallback>{spoque.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Link>

          {/* Content */}
          <div className="flex-1 space-y-3">
            {/* User Info */}
            <div>
              <Link href={`/profile/${spoque.username}`}>
                <h3 className="font-semibold hover:underline">@{spoque.username}</h3>
              </Link>
              <p className="text-sm text-muted-foreground">{spoque.promptText}</p>
            </div>

            {/* Audio Player */}
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                onClick={handlePlayPause}
                className="rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>

              <audio
                ref={audioRef}
                src={spoque.audioURL}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false);
                  if (onEnded) onEnded();
                }}
                preload="metadata"
              />

              <div className="flex-1 text-sm text-muted-foreground">
                20 seconds
              </div>
            </div>

            {/* Caption */}
            {spoque.caption && (
              <p className="text-sm">{spoque.caption}</p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className="gap-2"
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                />
                <span>{likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

