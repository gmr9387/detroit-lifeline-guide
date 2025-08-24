import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign,
  Users,
  Calendar,
  Target,
  Award,
  BarChart3,
  PieChart
} from 'lucide-react';
import { AnalyticsData, Application } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface AnalyticsProps {
  showCharts?: boolean;
  showDetails?: boolean;
}

export function Analytics({ showCharts = true, showDetails = true }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const apps = storageUtils.getApplications();
    setApplications(apps);
    
    let data = storageUtils.getAnalytics();
    if (!data) {
      data = storageUtils.generateAnalytics();
    }
    setAnalytics(data);
  };

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Loading analytics...</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'denied':
        return 'destructive';
      case 'submitted':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'denied':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRecommendations = () => {
    const recommendations = [];
    
    if (analytics.successRate < 70) {
      recommendations.push({
        icon: Target,
        title: 'Improve Application Success',
        description: 'Focus on completing all required documents and following up on applications.',
        priority: 'high'
      });
    }
    
    if (analytics.averageWaitTime > 30) {
      recommendations.push({
        icon: Clock,
        title: 'Reduce Wait Times',
        description: 'Consider applying to programs with faster processing times.',
        priority: 'medium'
      });
    }
    
    if (analytics.totalApplications < 3) {
      recommendations.push({
        icon: TrendingUp,
        title: 'Explore More Programs',
        description: 'Apply to additional programs to increase your chances of approval.',
        priority: 'medium'
      });
    }
    
    return recommendations;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{analytics.totalApplications}</p>
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
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                <p className="text-2xl font-bold">{analytics.averageWaitTime.toFixed(0)} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Benefits Received</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalBenefitsReceived)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Rate Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Application Status Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Approved
                </Badge>
                <span className="text-sm">{analytics.approvedApplications} applications</span>
              </div>
              <span className="text-sm font-medium">
                {analytics.totalApplications > 0 
                  ? ((analytics.approvedApplications / analytics.totalApplications) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={analytics.totalApplications > 0 
                ? (analytics.approvedApplications / analytics.totalApplications) * 100 
                : 0} 
              className="h-2"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Denied
                </Badge>
                <span className="text-sm">{analytics.deniedApplications} applications</span>
              </div>
              <span className="text-sm font-medium">
                {analytics.totalApplications > 0 
                  ? ((analytics.deniedApplications / analytics.totalApplications) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={analytics.totalApplications > 0 
                ? (analytics.deniedApplications / analytics.totalApplications) * 100 
                : 0} 
              className="h-2"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending
                </Badge>
                <span className="text-sm">
                  {analytics.totalApplications - analytics.approvedApplications - analytics.deniedApplications} applications
                </span>
              </div>
              <span className="text-sm font-medium">
                {analytics.totalApplications > 0 
                  ? (((analytics.totalApplications - analytics.approvedApplications - analytics.deniedApplications) / analytics.totalApplications) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
            <Progress 
              value={analytics.totalApplications > 0 
                ? ((analytics.totalApplications - analytics.approvedApplications - analytics.deniedApplications) / analytics.totalApplications) * 100 
                : 0} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Program Performance */}
      {showDetails && analytics.programSuccessRates.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Program Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.programSuccessRates.map((program) => (
                <div key={program.programId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{program.programName}</h4>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{program.successRate.toFixed(1)}% success rate</span>
                      <span>{program.averageWaitTime} days avg wait</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-background rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(program.successRate, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{program.successRate.toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {getRecommendations().map((rec, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <rec.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                </div>
                <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                  {rec.priority}
                </Badge>
              </div>
            ))}
            {getRecommendations().length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Great job! Your applications are performing well.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Applications */}
      {showDetails && applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{app.programName}</h4>
                    <p className="text-xs text-muted-foreground">
                      Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusColor(app.status)} className="flex items-center gap-1">
                    {getStatusIcon(app.status)}
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}