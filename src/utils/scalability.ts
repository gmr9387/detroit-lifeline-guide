// Scalability utilities for handling thousands of users
import { UserProfile, Application, BusinessLicenseApplication } from '@/types';

// Cache management for performance
class CacheManager {
  private cache = new Map<string, any>();
  private maxSize = 1000;
  private ttl = new Map<string, number>();

  set(key: string, value: any, ttlMs: number = 300000): void {
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }
    
    this.cache.set(key, value);
    this.ttl.set(key, Date.now() + ttlMs);
  }

  get(key: string): any | null {
    const value = this.cache.get(key);
    if (!value) return null;

    const expiry = this.ttl.get(key);
    if (expiry && Date.now() > expiry) {
      this.cache.delete(key);
      this.ttl.delete(key);
      return null;
    }

    return value;
  }

  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, expiry] of this.ttl) {
      if (expiry < oldestTime) {
        oldestTime = expiry;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.ttl.delete(oldestKey);
    }
  }

  clear(): void {
    this.cache.clear();
    this.ttl.clear();
  }
}

// Data pagination for large datasets
export class PaginationManager {
  static paginate<T>(data: T[], page: number, pageSize: number): {
    items: T[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
  } {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const items = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / pageSize);

    return {
      items,
      totalPages,
      currentPage: page,
      totalItems: data.length
    };
  }

  static getPageInfo(page: number, pageSize: number, totalItems: number) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      currentPage: page,
      totalPages,
      hasNext,
      hasPrev,
      startItem: (page - 1) * pageSize + 1,
      endItem: Math.min(page * pageSize, totalItems)
    };
  }
}

// Search and filtering for large datasets
export class SearchManager {
  static search<T>(
    data: T[],
    query: string,
    searchFields: (keyof T)[],
    filters?: Record<string, any>
  ): T[] {
    const normalizedQuery = query.toLowerCase().trim();
    
    let results = data.filter(item => {
      // Text search
      const matchesSearch = searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(normalizedQuery);
        }
        return false;
      });

      if (!matchesSearch) return false;

      // Apply filters
      if (filters) {
        return Object.entries(filters).every(([key, value]) => {
          const itemValue = (item as any)[key];
          if (Array.isArray(value)) {
            return value.includes(itemValue);
          }
          return itemValue === value;
        });
      }

      return true;
    });

    return results;
  }

  static sort<T>(data: T[], sortBy: keyof T, sortOrder: 'asc' | 'desc' = 'asc'): T[] {
    return [...data].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal);
        return sortOrder === 'asc' ? comparison : -comparison;
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }
}

// User session management for scalability
export class SessionManager {
  private static cache = new CacheManager();
  private static readonly SESSION_TTL = 24 * 60 * 60 * 1000; // 24 hours

  static createSession(userId: string, userData: any): string {
    const sessionId = `session_${userId}_${Date.now()}`;
    const sessionData = {
      userId,
      userData,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };

    this.cache.set(sessionId, sessionData, this.SESSION_TTL);
    return sessionId;
  }

  static getSession(sessionId: string): any | null {
    const session = this.cache.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
      this.cache.set(sessionId, session, this.SESSION_TTL);
    }
    return session;
  }

  static updateSession(sessionId: string, updates: any): void {
    const session = this.getSession(sessionId);
    if (session) {
      const updatedSession = { ...session, ...updates };
      this.cache.set(sessionId, updatedSession, this.SESSION_TTL);
    }
  }

  static invalidateSession(sessionId: string): void {
    this.cache.set(sessionId, null, 1);
  }
}

// Data synchronization for offline/online scenarios
export class SyncManager {
  private static pendingChanges: Array<{
    id: string;
    type: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
  }> = [];

  static addPendingChange(type: 'create' | 'update' | 'delete', data: any): void {
    const change = {
      id: `change_${Date.now()}_${Math.random()}`,
      type,
      data,
      timestamp: Date.now()
    };

    this.pendingChanges.push(change);
    this.savePendingChanges();
  }

  static getPendingChanges(): typeof this.pendingChanges {
    return [...this.pendingChanges];
  }

  static clearPendingChanges(): void {
    this.pendingChanges = [];
    this.savePendingChanges();
  }

  private static savePendingChanges(): void {
    try {
      localStorage.setItem('pending_changes', JSON.stringify(this.pendingChanges));
    } catch (error) {
      console.error('Failed to save pending changes:', error);
    }
  }

  static loadPendingChanges(): void {
    try {
      const stored = localStorage.getItem('pending_changes');
      if (stored) {
        this.pendingChanges = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load pending changes:', error);
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private static metrics: Record<string, number[]> = {};

  static startTimer(operation: string): string {
    const timerId = `${operation}_${Date.now()}`;
    this.metrics[timerId] = [Date.now()];
    return timerId;
  }

  static endTimer(timerId: string): number {
    const startTime = this.metrics[timerId]?.[0];
    if (!startTime) return 0;

    const duration = Date.now() - startTime;
    delete this.metrics[timerId];

    // Log slow operations
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${timerId} took ${duration}ms`);
    }

    return duration;
  }

  static getAverageTime(operation: string): number {
    const times = this.metrics[operation] || [];
    if (times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
}

// Batch operations for efficiency
export class BatchManager {
  static async processBatch<T>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<void>
  ): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await processor(batch);
    }
  }

  static chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}

// Memory management for large datasets
export class MemoryManager {
  private static memoryUsage = new Map<string, number>();

  static trackMemoryUsage(key: string, size: number): void {
    this.memoryUsage.set(key, size);
  }

  static getMemoryUsage(): Record<string, number> {
    return Object.fromEntries(this.memoryUsage);
  }

  static clearMemoryUsage(): void {
    this.memoryUsage.clear();
  }

  static estimateObjectSize(obj: any): number {
    const str = JSON.stringify(obj);
    return new Blob([str]).size;
  }
}

// Rate limiting for API calls
export class RateLimiter {
  private static requests = new Map<string, number[]>();
  private static readonly WINDOW_MS = 60000; // 1 minute
  private static readonly MAX_REQUESTS = 100; // per minute

  static canMakeRequest(userId: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove old requests outside the window
    const recentRequests = userRequests.filter(time => now - time < this.WINDOW_MS);
    
    if (recentRequests.length >= this.MAX_REQUESTS) {
      return false;
    }

    recentRequests.push(now);
    this.requests.set(userId, recentRequests);
    return true;
  }

  static getRemainingRequests(userId: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    const recentRequests = userRequests.filter(time => now - time < this.WINDOW_MS);
    return Math.max(0, this.MAX_REQUESTS - recentRequests.length);
  }
}

// Data compression utilities
export class CompressionManager {
  static compressData(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return btoa(jsonString);
    } catch (error) {
      console.error('Compression failed:', error);
      return JSON.stringify(data);
    }
  }

  static decompressData(compressedData: string): any {
    try {
      const jsonString = atob(compressedData);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decompression failed:', error);
      return JSON.parse(compressedData);
    }
  }
}

// Initialize sync manager on load
SyncManager.loadPendingChanges();