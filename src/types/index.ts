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

// Business License Types
export interface BusinessLicenseCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface BusinessLicenseRequirements {
  businessRegistration: string;
  foodSafety?: string;
  age?: string;
  background?: string;
  professional?: string;
  vehicle?: string;
  inspections: string;
  insurance: string;
  zoning: string;
  [key: string]: string | undefined;
}

export interface BusinessLicenseFees {
  application: number;
  annual: number;
  inspection: number;
  background?: number;
  vehicle?: number;
}

export interface BusinessLicenseContact {
  department: string;
  phone: string;
  website: string;
  address: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  topics: string[];
}

export interface BusinessLicense {
  id: string;
  name: string;
  category: string;
  description: string;
  requirements: BusinessLicenseRequirements;
  documents: string[];
  fees: BusinessLicenseFees;
  timeline: string;
  contact: BusinessLicenseContact;
  trainingModules: TrainingModule[];
}

export interface TrainingVideo {
  id: string;
  title: string;
  duration: string;
  url: string;
  description: string;
}

export interface TrainingChecklist {
  id: string;
  title: string;
  description: string;
}

export interface TrainingTemplate {
  id: string;
  title: string;
  description: string;
}

export interface TrainingResources {
  videos: TrainingVideo[];
  checklists: TrainingChecklist[];
  templates: TrainingTemplate[];
}

export interface BusinessLicenseData {
  categories: BusinessLicenseCategory[];
  licenses: BusinessLicense[];
  trainingResources: TrainingResources;
}

export interface BusinessLicenseApplication {
  id: string;
  licenseId: string;
  licenseName: string;
  status: 'researching' | 'preparing' | 'submitted' | 'under-review' | 'approved' | 'denied';
  startedAt: string;
  submittedAt?: string;
  documentsCompleted: string[];
  trainingCompleted: string[];
  notes?: string;
  estimatedCompletion?: string;
}

// Local Businesses and Community Types
export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Hours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface Contact {
  phone: string;
  website: string;
  email: string;
}

export interface Owner {
  name: string;
  story: string;
  yearsInBusiness: number;
}

export interface LocalBusiness {
  id: string;
  name: string;
  category: string;
  description: string;
  location: Location;
  hours: Hours;
  services: string[];
  contact: Contact;
  owner: Owner;
  highlights: string[];
}

export interface VendorInfo {
  applicationUrl: string;
  fees: {
    daily: number;
    seasonal: number;
  };
  requirements: string[];
}

export interface FarmersMarket {
  id: string;
  name: string;
  description: string;
  location: Location;
  hours: Hours;
  season: string;
  vendors: number;
  categories: string[];
  features: string[];
  contact: Contact;
  vendorInfo: VendorInfo;
}

export interface Demographics {
  population: string;
  averageIncome: string;
  majorEmployers: string[];
}

export interface Area {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  businessOpportunities: string[];
  demographics: Demographics;
}