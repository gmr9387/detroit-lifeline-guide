import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/layout/AppLayout';
import { Analytics } from '@/components/Analytics';
import { 
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';

export default function AnalyticsPage() {
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
              <h1 className="text-2xl font-bold">Analytics & Insights</h1>
              <p className="text-muted-foreground">Track your application progress and optimize your benefits</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-green-600">+50% vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">85%</p>
                  <p className="text-xs text-green-600">+12% vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg Wait Time</p>
                  <p className="text-2xl font-bold">18d</p>
                  <p className="text-xs text-red-600">+3d vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Benefits Value</p>
                  <p className="text-2xl font-bold">$2,450</p>
                  <p className="text-xs text-green-600">+$320 vs last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics */}
        <Analytics showCharts={true} showDetails={true} />

        {/* Insights & Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Personalized Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Optimization Opportunities</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">Apply to More Programs</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      You've only applied to 2 programs. Consider applying to 3-5 more to increase your chances of approval.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900">Document Preparation</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Your document completion rate is 75%. Complete all required documents to improve approval chances.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900">Follow-up Strategy</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Consider following up on pending applications after 14 days to check status.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Success Patterns</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-900">Best Performing Programs</h4>
                    <p className="text-sm text-purple-700 mt-1">
                      SNAP and WIC programs have the highest success rates in your area.
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <h4 className="font-medium text-indigo-900">Optimal Application Timing</h4>
                    <p className="text-sm text-indigo-700 mt-1">
                      Applications submitted in the first week of the month have 15% higher approval rates.
                    </p>
                  </div>
                  <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                    <h4 className="font-medium text-teal-900">Document Impact</h4>
                    <p className="text-sm text-teal-700 mt-1">
                      Applications with complete documentation are approved 3x faster than incomplete ones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Recommended Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4 flex-col"
                onClick={() => navigate('/programs')}
              >
                <TrendingUp className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Explore More Programs</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Find additional programs to apply to
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4 flex-col"
                onClick={() => navigate('/notifications')}
              >
                <Calendar className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Check Application Status</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Follow up on pending applications
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4 flex-col"
                onClick={() => navigate('/community')}
              >
                <BarChart3 className="h-6 w-6 text-primary" />
                <div className="text-center">
                  <div className="font-medium">Community Insights</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Learn from others' experiences
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}