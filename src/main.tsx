import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import performanceMonitor, { analyzeBundleSize, getMemoryUsage } from './utils/performance.tsx'

// Initialize performance monitoring
performanceMonitor.startMeasure('app-initialization');

// Log initial bundle analysis in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    analyzeBundleSize();
    const memory = getMemoryUsage();
    if (memory) {
      console.log('Memory usage:', memory);
    }
  }, 1000);
}

createRoot(document.getElementById('root')!).render(<App />)

performanceMonitor.endMeasure('app-initialization');
