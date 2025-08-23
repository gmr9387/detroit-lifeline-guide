import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  Clock,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Notification, TodoItem, Application } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface NotificationCenterProps {
  maxNotifications?: number;
  showAll?: boolean;
}

export function NotificationCenter({ maxNotifications = 5, showAll = false }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadNotifications();
    generateSmartNotifications();
  }, []);

  const loadNotifications = () => {
    const allNotifications = storageUtils.getNotifications();
    const filtered = showAll ? allNotifications : allNotifications.slice(0, maxNotifications);
    setNotifications(filtered);
    setUnreadCount(allNotifications.filter(n => !n.read).length);
  };

  const generateSmartNotifications = () => {
    const todos = storageUtils.getTodoItems();
    const applications = storageUtils.getApplications();
    const existingNotifications = storageUtils.getNotifications();
    
    const newNotifications: Notification[] = [];

    // Check for overdue todos
    todos.forEach(todo => {
      if (!todo.completed && todo.dueDate) {
        const dueDate = new Date(todo.dueDate);
        const today = new Date();
        
        if (dueDate < today) {
          const exists = existingNotifications.some(n => 
            n.title === 'Overdue Task' && n.message.includes(todo.title)
          );
          
          if (!exists) {
            newNotifications.push({
              id: `overdue-${todo.id}`,
              title: 'Overdue Task',
              message: `"${todo.title}" was due ${formatDate(dueDate)}`,
              type: 'warning',
              read: false,
              createdAt: new Date().toISOString(),
              actionUrl: '/dashboard'
            });
          }
        } else if (dueDate.getTime() - today.getTime() < 24 * 60 * 60 * 1000) { // Due tomorrow
          const exists = existingNotifications.some(n => 
            n.title === 'Task Due Tomorrow' && n.message.includes(todo.title)
          );
          
          if (!exists) {
            newNotifications.push({
              id: `due-tomorrow-${todo.id}`,
              title: 'Task Due Tomorrow',
              message: `"${todo.title}" is due tomorrow`,
              type: 'info',
              read: false,
              createdAt: new Date().toISOString(),
              actionUrl: '/dashboard'
            });
          }
        }
      }
    });

    // Check for application status updates
    applications.forEach(app => {
      const appDate = new Date(app.appliedAt);
      const today = new Date();
      const daysSinceApplication = Math.floor((today.getTime() - appDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (app.status === 'submitted' && daysSinceApplication > 14) {
        const exists = existingNotifications.some(n => 
          n.title === 'Application Status Check' && n.message.includes(app.programName)
        );
        
        if (!exists) {
          newNotifications.push({
            id: `status-check-${app.id}`,
            title: 'Application Status Check',
            message: `It's been ${daysSinceApplication} days since you applied to ${app.programName}. Consider checking the status.`,
            type: 'info',
            read: false,
            createdAt: new Date().toISOString(),
            actionUrl: `/program/${app.programId}`
          });
        }
      }
    });

    // Add new notifications
    newNotifications.forEach(notification => {
      storageUtils.saveNotification(notification);
    });

    if (newNotifications.length > 0) {
      loadNotifications();
    }
  };

  const markAsRead = (notificationId: string) => {
    storageUtils.markNotificationAsRead(notificationId);
    loadNotifications();
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        storageUtils.markNotificationAsRead(notification.id);
      }
    });
    loadNotifications();
  };

  const clearAllNotifications = () => {
    storageUtils.clearAllNotifications();
    loadNotifications();
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'error':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return formatDate(date);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      if (notification.actionUrl.startsWith('http')) {
        window.open(notification.actionUrl, '_blank');
      } else {
        window.location.href = notification.actionUrl;
      }
    }
  };

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No notifications yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={clearAllNotifications}>
            Clear all
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {notifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={`transition-all cursor-pointer hover:shadow-sm ${
              !notification.read ? 'border-l-4 border-l-blue-500 bg-blue-50/50' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Badge variant={getNotificationColor(notification.type)} className="text-xs">
                          {notification.type}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(notification.createdAt)}</span>
                        {notification.actionUrl && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-blue-600">
                              <ExternalLink className="h-3 w-3" />
                              View
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!showAll && notifications.length >= maxNotifications && (
        <div className="text-center">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/notifications'}>
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
}