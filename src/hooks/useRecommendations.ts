import { useState, useEffect, useMemo } from 'react';
import { Program, UserProfile, Application } from '@/types';
import { storageUtils } from '@/utils/localStorage';

export interface RecommendationScore {
  program: Program;
  score: number;
  reasons: string[];
  matchPercentage: number;
}

export interface RecommendationCategory {
  category: string;
  programs: RecommendationScore[];
  priority: 'high' | 'medium' | 'low';
}

export const useRecommendations = (user: UserProfile | null, programs: Program[]) => {
  const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
  const [categorizedRecommendations, setCategorizedRecommendations] = useState<RecommendationCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate recommendation scores based on user profile and behavior
  const calculateRecommendationScores = useMemo(() => {
    if (!user || !programs.length) return [];

    return programs.map(program => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Primary needs match (highest weight)
      if (user.primaryNeeds.includes(program.category)) {
        score += 50;
        reasons.push(`Matches your primary need: ${program.category}`);
      }

      // 2. Income eligibility match
      const incomeMatch = checkIncomeEligibility(user.income, program.eligibility.income);
      if (incomeMatch) {
        score += 30;
        reasons.push('Income eligibility match');
      }

      // 3. Location proximity (ZIP code based)
      const locationMatch = checkLocationProximity(user.zipCode, program);
      if (locationMatch) {
        score += 20;
        reasons.push('Available in your area');
      }

      // 4. Household size compatibility
      const householdMatch = checkHouseholdCompatibility(user.householdSize, program);
      if (householdMatch) {
        score += 15;
        reasons.push('Suitable for your household size');
      }

      // 5. Children-specific programs
      if (user.hasChildren && program.eligibility.children) {
        score += 10;
        reasons.push('Child-friendly program');
      }

      // 6. Language compatibility
      if (program.languages?.includes(user.language)) {
        score += 10;
        reasons.push(`Available in ${user.language}`);
      }

      // 7. Application history boost (if user has applied to similar programs)
      const historyBoost = getApplicationHistoryBoost(program, user);
      if (historyBoost > 0) {
        score += historyBoost;
        reasons.push('Based on your application history');
      }

      // 8. Popularity boost (simulated)
      const popularityBoost = getPopularityBoost(program);
      score += popularityBoost;

      // 9. Urgency boost (for time-sensitive programs)
      const urgencyBoost = getUrgencyBoost(program);
      score += urgencyBoost;
      if (urgencyBoost > 0) {
        reasons.push('Time-sensitive opportunity');
      }

      // Calculate match percentage (0-100)
      const matchPercentage = Math.min(100, Math.round((score / 150) * 100));

      return {
        program,
        score,
        reasons,
        matchPercentage
      };
    });
  }, [user, programs]);

  // Categorize recommendations by priority
  const categorizeRecommendations = useMemo(() => {
    const categorized: RecommendationCategory[] = [];
    const userNeeds = user?.primaryNeeds || [];

    // Group by user's primary needs
    userNeeds.forEach(need => {
      const categoryPrograms = recommendations
        .filter(rec => rec.program.category === need)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      if (categoryPrograms.length > 0) {
        categorized.push({
          category: need,
          programs: categoryPrograms,
          priority: 'high' as const
        });
      }
    });

    // Add other relevant categories
    const otherPrograms = recommendations
      .filter(rec => !userNeeds.includes(rec.program.category))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    if (otherPrograms.length > 0) {
      categorized.push({
        category: 'other',
        programs: otherPrograms,
        priority: 'medium' as const
      });
    }

    return categorized;
  }, [recommendations, user]);

  // Update recommendations when user or programs change
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate AI processing time
    const timer = setTimeout(() => {
      const scoredRecommendations = calculateRecommendationScores;
      setRecommendations(scoredRecommendations);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [calculateRecommendationScores]);

  // Update categorized recommendations
  useEffect(() => {
    setCategorizedRecommendations(categorizeRecommendations);
  }, [categorizeRecommendations]);

  // Get top recommendations
  const getTopRecommendations = (count: number = 5) => {
    return recommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, count);
  };

  // Get recommendations by category
  const getRecommendationsByCategory = (category: string) => {
    return recommendations
      .filter(rec => rec.program.category === category)
      .sort((a, b) => b.score - a.score);
  };

  // Get urgent recommendations (high priority, time-sensitive)
  const getUrgentRecommendations = () => {
    return recommendations
      .filter(rec => rec.reasons.some(reason => reason.includes('Time-sensitive')))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  return {
    recommendations,
    categorizedRecommendations,
    isLoading,
    getTopRecommendations,
    getRecommendationsByCategory,
    getUrgentRecommendations,
    refreshRecommendations: () => {
      setIsLoading(true);
      setTimeout(() => {
        const scoredRecommendations = calculateRecommendationScores;
        setRecommendations(scoredRecommendations);
        setIsLoading(false);
      }, 300);
    }
  };
};

// Helper functions for recommendation scoring

const checkIncomeEligibility = (userIncome: string, programIncome: string): boolean => {
  if (!programIncome || programIncome === 'Any') return true;
  
  const incomeRanges = {
    'under-15k': [0, 15000],
    '15k-30k': [15000, 30000],
    '30k-45k': [30000, 45000],
    '45k-60k': [45000, 60000],
    'over-60k': [60000, Infinity]
  };

  const userRange = incomeRanges[userIncome as keyof typeof incomeRanges];
  const programRange = incomeRanges[programIncome as keyof typeof incomeRanges];

  if (!userRange || !programRange) return true;

  // Check if user's income range overlaps with program's income range
  return userRange[0] <= programRange[1] && userRange[1] >= programRange[0];
};

const checkLocationProximity = (userZipCode: string, program: Program): boolean => {
  // In a real app, you'd have location data for programs
  // For now, we'll assume programs are available in Detroit area
  const detroitZipCodes = ['48201', '48202', '48203', '48204', '48205', '48206', '48207', '48208', '48209', '48210', '48211', '48212', '48213', '48214', '48215', '48216', '48217', '48218', '48219', '48220', '48221', '48222', '48223', '48224', '48225', '48226', '48227', '48228', '48229', '48230', '48231', '48232', '48233', '48234', '48235', '48236', '48237', '48238', '48239', '48240', '48242', '48243'];
  
  return detroitZipCodes.includes(userZipCode) || !program.contact?.address;
};

const checkHouseholdCompatibility = (householdSize: number, program: Program): boolean => {
  // Most programs are suitable for various household sizes
  // Some programs might have specific requirements
  return householdSize >= 1 && householdSize <= 10;
};

const getApplicationHistoryBoost = (program: Program, user: UserProfile): number => {
  const applications = storageUtils.getApplications();
  const userApplications = applications.filter(app => app.userId === user.id);
  
  // Check if user has applied to programs in the same category
  const categoryApplications = userApplications.filter(app => {
    // This would require program data in applications
    return true; // Simplified for demo
  });

  return categoryApplications.length * 5; // 5 points per similar application
};

const getPopularityBoost = (program: Program): number => {
  // Simulate popularity based on program characteristics
  let boost = 0;
  
  // Popular categories get a boost
  const popularCategories = ['housing', 'employment', 'food'];
  if (popularCategories.includes(program.category)) {
    boost += 5;
  }

  // Programs with more benefits get a boost
  if (program.benefits.length > 3) {
    boost += 3;
  }

  return boost;
};

const getUrgencyBoost = (program: Program): number => {
  // Check if program has deadlines or is time-sensitive
  if (program.eligibility.deadline) {
    const deadline = new Date(program.eligibility.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDeadline <= 7) return 20;
    if (daysUntilDeadline <= 30) return 10;
    if (daysUntilDeadline <= 90) return 5;
  }

  return 0;
};