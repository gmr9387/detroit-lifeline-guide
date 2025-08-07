import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MapPin, 
  Clock, 
  Phone, 
  Globe, 
  Star,
  Users,
  Heart,
  Leaf,
  ShoppingBag,
  Music,
  Car,
  Home,
  DollarSign,
  Calendar,
  ArrowRight,
  ExternalLink,
  Filter,
  Map
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PaginationManager, SearchManager } from '@/utils/scalability';
import localBusinessesData from '@/data/localBusinesses.json';
import { 
  FarmersMarket, 
  LocalBusiness, 
  Area 
} from '@/types';

export default function CommunityHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('businesses');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);

  const { farmersMarkets, localBusinesses, areas } = localBusinessesData;

  // Filter and search businesses
  const filteredBusinesses = SearchManager.search(
    localBusinesses,
    searchQuery,
    ['name', 'description', 'category'],
    {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      area: selectedArea !== 'all' ? selectedArea : undefined
    }
  );

  // Paginate results
  const paginatedBusinesses = PaginationManager.paginate(
    filteredBusinesses,
    currentPage,
    pageSize
  );

  // Filter markets
  const filteredMarkets = SearchManager.search(
    farmersMarkets,
    searchQuery,
    ['name', 'description'],
    {
      area: selectedArea !== 'all' ? selectedArea : undefined
    }
  );

  const getBusinessCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'food-service': '🍽️',
      'automotive': '🚗',
      'entertainment': '🎨',
      'technology': '💻',
      'environmental': '🌱',
      'beauty': '✂️',
      'agriculture': '🌾',
      'alcohol': '🍺'
    };
    return icons[category] || '🏢';
  };

  const getMarketStatus = (market: FarmersMarket) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
    const isOpen = market.hours[today as keyof typeof market.hours];
    return isOpen ? 'Open Today' : 'Closed Today';
  };

  const getAreaStats = (area: Area) => {
    const businessesInArea = localBusinesses.filter(business => 
      business.location.coordinates.lat === area.id
    ).length;
    
    return {
      businesses: businessesInArea,
      population: area.demographics.population,
      avgIncome: area.demographics.averageIncome
    };
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Detroit Community Hub
          </h1>
          <p className="text-muted-foreground">
            Discover local businesses, farmers markets, and community highlights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search businesses, markets, or areas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedCategory('all')}
              className={selectedCategory === 'all' ? 'bg-primary text-primary-foreground' : ''}
            >
              All Categories
            </Button>
            {Array.from(new Set(localBusinesses.map(b => b.category))).map((category) => (
              <Button
                key={category}
                variant="outline"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-primary text-primary-foreground' : ''}
              >
                {getBusinessCategoryIcon(category)} {category.replace('-', ' ')}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setSelectedArea('all')}
              className={selectedArea === 'all' ? 'bg-primary text-primary-foreground' : ''}
            >
              All Areas
            </Button>
            {areas.map((area) => (
              <Button
                key={area.id}
                variant="outline"
                onClick={() => setSelectedArea(area.id)}
                className={selectedArea === area.id ? 'bg-primary text-primary-foreground' : ''}
              >
                <MapPin size={16} className="mr-1" />
                {area.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="businesses">Local Businesses</TabsTrigger>
            <TabsTrigger value="markets">Farmers Markets</TabsTrigger>
            <TabsTrigger value="areas">Areas & Neighborhoods</TabsTrigger>
          </TabsList>

          {/* Local Businesses Tab */}
          <TabsContent value="businesses" className="mt-6">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Local Businesses ({filteredBusinesses.length})
              </h2>
              <Button
                variant="outline"
                onClick={() => navigate('/business-licenses')}
              >
                Start Your Business
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedBusinesses.items.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{business.name}</CardTitle>
                        <CardDescription>{business.description}</CardDescription>
                      </div>
                      <div className="text-2xl">{getBusinessCategoryIcon(business.category)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Services</h4>
                      <div className="flex flex-wrap gap-1">
                        {business.services.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {business.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{business.services.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Owner Story */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Owner Story</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {business.owner.story}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Highlights</h4>
                      <div className="flex flex-wrap gap-1">
                        {business.highlights.slice(0, 2).map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Contact & Hours */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">{business.location.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {business.hours.monday ? 'Mon-Sat' : 'Varies'}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Phone size={14} className="mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <Globe size={14} className="mr-1" />
                        Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {paginatedBusinesses.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm">
                    Page {currentPage} of {paginatedBusinesses.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={currentPage === paginatedBusinesses.totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Farmers Markets Tab */}
          <TabsContent value="markets" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Farmers Markets ({filteredMarkets.length})
              </h2>
              <p className="text-muted-foreground">
                Support local farmers and artisans at Detroit's vibrant markets
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMarkets.map((market) => (
                <Card key={market.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{market.name}</CardTitle>
                        <CardDescription>{market.description}</CardDescription>
                      </div>
                      <Badge variant={getMarketStatus(market) === 'Open Today' ? 'success' : 'secondary'}>
                        {getMarketStatus(market)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Market Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Vendors:</span>
                        <span className="ml-2">{market.vendors}</span>
                      </div>
                      <div>
                        <span className="font-medium">Season:</span>
                        <span className="ml-2">{market.season}</span>
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Categories</h4>
                      <div className="flex flex-wrap gap-1">
                        {market.categories.map((category, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {market.features.slice(0, 3).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Hours */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Hours</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(market.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize">{day}:</span>
                            <span className="text-muted-foreground">{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vendor Info */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">Vendor Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Daily Fee:</span>
                          <span className="font-medium">${market.vendorInfo.fees.daily}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Seasonal Fee:</span>
                          <span className="font-medium">${market.vendorInfo.fees.seasonal}</span>
                        </div>
                      </div>
                      <Button size="sm" className="w-full mt-3">
                        Apply to be a Vendor
                      </Button>
                    </div>

                    {/* Contact */}
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Phone size={14} className="mr-1" />
                        Contact
                      </Button>
                      <Button size="sm" variant="outline">
                        <ExternalLink size={14} className="mr-1" />
                        Website
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Areas Tab */}
          <TabsContent value="areas" className="mt-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                Detroit Areas & Neighborhoods
              </h2>
              <p className="text-muted-foreground">
                Explore Detroit's diverse neighborhoods and business opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area) => {
                const stats = getAreaStats(area);
                return (
                  <Card key={area.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{area.name}</CardTitle>
                      <CardDescription>{area.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary">{stats.businesses}</div>
                          <div className="text-xs text-muted-foreground">Businesses</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{stats.population}</div>
                          <div className="text-xs text-muted-foreground">Population</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-primary">{stats.avgIncome}</div>
                          <div className="text-xs text-muted-foreground">Avg Income</div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Highlights</h4>
                        <div className="space-y-1">
                          {area.highlights.slice(0, 3).map((highlight, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <Star size={12} className="text-yellow-500" />
                              <span>{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Business Opportunities */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Business Opportunities</h4>
                        <div className="flex flex-wrap gap-1">
                          {area.businessOpportunities.slice(0, 3).map((opportunity, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {opportunity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Major Employers */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Major Employers</h4>
                        <div className="flex flex-wrap gap-1">
                          {area.demographics.majorEmployers.slice(0, 2).map((employer, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {employer}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Map size={14} className="mr-1" />
                          Explore Area
                        </Button>
                        <Button size="sm" variant="outline">
                          <DollarSign size={14} className="mr-1" />
                          Business Info
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Stats */}
        <div className="mt-12 bg-gradient-hero rounded-xl p-6 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-4">Detroit Community Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold">{localBusinesses.length}+</div>
              <div className="text-sm text-primary-foreground/80">Local Businesses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{farmersMarkets.length}</div>
              <div className="text-sm text-primary-foreground/80">Farmers Markets</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{areas.length}</div>
              <div className="text-sm text-primary-foreground/80">Neighborhoods</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">1000+</div>
              <div className="text-sm text-primary-foreground/80">Community Members</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}