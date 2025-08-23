import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { storageUtils } from '@/utils/localStorage';
import { Program, ResourceCategory } from '@/types';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  MapPin, 
  DollarSign, 
  Users, 
  Heart,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useDebounce } from '@/hooks/usePerformance';

interface AdvancedSearchProps {
  programs: Program[];
  categories: ResourceCategory[];
  onResultsChange: (filteredPrograms: Program[]) => void;
  onSaveSearch?: (searchName: string, filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  category: string;
  location: string;
  incomeRange: [number, number];
  householdSize: number;
  hasChildren: boolean;
  languages: string[];
  sortBy: 'name' | 'relevance' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

const incomeRanges = [
  { label: 'Any Income', value: [0, 200000] },
  { label: 'Under $15,000', value: [0, 15000] },
  { label: '$15,000 - $30,000', value: [15000, 30000] },
  { label: '$30,000 - $45,000', value: [30000, 45000] },
  { label: '$45,000 - $60,000', value: [45000, 60000] },
  { label: 'Over $60,000', value: [60000, 200000] },
];

const languages = [
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'arabic', label: 'Arabic' },
  { value: 'french', label: 'French' },
  { value: 'chinese', label: 'Chinese' },
];

export default function AdvancedSearch({ 
  programs, 
  categories, 
  onResultsChange,
  onSaveSearch 
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    incomeRange: [0, 200000],
    householdSize: 1,
    hasChildren: false,
    languages: [],
    sortBy: 'relevance',
    sortOrder: 'desc',
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{ name: string; filters: SearchFilters }>>([]);
  const [searchName, setSearchName] = useState('');

  const debouncedQuery = useDebounce(filters.query, 300);

  // Load saved searches
  useEffect(() => {
    const saved = localStorage.getItem('saved-searches');
    if (saved) {
      try {
        setSavedSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load saved searches:', error);
      }
    }
  }, []);

  // Filter and sort programs
  const filteredPrograms = useMemo(() => {
    let filtered = programs;

    // Text search
    if (debouncedQuery) {
      const query = debouncedQuery.toLowerCase();
      filtered = filtered.filter(program =>
        program.name.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query) ||
        program.benefits.some(benefit => benefit.toLowerCase().includes(query)) ||
        program.eligibility.income?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(program => program.category === filters.category);
    }

    // Location filter (ZIP code)
    if (filters.location) {
      filtered = filtered.filter(program => {
        // In a real app, you'd have location data for programs
        // For now, we'll just check if the program has location info
        return program.contact?.address || true;
      });
    }

    // Income range filter
    filtered = filtered.filter(program => {
      const programIncome = program.eligibility.income;
      if (!programIncome || programIncome === 'Any') return true;
      
      // Parse income range from program eligibility
      // This is a simplified version - in reality you'd have more structured data
      return true; // For demo purposes
    });

    // Language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter(program => 
        filters.languages.some(lang => 
          program.languages?.includes(lang)
        )
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'popularity':
          // In a real app, you'd have popularity metrics
          comparison = 0;
          break;
        case 'relevance':
        default:
          // Relevance based on query match
          if (debouncedQuery) {
            const aScore = getRelevanceScore(a, debouncedQuery);
            const bScore = getRelevanceScore(b, debouncedQuery);
            comparison = bScore - aScore;
          }
          break;
      }

      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [programs, debouncedQuery, filters]);

  // Update results when filtered programs change
  useEffect(() => {
    onResultsChange(filteredPrograms);
  }, [filteredPrograms, onResultsChange]);

  const getRelevanceScore = (program: Program, query: string) => {
    let score = 0;
    const queryLower = query.toLowerCase();
    
    if (program.name.toLowerCase().includes(queryLower)) score += 10;
    if (program.description.toLowerCase().includes(queryLower)) score += 5;
    if (program.benefits.some(b => b.toLowerCase().includes(queryLower))) score += 3;
    
    return score;
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      incomeRange: [0, 200000],
      householdSize: 1,
      hasChildren: false,
      languages: [],
      sortBy: 'relevance',
      sortOrder: 'desc',
    });
  };

  const saveCurrentSearch = () => {
    if (!searchName.trim()) return;

    const newSavedSearch = { name: searchName, filters: { ...filters } };
    const updatedSearches = [...savedSearches, newSavedSearch];
    
    setSavedSearches(updatedSearches);
    localStorage.setItem('saved-searches', JSON.stringify(updatedSearches));
    setSearchName('');
    
    if (onSaveSearch) {
      onSaveSearch(searchName, filters);
    }
  };

  const loadSavedSearch = (savedFilters: SearchFilters) => {
    setFilters(savedFilters);
  };

  const deleteSavedSearch = (index: number) => {
    const updatedSearches = savedSearches.filter((_, i) => i !== index);
    setSavedSearches(updatedSearches);
    localStorage.setItem('saved-searches', JSON.stringify(updatedSearches));
  };

  const hasActiveFilters = filters.query || filters.category || filters.location || 
    filters.incomeRange[0] > 0 || filters.incomeRange[1] < 200000 || 
    filters.languages.length > 0;

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs, benefits, or keywords..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-48">
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
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  {Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
              </CardTitle>
              <CardDescription>
                Refine your search with specific criteria
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Location */}
                <div>
                  <Label>Location (ZIP Code)</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter ZIP code"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Income Range */}
                <div>
                  <Label>Income Range</Label>
                  <Select 
                    value={filters.incomeRange.join(',')} 
                    onValueChange={(value) => {
                      const [min, max] = value.split(',').map(Number);
                      handleFilterChange('incomeRange', [min, max]);
                    }}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeRanges.map((range) => (
                        <SelectItem key={range.value.join(',')} value={range.value.join(',')}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Household Size */}
                <div>
                  <Label>Household Size</Label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={filters.householdSize}
                    onChange={(e) => handleFilterChange('householdSize', parseInt(e.target.value))}
                    className="mt-1"
                  />
                </div>

                {/* Languages */}
                <div>
                  <Label>Languages</Label>
                  <div className="mt-2 space-y-2">
                    {languages.map((lang) => (
                      <div key={lang.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={lang.value}
                          checked={filters.languages.includes(lang.value)}
                          onCheckedChange={(checked) => {
                            const updated = checked
                              ? [...filters.languages, lang.value]
                              : filters.languages.filter(l => l !== lang.value);
                            handleFilterChange('languages', updated);
                          }}
                        />
                        <Label htmlFor={lang.value} className="text-sm">
                          {lang.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Children */}
                <div>
                  <Label>Household</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="hasChildren"
                      checked={filters.hasChildren}
                      onCheckedChange={(checked) => handleFilterChange('hasChildren', checked)}
                    />
                    <Label htmlFor="hasChildren" className="text-sm">
                      Has children under 18
                    </Label>
                  </div>
                </div>

                {/* Sort Options */}
                <div>
                  <Label>Sort By</Label>
                  <div className="flex gap-2 mt-1">
                    <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="popularity">Popularity</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFilterChange('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {filters.sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {filteredPrograms.length} programs found
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Save search as..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="w-48"
                  />
                  <Button onClick={saveCurrentSearch} disabled={!searchName.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Saved Searches
            </CardTitle>
            <CardDescription>
              Quick access to your frequently used searches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {savedSearches.map((saved, index) => (
                <div key={index} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadSavedSearch(saved.filters)}
                    className="h-auto p-0 text-sm"
                  >
                    {saved.name}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSavedSearch(index)}
                    className="h-auto p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}