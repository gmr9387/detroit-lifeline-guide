import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Download, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Settings,
  Key,
  Database,
  FileText,
  Bell,
  Globe,
  ShieldCheck,
  Privacy,
  Activity,
  History
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiry: number;
  loginNotifications: boolean;
  suspiciousActivityAlerts: boolean;
  dataEncryption: boolean;
  auditLogging: boolean;
}

interface PrivacySettings {
  dataSharing: boolean;
  analyticsTracking: boolean;
  marketingEmails: boolean;
  thirdPartyCookies: boolean;
  locationTracking: boolean;
  profileVisibility: 'public' | 'private' | 'friends';
  dataRetention: number;
}

interface AuditLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
  severity: 'low' | 'medium' | 'high';
}

export function SecuritySettings() {
  const { user } = useAuth();
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    loginNotifications: true,
    suspiciousActivityAlerts: true,
    dataEncryption: true,
    auditLogging: true,
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,
    thirdPartyCookies: false,
    locationTracking: false,
    profileVisibility: 'private',
    dataRetention: 365,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Mock audit logs
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        action: 'LOGIN',
        description: 'User logged in from Detroit, MI',
        timestamp: '2024-01-15T10:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
        status: 'success',
        severity: 'low',
      },
      {
        id: '2',
        action: 'PASSWORD_CHANGE',
        description: 'Password changed successfully',
        timestamp: '2024-01-14T15:20:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        status: 'success',
        severity: 'medium',
      },
      {
        id: '3',
        action: 'FAILED_LOGIN',
        description: 'Failed login attempt from unknown location',
        timestamp: '2024-01-13T08:45:00Z',
        ipAddress: '203.0.113.1',
        userAgent: 'Unknown',
        status: 'failed',
        severity: 'high',
      },
      {
        id: '4',
        action: 'DATA_EXPORT',
        description: 'User data exported',
        timestamp: '2024-01-12T14:15:00Z',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        status: 'success',
        severity: 'medium',
      },
    ];
    setAuditLogs(mockLogs);
  }, []);

  const handleSecuritySettingChange = (setting: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: value }));
  };

  const handlePrivacySettingChange = (setting: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleExportData = async () => {
    setIsExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsExporting(false);
    // In a real app, this would trigger a download
    console.log('Data exported successfully');
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    // Simulate deletion process
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsDeleting(false);
    // In a real app, this would delete the account
    console.log('Account deleted successfully');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Security & Privacy</h1>
        <p className="text-muted-foreground">Manage your account security and privacy settings</p>
      </div>

      <Tabs defaultValue="security" className="space-y-4">
        <TabsList>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Account Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    id="2fa"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorAuth', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Select
                    value={securitySettings.sessionTimeout.toString()}
                    onValueChange={(value) => handleSecuritySettingChange('sessionTimeout', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                  <Select
                    value={securitySettings.passwordExpiry.toString()}
                    onValueChange={(value) => handleSecuritySettingChange('passwordExpiry', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Security Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="login-notifications">Login Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when you log in from a new device
                    </p>
                  </div>
                  <Switch
                    id="login-notifications"
                    checked={securitySettings.loginNotifications}
                    onCheckedChange={(checked) => handleSecuritySettingChange('loginNotifications', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="suspicious-activity">Suspicious Activity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Alert me about unusual account activity
                    </p>
                  </div>
                  <Switch
                    id="suspicious-activity"
                    checked={securitySettings.suspiciousActivityAlerts}
                    onCheckedChange={(checked) => handleSecuritySettingChange('suspiciousActivityAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Protection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Protection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="encryption">Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">
                      Encrypt all stored data
                    </p>
                  </div>
                  <Switch
                    id="encryption"
                    checked={securitySettings.dataEncryption}
                    onCheckedChange={(checked) => handleSecuritySettingChange('dataEncryption', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="audit-logging">Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">
                      Log all account activities
                    </p>
                  </div>
                  <Switch
                    id="audit-logging"
                    checked={securitySettings.auditLogging}
                    onCheckedChange={(checked) => handleSecuritySettingChange('auditLogging', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Password Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Change Password
                </Button>
                <Button variant="outline" className="w-full">
                  View Password History
                </Button>
                <Button variant="outline" className="w-full">
                  Generate Strong Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Sharing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Data Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data-sharing">Share Data with Partners</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow sharing with trusted service providers
                    </p>
                  </div>
                  <Switch
                    id="data-sharing"
                    checked={privacySettings.dataSharing}
                    onCheckedChange={(checked) => handlePrivacySettingChange('dataSharing', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analytics">Analytics Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve our services with usage analytics
                    </p>
                  </div>
                  <Switch
                    id="analytics"
                    checked={privacySettings.analyticsTracking}
                    onCheckedChange={(checked) => handlePrivacySettingChange('analyticsTracking', checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="marketing">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new programs and services
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={privacySettings.marketingEmails}
                    onCheckedChange={(checked) => handlePrivacySettingChange('marketingEmails', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Profile & Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <Select
                    value={privacySettings.profileVisibility}
                    onValueChange={(value: any) => handlePrivacySettingChange('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="friends">Friends Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="location-tracking">Location Tracking</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow location-based program recommendations
                    </p>
                  </div>
                  <Switch
                    id="location-tracking"
                    checked={privacySettings.locationTracking}
                    onCheckedChange={(checked) => handlePrivacySettingChange('locationTracking', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="data-retention">Data Retention (days)</Label>
                  <Select
                    value={privacySettings.dataRetention.toString()}
                    onValueChange={(value) => handlePrivacySettingChange('dataRetention', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Log
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(log.status)}
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-muted-foreground">{log.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString()} • {log.ipAddress}
                        </div>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(log.severity)}>
                      {log.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Data Rights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Your Data Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Under GDPR, you have the right to access, modify, and delete your personal data.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <Button variant="outline" className="w-full" onClick={handleExportData} disabled={isExporting}>
                    {isExporting ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Export My Data
                      </>
                    )}
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete My Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Account</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            This action cannot be undone. All your data will be permanently deleted.
                          </AlertDescription>
                        </Alert>
                        <Button 
                          variant="destructive" 
                          className="w-full" 
                          onClick={handleDeleteAccount}
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <>
                              <Clock className="h-4 w-4 mr-2 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            'Confirm Deletion'
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Privacy Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full">
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Terms of Service
                  </Button>
                  <Button variant="outline" className="w-full">
                    Contact Data Protection Officer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}