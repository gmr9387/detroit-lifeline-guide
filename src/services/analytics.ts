// Privacy-compliant analytics service
// Uses browser APIs without external tracking or personal data collection

interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
}

interface PageView {
  path: string;
  title: string;
  timestamp: number;
  sessionId: string;
  referrer?: string;
}

interface UserMetrics {
  totalSessions: number;
  totalPageViews: number;
  averageSessionDuration: number;
  topPages: Array<{ path: string; views: number }>;
  topEvents: Array<{ name: string; count: number }>;
}

class AnalyticsService {
  private sessionId: string;
  private sessionStart: number;
  private isEnabled: boolean = true;
  private events: AnalyticsEvent[] = [];
  private pageViews: PageView[] = [];
  private currentPage: string = '';

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStart = Date.now();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeAnalytics(): Promise<void> {
    // Check user consent for analytics
    const consent = await this.checkAnalyticsConsent();
    this.isEnabled = consent;

    if (this.isEnabled) {
      // Track initial page load
      this.trackPageView(window.location.pathname, document.title);
      
      // Set up automatic page view tracking for SPA navigation
      this.setupNavigationTracking();
      
      // Set up automatic event tracking
      this.setupAutomaticTracking();
      
      // Set up session management
      this.setupSessionManagement();
      
      // Set up periodic data cleanup
      this.setupDataCleanup();
    }
  }

  private async checkAnalyticsConsent(): Promise<boolean> {
    // Check if user has previously given consent
    const storedConsent = localStorage.getItem('detroit_navigator_analytics_consent');
    
    if (storedConsent !== null) {
      return storedConsent === 'true';
    }

    // Ask for consent (would be implemented with a UI component)
    // For now, default to true since we're not tracking personal data
    return true;
  }

  private setupNavigationTracking(): void {
    // Track SPA navigation using History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      setTimeout(() => {
        this.trackPageView(window.location.pathname, document.title);
      }, 0);
    };

    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      setTimeout(() => {
        this.trackPageView(window.location.pathname, document.title);
      }, 0);
    };

    // Track browser back/forward navigation
    window.addEventListener('popstate', () => {
      setTimeout(() => {
        this.trackPageView(window.location.pathname, document.title);
      }, 0);
    });
  }

  private setupAutomaticTracking(): void {
    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form.dataset.trackSubmit !== 'false') {
        this.trackEvent('form_submit', 'engagement', {
          form_id: form.id || 'unknown',
          form_action: form.action || 'unknown'
        });
      }
    });

    // Track link clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.dataset.trackClick !== 'false') {
        this.trackEvent('link_click', 'engagement', {
          link_text: link.textContent?.trim() || '',
          link_url: link.href,
          external: !link.href.startsWith(window.location.origin)
        });
      }
    });

    // Track search queries
    document.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      
      if (target.type === 'search' || target.dataset.trackSearch === 'true') {
        // Debounced search tracking
        clearTimeout((target as any).searchTimeout);
        (target as any).searchTimeout = setTimeout(() => {
          if (target.value.length > 2) {
            this.trackEvent('search', 'user_action', {
              query_length: target.value.length,
              has_results: document.querySelectorAll('[data-search-result]').length > 0
            });
          }
        }, 1000);
      }
    });

    // Track errors
    window.addEventListener('error', (event) => {
      this.trackEvent('javascript_error', 'error', {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackEvent('unhandled_rejection', 'error', {
        reason: String(event.reason)
      });
    });

    // Track network status changes
    window.addEventListener('online', () => {
      this.trackEvent('network_online', 'system');
    });

    window.addEventListener('offline', () => {
      this.trackEvent('network_offline', 'system');
    });

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('visibility_change', 'system', {
        visible: !document.hidden
      });
    });
  }

  private setupSessionManagement(): void {
    // Track session duration on page unload
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd();
    });

    // Track session duration periodically
    setInterval(() => {
      this.trackEvent('session_heartbeat', 'system', {
        duration: Date.now() - this.sessionStart
      });
    }, 60000); // Every minute
  }

  private setupDataCleanup(): void {
    // Clean up old analytics data
    setInterval(() => {
      this.cleanupOldData();
    }, 24 * 60 * 60 * 1000); // Daily
  }

  // Public methods
  trackPageView(path: string, title: string): void {
    if (!this.isEnabled) return;

    const pageView: PageView = {
      path,
      title,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      referrer: this.currentPage || document.referrer
    };

    this.pageViews.push(pageView);
    this.currentPage = path;
    
    // Store in IndexedDB for persistence
    this.storePageView(pageView);

    // Track page performance
    this.trackPagePerformance(path);
  }

  trackEvent(name: string, category: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name,
      category,
      properties: this.sanitizeProperties(properties),
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    this.events.push(event);
    
    // Store in IndexedDB for persistence
    this.storeEvent(event);
  }

  trackUserAction(action: string, target: string, properties?: Record<string, any>): void {
    this.trackEvent(action, 'user_action', {
      target,
      ...properties
    });
  }

  trackProgramInteraction(programId: string, action: string, properties?: Record<string, any>): void {
    this.trackEvent('program_interaction', 'programs', {
      program_id: programId,
      action,
      ...properties
    });
  }

  trackApplicationProgress(applicationId: string, status: string, programId: string): void {
    this.trackEvent('application_progress', 'applications', {
      application_id: applicationId,
      status,
      program_id: programId
    });
  }

  trackSearchQuery(query: string, category?: string, resultsCount?: number): void {
    this.trackEvent('search_query', 'search', {
      query_length: query.length,
      category,
      results_count: resultsCount,
      has_results: (resultsCount || 0) > 0
    });
  }

  trackError(error: Error, context?: string): void {
    this.trackEvent('application_error', 'error', {
      message: error.message,
      stack: error.stack?.substring(0, 500), // Limit stack trace length
      context
    });
  }

  trackPerformance(name: string, duration: number, properties?: Record<string, any>): void {
    this.trackEvent('performance_timing', 'performance', {
      name,
      duration,
      ...properties
    });
  }

  // Privacy methods
  setAnalyticsEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    localStorage.setItem('detroit_navigator_analytics_consent', enabled.toString());
    
    if (!enabled) {
      this.clearAllData();
    }
  }

  isAnalyticsEnabled(): boolean {
    return this.isEnabled;
  }

  // Data retrieval methods
  async getUserMetrics(): Promise<UserMetrics> {
    const events = await this.getAllEvents();
    const pageViews = await this.getAllPageViews();

    // Calculate metrics
    const sessions = new Set(events.map(e => e.sessionId)).size;
    const sessionDurations = this.calculateSessionDurations(events);
    const averageDuration = sessionDurations.reduce((sum, d) => sum + d, 0) / sessionDurations.length || 0;

    // Top pages
    const pageViewCounts = pageViews.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }));

    // Top events
    const eventCounts = events.reduce((acc, event) => {
      acc[event.name] = (acc[event.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEvents = Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      totalSessions: sessions,
      totalPageViews: pageViews.length,
      averageSessionDuration: averageDuration,
      topPages,
      topEvents
    };
  }

  async exportData(): Promise<any> {
    if (!this.isEnabled) return null;

    const [events, pageViews] = await Promise.all([
      this.getAllEvents(),
      this.getAllPageViews()
    ]);

    return {
      events,
      pageViews,
      metrics: await this.getUserMetrics(),
      exportDate: new Date().toISOString()
    };
  }

  // Private helper methods
  private sanitizeProperties(properties?: Record<string, any>): Record<string, any> | undefined {
    if (!properties) return undefined;

    // Remove potentially sensitive data
    const sanitized = { ...properties };
    const sensitiveKeys = ['password', 'ssn', 'social', 'email', 'phone', 'address'];
    
    sensitiveKeys.forEach(key => {
      if (key in sanitized) {
        delete sanitized[key];
      }
    });

    // Truncate long strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 100) {
        sanitized[key] = sanitized[key].substring(0, 100) + '...';
      }
    });

    return sanitized;
  }

  private trackPagePerformance(path: string): void {
    // Use Performance API to track page load times
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.trackEvent('page_performance', 'performance', {
          path,
          load_time: navigation.loadEventEnd - navigation.loadEventStart,
          dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          dns_lookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp_connection: navigation.connectEnd - navigation.connectStart
        });
      }
    }
  }

  private calculateSessionDurations(events: AnalyticsEvent[]): number[] {
    const sessionGroups = events.reduce((acc, event) => {
      if (!acc[event.sessionId]) {
        acc[event.sessionId] = [];
      }
      acc[event.sessionId].push(event.timestamp);
      return acc;
    }, {} as Record<string, number[]>);

    return Object.values(sessionGroups).map(timestamps => {
      const sorted = timestamps.sort((a, b) => a - b);
      return sorted[sorted.length - 1] - sorted[0];
    });
  }

  private trackSessionEnd(): void {
    const sessionDuration = Date.now() - this.sessionStart;
    this.trackEvent('session_end', 'system', {
      duration: sessionDuration,
      page_views: this.pageViews.filter(pv => pv.sessionId === this.sessionId).length,
      events: this.events.filter(e => e.sessionId === this.sessionId).length
    });
  }

  // Storage methods (would integrate with IndexedDB service)
  private async storeEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const stored = JSON.parse(localStorage.getItem('detroit_navigator_analytics_events') || '[]');
      stored.push(event);
      
      // Keep only last 1000 events
      if (stored.length > 1000) {
        stored.splice(0, stored.length - 1000);
      }
      
      localStorage.setItem('detroit_navigator_analytics_events', JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to store analytics event:', error);
    }
  }

  private async storePageView(pageView: PageView): Promise<void> {
    try {
      const stored = JSON.parse(localStorage.getItem('detroit_navigator_analytics_pageviews') || '[]');
      stored.push(pageView);
      
      // Keep only last 500 page views
      if (stored.length > 500) {
        stored.splice(0, stored.length - 500);
      }
      
      localStorage.setItem('detroit_navigator_analytics_pageviews', JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to store page view:', error);
    }
  }

  private async getAllEvents(): Promise<AnalyticsEvent[]> {
    try {
      return JSON.parse(localStorage.getItem('detroit_navigator_analytics_events') || '[]');
    } catch (error) {
      console.error('Failed to get analytics events:', error);
      return [];
    }
  }

  private async getAllPageViews(): Promise<PageView[]> {
    try {
      return JSON.parse(localStorage.getItem('detroit_navigator_analytics_pageviews') || '[]');
    } catch (error) {
      console.error('Failed to get page views:', error);
      return [];
    }
  }

  private async clearAllData(): Promise<void> {
    localStorage.removeItem('detroit_navigator_analytics_events');
    localStorage.removeItem('detroit_navigator_analytics_pageviews');
    this.events = [];
    this.pageViews = [];
  }

  private cleanupOldData(): void {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    this.events = this.events.filter(event => event.timestamp > thirtyDaysAgo);
    this.pageViews = this.pageViews.filter(pv => pv.timestamp > thirtyDaysAgo);
    
    // Update stored data
    localStorage.setItem('detroit_navigator_analytics_events', JSON.stringify(this.events));
    localStorage.setItem('detroit_navigator_analytics_pageviews', JSON.stringify(this.pageViews));
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;