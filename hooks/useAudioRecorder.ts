'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { AudioRecordingState } from '@/lib/types';

const MAX_RECORDING_TIME = 20; // 20 seconds

export function useAudioRecorder() {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isPaused: false,
    recordingTime: 0,
    audioBlob: null,
    audioURL: null,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        setState((prev) => ({
          ...prev,
          audioBlob: blob,
          audioURL: url,
          isRecording: false,
        }));

        // Clean up
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start();
      
      setState((prev) => ({
        ...prev,
        isRecording: true,
        recordingTime: 0,
        audioBlob: null,
        audioURL: null,
      }));

      // Start timer
      timerRef.current = setInterval(() => {
        setState((prev) => {
          const newTime = prev.recordingTime + 0.1;
          
          // Auto-stop at max time
          if (newTime >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          
          return {
            ...prev,
            recordingTime: newTime,
          };
        });
      }, 100);
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Could not access microphone');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      isRecording: false,
    }));
  }, []);

  const resetRecording = useCallback(() => {
    if (state.audioURL) {
      URL.revokeObjectURL(state.audioURL);
    }

    setState({
      isRecording: false,
      isPaused: false,
      recordingTime: 0,
      audioBlob: null,
      audioURL: null,
    });

    chunksRef.current = [];
  }, [state.audioURL]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (state.audioURL) {
        URL.revokeObjectURL(state.audioURL);
      }
    };
  }, [state.audioURL]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    maxRecordingTime: MAX_RECORDING_TIME,
  };
}

