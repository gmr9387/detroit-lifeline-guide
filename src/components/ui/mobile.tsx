import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  MapPin, 
  Filter,
  X,
  ChevronUp,
  ChevronDown,
  Swipe,
  Touch
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mobile Header Component
interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function MobileHeader({
  title,
  subtitle,
  onMenuClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  showBackButton = false,
  onBackClick
}: MobileHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackClick}
              className="p-2"
            >
              <ChevronDown className="h-5 w-5 rotate-90" />
            </Button>
          )}
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onSearchClick && (
            <Button variant="ghost" size="sm" onClick={onSearchClick} className="p-2">
              <Search className="h-5 w-5" />
            </Button>
          )}
          {onNotificationClick && (
            <Button variant="ghost" size="sm" onClick={onNotificationClick} className="p-2">
              <Bell className="h-5 w-5" />
            </Button>
          )}
          {onProfileClick && (
            <Button variant="ghost" size="sm" onClick={onProfileClick} className="p-2">
              <User className="h-5 w-5" />
            </Button>
          )}
          {onMenuClick && (
            <Button variant="ghost" size="sm" onClick={onMenuClick} className="p-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Mobile Bottom Sheet Component
interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  snapPoints?: string[];
}

export function MobileBottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = ['25%', '50%', '75%']
}: MobileBottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(1);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="h-[75vh] rounded-t-xl"
        style={{ height: snapPoints[currentSnap] }}
      >
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle>{title}</SheetTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-12 h-1 bg-muted rounded-full mx-auto" />
        </SheetHeader>
        <div className="overflow-y-auto h-full">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Touch-friendly Card Component
interface TouchCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function TouchCard({ children, onClick, className, disabled }: TouchCardProps) {
  return (
    <Card 
      className={cn(
        "transition-all duration-200 active:scale-95 cursor-pointer",
        "min-h-[80px] flex items-center",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-4 w-full">
        {children}
      </CardContent>
    </Card>
  );
}

// Swipe Gesture Hook
export function useSwipeGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold = 50
) {
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
    setIsSwiping(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    setIsSwiping(false);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    isSwiping
  };
}

// Mobile Navigation Tabs
interface MobileNavTabsProps {
  tabs: {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function MobileNavTabs({ tabs, activeTab, onTabChange }: MobileNavTabsProps) {
  return (
    <div className="flex bg-background border-t">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-1 flex flex-col items-center py-3 px-2 transition-colors",
            activeTab === tab.id
              ? "text-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            {tab.icon}
            {tab.badge && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs"
              >
                {tab.badge}
              </Badge>
            )}
          </div>
          <span className="text-xs mt-1">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

// Pull to Refresh Hook
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const threshold = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    
    if (deltaY > 0 && window.scrollY === 0) {
      e.preventDefault();
      setPullDistance(Math.min(deltaY * 0.5, threshold));
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
  };

  return {
    isRefreshing,
    pullDistance,
    pullToRefreshHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  };
}

// Mobile Search Bar
interface MobileSearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  showFilters?: boolean;
  onFiltersClick?: () => void;
}

export function MobileSearchBar({
  placeholder = "Search programs...",
  value,
  onChange,
  onSearch,
  showFilters = true,
  onFiltersClick
}: MobileSearchBarProps) {
  return (
    <div className="flex items-center gap-2 p-4 bg-background border-b">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch?.()}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {showFilters && onFiltersClick && (
        <Button variant="outline" size="sm" onClick={onFiltersClick}>
          <Filter className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}