import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useNotifications, Notification, NotificationPreferences } from '@/contexts/NotificationContext';
import { 
  Bell, 
  BellOff, 
  Mail, 
  MessageSquare, 
  Settings, 
  Trash2, 
  Check, 
  Clock,
  AlertTriangle,
  Info,
  Star,
  Zap,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
  } = useNotifications();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showPreferences, setShowPreferences] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'deadline': return <Clock className="h-4 w-4 text-red-500" />;
      case 'update': return <Info className="h-4 w-4 text-blue-500" />;
      case 'recommendation': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'reminder': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'success': return <Check className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityLabel = (priority: Notification['priority']) => {
    switch (priority) {
      case 'urgent': return 'Urgent';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Normal';
    }
  };

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      if (filter === 'unread') return !notification.read;
      if (filter === 'read') return notification.read;
      return true;
    })
    .filter(notification => {
      if (categoryFilter === 'all') return true;
      return notification.category === categoryFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    if (notification.metadata?.actionUrl) {
      window.location.href = notification.metadata.actionUrl;
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: any) => {
    updatePreferences({ [key]: value });
  };

  const handleCategoryPreferenceChange = (category: keyof NotificationPreferences['categories'], value: boolean) => {
    updatePreferences({
      categories: {
        ...preferences.categories,
        [category]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Stay updated with your applications and program opportunities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Notification Preferences</DialogTitle>
                    <DialogDescription>
                      Customize how and when you receive notifications
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-3">Notification Channels</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <Label htmlFor="email">Email Notifications</Label>
                          </div>
                          <Switch
                            id="email"
                            checked={preferences.email}
                            onCheckedChange={(checked) => handlePreferenceChange('email', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            <Label htmlFor="sms">SMS Notifications</Label>
                          </div>
                          <Switch
                            id="sms"
                            checked={preferences.sms}
                            onCheckedChange={(checked) => handlePreferenceChange('sms', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <Label htmlFor="inApp">In-App Notifications</Label>
                          </div>
                          <Switch
                            id="inApp"
                            checked={preferences.inApp}
                            onCheckedChange={(checked) => handlePreferenceChange('inApp', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Notification Types</h4>
                      <div className="space-y-3">
                        {Object.entries(preferences.categories).map(([category, enabled]) => (
                          <div key={category} className="flex items-center justify-between">
                            <Label htmlFor={category} className="capitalize">
                              {category} notifications
                            </Label>
                            <Switch
                              id={category}
                              checked={enabled}
                              onCheckedChange={(checked) => 
                                handleCategoryPreferenceChange(category as keyof NotificationPreferences['categories'], checked)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Frequency</h4>
                      <Select
                        value={preferences.frequency}
                        onValueChange={(value) => handlePreferenceChange('frequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Summary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filter} onValueChange={(value) => setFilter(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="application">Applications</SelectItem>
                  <SelectItem value="program">Programs</SelectItem>
                  <SelectItem value="recommendation">Recommendations</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <BellOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "You're all caught up! Check back later for updates."
                  : `No ${filter} notifications found.`
                }
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm leading-tight">
                          {notification.title}
                        </h4>
                        <div className="flex items-center gap-2 ml-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                          >
                            {getPriorityLabel(notification.priority)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs capitalize">
                          {notification.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {notification.type}
                        </Badge>
                        
                        {notification.metadata?.actionUrl && (
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{notifications.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
              <div className="text-sm text-muted-foreground">Unread</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {notifications.filter(n => n.priority === 'urgent').length}
              </div>
              <div className="text-sm text-muted-foreground">Urgent</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {notifications.filter(n => n.type === 'success').length}
              </div>
              <div className="text-sm text-muted-foreground">Success</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}