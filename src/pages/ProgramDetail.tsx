import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProgressTracker } from '@/components/ProgressTracker';
import detroitResources from '@/data/detroitResources.json';
import { Program, Application } from '@/types';
import { storageUtils } from '@/utils/localStorage';
import { 
  ArrowLeft, 
  Phone, 
  Clock, 
  MapPin, 
  ExternalLink,
  Heart,
  CheckCircle,
  FileText,
  DollarSign,
  Users,
  Calendar,
  Globe,
  Share,
  Bookmark
} from 'lucide-react';

export default function ProgramDetail() {
  const { programId } = useParams<{ programId: string }>();
  const navigate = useNavigate();
  const [program, setProgram] = useState<Program | null>(null);
  const [checkedDocuments, setCheckedDocuments] = useState<string[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (!programId) {
      navigate('/programs');
      return;
    }

    const allPrograms = detroitResources.programs as Program[];
    const foundProgram = allPrograms.find(p => p.id === programId);
    
    if (!foundProgram) {
      navigate('/programs');
      return;
    }

    setProgram(foundProgram);
    
    const favorites = storageUtils.getFavorites();
    setIsFavorited(favorites.includes(programId));
  }, [programId, navigate]);

  const toggleFavorite = () => {
    if (!program) return;
    
    if (isFavorited) {
      storageUtils.removeFromFavorites(program.id);
    } else {
      storageUtils.addToFavorites(program.id);
    }
    setIsFavorited(!isFavorited);
  };

  const toggleDocument = (document: string) => {
    setCheckedDocuments(prev =>
      prev.includes(document)
        ? prev.filter(doc => doc !== document)
        : [...prev, document]
    );
  };

  const handleSaveApplication = () => {
    if (!program) return;

    const application: Application = {
      id: crypto.randomUUID(),
      programId: program.id,
      programName: program.name,
      status: 'saved',
      appliedAt: new Date().toISOString(),
      documentsChecked: checkedDocuments,
      notes: 'Application saved for later completion'
    };

    storageUtils.saveApplication(application);
    
    // Show success message and navigate
    navigate('/dashboard');
  };

  const getCategoryName = (categoryId: string) => {
    const categories = detroitResources.categories;
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  if (!program) {
    return (
      <AppLayout>
        <div className="p-4 text-center">
          <p>Loading program details...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          
          <div className="flex gap-2 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFavorite}
            >
              <Heart 
                className={cn(
                  "h-4 w-4",
                  isFavorited && "fill-current text-destructive"
                )} 
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: program.name,
                    text: program.description,
                    url: window.location.href
                  });
                }
              }}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Program Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{program.name}</CardTitle>
                <CardDescription className="text-base">
                  {program.description}
                </CardDescription>
              </div>
              <Badge variant="secondary" className="ml-4">
                {getCategoryName(program.category)}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{program.contact.phone}</div>
                  <div className="text-sm text-muted-foreground">Phone</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{program.contact.hours}</div>
                  <div className="text-sm text-muted-foreground">Hours</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <div className="font-medium">{program.contact.address}</div>
                  <div className="text-sm text-muted-foreground">Address</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <div>
                  <a 
                    href={program.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                  <div className="text-sm text-muted-foreground">Website</div>
                </div>
              </div>
            </div>

            {/* Language Support */}
            <div>
              <div className="font-medium mb-2">Languages Available:</div>
              <div className="flex flex-wrap gap-2">
                {program.languages.map((lang, index) => (
                  <Badge key={index} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Program Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {program.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Eligibility Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(program.eligibility).map(([key, value]) => (
                <div key={key} className="flex items-center gap-3">
                  {key === 'income' && <DollarSign className="h-4 w-4 text-muted-foreground" />}
                  {key === 'age' && <Calendar className="h-4 w-4 text-muted-foreground" />}
                  {key === 'residency' && <MapPin className="h-4 w-4 text-muted-foreground" />}
                  {!['income', 'age', 'residency'].includes(key) && <CheckCircle className="h-4 w-4 text-muted-foreground" />}
                  <div>
                    <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div className="text-sm text-muted-foreground">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Required Documents
            </CardTitle>
            <CardDescription>
              Check off documents as you gather them
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {program.documents.map((document, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`doc-${index}`}
                    checked={checkedDocuments.includes(document)}
                    onCheckedChange={() => toggleDocument(document)}
                  />
                  <label
                    htmlFor={`doc-${index}`}
                    className={cn(
                      "flex-1 cursor-pointer",
                      checkedDocuments.includes(document) && "line-through text-muted-foreground"
                    )}
                  >
                    {document}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">
                Documents Ready: {checkedDocuments.length}/{program.documents.length}
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${(checkedDocuments.length / program.documents.length) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Progress Tracking */}
        {(() => {
          const existingApplication = storageUtils.getApplications().find(app => app.programId === program.id);
          return existingApplication ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Application Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressTracker 
                  applicationId={existingApplication.id} 
                  application={existingApplication}
                  showDetails={true}
                />
              </CardContent>
            </Card>
          ) : null;
        })()}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            size="lg" 
            className="w-full"
            onClick={() => window.open(program.applicationUrl, '_blank')}
          >
            Apply Now
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full"
            onClick={handleSaveApplication}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Save Application Progress
          </Button>
        </div>

        {/* Important Notice */}
        <Card className="border-primary bg-primary-light/10">
          <CardContent className="p-4">
            <div className="text-sm">
              <strong>Important:</strong> This will take you to the official application website. 
              Make sure you have all required documents ready before starting your application.
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