import { UserProfile, Application, TodoItem, Notification, ProgressMilestone } from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'detroit_navigator_profile',
  APPLICATIONS: 'detroit_navigator_applications',
  FAVORITES: 'detroit_navigator_favorites',
  SEARCH_HISTORY: 'detroit_navigator_search_history',
  TODO_ITEMS: 'detroit_navigator_todos',
  NOTIFICATIONS: 'detroit_navigator_notifications',
  PROGRESS_MILESTONES: 'detroit_navigator_milestones',
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
  },

  // Todo Items
  saveTodoItem: (todo: TodoItem): void => {
    const todos = getTodoItems();
    const existingIndex = todos.findIndex(t => t.id === todo.id);
    
    if (existingIndex >= 0) {
      todos[existingIndex] = todo;
    } else {
      todos.push(todo);
    }
    
    localStorage.setItem(STORAGE_KEYS.TODO_ITEMS, JSON.stringify(todos));
  },

  getTodoItems: (): TodoItem[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.TODO_ITEMS);
    return stored ? JSON.parse(stored) : [];
  },

  deleteTodoItem: (todoId: string): void => {
    const todos = getTodoItems();
    const filtered = todos.filter(t => t.id !== todoId);
    localStorage.setItem(STORAGE_KEYS.TODO_ITEMS, JSON.stringify(filtered));
  },

  toggleTodoComplete: (todoId: string): void => {
    const todos = getTodoItems();
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      todo.completed = !todo.completed;
      localStorage.setItem(STORAGE_KEYS.TODO_ITEMS, JSON.stringify(todos));
    }
  },

  // Notifications
  saveNotification: (notification: Notification): void => {
    const notifications = getNotifications();
    notifications.unshift(notification);
    const limited = notifications.slice(0, 50); // Keep last 50 notifications
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(limited));
  },

  getNotifications: (): Notification[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  markNotificationAsRead: (notificationId: string): void => {
    const notifications = getNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  },

  clearAllNotifications: (): void => {
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  },

  // Progress Milestones
  saveProgressMilestone: (milestone: ProgressMilestone): void => {
    const milestones = getProgressMilestones();
    const existingIndex = milestones.findIndex(m => m.id === milestone.id);
    
    if (existingIndex >= 0) {
      milestones[existingIndex] = milestone;
    } else {
      milestones.push(milestone);
    }
    
    localStorage.setItem(STORAGE_KEYS.PROGRESS_MILESTONES, JSON.stringify(milestones));
  },

  getProgressMilestones: (): ProgressMilestone[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS_MILESTONES);
    return stored ? JSON.parse(stored) : [];
  },

  getMilestonesForApplication: (applicationId: string): ProgressMilestone[] => {
    const milestones = getProgressMilestones();
    return milestones
      .filter(m => m.applicationId === applicationId)
      .sort((a, b) => a.order - b.order);
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

function getTodoItems(): TodoItem[] {
  return storageUtils.getTodoItems();
}

function getNotifications(): Notification[] {
  return storageUtils.getNotifications();
}

function getProgressMilestones(): ProgressMilestone[] {
  return storageUtils.getProgressMilestones();
}