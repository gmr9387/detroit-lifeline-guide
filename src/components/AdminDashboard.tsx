import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Globe,
  Lock,
  Key,
  Server,
  Zap
} from 'lucide-react';
import { 
  AdminUser, 
  AdminProgram, 
  SystemAnalytics, 
  APIIntegration,
  SecurityAudit,
  DataEncryption,
  EnterpriseSettings
} from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface AdminDashboardProps {
  showFullFeatures?: boolean;
}

export function AdminDashboard({ showFullFeatures = true }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [adminPrograms, setAdminPrograms] = useState<AdminProgram[]>([]);
  const [systemAnalytics, setSystemAnalytics] = useState<SystemAnalytics | null>(null);
  const [apiIntegrations, setApiIntegrations] = useState<APIIntegration[]>([]);
  const [securityAudits, setSecurityAudits] = useState<SecurityAudit[]>([]);
  const [encryptionConfig, setEncryptionConfig] = useState<DataEncryption | null>(null);
  const [enterpriseSettings, setEnterpriseSettings] = useState<EnterpriseSettings | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAdminUsers(storageUtils.getAdminUsers());
    setAdminPrograms(storageUtils.getAdminPrograms());
    setSystemAnalytics(storageUtils.getSystemAnalytics());
    setApiIntegrations(storageUtils.getAPIIntegrations());
    setSecurityAudits(storageUtils.getSecurityAudits());
    setEncryptionConfig(storageUtils.getEncryptionConfig());
    setEnterpriseSettings(storageUtils.getEnterpriseSettings());
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'destructive';
      case 'error':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'warning';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatUptime = (uptime: number) => {
    return `${uptime.toFixed(2)}%`;
  };

  const formatResponseTime = (time: number) => {
    return `${time}ms`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Admin Access
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Server className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">System Uptime</p>
                    <p className="text-2xl font-bold">
                      {systemAnalytics ? formatUptime(systemAnalytics.systemUptime) : '99.9%'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold">
                      {systemAnalytics ? formatResponseTime(systemAnalytics.averageResponseTime) : '150ms'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">
                      {systemAnalytics ? systemAnalytics.activeUsers : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Growth</p>
                    <p className="text-2xl font-bold">
                      {systemAnalytics ? `${systemAnalytics.monthlyGrowth}%` : '25%'}
                    </p>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
                  <Plus className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Add Program</div>
                    <div className="text-xs text-muted-foreground">Create new program</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
                  <Users className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Manage Users</div>
                    <div className="text-xs text-muted-foreground">User administration</div>
                  </div>
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4 flex-col">
                  <Shield className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Security Audit</div>
                    <div className="text-xs text-muted-foreground">View security logs</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Admin Users</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>
          
          <div className="space-y-2">
            {adminUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{user.role}</Badge>
                          <Badge variant={user.isActive ? 'success' : 'secondary'} className="text-xs">
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Program Management</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Program
            </Button>
          </div>
          
          <div className="space-y-2">
            {adminPrograms.map((program) => (
              <Card key={program.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Globe className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{program.name}</h4>
                        <p className="text-sm text-muted-foreground">{program.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={program.isActive ? 'success' : 'secondary'} className="text-xs">
                            {program.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {program.applicationCount} applications
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {program.successRate.toFixed(1)}% success
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <h3 className="text-lg font-semibold">System Analytics</h3>
          
          {systemAnalytics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Daily Active Users</span>
                      <span className="font-medium">{systemAnalytics.userEngagement.dailyActiveUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekly Active Users</span>
                      <span className="font-medium">{systemAnalytics.userEngagement.weeklyActiveUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Active Users</span>
                      <span className="font-medium">{systemAnalytics.userEngagement.monthlyActiveUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Session Duration</span>
                      <span className="font-medium">{systemAnalytics.userEngagement.averageSessionDuration}m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Page Load Time</span>
                      <span className="font-medium">{systemAnalytics.performanceMetrics.pageLoadTime}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Response Time</span>
                      <span className="font-medium">{formatResponseTime(systemAnalytics.performanceMetrics.apiResponseTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-medium">{systemAnalytics.performanceMetrics.errorRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span className="font-medium">{formatUptime(systemAnalytics.performanceMetrics.uptime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">API Integrations</h3>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Integration
            </Button>
          </div>
          
          <div className="space-y-2">
            {apiIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        <p className="text-sm text-muted-foreground">{integration.endpoint}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={getStatusColor(integration.status)} className="text-xs">
                            {getStatusIcon(integration.status)}
                            {integration.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {integration.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {integration.successRate.toFixed(1)}% success
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <h3 className="text-lg font-semibold">Security & Compliance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Encryption
                </CardTitle>
              </CardHeader>
              <CardContent>
                {encryptionConfig ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Algorithm</span>
                      <span className="font-medium">{encryptionConfig.algorithm}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Key Size</span>
                      <span className="font-medium">{encryptionConfig.keySize} bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Encryption Level</span>
                      <span className="font-medium">{encryptionConfig.encryptionLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Key Rotation</span>
                      <span className="font-medium">{formatDate(encryptionConfig.lastKeyRotation)}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No encryption configuration found</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {encryptionConfig ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>HIPAA Compliance</span>
                      <Badge variant={encryptionConfig.complianceStatus.hipaa ? 'success' : 'destructive'}>
                        {encryptionConfig.complianceStatus.hipaa ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>GDPR Compliance</span>
                      <Badge variant={encryptionConfig.complianceStatus.gdpr ? 'success' : 'destructive'}>
                        {encryptionConfig.complianceStatus.gdpr ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SOX Compliance</span>
                      <Badge variant={encryptionConfig.complianceStatus.sox ? 'success' : 'destructive'}>
                        {encryptionConfig.complianceStatus.sox ? 'Compliant' : 'Non-Compliant'}
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No compliance data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Security Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Security Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {securityAudits.slice(0, 5).map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(audit.severity)} className="text-xs">
                        {audit.severity}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{audit.action}</p>
                        <p className="text-xs text-muted-foreground">{audit.details}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{formatDate(audit.timestamp)}</p>
                      <p className="text-xs text-muted-foreground">{audit.ipAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}