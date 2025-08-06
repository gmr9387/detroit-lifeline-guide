import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { storageUtils } from '@/utils/localStorage';
import { UserProfile } from '@/types';
import { ArrowRight, ArrowLeft, Users, DollarSign, MapPin, Heart, Globe } from 'lucide-react';

const TOTAL_STEPS = 5;

const incomeRanges = [
  { value: 'under-15k', label: 'Under $15,000' },
  { value: '15k-30k', label: '$15,000 - $30,000' },
  { value: '30k-45k', label: '$30,000 - $45,000' },
  { value: '45k-60k', label: '$45,000 - $60,000' },
  { value: 'over-60k', label: 'Over $60,000' },
  { value: 'prefer-not-say', label: 'Prefer not to say' },
];

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

const languages = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Español' },
  { value: 'arabic', label: 'العربية' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    householdSize: 1,
    hasChildren: false,
    income: '',
    zipCode: '',
    primaryNeeds: [] as string[],
    language: 'english',
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      id: crypto.randomUUID(),
      ...formData,
      completedAt: new Date().toISOString(),
    };

    storageUtils.saveUserProfile(profile);
    navigate('/dashboard');
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
      case 1: return formData.householdSize > 0;
      case 2: return formData.income !== '';
      case 3: return formData.zipCode.length >= 5;
      case 4: return formData.primaryNeeds.length > 0;
      case 5: return formData.language !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary-foreground mb-2">
            Detroit Resource Navigator
          </h1>
          <p className="text-primary-foreground/80">
            Find the help you need in just 5 minutes
          </p>
        </div>

        <Progress value={progress} className="mb-6" />

        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && <><Users className="h-5 w-5 text-primary" /> Household Information</>}
              {currentStep === 2 && <><DollarSign className="h-5 w-5 text-primary" /> Income Range</>}
              {currentStep === 3 && <><MapPin className="h-5 w-5 text-primary" /> Location</>}
              {currentStep === 4 && <><Heart className="h-5 w-5 text-primary" /> Your Needs</>}
              {currentStep === 5 && <><Globe className="h-5 w-5 text-primary" /> Language</>}
            </CardTitle>
            <CardDescription>
              Step {currentStep} of {TOTAL_STEPS}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Step 1: Household */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="householdSize">How many people live in your household?</Label>
                  <Input
                    id="householdSize"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.householdSize}
                    onChange={(e) => updateFormData('householdSize', parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasChildren"
                    checked={formData.hasChildren}
                    onCheckedChange={(checked) => updateFormData('hasChildren', checked)}
                  />
                  <Label htmlFor="hasChildren">I have children under 18</Label>
                </div>
              </div>
            )}

            {/* Step 2: Income */}
            {currentStep === 2 && (
              <div>
                <Label>What is your household's yearly income? (This helps us find programs you qualify for)</Label>
                <RadioGroup
                  value={formData.income}
                  onValueChange={(value) => updateFormData('income', value)}
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
            )}

            {/* Step 3: Location */}
            {currentStep === 3 && (
              <div>
                <Label htmlFor="zipCode">What's your ZIP code?</Label>
                <Input
                  id="zipCode"
                  type="text"
                  placeholder="48201"
                  maxLength={5}
                  value={formData.zipCode}
                  onChange={(e) => updateFormData('zipCode', e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  This helps us show you programs available in your area.
                </p>
              </div>
            )}

            {/* Step 4: Needs */}
            {currentStep === 4 && (
              <div>
                <Label>What type of help are you looking for? (Select all that apply)</Label>
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
              </div>
            )}

            {/* Step 5: Language */}
            {currentStep === 5 && (
              <div>
                <Label>Preferred language for services:</Label>
                <RadioGroup
                  value={formData.language}
                  onValueChange={(value) => updateFormData('language', value)}
                  className="mt-3"
                >
                  {languages.map((lang) => (
                    <div key={lang.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={lang.value} id={lang.value} />
                      <Label htmlFor={lang.value}>{lang.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex items-center gap-2"
          >
            {currentStep === TOTAL_STEPS ? 'Complete' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}