import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )} 
    />
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

interface LoadingGridProps {
  rows?: number;
  cols?: number;
  className?: string;
}

export function LoadingGrid({ rows = 3, cols = 2, className }: LoadingGridProps) {
  return (
    <div className={cn('grid gap-4', className)} style={{ 
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
    }}>
      {Array.from({ length: rows * cols }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
}

interface LoadingPageProps {
  message?: string;
  showSpinner?: boolean;
}

export function LoadingPage({ message = 'Loading...', showSpinner = true }: LoadingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        {showSpinner && (
          <div className="flex justify-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent absolute inset-0 animate-pulse"></div>
            </div>
          </div>
        )}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">{message}</h2>
          <p className="text-muted-foreground text-sm">
            Please wait while we load your information...
          </p>
        </div>
        <div className="flex justify-center space-x-1">
          <div className="animate-bounce h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '0ms' }}></div>
          <div className="animate-bounce h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '150ms' }}></div>
          <div className="animate-bounce h-2 w-2 bg-primary rounded-full" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function LoadingButton({ children, loading = false, className }: LoadingButtonProps) {
  return (
    <button 
      className={cn(
        'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors',
        loading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90',
        className
      )}
      disabled={loading}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  );
}

interface LoadingProgressProps {
  progress?: number;
  message?: string;
}

export function LoadingProgress({ progress = 0, message }: LoadingProgressProps) {
  return (
    <div className="space-y-4">
      {message && (
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      )}
      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        {Math.round(progress)}% complete
      </p>
    </div>
  );
}