import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { storageUtils } from '@/utils/localStorage';
import { UserProfile, Program, Application } from '@/types';
import detroitResources from '@/data/detroitResources.json';
import { 
  Bell, 
  Clock, 
  Star, 
  ArrowRight, 
  MapPin, 
  Phone,
  ExternalLink,
  Calendar,
  CheckCircle,
  AlertCircle,
  ListTodo
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TodoList } from '@/components/TodoList';
import { NotificationCenter } from '@/components/NotificationCenter';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Program[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const userProfile = storageUtils.getUserProfile();
    if (!userProfile) {
      navigate('/onboarding');
      return;
    }

    setProfile(userProfile);
    setApplications(storageUtils.getApplications());
    
    // Generate personalized recommendations
    const allPrograms = detroitResources.programs as Program[];
    const personalizedPrograms = allPrograms.filter(program => 
      userProfile.primaryNeeds.includes(program.category)
    ).slice(0, 4);
    
    setRecommendations(personalizedPrograms);
  }, [navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusBadge = (status: Application['status']) => {
    const variants = {
      saved: { variant: 'secondary' as const, text: 'Saved' },
      started: { variant: 'warning' as const, text: 'In Progress' },
      submitted: { variant: 'default' as const, text: 'Submitted' },
      approved: { variant: 'success' as const, text: 'Approved' },
      denied: { variant: 'destructive' as const, text: 'Denied' },
    };
    
    const config = variants[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  const quickActions = [
    {
      title: 'Apply for SNAP',
      description: 'Food assistance program',
      icon: '🍎',
      url: 'https://newmibridges.michigan.gov/',
      urgent: true
    },
    {
      title: 'Find Housing Help',
      description: 'Emergency rental assistance',
      icon: '🏠',
      url: '/programs?category=housing',
      urgent: false
    },
    {
      title: 'Job Training',
      description: 'Michigan Works! services',
      icon: '💼',
      url: '/programs?category=employment',
      urgent: false
    },
    {
      title: 'Health Insurance',
      description: 'Medicaid enrollment',
      icon: '❤️',
      url: 'https://www.michigan.gov/mibridges',
      urgent: false
    },
  ];

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="bg-gradient-hero rounded-xl p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">
            {getGreeting()}! 👋
          </h1>
          <p className="text-primary-foreground/90 mb-4">
            You have {recommendations.length} programs that might help you.
          </p>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/80">
            <MapPin className="h-4 w-4" />
            <span>Detroit, MI {profile.zipCode}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className={cn(
                  "cursor-pointer transition-smooth hover:shadow-md",
                  action.urgent && "ring-2 ring-secondary"
                )}
                onClick={() => {
                  if (action.url.startsWith('http')) {
                    window.open(action.url, '_blank');
                  } else {
                    navigate(action.url);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                  {action.urgent && (
                    <Badge variant="secondary" className="mt-2 text-xs">Urgent</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* My Applications */}
        {applications.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                My Applications
              </h2>
              <Link to="/applications">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <Card key={app.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{app.programName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" />
              Recommended for You
            </h2>
            <Link to="/programs">
              <Button variant="ghost" size="sm">See All Programs</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recommendations.map((program) => (
              <Card key={program.id} className="transition-smooth hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-1">{program.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">
                        {program.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {detroitResources.categories.find(c => c.id === program.category)?.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{program.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{program.contact.hours}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/program/${program.id}`)}
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(program.applicationUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Recent Notifications
          </h2>
          <NotificationCenter maxNotifications={3} />
        </div>

        {/* Todo List */}
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            My Tasks
          </h2>
          <TodoList maxItems={5} />
        </div>

        {/* Important Notices */}
        <Card className="border-warning bg-warning/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Important Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>• SNAP benefit renewals are due monthly</p>
              <p>• Emergency rental assistance applications close Feb 28</p>
              <p>• Free tax preparation available until April 15</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}