import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Search, 
  FileText, 
  CheckCircle, 
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalyticsData {
  users: {
    total: number;
    active: number;
    new: number;
    returning: number;
  };
  programs: {
    total: number;
    viewed: number;
    applied: number;
    popular: Array<{ id: string; name: string; views: number; applications: number }>;
  };
  searches: {
    total: number;
    successful: number;
    popular: Array<{ term: string; count: number }>;
    categories: Array<{ category: string; count: number }>;
  };
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    successRate: number;
  };
  impact: {
    totalAssistance: number;
    averageWaitTime: number;
    outcomes: Array<{ outcome: string; count: number; percentage: number }>;
  };
}

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    const loadAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        users: {
          total: 1247,
          active: 892,
          new: 156,
          returning: 736,
        },
        programs: {
          total: 89,
          viewed: 3421,
          applied: 567,
          popular: [
            { id: '1', name: 'SNAP Benefits', views: 456, applications: 89 },
            { id: '2', name: 'Housing Assistance', views: 389, applications: 67 },
            { id: '3', name: 'Job Training', views: 234, applications: 45 },
            { id: '4', name: 'Healthcare Access', views: 198, applications: 34 },
            { id: '5', name: 'Childcare Support', views: 167, applications: 28 },
          ],
        },
        searches: {
          total: 2156,
          successful: 1892,
          popular: [
            { term: 'housing assistance', count: 234 },
            { term: 'food stamps', count: 189 },
            { term: 'job training', count: 156 },
            { term: 'healthcare', count: 134 },
            { term: 'childcare', count: 98 },
          ],
          categories: [
            { category: 'Housing', count: 456 },
            { category: 'Employment', count: 389 },
            { category: 'Healthcare', count: 234 },
            { category: 'Education', count: 198 },
            { category: 'Food', count: 167 },
          ],
        },
        applications: {
          total: 567,
          pending: 123,
          approved: 389,
          rejected: 55,
          successRate: 87.6,
        },
        impact: {
          totalAssistance: 2340000,
          averageWaitTime: 14,
          outcomes: [
            { outcome: 'Housing Secured', count: 156, percentage: 27.5 },
            { outcome: 'Employment Found', count: 89, percentage: 15.7 },
            { outcome: 'Benefits Received', count: 234, percentage: 41.3 },
            { outcome: 'Education Started', count: 67, percentage: 11.8 },
            { outcome: 'Healthcare Access', count: 21, percentage: 3.7 },
          ],
        },
      };
      
      setAnalyticsData(mockData);
      setIsLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  if (isLoading || !analyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track user engagement and program impact</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Users"
          value={analyticsData.users.total.toLocaleString()}
          change="+12.5%"
          trend="up"
          icon={<Users className="h-4 w-4" />}
        />
        <MetricCard
          title="Program Views"
          value={analyticsData.programs.viewed.toLocaleString()}
          change="+8.3%"
          trend="up"
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          title="Applications"
          value={analyticsData.applications.total.toLocaleString()}
          change="+15.2%"
          trend="up"
          icon={<FileText className="h-4 w-4" />}
        />
        <MetricCard
          title="Success Rate"
          value={`${analyticsData.applications.successRate}%`}
          change="+2.1%"
          trend="up"
          icon={<CheckCircle className="h-4 w-4" />}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="searches">Searches</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  User Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Users</span>
                    <span className="font-medium">{analyticsData.users.active}</span>
                  </div>
                  <Progress value={(analyticsData.users.active / analyticsData.users.total) * 100} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">New Users</span>
                    <span className="font-medium">{analyticsData.users.new}</span>
                  </div>
                  <Progress value={(analyticsData.users.new / analyticsData.users.total) * 100} />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Returning Users</span>
                    <span className="font-medium">{analyticsData.users.returning}</span>
                  </div>
                  <Progress value={(analyticsData.users.returning / analyticsData.users.total) * 100} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approved</span>
                    <span className="font-medium text-green-600">{analyticsData.applications.approved}</span>
                  </div>
                  <Progress value={(analyticsData.applications.approved / analyticsData.applications.total) * 100} className="bg-green-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending</span>
                    <span className="font-medium text-yellow-600">{analyticsData.applications.pending}</span>
                  </div>
                  <Progress value={(analyticsData.applications.pending / analyticsData.applications.total) * 100} className="bg-yellow-100" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rejected</span>
                    <span className="font-medium text-red-600">{analyticsData.applications.rejected}</span>
                  </div>
                  <Progress value={(analyticsData.applications.rejected / analyticsData.applications.total) * 100} className="bg-red-100" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Demographics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{analyticsData.users.new}</div>
                  <div className="text-sm text-muted-foreground">New Users</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{analyticsData.users.returning}</div>
                  <div className="text-sm text-muted-foreground">Returning Users</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{analyticsData.users.active}</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Popular Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.programs.popular.map((program, index) => (
                  <div key={program.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <div>
                        <div className="font-medium">{program.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {program.views} views • {program.applications} applications
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{Math.round((program.applications / program.views) * 100)}%</div>
                      <div className="text-sm text-muted-foreground">conversion</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="searches" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Popular Search Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.searches.popular.map((search, index) => (
                    <div key={search.term} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{search.term}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{search.count} searches</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Search by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.searches.categories.map((category, index) => (
                    <div key={category.category} className="flex items-center justify-between">
                      <span className="font-medium">{category.category}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(category.count / Math.max(...analyticsData.searches.categories.map(c => c.count))) * 100} className="w-20" />
                        <span className="text-sm text-muted-foreground">{category.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      ${(analyticsData.impact.totalAssistance / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-sm text-muted-foreground">Total Assistance Provided</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analyticsData.impact.averageWaitTime} days
                    </div>
                    <div className="text-sm text-muted-foreground">Average Wait Time</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.impact.outcomes.map((outcome) => (
                    <div key={outcome.outcome} className="flex items-center justify-between">
                      <span className="font-medium">{outcome.outcome}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={outcome.percentage} className="w-20" />
                        <span className="text-sm text-muted-foreground">{outcome.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={cn(
              "flex items-center text-sm",
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              {change}
            </div>
          </div>
          <div className="p-2 bg-primary/10 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}