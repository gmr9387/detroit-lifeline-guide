import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// User management
export const auth = {
  // Sign up with email
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  // Sign in with email
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  },

  // Update password
  updatePassword: async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    });
    return { data, error };
  }
};

// User profiles
export const profiles = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    return { data, error };
  },

  // Create user profile
  createProfile: async (profile: any) => {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile);
    return { data, error };
  }
};

// Applications management
export const applications = {
  // Get user applications
  getUserApplications: async (userId: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Create application
  createApplication: async (application: any) => {
    const { data, error } = await supabase
      .from('applications')
      .insert(application);
    return { data, error };
  },

  // Update application
  updateApplication: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id);
    return { data, error };
  },

  // Delete application
  deleteApplication: async (id: string) => {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);
    return { error };
  }
};

// Business license applications
export const businessLicenses = {
  // Get user license applications
  getUserLicenseApplications: async (userId: string) => {
    const { data, error } = await supabase
      .from('business_license_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Create license application
  createLicenseApplication: async (application: any) => {
    const { data, error } = await supabase
      .from('business_license_applications')
      .insert(application);
    return { data, error };
  },

  // Update license application
  updateLicenseApplication: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('business_license_applications')
      .update(updates)
      .eq('id', id);
    return { data, error };
  },

  // Get license training progress
  getTrainingProgress: async (userId: string, licenseId: string) => {
    const { data, error } = await supabase
      .from('training_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('license_id', licenseId)
      .single();
    return { data, error };
  },

  // Update training progress
  updateTrainingProgress: async (userId: string, licenseId: string, progress: any) => {
    const { data, error } = await supabase
      .from('training_progress')
      .upsert({
        user_id: userId,
        license_id: licenseId,
        ...progress
      });
    return { data, error };
  }
};

// Local businesses and markets
export const community = {
  // Get all local businesses
  getLocalBusinesses: async () => {
    const { data, error } = await supabase
      .from('local_businesses')
      .select('*')
      .order('name');
    return { data, error };
  },

  // Get businesses by category
  getBusinessesByCategory: async (category: string) => {
    const { data, error } = await supabase
      .from('local_businesses')
      .select('*')
      .eq('category', category)
      .order('name');
    return { data, error };
  },

  // Get farmers markets
  getFarmersMarkets: async () => {
    const { data, error } = await supabase
      .from('farmers_markets')
      .select('*')
      .order('name');
    return { data, error };
  },

  // Get market vendors
  getMarketVendors: async (marketId: string) => {
    const { data, error } = await supabase
      .from('market_vendors')
      .select('*')
      .eq('market_id', marketId)
      .order('name');
    return { data, error };
  },

  // Add business review
  addBusinessReview: async (review: any) => {
    const { data, error } = await supabase
      .from('business_reviews')
      .insert(review);
    return { data, error };
  },

  // Get business reviews
  getBusinessReviews: async (businessId: string) => {
    const { data, error } = await supabase
      .from('business_reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
    return { data, error };
  }
};

// Analytics and tracking
export const analytics = {
  // Track page view
  trackPageView: async (page: string, userId?: string) => {
    const { data, error } = await supabase
      .from('page_views')
      .insert({
        page,
        user_id: userId,
        timestamp: new Date().toISOString()
      });
    return { data, error };
  },

  // Track application start
  trackApplicationStart: async (programId: string, userId: string) => {
    const { data, error } = await supabase
      .from('application_events')
      .insert({
        program_id: programId,
        user_id: userId,
        event_type: 'started',
        timestamp: new Date().toISOString()
      });
    return { data, error };
  },

  // Track training completion
  trackTrainingCompletion: async (licenseId: string, moduleId: string, userId: string) => {
    const { data, error } = await supabase
      .from('training_events')
      .insert({
        license_id: licenseId,
        module_id: moduleId,
        user_id: userId,
        event_type: 'completed',
        timestamp: new Date().toISOString()
      });
    return { data, error };
  }
};

// Real-time subscriptions
export const realtime = {
  // Subscribe to application updates
  subscribeToApplications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`applications:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'applications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  // Subscribe to training progress
  subscribeToTrainingProgress: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`training:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'training_progress',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  },

  // Subscribe to business updates
  subscribeToBusinessUpdates: (callback: (payload: any) => void) => {
    return supabase
      .channel('business_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'local_businesses'
      }, callback)
      .subscribe();
  }
};

// File uploads
export const storage = {
  // Upload document
  uploadDocument: async (file: File, userId: string, type: string) => {
    const fileName = `${userId}/${type}/${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('documents')
      .upload(fileName, file);
    return { data, error };
  },

  // Get document URL
  getDocumentUrl: (path: string) => {
    const { data } = supabase.storage
      .from('documents')
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Delete document
  deleteDocument: async (path: string) => {
    const { error } = await supabase.storage
      .from('documents')
      .remove([path]);
    return { error };
  }
};

// Notifications
export const notifications = {
  // Create notification
  createNotification: async (notification: any) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification);
    return { data, error };
  },

  // Get user notifications
  getUserNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Mark notification as read
  markNotificationRead: async (id: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);
    return { data, error };
  },

  // Subscribe to notifications
  subscribeToNotifications: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe();
  }
};

// Search functionality
export const search = {
  // Search programs
  searchPrograms: async (query: string) => {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    return { data, error };
  },

  // Search businesses
  searchBusinesses: async (query: string) => {
    const { data, error } = await supabase
      .from('local_businesses')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    return { data, error };
  },

  // Search licenses
  searchLicenses: async (query: string) => {
    const { data, error } = await supabase
      .from('business_licenses')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    return { data, error };
  }
};

// Export all functions
export default {
  auth,
  profiles,
  applications,
  businessLicenses,
  community,
  analytics,
  realtime,
  storage,
  notifications,
  search
};