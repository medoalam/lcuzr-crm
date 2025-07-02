

export type UserRole = 'Admin' | 'Sales Manager' | 'Showroom Rep' | 'Field Rep';

export interface User {
  id?: string;
  name: string;
  role: UserRole;
  avatar: string;
  email?: string;
  branch?: string;
  status?: 'Active' | 'Inactive';
  scopes?: string[];
}

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
};

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  source: 'Website' | 'Referral' | 'Exhibition' | 'Walk-in';
  owner: {
    name: string;
    avatar: string;
  };
  score: number;
  lastActivity: string;
  nextTask: string;
  interest: string;
}

export type DealStatus = 'Quotation' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
    id: string;
    name: string;
    client: string;
    amount: number;
    status: DealStatus;
    rep: {
        name: string;
        avatar: string;
    };
    createdDate: string;
    lastUpdate: string;
    probability: number;
}
    
export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  prices: { [currency: string]: number };
  baseCurrency: string;
  stock: number;
  status: 'Active' | 'Inactive';
  tags: string[];
  imageUrl: string;
  sales: number;
  quotes: number;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  type: 'Showroom' | 'Office' | 'Warehouse' | 'Remote Team';
  status: 'Active' | 'Inactive';
  manager: string;
  teamSize: number;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  kpis: {
    sales: number;
    leads: number;
    walkins: number;
  };
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
}

export interface AiInsight {
  type: 'Alert' | 'Opportunity' | 'Forecast' | 'Optimization';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actionText?: string;
  relatedEntity?: string;
}

export interface Department {
    id: string;
    name: string;
    color: string;
    managerId?: string;
    parentId?: string | null;
}

export type TeamMemberPermission = 'add_user' | 'edit_team' | 'view_reports';

export interface TeamMember {
    id: string;
    name: string;
    position: string;
    email: string;
    avatar: string;
    departmentId: string;
    reportsTo: string | null;
    location: string;
    tags: string[];
    permissions?: TeamMemberPermission[];
    children?: TeamMember[];
}
