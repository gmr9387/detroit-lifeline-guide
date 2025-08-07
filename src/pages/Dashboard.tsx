import { useEffect, useState, useMemo, useCallback, memo } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';

// Memoized components for better performance
const RecommendationCard = memo(({ program }: { program: Program }) => (
  <Card key={program.id} className="cursor-pointer hover:shadow-md transition-shadow">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <CardTitle className="text-lg font-semibold">{program.name}</CardTitle>
        <Badge variant="secondary" className="ml-2">
          {program.category}
        </Badge>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {program.description}
      </p>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>Detroit</span>
        </div>
        {program.phone && (
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span className="truncate">{program.phone}</span>
          </div>
        )}
      </div>
      <Link to={`/program/${program.id}`}>
        <Button size="sm" className="w-full">
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </CardContent>
  </Card>
));

const ApplicationCard = memo(({ application }: { application: Application }) => (
  <Card key={application.id}>
    <CardContent className="pt-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{application.programName}</h3>
        <div className="flex items-center gap-2">
          {application.status === 'approved' && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          {application.status === 'pending' && (
            <Clock className="h-4 w-4 text-yellow-500" />
          )}
          {application.status === 'denied' && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
          <Badge 
            variant={application.status === 'approved' ? 'default' : 'secondary'}
            className={
              application.status === 'approved' 
                ? 'bg-green-100 text-green-800' 
                : application.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }
          >
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </Badge>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        Applied on {new Date(application.appliedDate).toLocaleDateString()}
      </p>
      {application.nextSteps && (
        <p className="text-sm text-blue-600 font-medium">
          Next: {application.nextSteps}
        </p>
      )}
    </CardContent>
  </Card>
));

const Dashboard = memo(() => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendations, setRecommendations] = useState<Program[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // Memoize expensive calculations
  const allPrograms = useMemo(() => detroitResources.programs as Program[], []);
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const personalizedRecommendations = useMemo(() => {
    if (!profile) return [];
    return allPrograms.filter(program => 
      profile.primaryNeeds.includes(program.category)
    ).slice(0, 4);
  }, [allPrograms, profile]);

  const recentApplications = useMemo(() => {
    return applications
      .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
      .slice(0, 3);
  }, [applications]);

  const loadUserData = useCallback(() => {
    const userProfile = storageUtils.getUserProfile();
    if (!userProfile) {
      navigate('/onboarding');
      return;
    }

    setProfile(userProfile);
    setApplications(storageUtils.getApplications());
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    if (personalizedRecommendations.length > 0) {
      setRecommendations(personalizedRecommendations);
    }
  }, [personalizedRecommendations]);

  if (!profile) {
    return null; // or a loading skeleton
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {greeting}, {profile.firstName}!
            </h1>
            <p className="text-gray-600">
              Welcome back to your Detroit Resource Navigator dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Star className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recommended Programs</p>
                    <p className="text-2xl font-bold text-gray-900">{recommendations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Bell className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {applications.filter(app => app.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recommended Programs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recommended for You
                </h2>
                <Link to="/programs">
                  <Button variant="outline" size="sm">
                    View All <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {recommendations.length > 0 ? (
                <div className="space-y-4">
                  {recommendations.map((program) => (
                    <RecommendationCard key={program.id} program={program} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No recommendations yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Update your profile to get personalized program recommendations.
                    </p>
                    <Link to="/programs">
                      <Button>Browse All Programs</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Applications */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Applications
                </h2>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </div>

              {recentApplications.length > 0 ? (
                <div className="space-y-4">
                  {recentApplications.map((application) => (
                    <ApplicationCard key={application.id} application={application} />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No applications yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Start by exploring programs that match your needs.
                    </p>
                    <Link to="/programs">
                      <Button>Find Programs</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/programs">
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-4">
                        <Star className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Explore Programs</h3>
                      <p className="text-sm text-gray-600">
                        Browse all available assistance programs in Detroit
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-4">
                      <Bell className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Get Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Set up alerts for new programs and application updates
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-4">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Get Help</h3>
                    <p className="text-sm text-gray-600">
                      Contact support for assistance with applications
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;