export interface User {
  uid: string;
  email: string;
  username: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPrompt {
  id: string;
  prompt: string;
  date: string; // YYYY-MM-DD format
  createdAt: Date;
  createdBy: string;
}

export interface Spoque {
  id: string;
  userId: string;
  username: string;
  userPhotoURL?: string;
  audioURL: string;
  caption?: string;
  promptId: string;
  promptText: string;
  date: string; // YYYY-MM-DD format
  likes: number;
  likedBy: string[]; // Array of user IDs
  createdAt: Date;
}

export interface AudioRecordingState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  audioBlob: Blob | null;
  audioURL: string | null;
}

