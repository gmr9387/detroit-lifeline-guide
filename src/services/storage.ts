// IndexedDB Storage Service
// Replaces localStorage with more robust browser-native data storage

import { UserProfile, Application } from '@/types';

interface StorageSchema {
  userProfile: UserProfile;
  applications: Application[];
  favorites: string[];
  searchHistory: string[];
  offlineData: any;
  appSettings: any;
}

class IndexedDBStorage {
  private dbName = 'DetroitNavigatorDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // Initialize the database
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Error opening IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('userProfile')) {
          db.createObjectStore('userProfile', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('applications')) {
          const applicationStore = db.createObjectStore('applications', { keyPath: 'id' });
          applicationStore.createIndex('programId', 'programId', { unique: false });
          applicationStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('searchHistory')) {
          const searchStore = db.createObjectStore('searchHistory', { keyPath: 'id', autoIncrement: true });
          searchStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('offlineData')) {
          const offlineStore = db.createObjectStore('offlineData', { keyPath: 'key' });
          offlineStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('appSettings')) {
          db.createObjectStore('appSettings', { keyPath: 'key' });
        }
      };
    });
  }

  // Ensure database is initialized
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    if (!this.db) {
      throw new Error('Failed to initialize database');
    }
    return this.db;
  }

  // Generic get method
  private async get<T>(storeName: string, key: string): Promise<T | null> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      
      request.onsuccess = () => {
        resolve(request.result || null);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Generic put method
  private async put(storeName: string, data: any): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Generic delete method
  private async delete(storeName: string, key: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.delete(key);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // Generic getAll method
  private async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  // User Profile methods
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.put('userProfile', profile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const profiles = await this.getAll<UserProfile>('userProfile');
    return profiles.length > 0 ? profiles[0] : null;
  }

  async deleteUserProfile(): Promise<void> {
    const profile = await this.getUserProfile();
    if (profile) {
      await this.delete('userProfile', profile.id);
    }
  }

  // Applications methods
  async saveApplication(application: Application): Promise<void> {
    await this.put('applications', application);
  }

  async getApplications(): Promise<Application[]> {
    return await this.getAll<Application>('applications');
  }

  async getApplication(id: string): Promise<Application | null> {
    return await this.get<Application>('applications', id);
  }

  async getApplicationsByProgram(programId: string): Promise<Application[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['applications'], 'readonly');
    const store = transaction.objectStore('applications');
    const index = store.index('programId');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(programId);
      
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async deleteApplication(id: string): Promise<void> {
    await this.delete('applications', id);
  }

  // Favorites methods
  async addToFavorites(programId: string): Promise<void> {
    const favorite = {
      id: programId,
      programId,
      addedAt: new Date().toISOString()
    };
    await this.put('favorites', favorite);
  }

  async removeFromFavorites(programId: string): Promise<void> {
    await this.delete('favorites', programId);
  }

  async getFavorites(): Promise<string[]> {
    const favorites = await this.getAll<{ id: string; programId: string }>('favorites');
    return favorites.map(fav => fav.programId);
  }

  async isFavorite(programId: string): Promise<boolean> {
    const favorite = await this.get('favorites', programId);
    return !!favorite;
  }

  // Search History methods
  async addToSearchHistory(query: string): Promise<void> {
    const searchEntry = {
      query,
      timestamp: Date.now()
    };
    
    // Remove duplicate entries
    await this.removeFromSearchHistory(query);
    
    // Add new entry
    await this.put('searchHistory', searchEntry);
    
    // Keep only last 10 searches
    const history = await this.getSearchHistory();
    if (history.length > 10) {
      const db = await this.ensureDB();
      const transaction = db.transaction(['searchHistory'], 'readwrite');
      const store = transaction.objectStore('searchHistory');
      const index = store.index('timestamp');
      
      // Get oldest entries to delete
      const request = index.openCursor();
      let deleteCount = history.length - 10;
      
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && deleteCount > 0) {
          cursor.delete();
          deleteCount--;
          cursor.continue();
        }
      };
    }
  }

  async getSearchHistory(): Promise<string[]> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['searchHistory'], 'readonly');
    const store = transaction.objectStore('searchHistory');
    const index = store.index('timestamp');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll();
      
      request.onsuccess = () => {
        const results = request.result || [];
        // Sort by timestamp descending and extract queries
        const queries = results
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(entry => entry.query);
        resolve(queries);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async removeFromSearchHistory(query: string): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['searchHistory'], 'readwrite');
    const store = transaction.objectStore('searchHistory');
    
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        if (cursor.value.query === query) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
  }

  async clearSearchHistory(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['searchHistory'], 'readwrite');
    const store = transaction.objectStore('searchHistory');
    await store.clear();
  }

  // Offline Data methods
  async saveOfflineData(key: string, data: any): Promise<void> {
    const offlineEntry = {
      key,
      data,
      timestamp: Date.now()
    };
    await this.put('offlineData', offlineEntry);
  }

  async getOfflineData(key: string): Promise<any> {
    const entry = await this.get<{ key: string; data: any; timestamp: number }>('offlineData', key);
    return entry?.data || null;
  }

  async clearOfflineData(): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction(['offlineData'], 'readwrite');
    const store = transaction.objectStore('offlineData');
    await store.clear();
  }

  // App Settings methods
  async saveSetting(key: string, value: any): Promise<void> {
    const setting = { key, value };
    await this.put('appSettings', setting);
  }

  async getSetting(key: string): Promise<any> {
    const setting = await this.get<{ key: string; value: any }>('appSettings', key);
    return setting?.value || null;
  }

  async deleteSetting(key: string): Promise<void> {
    await this.delete('appSettings', key);
  }

  // Bulk operations
  async exportData(): Promise<any> {
    try {
      const [profile, applications, favorites, searchHistory, settings] = await Promise.all([
        this.getUserProfile(),
        this.getApplications(),
        this.getFavorites(),
        this.getSearchHistory(),
        this.getAll('appSettings')
      ]);

      return {
        profile,
        applications,
        favorites,
        searchHistory,
        settings,
        exportDate: new Date().toISOString(),
        version: this.dbVersion
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importData(data: any): Promise<void> {
    try {
      if (data.profile) {
        await this.saveUserProfile(data.profile);
      }

      if (data.applications) {
        for (const app of data.applications) {
          await this.saveApplication(app);
        }
      }

      if (data.favorites) {
        for (const programId of data.favorites) {
          await this.addToFavorites(programId);
        }
      }

      if (data.searchHistory) {
        for (const query of data.searchHistory) {
          await this.addToSearchHistory(query);
        }
      }

      if (data.settings) {
        for (const setting of data.settings) {
          await this.saveSetting(setting.key, setting.value);
        }
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      const db = await this.ensureDB();
      const storeNames = ['userProfile', 'applications', 'favorites', 'searchHistory', 'offlineData', 'appSettings'];
      
      for (const storeName of storeNames) {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
      }
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  // Database maintenance
  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0
      };
    }
    return { used: 0, quota: 0 };
  }

  async compactDatabase(): Promise<void> {
    // Clean up old offline data (older than 30 days)
    const db = await this.ensureDB();
    const transaction = db.transaction(['offlineData'], 'readwrite');
    const store = transaction.objectStore('offlineData');
    const index = store.index('timestamp');
    
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const range = IDBKeyRange.upperBound(thirtyDaysAgo);
    
    const request = index.openCursor(range);
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        cursor.delete();
        cursor.continue();
      }
    };
  }
}

// Fallback to localStorage if IndexedDB is not available
class LocalStorageFallback {
  private prefix = 'detroit_navigator_';

  async init(): Promise<void> {
    // No initialization needed for localStorage
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    localStorage.setItem(`${this.prefix}profile`, JSON.stringify(profile));
  }

  async getUserProfile(): Promise<UserProfile | null> {
    const stored = localStorage.getItem(`${this.prefix}profile`);
    return stored ? JSON.parse(stored) : null;
  }

  async getApplications(): Promise<Application[]> {
    const stored = localStorage.getItem(`${this.prefix}applications`);
    return stored ? JSON.parse(stored) : [];
  }

  async saveApplication(application: Application): Promise<void> {
    const applications = await this.getApplications();
    const index = applications.findIndex(app => app.id === application.id);
    
    if (index >= 0) {
      applications[index] = application;
    } else {
      applications.push(application);
    }
    
    localStorage.setItem(`${this.prefix}applications`, JSON.stringify(applications));
  }

  async getFavorites(): Promise<string[]> {
    const stored = localStorage.getItem(`${this.prefix}favorites`);
    return stored ? JSON.parse(stored) : [];
  }

  async addToFavorites(programId: string): Promise<void> {
    const favorites = await this.getFavorites();
    if (!favorites.includes(programId)) {
      favorites.push(programId);
      localStorage.setItem(`${this.prefix}favorites`, JSON.stringify(favorites));
    }
  }

  async removeFromFavorites(programId: string): Promise<void> {
    const favorites = await this.getFavorites();
    const filtered = favorites.filter(id => id !== programId);
    localStorage.setItem(`${this.prefix}favorites`, JSON.stringify(filtered));
  }

  async clearAllData(): Promise<void> {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix));
    keys.forEach(key => localStorage.removeItem(key));
  }
}

// Storage factory
class StorageService {
  private storage: IndexedDBStorage | LocalStorageFallback;
  private initialized = false;

  constructor() {
    // Check if IndexedDB is available
    if ('indexedDB' in window) {
      this.storage = new IndexedDBStorage();
    } else {
      console.warn('IndexedDB not available, falling back to localStorage');
      this.storage = new LocalStorageFallback();
    }
  }

  async init(): Promise<void> {
    if (!this.initialized) {
      await this.storage.init();
      this.initialized = true;
    }
  }

  // Proxy all methods to the underlying storage
  async saveUserProfile(profile: UserProfile): Promise<void> {
    await this.init();
    return this.storage.saveUserProfile(profile);
  }

  async getUserProfile(): Promise<UserProfile | null> {
    await this.init();
    return this.storage.getUserProfile();
  }

  async saveApplication(application: Application): Promise<void> {
    await this.init();
    return this.storage.saveApplication(application);
  }

  async getApplications(): Promise<Application[]> {
    await this.init();
    return this.storage.getApplications();
  }

  async addToFavorites(programId: string): Promise<void> {
    await this.init();
    return this.storage.addToFavorites(programId);
  }

  async removeFromFavorites(programId: string): Promise<void> {
    await this.init();
    return this.storage.removeFromFavorites(programId);
  }

  async getFavorites(): Promise<string[]> {
    await this.init();
    return this.storage.getFavorites();
  }

  async clearAllData(): Promise<void> {
    await this.init();
    return this.storage.clearAllData();
  }

  // Enhanced methods available only with IndexedDB
  async addToSearchHistory(query: string): Promise<void> {
    await this.init();
    if (this.storage instanceof IndexedDBStorage) {
      return this.storage.addToSearchHistory(query);
    }
  }

  async getSearchHistory(): Promise<string[]> {
    await this.init();
    if (this.storage instanceof IndexedDBStorage) {
      return this.storage.getSearchHistory();
    }
    return [];
  }

  async exportData(): Promise<any> {
    await this.init();
    if (this.storage instanceof IndexedDBStorage) {
      return this.storage.exportData();
    }
    throw new Error('Data export not available with localStorage fallback');
  }

  async importData(data: any): Promise<void> {
    await this.init();
    if (this.storage instanceof IndexedDBStorage) {
      return this.storage.importData(data);
    }
    throw new Error('Data import not available with localStorage fallback');
  }
}

export const storageService = new StorageService();
export default storageService;