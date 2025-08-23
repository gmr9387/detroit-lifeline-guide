import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/contexts/AuthContext';
import { useFormValidation } from '@/hooks/useFormValidation';
import { userProfileSchema } from '@/hooks/useFormValidation';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowLeft, ArrowRight, ArrowLeft as ArrowLeftIcon } from 'lucide-react';

const registerSchema = userProfileSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const TOTAL_STEPS = 3;

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState<RegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    householdSize: 1,
    hasChildren: false,
    income: '',
    zipCode: '',
    primaryNeeds: [],
    language: 'english',
    agreeToTerms: false,
  });

  const { validate, validateField, getFieldError, hasErrors } = useFormValidation(registerSchema);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validation = validate(formData);
    if (!validation.isValid) {
      return;
    }

    const { password, confirmPassword, agreeToTerms, ...userData } = formData;
    const result = await register(userData, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleInputChange = (field: keyof RegisterForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const toggleNeed = (needId: string) => {
    setFormData(prev => ({
      ...prev,
      primaryNeeds: prev.primaryNeeds.includes(needId)
        ? prev.primaryNeeds.filter(id => id !== needId)
        : [...prev.primaryNeeds, needId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.firstName && formData.lastName && formData.email && formData.password && formData.confirmPassword;
      case 2: return formData.householdSize > 0 && formData.zipCode;
      case 3: return formData.primaryNeeds.length > 0 && formData.agreeToTerms;
      default: return false;
    }
  };

  const needsOptions = [
    { id: 'housing', label: 'Housing & Rent Help', icon: '🏠' },
    { id: 'employment', label: 'Jobs & Training', icon: '💼' },
    { id: 'food', label: 'Food & Nutrition', icon: '🍎' },
    { id: 'healthcare', label: 'Healthcare', icon: '❤️' },
    { id: 'childcare', label: 'Child Care', icon: '👶' },
    { id: 'utilities', label: 'Utility Bills', icon: '⚡' },
    { id: 'financial', label: 'Financial Help', icon: '💰' },
    { id: 'business', label: 'Start a Business', icon: '🚀' },
  ];

  const incomeRanges = [
    { value: 'under-15k', label: 'Under $15,000' },
    { value: '15k-30k', label: '$15,000 - $30,000' },
    { value: '30k-45k', label: '$30,000 - $45,000' },
    { value: '45k-60k', label: '$45,000 - $60,000' },
    { value: 'over-60k', label: 'Over $60,000' },
    { value: 'prefer-not-say', label: 'Prefer not to say' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back to Home */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>
              Join Detroit Resource Navigator to access personalized assistance
            </CardDescription>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2 mt-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep} of {TOTAL_STEPS}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className={cn("pl-10", getFieldError('firstName') && "border-destructive")}
                          disabled={isLoading}
                        />
                      </div>
                      {getFieldError('firstName') && (
                        <p className="text-sm text-destructive">{getFieldError('firstName')}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className={cn("pl-10", getFieldError('lastName') && "border-destructive")}
                          disabled={isLoading}
                        />
                      </div>
                      {getFieldError('lastName') && (
                        <p className="text-sm text-destructive">{getFieldError('lastName')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={cn("pl-10", getFieldError('email') && "border-destructive")}
                        disabled={isLoading}
                      />
                    </div>
                    {getFieldError('email') && (
                      <p className="text-sm text-destructive">{getFieldError('email')}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={cn("pl-10 pr-10", getFieldError('password') && "border-destructive")}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {getFieldError('password') && (
                      <p className="text-sm text-destructive">{getFieldError('password')}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={cn("pl-10 pr-10", getFieldError('confirmPassword') && "border-destructive")}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {getFieldError('confirmPassword') && (
                      <p className="text-sm text-destructive">{getFieldError('confirmPassword')}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Household Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="householdSize">How many people live in your household? *</Label>
                    <Input
                      id="householdSize"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.householdSize}
                      onChange={(e) => handleInputChange('householdSize', parseInt(e.target.value))}
                      className={cn("mt-2", getFieldError('householdSize') && "border-destructive")}
                      disabled={isLoading}
                    />
                    {getFieldError('householdSize') && (
                      <p className="text-sm text-destructive">{getFieldError('householdSize')}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="zipCode"
                        type="text"
                        placeholder="48201"
                        maxLength={5}
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className={cn("pl-10", getFieldError('zipCode') && "border-destructive")}
                        disabled={isLoading}
                      />
                    </div>
                    {getFieldError('zipCode') && (
                      <p className="text-sm text-destructive">{getFieldError('zipCode')}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      This helps us show you programs available in your area.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasChildren"
                      checked={formData.hasChildren}
                      onCheckedChange={(checked) => handleInputChange('hasChildren', checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="hasChildren">I have children under 18</Label>
                  </div>

                  <div>
                    <Label>What is your household's yearly income?</Label>
                    <RadioGroup
                      value={formData.income}
                      onValueChange={(value) => handleInputChange('income', value)}
                      className="mt-3"
                    >
                      {incomeRanges.map((range) => (
                        <div key={range.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={range.value} id={range.value} />
                          <Label htmlFor={range.value}>{range.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              )}

              {/* Step 3: Needs & Terms */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label>What type of help are you looking for? (Select all that apply) *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {needsOptions.map((need) => (
                        <div
                          key={need.id}
                          onClick={() => toggleNeed(need.id)}
                          className={cn(
                            "p-3 border rounded-lg cursor-pointer transition-smooth text-center",
                            formData.primaryNeeds.includes(need.id)
                              ? "border-primary bg-primary-light text-primary"
                              : "border-border hover:border-primary/50"
                          )}
                        >
                          <div className="text-2xl mb-1">{need.icon}</div>
                          <div className="text-sm font-medium">{need.label}</div>
                        </div>
                      ))}
                    </div>
                    {getFieldError('primaryNeeds') && (
                      <p className="text-sm text-destructive mt-2">{getFieldError('primaryNeeds')}</p>
                    )}
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                      disabled={isLoading}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                      *
                    </Label>
                  </div>
                  {getFieldError('agreeToTerms') && (
                    <p className="text-sm text-destructive">{getFieldError('agreeToTerms')}</p>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                {currentStep < TOTAL_STEPS ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!canProceed() || isLoading}
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!canProceed() || isLoading || hasErrors}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                )}
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}