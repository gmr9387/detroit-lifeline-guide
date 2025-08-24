import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  AlertCircle,
  ChevronRight,
  FileText,
  Calendar,
  Phone
} from 'lucide-react';
import { ProgressMilestone, Application } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface ProgressTrackerProps {
  applicationId: string;
  application?: Application;
  showDetails?: boolean;
}

const defaultMilestones = [
  {
    id: '1',
    title: 'Application Started',
    description: 'Initial application submitted',
    order: 1
  },
  {
    id: '2',
    title: 'Documents Submitted',
    description: 'Required documents uploaded',
    order: 2
  },
  {
    id: '3',
    title: 'Under Review',
    description: 'Application being processed',
    order: 3
  },
  {
    id: '4',
    title: 'Additional Info Requested',
    description: 'Follow up on any requests',
    order: 4
  },
  {
    id: '5',
    title: 'Decision Made',
    description: 'Application approved or denied',
    order: 5
  }
];

export function ProgressTracker({ applicationId, application, showDetails = true }: ProgressTrackerProps) {
  const [milestones, setMilestones] = useState<ProgressMilestone[]>([]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    loadMilestones();
  }, [applicationId]);

  const loadMilestones = () => {
    let appMilestones = storageUtils.getMilestonesForApplication(applicationId);
    
    // If no milestones exist, create default ones based on application status
    if (appMilestones.length === 0) {
      appMilestones = defaultMilestones.map(milestone => ({
        ...milestone,
        applicationId,
        completed: getDefaultCompletionStatus(milestone.order, application?.status),
        id: `${applicationId}-${milestone.id}`
      }));
      
      // Save default milestones
      appMilestones.forEach(milestone => {
        storageUtils.saveProgressMilestone(milestone);
      });
    }
    
    setMilestones(appMilestones);
    calculateProgress(appMilestones);
  };

  const getDefaultCompletionStatus = (order: number, status?: Application['status']) => {
    if (!status) return order === 1; // Only first milestone if no status
    
    const statusOrder = {
      saved: 1,
      started: 1,
      submitted: 2,
      approved: 5,
      denied: 5
    };
    
    return order <= statusOrder[status];
  };

  const calculateProgress = (milestones: ProgressMilestone[]) => {
    const completed = milestones.filter(m => m.completed).length;
    const percentage = (completed / milestones.length) * 100;
    setProgressPercentage(Math.round(percentage));
  };

  const toggleMilestone = (milestoneId: string) => {
    const updatedMilestones = milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        const updated = { ...milestone, completed: !milestone.completed };
        storageUtils.saveProgressMilestone(updated);
        return updated;
      }
      return milestone;
    });
    
    setMilestones(updatedMilestones);
    calculateProgress(updatedMilestones);
  };

  const getStatusColor = (milestone: ProgressMilestone) => {
    if (milestone.completed) return 'success';
    if (isNextMilestone(milestone)) return 'warning';
    return 'secondary';
  };

  const isNextMilestone = (milestone: ProgressMilestone) => {
    const completedCount = milestones.filter(m => m.completed).length;
    return milestone.order === completedCount + 1;
  };

  const getStatusIcon = (milestone: ProgressMilestone) => {
    if (milestone.completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    if (isNextMilestone(milestone)) {
      return <Clock className="h-5 w-5 text-yellow-600" />;
    }
    return <Circle className="h-5 w-5 text-gray-400" />;
  };

  const getNextSteps = () => {
    const nextMilestone = milestones.find(m => !m.completed);
    if (!nextMilestone) return null;

    const steps = {
      1: [
        { icon: FileText, text: 'Complete application form' },
        { icon: Calendar, text: 'Note submission deadline' }
      ],
      2: [
        { icon: FileText, text: 'Gather required documents' },
        { icon: Phone, text: 'Contact program for document list' }
      ],
      3: [
        { icon: Clock, text: 'Wait for processing (2-4 weeks)' },
        { icon: Phone, text: 'Check status weekly' }
      ],
      4: [
        { icon: AlertCircle, text: 'Respond to requests promptly' },
        { icon: Phone, text: 'Call if you have questions' }
      ],
      5: [
        { icon: CheckCircle, text: 'Review decision letter' },
        { icon: Phone, text: 'Appeal if needed within 30 days' }
      ]
    };

    return steps[nextMilestone.order as keyof typeof steps] || [];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Application Progress</h3>
        <Badge variant="outline">
          {progressPercentage}% Complete
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <Card 
            key={milestone.id} 
            className={`transition-all cursor-pointer hover:shadow-sm ${
              milestone.completed ? 'border-green-200 bg-green-50/50' : 
              isNextMilestone(milestone) ? 'border-yellow-200 bg-yellow-50/50' : ''
            }`}
            onClick={() => toggleMilestone(milestone.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(milestone)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className={`font-medium ${milestone.completed ? 'text-green-700' : ''}`}>
                        {milestone.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {milestone.description}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(milestone)} className="text-xs">
                      {milestone.completed ? 'Completed' : 
                       isNextMilestone(milestone) ? 'Next' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Next Steps */}
      {showDetails && getNextSteps() && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ChevronRight className="h-5 w-5 text-blue-600" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getNextSteps()?.map((step, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <step.icon className="h-4 w-4 text-blue-600" />
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Application Status */}
      {application && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{application.programName}</h4>
                <p className="text-sm text-muted-foreground">
                  Applied {new Date(application.appliedAt).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={
                application.status === 'approved' ? 'success' :
                application.status === 'denied' ? 'destructive' :
                application.status === 'submitted' ? 'default' :
                'secondary'
              }>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}