import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { storageUtils } from '@/utils/localStorage';
import { 
  MapPin, 
  Users, 
  Shield, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Heart,
  Star
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const profile = storageUtils.getUserProfile();
    if (profile) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const features = [
    {
      icon: MapPin,
      title: 'Local Resources',
      description: 'Find Detroit-specific programs and services near you'
    },
    {
      icon: Users,
      title: 'Personalized',
      description: 'Get recommendations based on your family\'s needs'
    },
    {
      icon: Shield,
      title: 'Trusted',
      description: 'All programs verified and up-to-date'
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'One place for all your applications and deadlines'
    }
  ];

  const stats = [
    { number: '100+', label: 'Programs Available' },
    { number: '8', label: 'Categories Covered' },
    { number: '3', label: 'Languages Supported' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
              Detroit Resource
              <br />
              <span className="text-secondary">Navigator</span>
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Find government services, social programs, and community resources 
              all in one place. Get personalized help for your family's needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/onboarding')}
                className="px-8 py-3 text-lg shadow-glow"
              >
                Get Started - 5 Minutes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-primary-foreground/70">
                Free • Confidential • No registration required
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-secondary mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-primary-foreground/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-background">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How We Help Detroit Families
            </h2>
            <p className="text-muted-foreground text-lg">
              Connecting you with the resources you need, when you need them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-6 rounded-xl bg-card shadow-sm border">
                <div className="p-3 rounded-lg bg-primary-light">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Categories Preview */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-6">Available Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: '🏠', label: 'Housing' },
                { icon: '💼', label: 'Employment' },
                { icon: '🍎', label: 'Food' },
                { icon: '❤️', label: 'Healthcare' },
                { icon: '👶', label: 'Child Care' },
                { icon: '⚡', label: 'Utilities' },
                { icon: '💰', label: 'Financial' },
                { icon: '🚀', label: 'Business' },
              ].map((category, index) => (
                <div key={index} className="p-4 text-center bg-card rounded-lg border shadow-sm">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-subtle rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Find Help?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Answer a few quick questions and get personalized recommendations 
              for programs that can help your family.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="px-8"
            >
              Start Your Search
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
