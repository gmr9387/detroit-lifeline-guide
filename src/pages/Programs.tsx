import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProgramListSkeleton } from '@/components/ui/loading';
import AdvancedSearch, { SearchFilters } from '@/components/AdvancedSearch';
import detroitResources from '@/data/detroitResources.json';
import { Program, ResourceCategory } from '@/types';
import {
  Phone,
  Clock,
  MapPin,
  ExternalLink,
  ArrowRight,
  Heart
} from 'lucide-react';
import { storageUtils } from '@/utils/localStorage';

export default function Programs() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const favorites = storageUtils.getFavorites();
  const categories = detroitResources.categories as ResourceCategory[];
  const programs = detroitResources.programs as Program[];

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize filtered programs with category filter if provided
  useEffect(() => {
    if (initialCategory) {
      const filtered = programs.filter(program => program.category === initialCategory);
      setFilteredPrograms(filtered);
    } else {
      setFilteredPrograms(programs);
    }
  }, [programs, initialCategory]);

  const toggleFavorite = (programId: string) => {
    if (favorites.includes(programId)) {
      storageUtils.removeFromFavorites(programId);
    } else {
      storageUtils.addToFavorites(programId);
    }
    // Force re-render by updating search query
    setSearchQuery(prev => prev);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.name || categoryId;
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="bg-primary rounded-xl p-6 text-primary-foreground">
          <h1 className="text-2xl font-bold mb-2">Browse Programs</h1>
          <p className="text-primary-foreground/90">
            {filteredPrograms.length} programs available
          </p>
        </div>

        {/* Advanced Search */}
        <AdvancedSearch
          programs={programs}
          categories={categories}
          onResultsChange={setFilteredPrograms}
        />

        {/* Programs List */}
        <div className="space-y-4">
          {isLoading ? (
            <ProgramListSkeleton count={6} />
          ) : filteredPrograms.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  No programs found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilteredPrograms(programs);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPrograms.map((program) => (
              <Card key={program.id} className="transition-smooth hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{program.name}</CardTitle>
                        <button
                          onClick={() => toggleFavorite(program.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Heart 
                            className={cn(
                              "h-4 w-4",
                              favorites.includes(program.id) && "fill-current text-destructive"
                            )} 
                          />
                        </button>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {program.description}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {getCategoryName(program.category)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Benefits Preview */}
                  <div className="mb-4">
                    <div className="text-sm font-medium mb-1">Key Benefits:</div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {program.benefits.slice(0, 2).map((benefit, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-success mt-1">•</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                      {program.benefits.length > 2 && (
                        <li className="text-xs text-muted-foreground">
                          +{program.benefits.length - 2} more benefits
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{program.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{program.contact.hours}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{program.contact.address}</span>
                    </div>
                  </div>

                  {/* Language Support */}
                  <div className="flex items-center gap-1 mb-4">
                    <span className="text-xs text-muted-foreground">Languages:</span>
                    {program.languages.map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/program/${program.id}`} className="flex-1">
                      <Button size="sm" className="w-full">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
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
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}

function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}