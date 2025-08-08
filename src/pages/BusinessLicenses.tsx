import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Play, 
  BookOpen, 
  CheckCircle, 
  Clock,
  DollarSign,
  FileText,
  Phone,
  Globe,
  MapPin,
  AlertCircle,
  Star,
  ArrowRight,
  Download,
  Calendar
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import businessLicensesData from '@/data/businessLicenses.json';
import { BusinessLicense, BusinessLicenseCategory, BusinessLicenseApplication } from '@/types';

export default function BusinessLicenses() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<BusinessLicenseApplication[]>([]);
  const [selectedLicense, setSelectedLicense] = useState<BusinessLicense | null>(null);

  const { categories, licenses, trainingResources } = businessLicensesData;

  useEffect(() => {
    // Load user's license applications from localStorage
    const savedApplications = localStorage.getItem('business_license_applications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  const filteredLicenses = licenses.filter(license => {
    const matchesCategory = selectedCategory === 'all' || license.category === selectedCategory;
    const matchesSearch = license.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         license.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getApplicationStatus = (licenseId: string) => {
    const application = applications.find(app => app.licenseId === licenseId);
    return application?.status || 'not-started';
  };

  const getProgressPercentage = (licenseId: string) => {
    const application = applications.find(app => app.licenseId === licenseId);
    if (!application) return 0;
    
    const totalSteps = 4; // research, documents, training, submit
    let completedSteps = 0;
    
    if (application.status !== 'not-started') completedSteps++;
    if (application.documentsCompleted.length > 0) completedSteps++;
    if (application.trainingCompleted.length > 0) completedSteps++;
    if (application.status === 'submitted' || application.status === 'under-review' || 
        application.status === 'approved' || application.status === 'denied') completedSteps++;
    
    return (completedSteps / totalSteps) * 100;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'not-started': { variant: 'secondary' as const, text: 'Not Started' },
      'researching': { variant: 'warning' as const, text: 'Researching' },
      'preparing': { variant: 'default' as const, text: 'Preparing' },
      'submitted': { variant: 'default' as const, text: 'Submitted' },
      'under-review': { variant: 'default' as const, text: 'Under Review' },
      'approved': { variant: 'success' as const, text: 'Approved' },
      'denied': { variant: 'destructive' as const, text: 'Denied' },
    };
    
    const config = variants[status as keyof typeof variants] || variants['not-started'];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const quickActions = [
    {
      title: 'Restaurant License',
      description: 'Food service establishment',
      icon: '🍽️',
      category: 'food-service',
      popular: true
    },
    {
      title: 'Liquor License',
      description: 'Alcohol sales and service',
      icon: '🍷',
      category: 'alcohol',
      popular: true
    },
    {
      title: 'Grocery Store',
      description: 'Food retail establishment',
      icon: '🛒',
      category: 'retail',
      popular: false
    },
    {
      title: 'Food Truck',
      description: 'Mobile food service',
      icon: '🚚',
      category: 'food-service',
      popular: false
    }
  ];

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Business License Training
          </h1>
          <p className="text-muted-foreground">
            Get step-by-step guidance to obtain your business license in Detroit
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular Licenses</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  const license = licenses.find(l => l.category === action.category);
                  if (license) {
                    setSelectedLicense(license);
                  }
                }}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-3xl mb-2">{action.icon}</div>
                  <h3 className="font-semibold text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                  {action.popular && (
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Popular
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search licenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'bg-primary text-primary-foreground' : ''}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* License Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLicenses.map((license) => {
            const status = getApplicationStatus(license.id);
            const progress = getProgressPercentage(license.id);
            
            return (
              <Card key={license.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{license.name}</CardTitle>
                    {getStatusBadge(status)}
                  </div>
                  <CardDescription>{license.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    {/* Key Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-muted-foreground" />
                        <span>${license.fees.application}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-muted-foreground" />
                        <span>{license.timeline}</span>
                      </div>
                    </div>

                    {/* Training Modules */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Training Modules</h4>
                      <div className="space-y-1">
                        {license.trainingModules.slice(0, 2).map((module) => (
                          <div key={module.id} className="flex items-center gap-2 text-xs">
                            <BookOpen size={14} className="text-muted-foreground" />
                            <span>{module.title}</span>
                            <span className="text-muted-foreground">({module.duration})</span>
                          </div>
                        ))}
                        {license.trainingModules.length > 2 && (
                          <div className="text-xs text-muted-foreground">
                            +{license.trainingModules.length - 2} more modules
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedLicense(license)}
                      >
                        View Details
                      </Button>
                      {status === 'not-started' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const newApplication: BusinessLicenseApplication = {
                              id: Date.now().toString(),
                              licenseId: license.id,
                              licenseName: license.name,
                              status: 'researching',
                              startedAt: new Date().toISOString(),
                              documentsCompleted: [],
                              trainingCompleted: []
                            };
                            const updatedApplications = [...applications, newApplication];
                            setApplications(updatedApplications);
                            localStorage.setItem('business_license_applications', JSON.stringify(updatedApplications));
                          }}
                        >
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Training Resources */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Training Resources</h2>
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="checklists">Checklists</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingResources.videos.map((video) => (
                  <Card key={video.id} className="cursor-pointer hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Play className="text-primary" size={20} />
                        <div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">{video.duration}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{video.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="checklists" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingResources.checklists.map((checklist) => (
                  <Card key={checklist.id} className="cursor-pointer hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="text-primary" size={20} />
                        <h3 className="font-semibold">{checklist.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{checklist.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trainingResources.templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Download className="text-primary" size={20} />
                        <h3 className="font-semibold">{template.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* License Detail Modal */}
      {selectedLicense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedLicense.name}</h2>
                  <p className="text-muted-foreground">{selectedLicense.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLicense(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requirements */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Requirements</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedLicense.requirements).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <CheckCircle className="text-green-500" size={16} />
                        <div>
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                          <span className="text-muted-foreground ml-2">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fees & Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fees & Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Application Fee:</span>
                      <span className="font-semibold">${selectedLicense.fees.application}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Fee:</span>
                      <span className="font-semibold">${selectedLicense.fees.annual}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inspection Fee:</span>
                      <span className="font-semibold">${selectedLicense.fees.inspection}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeline:</span>
                      <span className="font-semibold">{selectedLicense.timeline}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <MapPin className="text-muted-foreground" size={16} />
                      <span>{selectedLicense.contact.address}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="text-muted-foreground" size={16} />
                      <span>{selectedLicense.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="text-muted-foreground" size={16} />
                      <a href={selectedLicense.contact.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Visit Website
                      </a>
                    </div>
                  </div>
                </div>

                {/* Training Modules */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Training Modules</h3>
                  <div className="space-y-3">
                    {selectedLicense.trainingModules.map((module) => (
                      <div key={module.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{module.title}</h4>
                          <Badge variant="secondary">{module.duration}</Badge>
                        </div>
                        <div className="space-y-1">
                          {module.topics.map((topic, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t">
                <Button className="flex-1">
                  Start Application
                </Button>
                <Button variant="outline" className="flex-1">
                  Download Checklist
                </Button>
                <Button variant="outline">
                  Contact Department
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}