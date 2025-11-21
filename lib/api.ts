import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { DailyPrompt, Spoque } from './types';

// Get today's date in YYYY-MM-DD format
export function getTodayString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Daily Prompt Functions
export async function getTodayPrompt(): Promise<DailyPrompt | null> {
  const today = getTodayString();
  const promptDoc = await getDoc(doc(db, 'prompts', today));
  
  if (promptDoc.exists()) {
    const data = promptDoc.data();
    return {
      id: promptDoc.id,
      prompt: data.prompt,
      date: data.date,
      createdAt: data.createdAt?.toDate(),
      createdBy: data.createdBy,
    };
  }
  
  return null;
}

export async function createPrompt(prompt: string, userId: string, date?: string): Promise<void> {
  const promptDate = date || getTodayString();
  
  await setDoc(doc(db, 'prompts', promptDate), {
    prompt,
    date: promptDate,
    createdAt: serverTimestamp(),
    createdBy: userId,
  });
}

export async function getPromptByDate(date: string): Promise<DailyPrompt | null> {
  const promptDoc = await getDoc(doc(db, 'prompts', date));
  
  if (promptDoc.exists()) {
    const data = promptDoc.data();
    return {
      id: promptDoc.id,
      prompt: data.prompt,
      date: data.date,
      createdAt: data.createdAt?.toDate(),
      createdBy: data.createdBy,
    };
  }
  
  return null;
}

// Spoque Functions
export async function uploadAudio(audioBlob: Blob, userId: string): Promise<string> {
  const timestamp = Date.now();
  const fileName = `spoques/${userId}/${timestamp}.webm`;
  const storageRef = ref(storage, fileName);
  
  await uploadBytes(storageRef, audioBlob);
  const downloadURL = await getDownloadURL(storageRef);
  
  return downloadURL;
}

export async function createSpoque(
  userId: string,
  username: string,
  userPhotoURL: string | undefined,
  audioURL: string,
  promptId: string,
  promptText: string,
  caption?: string
): Promise<string> {
  const today = getTodayString();
  const spoqueRef = doc(collection(db, 'spoques'));
  
  await setDoc(spoqueRef, {
    userId,
    username,
    userPhotoURL: userPhotoURL || null,
    audioURL,
    caption: caption || null,
    promptId,
    promptText,
    date: today,
    likes: 0,
    likedBy: [],
    createdAt: serverTimestamp(),
  });
  
  return spoqueRef.id;
}

export async function getTodaySpoques(): Promise<Spoque[]> {
  const today = getTodayString();
  const spoquesQuery = query(
    collection(db, 'spoques'),
    where('date', '==', today),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(spoquesQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username,
      userPhotoURL: data.userPhotoURL,
      audioURL: data.audioURL,
      caption: data.caption,
      promptId: data.promptId,
      promptText: data.promptText,
      date: data.date,
      likes: data.likes || 0,
      likedBy: data.likedBy || [],
      createdAt: data.createdAt?.toDate(),
    };
  });
}

export async function getUserSpoques(userId: string): Promise<Spoque[]> {
  const spoquesQuery = query(
    collection(db, 'spoques'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(spoquesQuery);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      username: data.username,
      userPhotoURL: data.userPhotoURL,
      audioURL: data.audioURL,
      caption: data.caption,
      promptId: data.promptId,
      promptText: data.promptText,
      date: data.date,
      likes: data.likes || 0,
      likedBy: data.likedBy || [],
      createdAt: data.createdAt?.toDate(),
    };
  });
}

export async function getSpoqueById(spoqueId: string): Promise<Spoque | null> {
  const spoqueDoc = await getDoc(doc(db, 'spoques', spoqueId));
  
  if (spoqueDoc.exists()) {
    const data = spoqueDoc.data();
    return {
      id: spoqueDoc.id,
      userId: data.userId,
      username: data.username,
      userPhotoURL: data.userPhotoURL,
      audioURL: data.audioURL,
      caption: data.caption,
      promptId: data.promptId,
      promptText: data.promptText,
      date: data.date,
      likes: data.likes || 0,
      likedBy: data.likedBy || [],
      createdAt: data.createdAt?.toDate(),
    };
  }
  
  return null;
}

export async function toggleLike(spoqueId: string, userId: string, isLiked: boolean): Promise<void> {
  const spoqueRef = doc(db, 'spoques', spoqueId);
  
  if (isLiked) {
    // Unlike
    await updateDoc(spoqueRef, {
      likes: increment(-1),
      likedBy: arrayRemove(userId),
    });
  } else {
    // Like
    await updateDoc(spoqueRef, {
      likes: increment(1),
      likedBy: arrayUnion(userId),
    });
  }
}

export async function hasUserPostedToday(userId: string): Promise<boolean> {
  const today = getTodayString();
  const spoquesQuery = query(
    collection(db, 'spoques'),
    where('userId', '==', userId),
    where('date', '==', today),
    limit(1)
  );
  
  const snapshot = await getDocs(spoquesQuery);
  return !snapshot.empty;
}

