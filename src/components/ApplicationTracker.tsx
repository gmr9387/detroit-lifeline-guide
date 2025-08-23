import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storageUtils } from '@/utils/localStorage';
import { Application, Program } from '@/types';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ApplicationTrackerProps {
  applications: Application[];
  onUpdate: (applications: Application[]) => void;
}

const statusConfig = {
  saved: { 
    label: 'Saved', 
    color: 'bg-gray-500', 
    icon: FileText,
    description: 'Application saved for later'
  },
  started: { 
    label: 'In Progress', 
    color: 'bg-blue-500', 
    icon: Clock,
    description: 'Application started but not submitted'
  },
  submitted: { 
    label: 'Submitted', 
    color: 'bg-yellow-500', 
    icon: AlertCircle,
    description: 'Application submitted, waiting for response'
  },
  approved: { 
    label: 'Approved', 
    color: 'bg-green-500', 
    icon: CheckCircle,
    description: 'Application approved'
  },
  denied: { 
    label: 'Denied', 
    color: 'bg-red-500', 
    icon: AlertCircle,
    description: 'Application denied'
  },
};

export default function ApplicationTracker({ applications, onUpdate }: ApplicationTrackerProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    notes: '',
  });

  useEffect(() => {
    if (selectedApplication) {
      setEditForm({
        status: selectedApplication.status,
        notes: selectedApplication.notes || '',
      });
    }
  }, [selectedApplication]);

  const handleStatusUpdate = (applicationId: string, newStatus: Application['status']) => {
    const updatedApplications = applications.map(app => 
      app.id === applicationId 
        ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
        : app
    );
    storageUtils.saveApplications(updatedApplications);
    onUpdate(updatedApplications);
  };

  const handleEditApplication = () => {
    if (!selectedApplication) return;

    const updatedApplications = applications.map(app => 
      app.id === selectedApplication.id 
        ? { 
            ...app, 
            status: editForm.status as Application['status'],
            notes: editForm.notes,
            updatedAt: new Date().toISOString() 
          }
        : app
    );
    
    storageUtils.saveApplications(updatedApplications);
    onUpdate(updatedApplications);
    setIsEditDialogOpen(false);
    setSelectedApplication(null);
  };

  const handleDeleteApplication = (applicationId: string) => {
    const updatedApplications = applications.filter(app => app.id !== applicationId);
    storageUtils.saveApplications(updatedApplications);
    onUpdate(updatedApplications);
  };

  const getStatusProgress = (status: Application['status']) => {
    const statusOrder = ['saved', 'started', 'submitted', 'approved'];
    const currentIndex = statusOrder.indexOf(status);
    return ((currentIndex + 1) / statusOrder.length) * 100;
  };

  const getUpcomingDeadlines = () => {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return applications.filter(app => {
      if (app.deadline) {
        const deadline = new Date(app.deadline);
        return deadline > now && deadline <= thirtyDaysFromNow;
      }
      return false;
    });
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  if (applications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start applying to programs to track your progress here.
          </p>
          <Button onClick={() => window.location.href = '/programs'}>
            <Plus className="mr-2 h-4 w-4" />
            Browse Programs
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'started').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'submitted').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Deadlines
            </CardTitle>
            <CardDescription>
              Applications with deadlines in the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingDeadlines.map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{app.programName}</p>
                    <p className="text-sm text-muted-foreground">
                      Deadline: {app.deadline && format(new Date(app.deadline), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <Badge variant="destructive">
                    {app.deadline && formatDistanceToNow(new Date(app.deadline), { addSuffix: true })}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>
            Track the status and progress of your program applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {applications.map(application => {
              const statusInfo = statusConfig[application.status];
              const StatusIcon = statusInfo.icon;
              const progress = getStatusProgress(application.status);

              return (
                <div key={application.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{application.programName}</h3>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Applied: {format(new Date(application.appliedAt), 'MMM dd, yyyy')}
                      </p>
                      {application.notes && (
                        <p className="text-sm text-muted-foreground">
                          Notes: {application.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{application.programName}</DialogTitle>
                            <DialogDescription>
                              Application details and status
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Status</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusIcon className="h-4 w-4" />
                                <span>{statusInfo.label}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {statusInfo.description}
                              </p>
                            </div>
                            <div>
                              <Label>Progress</Label>
                              <Progress value={progress} className="mt-1" />
                              <p className="text-sm text-muted-foreground mt-1">
                                {Math.round(progress)}% complete
                              </p>
                            </div>
                            {application.notes && (
                              <div>
                                <Label>Notes</Label>
                                <p className="text-sm mt-1">{application.notes}</p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => {
                                  setSelectedApplication(application);
                                  setIsEditDialogOpen(true);
                                }}
                                className="flex-1"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => window.open(`/program/${application.programId}`, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Program
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} />
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Select 
                      value={application.status} 
                      onValueChange={(value) => handleStatusUpdate(application.id, value as Application['status'])}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteApplication(application.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Application</DialogTitle>
            <DialogDescription>
              Update the status and notes for your application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={editForm.notes}
                onChange={(e) => setEditForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any notes about this application..."
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditApplication} className="flex-1">
                Save Changes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}