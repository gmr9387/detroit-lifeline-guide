import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, Application, Program } from '@/types';
import { storageUtils } from '@/utils/localStorage';

export interface Notification {
  id: string;
  type: 'deadline' | 'update' | 'recommendation' | 'reminder' | 'success' | 'error';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'application' | 'program' | 'system' | 'recommendation';
  read: boolean;
  createdAt: string;
  scheduledFor?: string;
  userId: string;
  metadata?: {
    applicationId?: string;
    programId?: string;
    deadline?: string;
    actionUrl?: string;
  };
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  inApp: boolean;
  categories: {
    deadline: boolean;
    update: boolean;
    recommendation: boolean;
    reminder: boolean;
    success: boolean;
    error: boolean;
  };
  frequency: 'immediate' | 'daily' | 'weekly';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  updatePreferences: (preferences: Partial<NotificationPreferences>) => void;
  sendEmailNotification: (to: string, subject: string, body: string) => Promise<boolean>;
  sendSMSNotification: (to: string, message: string) => Promise<boolean>;
  checkDeadlines: () => void;
  generateRecommendations: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
  user?: UserProfile | null;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children, user }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: true,
    sms: false,
    push: true,
    inApp: true,
    categories: {
      deadline: true,
      update: true,
      recommendation: true,
      reminder: true,
      success: true,
      error: true,
    },
    frequency: 'immediate',
  });

  // Load notifications from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`notifications-${user.id}`);
      if (stored) {
        try {
          setNotifications(JSON.parse(stored));
        } catch (error) {
          console.error('Failed to load notifications:', error);
        }
      }

      const storedPrefs = localStorage.getItem(`notification-preferences-${user.id}`);
      if (storedPrefs) {
        try {
          setPreferences(JSON.parse(storedPrefs));
        } catch (error) {
          console.error('Failed to load notification preferences:', error);
        }
      }
    }
  }, [user]);

  // Save notifications to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notifications-${user.id}`, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  // Save preferences to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`notification-preferences-${user.id}`, JSON.stringify(preferences));
    }
  }, [preferences, user]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    if (!user) return;

    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false,
      userId: user.id,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Send external notifications based on preferences
    if (preferences.email && notification.priority !== 'low') {
      sendEmailNotification(user.email, notification.title, notification.message);
    }

    if (preferences.sms && notification.priority === 'urgent') {
      sendSMSNotification(user.phone || '', notification.message);
    }
  }, [user, preferences]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updatePreferences = useCallback((newPreferences: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  const sendEmailNotification = useCallback(async (to: string, subject: string, body: string): Promise<boolean> => {
    try {
      // In a real app, this would integrate with an email service
      console.log('Email notification sent:', { to, subject, body });
      
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      return false;
    }
  }, []);

  const sendSMSNotification = useCallback(async (to: string, message: string): Promise<boolean> => {
    try {
      // In a real app, this would integrate with an SMS service
      console.log('SMS notification sent:', { to, message });
      
      // Simulate SMS sending
      await new Promise(resolve => setTimeout(resolve, 100));
      
      return true;
    } catch (error) {
      console.error('Failed to send SMS notification:', error);
      return false;
    }
  }, []);

  const checkDeadlines = useCallback(() => {
    if (!user) return;

    const applications = storageUtils.getApplications();
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    applications.forEach(application => {
      if (application.deadline) {
        const deadline = new Date(application.deadline);
        const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilDeadline <= 1 && daysUntilDeadline > 0) {
          addNotification({
            type: 'deadline',
            title: 'Urgent: Application Deadline Tomorrow',
            message: `Your application for ${application.programName} is due tomorrow. Don't miss this opportunity!`,
            priority: 'urgent',
            category: 'application',
            userId: user.id,
            metadata: {
              applicationId: application.id,
              programId: application.programId,
              deadline: application.deadline,
              actionUrl: `/program/${application.programId}`,
            },
          });
        } else if (daysUntilDeadline <= 7 && daysUntilDeadline > 1) {
          addNotification({
            type: 'reminder',
            title: 'Application Deadline Approaching',
            message: `Your application for ${application.programName} is due in ${daysUntilDeadline} days.`,
            priority: 'high',
            category: 'application',
            userId: user.id,
            metadata: {
              applicationId: application.id,
              programId: application.programId,
              deadline: application.deadline,
              actionUrl: `/program/${application.programId}`,
            },
          });
        }
      }
    });
  }, [user, addNotification]);

  const generateRecommendations = useCallback(() => {
    if (!user) return;

    // Generate periodic recommendation notifications
    const lastRecommendation = notifications.find(n => 
      n.type === 'recommendation' && 
      new Date(n.createdAt).getTime() > new Date().getTime() - 7 * 24 * 60 * 60 * 1000
    );

    if (!lastRecommendation) {
      addNotification({
        type: 'recommendation',
        title: 'New Programs Available for You',
        message: 'We found new programs that match your profile. Check them out!',
        priority: 'medium',
        category: 'recommendation',
        userId: user.id,
        metadata: {
          actionUrl: '/programs',
        },
      });
    }
  }, [user, notifications, addNotification]);

  // Check deadlines periodically
  useEffect(() => {
    if (user) {
      checkDeadlines();
      
      // Check deadlines every hour
      const interval = setInterval(checkDeadlines, 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, checkDeadlines]);

  // Generate recommendations weekly
  useEffect(() => {
    if (user) {
      generateRecommendations();
      
      // Generate recommendations weekly
      const interval = setInterval(generateRecommendations, 7 * 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user, generateRecommendations]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    preferences,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    sendEmailNotification,
    sendSMSNotification,
    checkDeadlines,
    generateRecommendations,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};