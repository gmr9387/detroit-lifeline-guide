import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: Partial<UserProfile>, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = storageUtils.getUserProfile();
        if (storedUser) {
          // In a real app, you'd validate the session with the backend
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any email/password combination
      // In production, this would validate against your backend
      const mockUser: UserProfile = {
        id: crypto.randomUUID(),
        firstName: 'Demo',
        lastName: 'User',
        email,
        phone: '',
        householdSize: 1,
        hasChildren: false,
        income: '30k-45k',
        zipCode: '48201',
        primaryNeeds: ['housing', 'employment'],
        language: 'english',
        completedAt: new Date().toISOString(),
      };

      setUser(mockUser);
      storageUtils.saveUserProfile(mockUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: Partial<UserProfile>, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: UserProfile = {
        id: crypto.randomUUID(),
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        householdSize: userData.householdSize || 1,
        hasChildren: userData.hasChildren || false,
        income: userData.income || 'prefer-not-say',
        zipCode: userData.zipCode || '',
        primaryNeeds: userData.primaryNeeds || [],
        language: userData.language || 'english',
        completedAt: new Date().toISOString(),
      };

      setUser(newUser);
      storageUtils.saveUserProfile(newUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    storageUtils.clearAllData();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      storageUtils.saveUserProfile(updatedUser);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Profile update failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const resetPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would send a reset email
      console.log(`Password reset email sent to ${email}`);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Password reset failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would validate current password and update
      console.log('Password changed successfully');
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Password change failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};