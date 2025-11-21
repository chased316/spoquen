'use client';

import { useState, useEffect } from 'react';
import { Spoque } from '@/lib/types';
import { SpoqueCard } from './SpoqueCard';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AutoplayFeedProps {
  spoques: Spoque[];
}

export function AutoplayFeed({ spoques }: AutoplayFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (spoques.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          No Spoques yet today. Be the first to post!
        </p>
      </div>
    );
  }

  const handleNext = () => {
    if (currentIndex < spoques.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Navigation */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {currentIndex + 1} of {spoques.length} Spoques
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronUp className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            disabled={currentIndex === spoques.length - 1}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Current Spoque */}
      <SpoqueCard
        spoque={spoques[currentIndex]}
        autoplay={true}
        onEnded={handleNext}
        onPlay={() => {
          // Stop all other audio elements
          document.querySelectorAll('audio').forEach((audio) => {
            if (audio !== document.querySelector(`audio[src="${spoques[currentIndex].audioURL}"]`)) {
              audio.pause();
            }
          });
        }}
      />

      {/* All Spoques List */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-semibold">All Today&apos;s Spoques</h2>
        <div className="space-y-4">
          {spoques.map((spoque, index) => (
            <div
              key={spoque.id}
              className={index === currentIndex ? 'ring-2 ring-primary rounded-lg' : ''}
            >
              <SpoqueCard
                spoque={spoque}
                autoplay={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

