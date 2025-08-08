import { ReactNode } from 'react';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: ReactNode;
  hideBottomNav?: boolean;
  showFooter?: boolean;
}

export function AppLayout({ children, hideBottomNav = false, showFooter = false }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <main className={cn(
        "flex-1",
        !hideBottomNav && "pb-20" // Add padding for bottom navigation
      )}>
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
      {showFooter && <Footer />}
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}