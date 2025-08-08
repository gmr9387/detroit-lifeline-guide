import { supabase, auth, profiles, applications, businessLicenses, community, analytics } from '@/lib/supabase';
import { storageUtils } from './localStorage';
import { SyncManager, PerformanceMonitor } from './scalability';

// Hybrid storage manager that works with both local storage and Supabase
export class HybridStorage {
  private static isOnline = navigator.onLine;
  private static syncQueue: Array<{ type: string; data: any; timestamp: number }> = [];

  // Initialize online/offline detection
  static init() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingChanges();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });

    // Check initial online status
    this.isOnline = navigator.onLine;
  }

  // User profile management
  static async getUserProfile(): Promise<any> {
    const timer = PerformanceMonitor.startTimer('getUserProfile');
    
    try {
      if (this.isOnline) {
        const { user } = await auth.getCurrentUser();
        if (user) {
          const { data, error } = await profiles.getProfile(user.id);
          if (data) {
            // Cache in local storage
            storageUtils.saveUserProfile(data);
            PerformanceMonitor.endTimer(timer);
            return data;
          }
        }
      }
      
      // Fallback to local storage
      const localProfile = storageUtils.getUserProfile();
      PerformanceMonitor.endTimer(timer);
      return localProfile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      const localProfile = storageUtils.getUserProfile();
      PerformanceMonitor.endTimer(timer);
      return localProfile;
    }
  }

  static async saveUserProfile(profile: any): Promise<void> {
    const timer = PerformanceMonitor.startTimer('saveUserProfile');
    
    // Always save to local storage first
    storageUtils.saveUserProfile(profile);
    
    if (this.isOnline) {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          await profiles.updateProfile(user.id, profile);
        } else {
          // Queue for sync when user logs in
          this.addToSyncQueue('profile', profile);
        }
      } catch (error) {
        console.error('Error saving profile to Supabase:', error);
        this.addToSyncQueue('profile', profile);
      }
    } else {
      this.addToSyncQueue('profile', profile);
    }
    
    PerformanceMonitor.endTimer(timer);
  }

  // Applications management
  static async getApplications(): Promise<any[]> {
    const timer = PerformanceMonitor.startTimer('getApplications');
    
    try {
      if (this.isOnline) {
        const { user } = await auth.getCurrentUser();
        if (user) {
          const { data, error } = await applications.getUserApplications(user.id);
          if (data) {
            // Cache in local storage
            localStorage.setItem('applications_cache', JSON.stringify(data));
            PerformanceMonitor.endTimer(timer);
            return data;
          }
        }
      }
      
      // Fallback to local storage
      const localApplications = storageUtils.getApplications();
      PerformanceMonitor.endTimer(timer);
      return localApplications;
    } catch (error) {
      console.error('Error getting applications:', error);
      const localApplications = storageUtils.getApplications();
      PerformanceMonitor.endTimer(timer);
      return localApplications;
    }
  }

  static async saveApplication(application: any): Promise<void> {
    const timer = PerformanceMonitor.startTimer('saveApplication');
    
    // Always save to local storage first
    storageUtils.saveApplication(application);
    
    if (this.isOnline) {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          await applications.createApplication({
            ...application,
            user_id: user.id
          });
        } else {
          this.addToSyncQueue('application', application);
        }
      } catch (error) {
        console.error('Error saving application to Supabase:', error);
        this.addToSyncQueue('application', application);
      }
    } else {
      this.addToSyncQueue('application', application);
    }
    
    PerformanceMonitor.endTimer(timer);
  }

  // Business license applications
  static async getBusinessLicenseApplications(): Promise<any[]> {
    const timer = PerformanceMonitor.startTimer('getBusinessLicenseApplications');
    
    try {
      if (this.isOnline) {
        const { user } = await auth.getCurrentUser();
        if (user) {
          const { data, error } = await businessLicenses.getUserLicenseApplications(user.id);
          if (data) {
            localStorage.setItem('business_license_applications_cache', JSON.stringify(data));
            PerformanceMonitor.endTimer(timer);
            return data;
          }
        }
      }
      
      // Fallback to local storage
      const localApplications = JSON.parse(localStorage.getItem('business_license_applications') || '[]');
      PerformanceMonitor.endTimer(timer);
      return localApplications;
    } catch (error) {
      console.error('Error getting business license applications:', error);
      const localApplications = JSON.parse(localStorage.getItem('business_license_applications') || '[]');
      PerformanceMonitor.endTimer(timer);
      return localApplications;
    }
  }

  static async saveBusinessLicenseApplication(application: any): Promise<void> {
    const timer = PerformanceMonitor.startTimer('saveBusinessLicenseApplication');
    
    // Always save to local storage first
    const existingApplications = JSON.parse(localStorage.getItem('business_license_applications') || '[]');
    const updatedApplications = [...existingApplications, application];
    localStorage.setItem('business_license_applications', JSON.stringify(updatedApplications));
    
    if (this.isOnline) {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          await businessLicenses.createLicenseApplication({
            ...application,
            user_id: user.id
          });
        } else {
          this.addToSyncQueue('businessLicense', application);
        }
      } catch (error) {
        console.error('Error saving business license application to Supabase:', error);
        this.addToSyncQueue('businessLicense', application);
      }
    } else {
      this.addToSyncQueue('businessLicense', application);
    }
    
    PerformanceMonitor.endTimer(timer);
  }

  // Community data (businesses, markets)
  static async getLocalBusinesses(): Promise<any[]> {
    const timer = PerformanceMonitor.startTimer('getLocalBusinesses');
    
    try {
      if (this.isOnline) {
        const { data, error } = await community.getLocalBusinesses();
        if (data) {
          localStorage.setItem('local_businesses_cache', JSON.stringify(data));
          PerformanceMonitor.endTimer(timer);
          return data;
        }
      }
      
      // Fallback to local storage
      const cachedBusinesses = JSON.parse(localStorage.getItem('local_businesses_cache') || '[]');
      if (cachedBusinesses.length > 0) {
        PerformanceMonitor.endTimer(timer);
        return cachedBusinesses;
      }
      
      // Return static data if no cache
      const staticBusinesses = await import('@/data/localBusinesses.json');
      PerformanceMonitor.endTimer(timer);
      return staticBusinesses.localBusinesses;
    } catch (error) {
      console.error('Error getting local businesses:', error);
      const staticBusinesses = await import('@/data/localBusinesses.json');
      PerformanceMonitor.endTimer(timer);
      return staticBusinesses.localBusinesses;
    }
  }

  static async getFarmersMarkets(): Promise<any[]> {
    const timer = PerformanceMonitor.startTimer('getFarmersMarkets');
    
    try {
      if (this.isOnline) {
        const { data, error } = await community.getFarmersMarkets();
        if (data) {
          localStorage.setItem('farmers_markets_cache', JSON.stringify(data));
          PerformanceMonitor.endTimer(timer);
          return data;
        }
      }
      
      // Fallback to local storage
      const cachedMarkets = JSON.parse(localStorage.getItem('farmers_markets_cache') || '[]');
      if (cachedMarkets.length > 0) {
        PerformanceMonitor.endTimer(timer);
        return cachedMarkets;
      }
      
      // Return static data if no cache
      const staticMarkets = await import('@/data/localBusinesses.json');
      PerformanceMonitor.endTimer(timer);
      return staticMarkets.farmersMarkets;
    } catch (error) {
      console.error('Error getting farmers markets:', error);
      const staticMarkets = await import('@/data/localBusinesses.json');
      PerformanceMonitor.endTimer(timer);
      return staticMarkets.farmersMarkets;
    }
  }

  // Analytics tracking
  static async trackPageView(page: string): Promise<void> {
    if (this.isOnline) {
      try {
        const { user } = await auth.getCurrentUser();
        await analytics.trackPageView(page, user?.id);
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    }
    
    // Always track locally for offline analytics
    const localAnalytics = JSON.parse(localStorage.getItem('analytics') || '[]');
    localAnalytics.push({
      type: 'page_view',
      page,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem('analytics', JSON.stringify(localAnalytics));
  }

  static async trackApplicationStart(programId: string): Promise<void> {
    if (this.isOnline) {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          await analytics.trackApplicationStart(programId, user.id);
        }
      } catch (error) {
        console.error('Error tracking application start:', error);
      }
    }
  }

  static async trackTrainingCompletion(licenseId: string, moduleId: string): Promise<void> {
    if (this.isOnline) {
      try {
        const { user } = await auth.getCurrentUser();
        if (user) {
          await analytics.trackTrainingCompletion(licenseId, moduleId, user.id);
        }
      } catch (error) {
        console.error('Error tracking training completion:', error);
      }
    }
  }

  // Sync management
  private static addToSyncQueue(type: string, data: any): void {
    this.syncQueue.push({
      type,
      data,
      timestamp: Date.now()
    });
    
    // Save queue to local storage
    localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue));
  }

  static async syncPendingChanges(): Promise<void> {
    if (!this.isOnline) return;
    
    const queue = JSON.parse(localStorage.getItem('sync_queue') || '[]');
    if (queue.length === 0) return;
    
    const { user } = await auth.getCurrentUser();
    if (!user) return;
    
    for (const item of queue) {
      try {
        switch (item.type) {
          case 'profile':
            await profiles.updateProfile(user.id, item.data);
            break;
          case 'application':
            await applications.createApplication({
              ...item.data,
              user_id: user.id
            });
            break;
          case 'businessLicense':
            await businessLicenses.createLicenseApplication({
              ...item.data,
              user_id: user.id
            });
            break;
        }
      } catch (error) {
        console.error(`Error syncing ${item.type}:`, error);
      }
    }
    
    // Clear queue after successful sync
    this.syncQueue = [];
    localStorage.removeItem('sync_queue');
  }

  // Authentication helpers
  static async signIn(email: string, password: string): Promise<any> {
    const { data, error } = await auth.signIn(email, password);
    if (data?.user) {
      // Sync pending changes after login
      await this.syncPendingChanges();
    }
    return { data, error };
  }

  static async signUp(email: string, password: string, userData: any): Promise<any> {
    const { data, error } = await auth.signUp(email, password, userData);
    if (data?.user) {
      // Create profile after signup
      await profiles.createProfile({
        id: data.user.id,
        ...userData
      });
    }
    return { data, error };
  }

  static async signOut(): Promise<void> {
    await auth.signOut();
    // Clear local caches
    localStorage.removeItem('applications_cache');
    localStorage.removeItem('business_license_applications_cache');
    localStorage.removeItem('local_businesses_cache');
    localStorage.removeItem('farmers_markets_cache');
  }

  // Cache management
  static clearCache(): void {
    localStorage.removeItem('applications_cache');
    localStorage.removeItem('business_license_applications_cache');
    localStorage.removeItem('local_businesses_cache');
    localStorage.removeItem('farmers_markets_cache');
    localStorage.removeItem('sync_queue');
    localStorage.removeItem('analytics');
  }

  // Health check
  static async healthCheck(): Promise<{ online: boolean; supabase: boolean; local: boolean }> {
    const result = {
      online: this.isOnline,
      supabase: false,
      local: true
    };
    
    if (this.isOnline) {
      try {
        const { data } = await supabase.from('profiles').select('count').limit(1);
        result.supabase = true;
      } catch (error) {
        console.error('Supabase health check failed:', error);
      }
    }
    
    return result;
  }
}

// Initialize hybrid storage
HybridStorage.init();