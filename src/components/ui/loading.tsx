import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple skeleton component since it's not in lucide-react
const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-muted rounded", className)} />
);

// Spinner component for general loading states
export const Spinner = ({ 
  size = 'default', 
  className 
}: { 
  size?: 'sm' | 'default' | 'lg'; 
  className?: string;
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  );
};

// Loading skeleton for content areas
export const ContentSkeleton = ({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
};

// Card skeleton for program cards
export const CardSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn('rounded-lg border p-4 space-y-3', className)}>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex space-x-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
};

// Program list skeleton
export const ProgramListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

// Page loading skeleton
export const PageSkeleton = () => {
  return (
    <div className="space-y-6 p-4">
      {/* Header skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Search/filter skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <ProgramListSkeleton count={6} />
    </div>
  );
};

// Button loading state
export const LoadingButton = ({ 
  children, 
  loading, 
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  loading?: boolean;
}) => {
  return (
    <button 
      {...props} 
      disabled={loading || props.disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        props.className
      )}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
};

// Full screen loading overlay
export const LoadingOverlay = ({ 
  message = 'Loading...',
  show = true 
}: { 
  message?: string; 
  show?: boolean;
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

// Inline loading indicator
export const InlineLoader = ({ 
  message = 'Loading...',
  size = 'default'
}: { 
  message?: string; 
  size?: 'sm' | 'default' | 'lg';
}) => {
  return (
    <div className="flex items-center space-x-2 text-muted-foreground">
      <Spinner size={size} />
      <span className="text-sm">{message}</span>
    </div>
  );
};