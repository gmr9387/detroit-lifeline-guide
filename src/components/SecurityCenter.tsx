import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Lock, 
  Key, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Database,
  Server,
  Zap,
  Users,
  FileText
} from 'lucide-react';
import { SecurityAudit, DataEncryption, APIIntegration } from '@/types';
import { storageUtils } from '@/utils/localStorage';

interface SecurityCenterProps {
  showDetails?: boolean;
}

export function SecurityCenter({ showDetails = true }: SecurityCenterProps) {
  const [securityAudits, setSecurityAudits] = useState<SecurityAudit[]>([]);
  const [encryptionConfig, setEncryptionConfig] = useState<DataEncryption | null>(null);
  const [apiIntegrations, setApiIntegrations] = useState<APIIntegration[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSecurityAudits(storageUtils.getSecurityAudits());
    setEncryptionConfig(storageUtils.getEncryptionConfig());
    setApiIntegrations(storageUtils.getAPIIntegrations());
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

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'login':
        return <Users className="h-4 w-4" />;
      case 'data_access':
        return <Database className="h-4 w-4" />;
      case 'admin_action':
        return <Shield className="h-4 w-4" />;
      case 'security_alert':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Eye className="h-4 w-4" />;
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

  const getComplianceStatus = () => {
    if (!encryptionConfig) return { hipaa: false, gdpr: false, sox: false };
    return encryptionConfig.complianceStatus;
  };

  const complianceStatus = getComplianceStatus();
  const criticalEvents = securityAudits.filter(audit => audit.severity === 'critical').length;
  const highEvents = securityAudits.filter(audit => audit.severity === 'high').length;
  const totalEvents = securityAudits.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Security Center</h3>
        <Badge variant="outline" className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Enterprise Security
        </Badge>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Events</p>
                <p className="text-2xl font-bold">{criticalEvents}</p>
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
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">{highEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{totalEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">HIPAA</span>
              </div>
              <Badge variant={complianceStatus.hipaa ? 'success' : 'destructive'}>
                {complianceStatus.hipaa ? 'Compliant' : 'Non-Compliant'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">GDPR</span>
              </div>
              <Badge variant={complianceStatus.gdpr ? 'success' : 'destructive'}>
                {complianceStatus.gdpr ? 'Compliant' : 'Non-Compliant'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900">SOX</span>
              </div>
              <Badge variant={complianceStatus.sox ? 'success' : 'destructive'}>
                {complianceStatus.sox ? 'Compliant' : 'Non-Compliant'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Encryption Configuration */}
      {encryptionConfig && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Data Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Algorithm</span>
                  <span className="font-medium">{encryptionConfig.algorithm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Key Size</span>
                  <span className="font-medium">{encryptionConfig.keySize} bits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Encryption Level</span>
                  <span className="font-medium">{encryptionConfig.encryptionLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Last Key Rotation</span>
                  <span className="font-medium">{formatDate(encryptionConfig.lastKeyRotation)}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">AES-256 encryption enabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">SSL/TLS 1.3 enforced</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Key rotation automated</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Data at rest encrypted</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Events */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {securityAudits.slice(0, 10).map((audit) => (
                <div key={audit.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {getEventTypeIcon(audit.eventType)}
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
      )}
    </div>
  );
}