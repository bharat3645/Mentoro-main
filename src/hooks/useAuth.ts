import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, signIn, signUp, signOut, getCurrentUser, getProfile } from '../lib/supabase';
import { profileAPI } from '../services/api';

interface Profile {
  id: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  total_xp: number;
  streak_days: number;
  rank: string;
  total_battles: number;
  battles_won: number;
  quests_completed: number;
  cards_collected: number;
  contributions_accepted: number;
  current_theme: string;
  unlocked_themes: string[];
  mood: string;
  created_at?: string;
  updated_at?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    getCurrentUser().then((user) => {
      setUser(user);
      if (user) {
        loadProfile(user.id);
      } else {
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Error getting current user:', err);
      setError('Failed to authenticate');
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setError(null);
        
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      setLoading(true);
      
      // Try to get profile from Supabase first
      try {
        const profileData = await getProfile(userId);
        setProfile(profileData);
      } catch (supabaseError) {
        console.warn('Failed to load profile from Supabase, trying API fallback:', supabaseError);
        
        // Fallback to API or create demo profile
        try {
          const apiProfile = await profileAPI.getProfile();
          setProfile(apiProfile);
        } catch (apiError) {
          console.warn('API also unavailable, using demo profile:', apiError);
          
          // Create a demo profile for development
          const demoProfile: Profile = {
            id: userId,
            username: 'Demo User',
            avatar: '🚀',
            level: 1,
            xp: 0,
            total_xp: 0,
            streak_days: 0,
            rank: 'Bronze I',
            total_battles: 0,
            battles_won: 0,
            quests_completed: 0,
            cards_collected: 0,
            contributions_accepted: 0,
            current_theme: 'dark',
            unlocked_themes: ['dark'],
            mood: 'excited'
          };
          setProfile(demoProfile);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user.id);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;

    try {
      // Update local state immediately for better UX
      setProfile({ ...profile, ...updates });
      
      // Try to update via API
      try {
        await profileAPI.updateProfile({
          username: updates.username || profile.username,
          avatar: updates.avatar || profile.avatar
        });
      } catch (error) {
        console.warn('Failed to update profile via API, changes are local only:', error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Revert local changes on error
      await refreshProfile();
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await signIn(email, password);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      const data = await signUp(email, password, username);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setProfile(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    user,
    profile,
    loading,
    error,
    refreshProfile,
    updateProfile,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
};