

export type Permission = {
    id: string;
    label: string;
    description: string;
};
  
export type PermissionGroup = {
    group: string;
    permissions: Permission[];
};
  
export type Role = {
    id:string;
    name: string;
    description: string;
    permissions: string[]; // array of permission ids
};

export type UserRole = {
    userId: string;
    roleId: string;
};

// Main Data Types
export type Company = {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  website: string;
  status: 'Active' | 'Trial' | 'Suspended';
  plan: string;
  location: string;
  employees: string;
  usage: { users: number; storage: number; limit: number };
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  company: string;
  lastLogin: string;
  status: 'Active' | 'Suspended';
};

export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'High' | 'Medium' | 'Low';

export type Ticket = {
  id: string;
  subject: string;
  company: string;
  companyId: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  assignedAgent: string;
};

export type Transaction = {
  invoice: string;
  company: string;
  companyId: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  date: string;
  nextBillingDate: string;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Wire Transfer';
  plan: string;
};

export type AuditLog = {
  id: string;
  timestamp: string;
  route: string;
  method: string;
  tokenOwner: string;
  status: number;
  duration: number;
  ip: string;
};

// This type is for the admin UI and does not include the sensitive token string.
export type AdminTokenView = {
  id: string;
  owner: string;
  scopes: string[];
  status: 'active' | 'revoked';
  created_at: string;
  last_used: string;
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number | null; // Monthly price. null for 'Custom'.
  description: string;
  features: string[];
  badge: 'Popular' | 'Best Value' | null;
  status: 'active' | 'archived';
  notes?: string;
};
    
