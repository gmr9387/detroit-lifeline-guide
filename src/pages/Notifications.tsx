import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { NotificationCenter } from '@/components/NotificationCenter';
import { TodoList } from '@/components/TodoList';
import { 
  Bell, 
  ListTodo, 
  ArrowLeft,
  Filter,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Notifications & Tasks</h1>
              <p className="text-muted-foreground">Stay on top of your applications and important deadlines</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                All Notifications
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </div>
            <NotificationCenter showAll={true} />
          </div>

          {/* Todo List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-primary" />
                All Tasks
              </h2>
            </div>
            <TodoList showAddButton={true} />
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate('/dashboard')}
              >
                <CheckCircle className="h-4 w-4" />
                View Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => navigate('/programs')}
              >
                <Info className="h-4 w-4" />
                Browse Programs
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  // Add sample tasks
                  const sampleTasks = [
                    {
                      id: Date.now().toString(),
                      title: 'Check SNAP application status',
                      description: 'Follow up on SNAP benefits application',
                      completed: false,
                      category: 'important' as const,
                      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      createdAt: new Date().toISOString()
                    },
                    {
                      id: (Date.now() + 1).toString(),
                      title: 'Gather tax documents',
                      description: 'Collect W-2s, 1099s, and other tax documents',
                      completed: false,
                      category: 'urgent' as const,
                      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                      createdAt: new Date().toISOString()
                    }
                  ];
                  
                  sampleTasks.forEach(task => {
                    const { storageUtils } = require('@/utils/localStorage');
                    storageUtils.saveTodoItem(task);
                  });
                  
                  window.location.reload();
                }}
              >
                <ListTodo className="h-4 w-4" />
                Add Sample Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}