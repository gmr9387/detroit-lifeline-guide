import { UserProfile, Application } from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'detroit_navigator_profile',
  APPLICATIONS: 'detroit_navigator_applications',
  FAVORITES: 'detroit_navigator_favorites',
  SEARCH_HISTORY: 'detroit_navigator_search_history',
} as const;

export const storageUtils = {
  // User Profile
  saveUserProfile: (profile: UserProfile): void => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  getUserProfile: (): UserProfile | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return stored ? JSON.parse(stored) : null;
  },

  // Applications
  saveApplication: (application: Application): void => {
    const applications = getApplications();
    const existingIndex = applications.findIndex(app => app.id === application.id);
    
    if (existingIndex >= 0) {
      applications[existingIndex] = application;
    } else {
      applications.push(application);
    }
    
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  },

  getApplications: (): Application[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  // Favorites
  addToFavorites: (programId: string): void => {
    const favorites = getFavorites();
    if (!favorites.includes(programId)) {
      favorites.push(programId);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }
  },

  removeFromFavorites: (programId: string): void => {
    const favorites = getFavorites();
    const filtered = favorites.filter(id => id !== programId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  },

  getFavorites: (): string[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return stored ? JSON.parse(stored) : [];
  },

  // Search History
  addToSearchHistory: (query: string): void => {
    const history = getSearchHistory();
    const filtered = history.filter(h => h !== query);
    filtered.unshift(query);
    const limited = filtered.slice(0, 10); // Keep last 10 searches
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(limited));
  },

  getSearchHistory: (): string[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return stored ? JSON.parse(stored) : [];
  },

  clearSearchHistory: (): void => {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  },

  // Clear all data
  clearAllData: (): void => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

// Helper functions for internal use
function getApplications(): Application[] {
  return storageUtils.getApplications();
}

function getFavorites(): string[] {
  return storageUtils.getFavorites();
}

function getSearchHistory(): string[] {
  return storageUtils.getSearchHistory();
}