import React from 'react';

// Performance monitoring utilities

interface PerformanceMetrics {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    // Observe navigation timing
    if ('PerformanceObserver' in window) {
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.logMetric(entry.name, entry.duration);
        });
      });

      navObserver.observe({ entryTypes: ['navigation', 'paint'] });
      this.observers.push(navObserver);

      // Observe resource loading
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 100) { // Only log slow resources
            this.logMetric(`Resource: ${entry.name}`, entry.duration);
          }
        });
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  // Mark the start of a performance measurement
  startMeasure(name: string) {
    performance.mark(`${name}-start`);
  }

  // End a performance measurement and log the result
  endMeasure(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    if (measure) {
      this.logMetric(name, measure.duration);
    }
  }

  // Log a performance metric
  private logMetric(name: string, duration: number) {
    const metric: PerformanceMetrics = {
      name,
      duration,
      timestamp: Date.now()
    };

    this.metrics.push(metric);

    // Only keep last 100 metrics to prevent memory leaks
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100);
    }

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 50) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
  }

  // Get all recorded metrics
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  // Get Web Vitals metrics
  getWebVitals() {
    return {
      // First Contentful Paint
      fcp: this.getMetricByName('first-contentful-paint'),
      // Largest Contentful Paint
      lcp: this.getMetricByName('largest-contentful-paint'),
      // Time to Interactive (approximation)
      tti: performance.timing.domInteractive - performance.timing.navigationStart,
      // DOM Content Loaded
      dcl: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      // Load Complete
      load: performance.timing.loadEventEnd - performance.timing.navigationStart
    };
  }

  private getMetricByName(name: string): number | null {
    const metric = this.metrics.find(m => m.name.includes(name));
    return metric ? metric.duration : null;
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

// React hook for component performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  React.useEffect(() => {
    performanceMonitor.startMeasure(`${componentName}-render`);
    
    return () => {
      performanceMonitor.endMeasure(`${componentName}-render`);
    };
  });

  return {
    startMeasure: (operation: string) => 
      performanceMonitor.startMeasure(`${componentName}-${operation}`),
    endMeasure: (operation: string) => 
      performanceMonitor.endMeasure(`${componentName}-${operation}`)
  };
};

// HOC for automatic component performance monitoring
export const withPerformanceMonitoring = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name;
  
  const MonitoredComponent = React.memo((props: P) => {
    usePerformanceMonitor(displayName);
    return <WrappedComponent {...props} />;
  });

  MonitoredComponent.displayName = `withPerformanceMonitoring(${displayName})`;
  return MonitoredComponent;
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    // Get all loaded scripts
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    console.group('Bundle Analysis');
    
    scripts.forEach((script: HTMLScriptElement) => {
      if (script.src.includes('assets')) {
        fetch(script.src, { method: 'HEAD' })
          .then(response => {
            const size = response.headers.get('content-length');
            if (size) {
              console.log(`JS: ${script.src.split('/').pop()} - ${(parseInt(size) / 1024).toFixed(2)}KB`);
            }
          })
          .catch(() => {});
      }
    });

    styles.forEach((link: HTMLLinkElement) => {
      if (link.href.includes('assets')) {
        fetch(link.href, { method: 'HEAD' })
          .then(response => {
            const size = response.headers.get('content-length');
            if (size) {
              console.log(`CSS: ${link.href.split('/').pop()} - ${(parseInt(size) / 1024).toFixed(2)}KB`);
            }
          })
          .catch(() => {});
      }
    });

    console.groupEnd();
  }
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
    };
  }
  return null;
};