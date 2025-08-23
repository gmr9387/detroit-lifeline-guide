import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MobileHeader } from '@/components/ui/mobile';
import { MobileNavTabs } from '@/components/ui/mobile';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { 
  Home, 
  Search, 
  FileText, 
  User, 
  Bell,
  Menu,
  Settings
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  showBottomNav?: boolean;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
}

export function MobileLayout({
  children,
  title = "Detroit Resources",
  subtitle,
  showHeader = true,
  showBottomNav = true,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onMenuClick
}: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get unread notification count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Determine active tab based on current route
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'home';
    if (path === '/programs') return 'search';
    if (path.includes('/program/')) return 'search';
    if (path === '/applications') return 'applications';
    if (path === '/profile') return 'profile';
    return 'home';
  };

  const handleTabChange = (tabId: string) => {
    switch (tabId) {
      case 'home':
        navigate('/dashboard');
        break;
      case 'search':
        navigate('/programs');
        break;
      case 'applications':
        navigate('/applications');
        break;
      case 'profile':
        navigate('/profile');
        break;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navigationTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="h-5 w-5" />,
    },
    {
      id: 'search',
      label: 'Search',
      icon: <Search className="h-5 w-5" />,
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Header */}
      {showHeader && (
        <MobileHeader
          title={title}
          subtitle={subtitle}
          onSearchClick={onSearchClick}
          onNotificationClick={onNotificationClick}
          onProfileClick={onProfileClick}
          onMenuClick={() => setIsMenuOpen(true)}
        />
      )}

      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-y-auto",
        showBottomNav && "pb-20"
      )}>
        {children}
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <MobileNavTabs
            tabs={navigationTabs}
            activeTab={getActiveTab()}
            onTabChange={handleTabChange}
          />
        </div>
      )}

      {/* Mobile Menu Sheet */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            {/* User Info */}
            {user && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4">Quick Actions</h3>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
              >
                <Home className="h-4 w-4 mr-3" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/programs');
                  setIsMenuOpen(false);
                }}
              >
                <Search className="h-4 w-4 mr-3" />
                Browse Programs
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/applications');
                  setIsMenuOpen(false);
                }}
              >
                <FileText className="h-4 w-4 mr-3" />
                My Applications
              </Button>
            </div>

            <Separator />

            {/* Notifications */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4">Notifications</h3>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  onNotificationClick?.();
                  setIsMenuOpen(false);
                }}
              >
                <div className="relative">
                  <Bell className="h-4 w-4 mr-3" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </div>

            <Separator />

            {/* Settings & Account */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground px-4">Account</h3>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/profile');
                  setIsMenuOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-3" />
                Profile Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  // Navigate to settings page
                  setIsMenuOpen(false);
                }}
              >
                <Settings className="h-4 w-4 mr-3" />
                App Settings
              </Button>
            </div>

            <Separator />

            {/* Logout */}
            {user && (
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Mobile-specific page wrapper
export function MobilePage({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  ...props
}: MobileLayoutProps & {
  showBackButton?: boolean;
  onBackClick?: () => void;
}) {
  return (
    <MobileLayout
      title={title}
      subtitle={subtitle}
      {...props}
    >
      {children}
    </MobileLayout>
  );
}