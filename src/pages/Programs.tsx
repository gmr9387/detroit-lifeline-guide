import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/layout/AppLayout';
import detroitAPI from '@/services/api';
import storageService from '@/services/storage';
import { useI18n } from '@/services/i18n';
import { Program, ResourceCategory } from '@/types';
import { 
  Search, 
  Filter, 
  Phone, 
  Clock, 
  MapPin, 
  ExternalLink,
  ArrowRight,
  Heart
} from 'lucide-react';


export default function Programs() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const { t } = useI18n();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [showFilters, setShowFilters] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [categories, setCategories] = useState<ResourceCategory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data using new API services
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        const [programsResponse, categoriesResponse, userFavorites] = await Promise.all([
          detroitAPI.getPrograms({ category: selectedCategory }),
          detroitAPI.getCategories(),
          storageService.getFavorites()
        ]);

        if (programsResponse.success) {
          setPrograms(programsResponse.data);
        }
        
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }
        
        setFavorites(userFavorites);
      } catch (err) {
        setError(t('error.serverError'));
        console.error('Failed to load programs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [selectedCategory, t]);

  const filteredPrograms = useMemo(() => {
    let filtered = programs;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(program => program.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(program =>
        program.name.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query) ||
        program.benefits.some(benefit => benefit.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [programs, selectedCategory, searchQuery]);

  const toggleFavorite = async (programId: string) => {
    try {
      if (favorites.includes(programId)) {
        await storageService.removeFromFavorites(programId);
        setFavorites(prev => prev.filter(id => id !== programId));
      } else {
        await storageService.addToFavorites(programId);
        setFavorites(prev => [...prev, programId]);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
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

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs, benefits, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2 items-center">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {selectedCategory && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtered by:</span>
                <Badge variant="secondary">
                  {getCategoryName(selectedCategory)}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categories Quick Filter */}
        {!selectedCategory && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {/* Programs List */}
        <div className="space-y-4">
          {filteredPrograms.length === 0 ? (
            <Card className="text-center p-8">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  No programs found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
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