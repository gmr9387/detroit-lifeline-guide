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