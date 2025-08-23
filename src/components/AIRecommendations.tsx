import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useRecommendations, RecommendationScore, RecommendationCategory } from '@/hooks/useRecommendations';
import { Program } from '@/types';
import { 
  Brain, 
  Star, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Zap,
  Eye,
  Heart,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIRecommendationsProps {
  user: any;
  programs: Program[];
  onProgramSelect?: (program: Program) => void;
}

export default function AIRecommendations({ user, programs, onProgramSelect }: AIRecommendationsProps) {
  const {
    recommendations,
    categorizedRecommendations,
    isLoading,
    getTopRecommendations,
    getUrgentRecommendations,
    refreshRecommendations
  } = useRecommendations(user, programs);

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<RecommendationScore | null>(null);

  const topRecommendations = getTopRecommendations(5);
  const urgentRecommendations = getUrgentRecommendations();

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Target className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'low': return <Star className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Basic Match';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Analyzing your profile and preferences...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI-Powered Recommendations
              </CardTitle>
              <CardDescription>
                Personalized program suggestions based on your profile and preferences
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={refreshRecommendations}>
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Urgent Recommendations */}
      {urgentRecommendations.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Zap className="h-5 w-5" />
              Urgent Opportunities
            </CardTitle>
            <CardDescription className="text-red-600">
              Time-sensitive programs that require immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {urgentRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900">{rec.program.name}</h4>
                    <p className="text-sm text-red-700">{rec.reasons.find(r => r.includes('Time-sensitive'))}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Urgent</Badge>
                    <Button size="sm" onClick={() => onProgramSelect?.(rec.program)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Top Recommendations
          </CardTitle>
          <CardDescription>
            Programs with the highest match scores for your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topRecommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{rec.program.name}</h3>
                      <Badge variant="outline" className={getMatchColor(rec.matchPercentage)}>
                        {rec.matchPercentage}% Match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.program.description}</p>
                    
                    {/* Match Progress */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-sm">
                        <span>Match Score</span>
                        <span className={getMatchColor(rec.matchPercentage)}>
                          {getMatchLabel(rec.matchPercentage)}
                        </span>
                      </div>
                      <Progress value={rec.matchPercentage} className="h-2" />
                    </div>

                    {/* Match Reasons */}
                    <div className="space-y-1">
                      {rec.reasons.slice(0, 3).map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1 h-1 bg-primary rounded-full"></div>
                          {reason}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{rec.program.name}</DialogTitle>
                          <DialogDescription>
                            Detailed analysis of why this program matches your profile
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Match Analysis</h4>
                            <div className="space-y-2">
                              {rec.reasons.map((reason, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                                  {reason}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Program Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Category:</span> {rec.program.category}
                              </div>
                              <div>
                                <span className="font-medium">Benefits:</span> {rec.program.benefits.length}
                              </div>
                              <div>
                                <span className="font-medium">Income Eligibility:</span> {rec.program.eligibility.income}
                              </div>
                              <div>
                                <span className="font-medium">Languages:</span> {rec.program.languages?.join(', ') || 'English'}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button asChild className="flex-1">
                              <Link to={`/program/${rec.program.id}`}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Program
                              </Link>
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Heart className="h-4 w-4 mr-2" />
                              Save for Later
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button size="sm" onClick={() => onProgramSelect?.(rec.program)}>
                      Apply Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Categorized Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Recommendations by Category
          </CardTitle>
          <CardDescription>
            Organized by your primary needs and interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categorizedRecommendations.map((category) => (
              <Collapsible
                key={category.category}
                open={expandedCategories.includes(category.category)}
                onOpenChange={() => toggleCategory(category.category)}
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getPriorityColor(category.priority)} text-white`}>
                        {getPriorityIcon(category.priority)}
                      </div>
                      <div>
                        <h3 className="font-medium capitalize">
                          {category.category === 'other' ? 'Other Programs' : category.category}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {category.programs.length} programs available
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={category.priority === 'high' ? 'destructive' : 'secondary'}>
                        {category.priority} priority
                      </Badge>
                      {expandedCategories.includes(category.category) ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-3 space-y-2 pl-4">
                    {category.programs.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{rec.program.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {rec.matchPercentage}% match • {rec.reasons[0]}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {rec.matchPercentage}%
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => onProgramSelect?.(rec.program)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Analysis of your profile and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">
                {recommendations.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Programs Analyzed</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {recommendations.filter(r => r.matchPercentage >= 60).length}
              </div>
              <div className="text-sm text-muted-foreground">Good Matches Found</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {urgentRecommendations.length}
              </div>
              <div className="text-sm text-muted-foreground">Urgent Opportunities</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}