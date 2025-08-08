import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Users, 
  Baby, 
  DollarSign,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { HybridStorage } from '@/utils/hybridStorage';
import { LoadingPage } from '@/components/ui/loading';

interface UserData {
  householdSize: number;
  hasChildren: boolean;
  income: string;
  zipCode: string;
  primaryNeeds: string[];
  language: string;
}

export default function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign in form
  const [signInData, setSignInData] = useState({
    email: '',
    password: ''
  });

  // Sign up form
  const [signUpData, setSignUpData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    userData: {
      householdSize: 1,
      hasChildren: false,
      income: '',
      zipCode: '',
      primaryNeeds: [],
      language: 'English'
    }
  });

  // Reset password form
  const [resetEmail, setResetEmail] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await HybridStorage.signIn(signInData.email, signInData.password);
      
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        setSuccess('Successfully signed in!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      }
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await HybridStorage.signUp(signUpData.email, signUpData.password, signUpData.userData);
      
      if (error) {
        setError(error.message);
      } else if (data?.user) {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setTimeout(() => {
          setActiveTab('signin');
        }, 2000);
      }
    } catch (error) {
      setError('An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await HybridStorage.auth.resetPassword(resetEmail);
      
      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Please check your inbox.');
        setResetEmail('');
      }
    } catch (error) {
      setError('An error occurred while sending reset email');
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = (field: keyof UserData, value: any) => {
    setSignUpData(prev => ({
      ...prev,
      userData: {
        ...prev.userData,
        [field]: value
      }
    }));
  };

  const updatePrimaryNeeds = (need: string) => {
    const currentNeeds = signUpData.userData.primaryNeeds;
    const updatedNeeds = currentNeeds.includes(need)
      ? currentNeeds.filter(n => n !== need)
      : [...currentNeeds, need];
    
    updateUserData('primaryNeeds', updatedNeeds);
  };

  if (loading) {
    return <LoadingPage message="Processing..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Detroit Resource Navigator</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
              <TabsTrigger value="reset">Reset</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signInData.email}
                      onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* User Profile Setup */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-semibold">Profile Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="household-size">Household Size</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        id="household-size"
                        type="number"
                        min="1"
                        max="10"
                        value={signUpData.userData.householdSize}
                        onChange={(e) => updateUserData('householdSize', parseInt(e.target.value))}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip-code">Zip Code</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input
                        id="zip-code"
                        type="text"
                        placeholder="Enter your zip code"
                        value={signUpData.userData.zipCode}
                        onChange={(e) => updateUserData('zipCode', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income">Annual Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <select
                        id="income"
                        value={signUpData.userData.income}
                        onChange={(e) => updateUserData('income', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="">Select income range</option>
                        <option value="under-25000">Under $25,000</option>
                        <option value="25000-50000">$25,000 - $50,000</option>
                        <option value="50000-75000">$50,000 - $75,000</option>
                        <option value="75000-100000">$75,000 - $100,000</option>
                        <option value="over-100000">Over $100,000</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Primary Needs</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {['housing', 'food', 'employment', 'healthcare', 'utilities', 'childcare'].map((need) => (
                        <button
                          key={need}
                          type="button"
                          onClick={() => updatePrimaryNeeds(need)}
                          className={`p-2 text-sm rounded border transition-colors ${
                            signUpData.userData.primaryNeeds.includes(need)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                        >
                          {need.charAt(0).toUpperCase() + need.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <select
                        id="language"
                        value={signUpData.userData.language}
                        onChange={(e) => updateUserData('language', e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Arabic">Arabic</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>

            {/* Reset Password Tab */}
            <TabsContent value="reset" className="mt-6">
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Error Alert */}
          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert className="mt-4" variant="default">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}