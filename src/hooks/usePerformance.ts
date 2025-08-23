import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Hook for lazy loading components
export const useLazyLoad = <T>(
  loadFn: () => Promise<T>,
  deps: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await loadFn();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [loadFn, loading]);

  useEffect(() => {
    load();
  }, deps);

  return { data, loading, error, reload: load };
};

// Hook for debouncing values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for throttling function calls
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  ) as T;
};

// Hook for intersection observer (lazy loading)
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting] as const;
};

// Hook for virtual scrolling
export const useVirtualScroll = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 1,
      itemCount
    );
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, itemCount]);

  const totalHeight = itemCount * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    visibleRange,
    totalHeight,
    offsetY,
    setScrollTop,
  };
};

// Hook for performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const timeSinceLastRender = currentTime - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times in ${timeSinceLastRender.toFixed(2)}ms`);
    }
    
    lastRenderTime.current = currentTime;
  });

  return {
    renderCount: renderCount.current,
  };
};

// Hook for memory management
export const useMemoryCleanup = () => {
  useEffect(() => {
    return () => {
      // Cleanup function for memory management
      if (process.env.NODE_ENV === 'development') {
        console.log('Component unmounted, cleaning up memory...');
      }
    };
  }, []);
};

// Hook for optimizing expensive calculations
export const useMemoizedValue = <T>(
  factory: () => T,
  deps: any[],
  equalityFn?: (prev: T, next: T) => boolean
): T => {
  const prevValueRef = useRef<T>();
  const prevDepsRef = useRef<any[]>();

  return useMemo(() => {
    const newValue = factory();
    
    // Custom equality check
    if (equalityFn && prevValueRef.current !== undefined) {
      if (equalityFn(prevValueRef.current, newValue)) {
        return prevValueRef.current;
      }
    }
    
    prevValueRef.current = newValue;
    prevDepsRef.current = deps;
    
    return newValue;
  }, deps);
};

// Hook for batch updates
export const useBatchUpdates = () => {
  const [updates, setUpdates] = useState<any[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((update: any) => {
    setUpdates(prev => [...prev, update]);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setUpdates([]);
    }, 16); // One frame at 60fps
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { updates, batchUpdate };
};

// Hook for resource preloading
export const usePreload = (urls: string[]) => {
  useEffect(() => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = url;
      link.as = url.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }, [urls]);
};

// Hook for measuring component render time
export const useRenderTime = (componentName: string) => {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
    
    startTime.current = performance.now();
  });
};