'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { SpoqueCard } from '@/components/feed/SpoqueCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getUserSpoques } from '@/lib/api';
import { Spoque } from '@/lib/types';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [spoques, setSpoques] = useState<Spoque[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // Get user by username
      const usersQuery = query(
        collection(db, 'users'),
        where('username', '==', username),
        limit(1)
      );
      const userSnapshot = await getDocs(usersQuery);

      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const userId = userSnapshot.docs[0].id;
        setUserProfile({ ...userData, uid: userId });

        // Get user's spoques
        const spoquesData = await getUserSpoques(userId);
        setSpoques(spoquesData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">User not found</h2>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={userProfile.photoURL} alt={username} />
              <AvatarFallback className="text-3xl">
                {username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">@{username}</h1>
              <p className="text-muted-foreground">
                {spoques.length} Spoque{spoques.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Spoques Archive */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Archive</h2>
            {spoques.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No Spoques yet
              </div>
            ) : (
              <div className="space-y-4">
                {spoques.map((spoque) => (
                  <SpoqueCard key={spoque.id} spoque={spoque} autoplay={false} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

