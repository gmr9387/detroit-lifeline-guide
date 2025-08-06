import { ReactNode } from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
}

export function AppLayout({ children, hideBottomNav = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className={cn(
        "min-h-screen",
        !hideBottomNav && "pb-20" // Add padding for bottom navigation
      )}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}