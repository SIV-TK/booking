
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { usersData } from '@/lib/data';

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        // We find the user from our data source to make sure it's valid
        // In a real app, this would be an API call to verify session
        const validUser = usersData.find(u => u.id === parsedUser.id);
        if (validUser) {
          setUser(validUser);
        } else {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  return { user, loading };
}
