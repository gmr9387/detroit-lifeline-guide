import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminDashboard } from '@/components/AdminDashboard';
import { 
  ArrowLeft,
  Shield,
  Settings,
  Users,
  Database,
  Lock,
  BarChart3,
  Globe,
  Zap,
  Server
} from 'lucide-react';

export default function Admin() {
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
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <p className="text-muted-foreground">Enterprise management and system administration</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Admin Access
            </Badge>
          </div>
        </div>

        {/* Admin Dashboard */}
        <AdminDashboard showFullFeatures={true} />

        {/* Enterprise Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">User Management</p>
                  <p className="text-lg font-semibold">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Database className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">API Integrations</p>
                  <p className="text-lg font-semibold">3 Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Lock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Security Status</p>
                  <p className="text-lg font-semibold">Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Server className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-lg font-semibold">99.9%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security & Compliance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">HIPAA Compliance</span>
                  </div>
                  <Badge variant="success">Compliant</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">Data Encryption</span>
                  </div>
                  <Badge variant="success">AES-256</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-900">SSL/TLS</span>
                  </div>
                  <Badge variant="success">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Audit Logging</span>
                  </div>
                  <Badge variant="warning">Review Required</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                System Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">System Uptime</span>
                  <span className="font-medium text-green-600">99.9%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.9%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Response Time</span>
                  <span className="font-medium text-blue-600">150ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <span className="font-medium text-green-600">0.1%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Success Rate</span>
                  <span className="font-medium text-green-600">99.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '99.5%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4 flex-col"
                onClick={() => navigate('/admin/users')}
              >
                <Users className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">User Management</div>
                  <div className="text-xs text-muted-foreground">Manage admin users</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4 flex-col"
                onClick={() => navigate('/admin/programs')}
              >
                <Globe className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Program Management</div>
                  <div className="text-xs text-muted-foreground">Manage programs</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4 flex-col"
                onClick={() => navigate('/admin/security')}
              >
                <Shield className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Security Settings</div>
                  <div className="text-xs text-muted-foreground">Configure security</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4 flex-col"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">System Settings</div>
                  <div className="text-xs text-muted-foreground">Configure system</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Information */}
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">System Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Version:</span>
                    <span>2.0.0 (Enterprise)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Environment:</span>
                    <span>Production</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database:</span>
                    <span>PostgreSQL 14</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cache:</span>
                    <span>Redis 6.2</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">License Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">License Type:</span>
                    <span>Enterprise</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span>Dec 31, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Users:</span>
                    <span>Unlimited</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Support:</span>
                    <span>24/7 Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}