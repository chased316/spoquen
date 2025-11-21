'use client';

import { useState, useRef } from 'react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mic, Square, Play, Pause, RotateCcw, Upload } from 'lucide-react';
import { uploadAudio, createSpoque } from '@/lib/api';
import { DailyPrompt } from '@/lib/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface AudioRecorderProps {
  prompt: DailyPrompt;
  onSuccess?: () => void;
}

export function AudioRecorder({ prompt, onSuccess }: AudioRecorderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const {
    isRecording,
    recordingTime,
    audioBlob,
    audioURL,
    startRecording,
    stopRecording,
    resetRecording,
    maxRecordingTime,
  } = useAudioRecorder();

  const [caption, setCaption] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploading, setUploading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (time: number) => {
    const seconds = Math.floor(time);
    const decimals = Math.floor((time - seconds) * 10);
    return `${seconds}.${decimals}s`;
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleUpload = async () => {
    if (!audioBlob || !user) return;

    setUploading(true);
    try {
      // Upload audio file
      const audioURL = await uploadAudio(audioBlob, user.uid);

      // Create spoque
      await createSpoque(
        user.uid,
        user.username,
        user.photoURL,
        audioURL,
        prompt.id,
        prompt.prompt,
        caption || undefined
      );

      toast.success('Your Spoque has been posted!');
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/feed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload Spoque');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Today&apos;s Prompt</CardTitle>
        <CardDescription className="text-lg font-medium text-foreground">
          {prompt.prompt}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording Controls */}
        <div className="flex flex-col items-center space-y-4">
          {/* Timer */}
          <div className="text-4xl font-bold tabular-nums">
            {formatTime(recordingTime)} / {maxRecordingTime}s
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-100"
              style={{ width: `${(recordingTime / maxRecordingTime) * 100}%` }}
            />
          </div>

          {/* Record/Stop Button */}
          {!audioBlob && (
            <div className="flex gap-4">
              {!isRecording ? (
                <Button
                  size="lg"
                  onClick={startRecording}
                  className="rounded-full w-20 h-20"
                >
                  <Mic className="w-8 h-8" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={stopRecording}
                  variant="destructive"
                  className="rounded-full w-20 h-20"
                >
                  <Square className="w-8 h-8" />
                </Button>
              )}
            </div>
          )}

          {/* Playback Controls */}
          {audioBlob && audioURL && (
            <div className="w-full space-y-4">
              <audio
                ref={audioRef}
                src={audioURL}
                className="hidden"
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handlePlayPause}
                  className="rounded-full w-16 h-16"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                <Button
                  size="lg"
                  onClick={resetRecording}
                  variant="outline"
                  className="rounded-full w-16 h-16"
                >
                  <RotateCcw className="w-6 h-6" />
                </Button>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption (optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="Add a caption to your Spoque..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={200}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground text-right">
                  {caption.length}/200
                </p>
              </div>

              {/* Upload Button */}
              <Button
                size="lg"
                onClick={handleUpload}
                disabled={uploading}
                className="w-full"
              >
                {uploading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="w-5 h-5 mr-2" />
                    Post Spoque
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {!isRecording && !audioBlob && (
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>Record your 20-second audio response</p>
            <p>One take only • No editing • Be authentic</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

