import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Accessibility, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Accessibility context
interface AccessibilityContextType {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  fontSize: number;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleReducedMotion: () => void;
  toggleScreenReader: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
}

const AccessibilityContext = React.createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = React.useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Accessibility provider component
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setHighContrast(settings.highContrast || false);
      setLargeText(settings.largeText || false);
      setReducedMotion(settings.reducedMotion || false);
      setScreenReader(settings.screenReader || false);
      setFontSize(settings.fontSize || 16);
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = (settings: Partial<AccessibilityContextType>) => {
    const currentSettings = {
      highContrast,
      largeText,
      reducedMotion,
      screenReader,
      fontSize,
      ...settings,
    };
    localStorage.setItem('accessibility-settings', JSON.stringify(currentSettings));
  };

  // Apply accessibility styles to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    root.style.fontSize = `${fontSize}px`;
  }, [highContrast, largeText, reducedMotion, fontSize]);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    saveSettings({ highContrast: newValue });
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    saveSettings({ largeText: newValue });
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    saveSettings({ reducedMotion: newValue });
  };

  const toggleScreenReader = () => {
    const newValue = !screenReader;
    setScreenReader(newValue);
    saveSettings({ screenReader: newValue });
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24);
    setFontSize(newSize);
    saveSettings({ fontSize: newSize });
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    saveSettings({ fontSize: newSize });
  };

  const resetFontSize = () => {
    setFontSize(16);
    saveSettings({ fontSize: 16 });
  };

  const value = {
    highContrast,
    largeText,
    reducedMotion,
    screenReader,
    fontSize,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReader,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility menu component
export const AccessibilityMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    largeText,
    reducedMotion,
    screenReader,
    fontSize,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleScreenReader,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
  } = useAccessibility();

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
        className="flex items-center gap-2"
      >
        <Accessibility className="h-4 w-4" />
        Accessibility
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-background p-4 shadow-lg z-50">
          <h3 className="font-semibold mb-4">Accessibility Settings</h3>
          
          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                High Contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between">
              <Label htmlFor="large-text" className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                Large Text
              </Label>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={toggleLargeText}
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reduced Motion
              </Label>
              <Switch
                id="reduced-motion"
                checked={reducedMotion}
                onCheckedChange={toggleReducedMotion}
              />
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="flex items-center gap-2">
                {screenReader ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                Screen Reader Mode
              </Label>
              <Switch
                id="screen-reader"
                checked={screenReader}
                onCheckedChange={toggleScreenReader}
              />
            </div>

            {/* Font Size Controls */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <ZoomIn className="h-4 w-4" />
                Font Size: {fontSize}px
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                  aria-label="Decrease font size"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFontSize}
                  aria-label="Reset font size"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 24}
                  aria-label="Increase font size"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Skip to main content link
export const SkipToMainContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>
  );
};

// Screen reader only text
export const SrOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <span className="sr-only">{children}</span>;
};

// Focus trap component
export const FocusTrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <div ref={containerRef}>{children}</div>;
};