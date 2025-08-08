import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, auth } from '@/lib/supabase';
import { HybridStorage } from '@/utils/hybridStorage';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  household_size: number;
  has_children: boolean;
  income: string;
  zip_code: string;
  primary_needs: string[];
  language: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId: string) => {
    try {
      const profileData = await HybridStorage.getUserProfile();
      if (profileData) {
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await HybridStorage.signIn(email, password);
    if (result.data?.user) {
      setUser(result.data.user);
      await loadUserProfile(result.data.user.id);
    }
    return result;
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const result = await HybridStorage.signUp(email, password, userData);
    if (result.data?.user) {
      setUser(result.data.user);
      await loadUserProfile(result.data.user.id);
    }
    return result;
  };

  const signOut = async () => {
    await HybridStorage.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    const updatedProfile = { ...profile, ...updates };
    await HybridStorage.saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const refreshProfile = async () => {
    if (!user) return;
    await loadUserProfile(user.id);
  };

  const value: UserContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    refreshProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};