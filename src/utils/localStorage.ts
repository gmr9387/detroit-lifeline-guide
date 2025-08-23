import { 
  UserProfile, 
  Application, 
  TodoItem, 
  Notification, 
  ProgressMilestone,
  Document,
  UserReview,
  SuccessStory,
  AnalyticsData,
  CommunityPost,
  CommunityReply,
  AdminUser,
  AdminProgram,
  SystemAnalytics,
  APIIntegration,
  SecurityAudit,
  DataEncryption,
  EnterpriseSettings
} from '@/types';

const STORAGE_KEYS = {
  USER_PROFILE: 'detroit_navigator_profile',
  APPLICATIONS: 'detroit_navigator_applications',
  FAVORITES: 'detroit_navigator_favorites',
  SEARCH_HISTORY: 'detroit_navigator_search_history',
  TODO_ITEMS: 'detroit_navigator_todos',
  NOTIFICATIONS: 'detroit_navigator_notifications',
  PROGRESS_MILESTONES: 'detroit_navigator_milestones',
  DOCUMENTS: 'detroit_navigator_documents',
  REVIEWS: 'detroit_navigator_reviews',
  SUCCESS_STORIES: 'detroit_navigator_success_stories',
  COMMUNITY_POSTS: 'detroit_navigator_community_posts',
  ANALYTICS: 'detroit_navigator_analytics',
  ADMIN_USERS: 'detroit_navigator_admin_users',
  ADMIN_PROGRAMS: 'detroit_navigator_admin_programs',
  SYSTEM_ANALYTICS: 'detroit_navigator_system_analytics',
  API_INTEGRATIONS: 'detroit_navigator_api_integrations',
  SECURITY_AUDIT: 'detroit_navigator_security_audit',
  ENCRYPTION_CONFIG: 'detroit_navigator_encryption_config',
  ENTERPRISE_SETTINGS: 'detroit_navigator_enterprise_settings',
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
  },

  // Documents
  saveDocument: (document: Document): void => {
    const documents = getDocuments();
    const existingIndex = documents.findIndex(d => d.id === document.id);
    
    if (existingIndex >= 0) {
      documents[existingIndex] = document;
    } else {
      documents.push(document);
    }
    
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  },

  getDocuments: (): Document[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    return stored ? JSON.parse(stored) : [];
  },

  getDocumentsForApplication: (applicationId: string): Document[] => {
    const documents = getDocuments();
    return documents.filter(d => d.applicationId === applicationId);
  },

  deleteDocument: (documentId: string): void => {
    const documents = getDocuments();
    const filtered = documents.filter(d => d.id !== documentId);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
  },

  // Reviews
  saveReview: (review: UserReview): void => {
    const reviews = getReviews();
    const existingIndex = reviews.findIndex(r => r.id === review.id);
    
    if (existingIndex >= 0) {
      reviews[existingIndex] = review;
    } else {
      reviews.push(review);
    }
    
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  },

  getReviews: (): UserReview[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return stored ? JSON.parse(stored) : [];
  },

  getReviewsForProgram: (programId: string): UserReview[] => {
    const reviews = getReviews();
    return reviews.filter(r => r.programId === programId);
  },

  // Success Stories
  saveSuccessStory: (story: SuccessStory): void => {
    const stories = getSuccessStories();
    const existingIndex = stories.findIndex(s => s.id === story.id);
    
    if (existingIndex >= 0) {
      stories[existingIndex] = story;
    } else {
      stories.push(story);
    }
    
    localStorage.setItem(STORAGE_KEYS.SUCCESS_STORIES, JSON.stringify(stories));
  },

  getSuccessStories: (): SuccessStory[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.SUCCESS_STORIES);
    return stored ? JSON.parse(stored) : [];
  },

  getSuccessStoriesForProgram: (programId: string): SuccessStory[] => {
    const stories = getSuccessStories();
    return stories.filter(s => s.programId === programId);
  },

  // Community Posts
  saveCommunityPost: (post: CommunityPost): void => {
    const posts = getCommunityPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      posts[existingIndex] = post;
    } else {
      posts.push(post);
    }
    
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
  },

  getCommunityPosts: (): CommunityPost[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    return stored ? JSON.parse(stored) : [];
  },

  addCommunityReply: (postId: string, reply: CommunityReply): void => {
    const posts = getCommunityPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex >= 0) {
      posts[postIndex].replies.push(reply);
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
    }
  },

  // Analytics
  saveAnalytics: (analytics: AnalyticsData): void => {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
  },

  getAnalytics: (): AnalyticsData | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return stored ? JSON.parse(stored) : null;
  },

  generateAnalytics: (): AnalyticsData => {
    const applications = getApplications();
    const reviews = getReviews();
    
    const totalApplications = applications.length;
    const approvedApplications = applications.filter(app => app.status === 'approved').length;
    const deniedApplications = applications.filter(app => app.status === 'denied').length;
    const successRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;
    
    // Calculate average wait time from reviews
    const waitTimes = reviews
      .filter(r => r.waitTime)
      .map(r => r.waitTime!);
    const averageWaitTime = waitTimes.length > 0 
      ? waitTimes.reduce((sum, time) => sum + time, 0) / waitTimes.length 
      : 0;

    // Generate monthly application data
    const monthlyData = applications.reduce((acc, app) => {
      const month = new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyApplications = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count
    }));

    // Calculate program success rates
    const programStats = applications.reduce((acc, app) => {
      if (!acc[app.programId]) {
        acc[app.programId] = { total: 0, approved: 0, programName: app.programName };
      }
      acc[app.programId].total++;
      if (app.status === 'approved') {
        acc[app.programId].approved++;
      }
      return acc;
    }, {} as Record<string, { total: number; approved: number; programName: string }>);

    const programSuccessRates = Object.entries(programStats).map(([programId, stats]) => ({
      programId,
      programName: stats.programName,
      successRate: (stats.approved / stats.total) * 100,
      averageWaitTime: 21 // Default average wait time
    }));

    const analytics: AnalyticsData = {
      totalApplications,
      approvedApplications,
      deniedApplications,
      averageWaitTime,
      successRate,
      totalBenefitsReceived: approvedApplications * 2, // Estimate
      monthlyApplications,
      programSuccessRates
    };

    saveAnalytics(analytics);
    return analytics;
  },

  // Admin Users
  saveAdminUser: (user: AdminUser): void => {
    const users = getAdminUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
  },

  getAdminUsers: (): AdminUser[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    return stored ? JSON.parse(stored) : [];
  },

  deleteAdminUser: (userId: string): void => {
    const users = getAdminUsers();
    const filtered = users.filter(u => u.id !== userId);
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(filtered));
  },

  // Admin Programs
  saveAdminProgram: (program: AdminProgram): void => {
    const programs = getAdminPrograms();
    const existingIndex = programs.findIndex(p => p.id === program.id);
    
    if (existingIndex >= 0) {
      programs[existingIndex] = program;
    } else {
      programs.push(program);
    }
    
    localStorage.setItem(STORAGE_KEYS.ADMIN_PROGRAMS, JSON.stringify(programs));
  },

  getAdminPrograms: (): AdminProgram[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_PROGRAMS);
    return stored ? JSON.parse(stored) : [];
  },

  deleteAdminProgram: (programId: string): void => {
    const programs = getAdminPrograms();
    const filtered = programs.filter(p => p.id !== programId);
    localStorage.setItem(STORAGE_KEYS.ADMIN_PROGRAMS, JSON.stringify(filtered));
  },

  // System Analytics
  saveSystemAnalytics: (analytics: SystemAnalytics): void => {
    localStorage.setItem(STORAGE_KEYS.SYSTEM_ANALYTICS, JSON.stringify(analytics));
  },

  getSystemAnalytics: (): SystemAnalytics | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.SYSTEM_ANALYTICS);
    return stored ? JSON.parse(stored) : null;
  },

  generateSystemAnalytics: (): SystemAnalytics => {
    const applications = getApplications();
    const users = getAdminUsers();
    const programs = getAdminPrograms();
    
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;
    const totalApplications = applications.length;
    const totalPrograms = programs.length;
    
    // Calculate top programs
    const programStats = applications.reduce((acc, app) => {
      if (!acc[app.programId]) {
        acc[app.programId] = { count: 0, approved: 0, programName: app.programName };
      }
      acc[app.programId].count++;
      if (app.status === 'approved') {
        acc[app.programId].approved++;
      }
      return acc;
    }, {} as Record<string, { count: number; approved: number; programName: string }>);

    const topPrograms = Object.entries(programStats)
      .map(([programId, stats]) => ({
        programId,
        programName: stats.programName,
        applicationCount: stats.count,
        successRate: (stats.approved / stats.count) * 100
      }))
      .sort((a, b) => b.applicationCount - a.applicationCount)
      .slice(0, 5);

    const analytics: SystemAnalytics = {
      totalUsers,
      activeUsers,
      totalApplications,
      totalPrograms,
      systemUptime: 99.9,
      averageResponseTime: 150,
      monthlyGrowth: 25,
      topPrograms,
      userEngagement: {
        dailyActiveUsers: Math.floor(activeUsers * 0.3),
        weeklyActiveUsers: Math.floor(activeUsers * 0.7),
        monthlyActiveUsers: activeUsers,
        averageSessionDuration: 8.5
      },
      performanceMetrics: {
        pageLoadTime: 1.2,
        apiResponseTime: 150,
        errorRate: 0.1,
        uptime: 99.9
      }
    };

    saveSystemAnalytics(analytics);
    return analytics;
  },

  // API Integrations
  saveAPIIntegration: (integration: APIIntegration): void => {
    const integrations = getAPIIntegrations();
    const existingIndex = integrations.findIndex(i => i.id === integration.id);
    
    if (existingIndex >= 0) {
      integrations[existingIndex] = integration;
    } else {
      integrations.push(integration);
    }
    
    localStorage.setItem(STORAGE_KEYS.API_INTEGRATIONS, JSON.stringify(integrations));
  },

  getAPIIntegrations: (): APIIntegration[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.API_INTEGRATIONS);
    return stored ? JSON.parse(stored) : [];
  },

  deleteAPIIntegration: (integrationId: string): void => {
    const integrations = getAPIIntegrations();
    const filtered = integrations.filter(i => i.id !== integrationId);
    localStorage.setItem(STORAGE_KEYS.API_INTEGRATIONS, JSON.stringify(filtered));
  },

  // Security Audit
  saveSecurityAudit: (audit: SecurityAudit): void => {
    const audits = getSecurityAudits();
    audits.unshift(audit);
    const limited = audits.slice(0, 1000); // Keep last 1000 audit entries
    localStorage.setItem(STORAGE_KEYS.SECURITY_AUDIT, JSON.stringify(limited));
  },

  getSecurityAudits: (): SecurityAudit[] => {
    const stored = localStorage.getItem(STORAGE_KEYS.SECURITY_AUDIT);
    return stored ? JSON.parse(stored) : [];
  },

  // Data Encryption
  saveEncryptionConfig: (config: DataEncryption): void => {
    localStorage.setItem(STORAGE_KEYS.ENCRYPTION_CONFIG, JSON.stringify(config));
  },

  getEncryptionConfig: (): DataEncryption | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_CONFIG);
    return stored ? JSON.parse(stored) : null;
  },

  // Enterprise Settings
  saveEnterpriseSettings: (settings: EnterpriseSettings): void => {
    localStorage.setItem(STORAGE_KEYS.ENTERPRISE_SETTINGS, JSON.stringify(settings));
  },

  getEnterpriseSettings: (): EnterpriseSettings | null => {
    const stored = localStorage.getItem(STORAGE_KEYS.ENTERPRISE_SETTINGS);
    return stored ? JSON.parse(stored) : null;
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

function getDocuments(): Document[] {
  return storageUtils.getDocuments();
}

function getReviews(): UserReview[] {
  return storageUtils.getReviews();
}

function getSuccessStories(): SuccessStory[] {
  return storageUtils.getSuccessStories();
}

function getCommunityPosts(): CommunityPost[] {
  return storageUtils.getCommunityPosts();
}

function getAdminUsers(): AdminUser[] {
  return storageUtils.getAdminUsers();
}

function getAdminPrograms(): AdminProgram[] {
  return storageUtils.getAdminPrograms();
}

function getAPIIntegrations(): APIIntegration[] {
  return storageUtils.getAPIIntegrations();
}