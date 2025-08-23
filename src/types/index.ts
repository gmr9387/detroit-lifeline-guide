export interface UserProfile {
  id: string;
  householdSize: number;
  hasChildren: boolean;
  income: string;
  zipCode: string;
  primaryNeeds: string[];
  language: string;
  completedAt: string;
}

export interface ResourceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Program {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: {
    income: string;
    age: string;
    residency: string;
    [key: string]: string;
  };
  benefits: string[];
  documents: string[];
  contact: {
    phone: string;
    website: string;
    address: string;
    hours: string;
  };
  languages: string[];
  applicationUrl: string;
}

export interface Application {
  id: string;
  programId: string;
  programName: string;
  status: 'saved' | 'started' | 'submitted' | 'approved' | 'denied';
  appliedAt: string;
  documentsChecked: string[];
  notes?: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  url: string;
  category: string;
}

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: 'urgent' | 'important' | 'routine';
  dueDate?: string;
  createdAt: string;
  applicationId?: string;
  programId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface ProgressMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  applicationId: string;
  order: number;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document';
  size: number;
  uploadedAt: string;
  applicationId?: string;
  programId?: string;
  status: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
}

export interface UserReview {
  id: string;
  programId: string;
  programName: string;
  rating: number;
  review: string;
  helpfulCount: number;
  createdAt: string;
  userId: string;
  userName: string;
  applicationStatus: 'approved' | 'denied' | 'pending';
  waitTime?: number; // days
  benefitsReceived?: string[];
}

export interface SuccessStory {
  id: string;
  title: string;
  story: string;
  programId: string;
  programName: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  helpfulCount: number;
  tags: string[];
  isAnonymous: boolean;
}

export interface AnalyticsData {
  totalApplications: number;
  approvedApplications: number;
  deniedApplications: number;
  averageWaitTime: number;
  successRate: number;
  totalBenefitsReceived: number;
  monthlyApplications: Array<{
    month: string;
    count: number;
  }>;
  programSuccessRates: Array<{
    programId: string;
    programName: string;
    successRate: number;
    averageWaitTime: number;
  }>;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  category: 'general' | 'application-help' | 'documentation' | 'success-story';
  tags: string[];
  replies: CommunityReply[];
  helpfulCount: number;
  isPinned: boolean;
}

export interface CommunityReply {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  helpfulCount: number;
  isAcceptedAnswer: boolean;
}