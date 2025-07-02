
import type { Company, User, Ticket, Transaction, AuditLog, SubscriptionPlan } from '@/lib/types';
import { initialRoles } from './permissions-data';

// Consistent IDs for linking data
const COMPANY_IDS = {
  INNOVATE: 'C001',
  SYNERGY: 'C002',
  APEX: 'C003',
  MOMENTUM: 'C004',
  QUANTUM: 'C005',
  VISIONARY: 'C006',
};

const USER_IDS = {
  ALICE: 'U001',
  BOB: 'U002',
  CHARLIE: 'U003',
  DIANA: 'U004',
  ETHAN: 'U005',
  JANE: 'AGENT01',
  JOHN: 'AGENT02',
  PETER: 'AGENT03',
};

// In a real application, this would come from a database.
export let companies: Company[] = [
  {
    id: COMPANY_IDS.INNOVATE,
    name: 'Innovate Inc.',
    industry: 'Technology',
    contactEmail: 'contact@innovate.com',
    website: 'https://innovate.com',
    status: 'Active',
    plan: 'Enterprise',
    location: 'San Francisco, USA',
    employees: '51-200',
    usage: { users: 48, storage: 950, limit: 1000 },
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-07-28T12:30:00Z',
  },
  {
    id: COMPANY_IDS.SYNERGY,
    name: 'Synergy Corp',
    industry: 'Finance',
    contactEmail: 'accounts@synergy.com',
    website: 'https://synergy.com',
    status: 'Active',
    plan: 'Business',
    location: 'New York, USA',
    employees: '201-1000',
    usage: { users: 19, storage: 48, limit: 50 },
    createdAt: '2023-02-20T11:00:00Z',
    updatedAt: '2024-07-25T09:00:00Z',
  },
  {
    id: COMPANY_IDS.APEX,
    name: 'Apex Solutions',
    industry: 'Healthcare',
    contactEmail: 'support@apex.com',
    website: 'https://apex.com',
    status: 'Trial',
    plan: 'Pro',
    location: 'Chicago, USA',
    employees: '11-50',
    usage: { users: 8, storage: 18, limit: 20 },
    createdAt: '2024-07-01T14:00:00Z',
    updatedAt: '2024-07-29T18:00:00Z',
  },
  {
    id: COMPANY_IDS.MOMENTUM,
    name: 'Momentum LLC',
    industry: 'Logistics',
    contactEmail: 'info@momentum.com',
    website: 'https://momentum.com',
    status: 'Suspended',
    plan: 'Pro',
    location: 'Houston, USA',
    employees: '11-50',
    usage: { users: 10, storage: 15, limit: 20 },
    createdAt: '2022-11-05T16:00:00Z',
    updatedAt: '2024-06-30T10:00:00Z',
  },
  {
    id: COMPANY_IDS.QUANTUM,
    name: 'Quantum Dynamics',
    industry: 'Technology',
    contactEmail: 'rd@quantum.com',
    website: 'https://quantum.com',
    status: 'Active',
    plan: 'Enterprise',
    location: 'London, UK',
    employees: '1000+',
    usage: { users: 92, storage: 780, limit: 1000 },
    createdAt: '2022-08-10T09:00:00Z',
    updatedAt: '2024-07-22T11:45:00Z',
  },
  {
    id: COMPANY_IDS.VISIONARY,
    name: 'Visionary Ventures',
    industry: 'Marketing',
    contactEmail: 'hello@visionary.com',
    website: 'https://visionary.com',
    status: 'Active',
    plan: 'Business',
    location: 'Paris, France',
    employees: '51-200',
    usage: { users: 24, storage: 35, limit: 50 },
    createdAt: '2023-05-12T08:00:00Z',
    updatedAt: '2024-07-15T14:20:00Z',
  },
];

export let users: User[] = [
  { id: USER_IDS.ALICE, name: 'Alice Johnson', email: 'alice@innovate.com', role: 'Admin', company: 'Innovate Inc.', lastLogin: '2024-07-30T10:00:00Z', status: 'Active' },
  { id: USER_IDS.BOB, name: 'Bob Williams', email: 'bob@synergy.com', role: 'Member', company: 'Synergy Corp', lastLogin: '2024-07-29T12:30:00Z', status: 'Active' },
  { id: USER_IDS.CHARLIE, name: 'Charlie Brown', email: 'charlie@apex.com', role: 'Member', company: 'Apex Solutions', lastLogin: '2024-07-28T15:00:00Z', status: 'Suspended' },
  { id: USER_IDS.DIANA, name: 'Diana Prince', email: 'diana@visionary.com', role: 'Viewer', company: 'Visionary Ventures', lastLogin: '2024-07-30T09:00:00Z', status: 'Active' },
  { id: USER_IDS.ETHAN, name: 'Ethan Hunt', email: 'ethan@quantum.com', role: 'Admin', company: 'Quantum Dynamics', lastLogin: '2024-07-25T11:00:00Z', status: 'Active' },
  { id: USER_IDS.JANE, name: 'Jane Doe', email: 'jane.doe@support.lcuzr.com', role: 'Admin', company: 'LCUZR Internal', lastLogin: '2024-07-30T11:00:00Z', status: 'Active' },
  { id: USER_IDS.JOHN, name: 'John Smith', email: 'john.smith@support.lcuzr.com', role: 'Admin', company: 'LCUZR Internal', lastLogin: '2024-07-30T12:00:00Z', status: 'Active' },
  { id: USER_IDS.PETER, name: 'Peter Jones', email: 'peter.jones@support.lcuzr.com', role: 'Admin', company: 'LCUZR Internal', lastLogin: '2024-07-30T13:00:00Z', status: 'Active' },
];

export let tickets: Ticket[] = [
    { id: "TKT-001", subject: "Problem with billing invoice", company: "Synergy Corp", companyId: COMPANY_IDS.SYNERGY, priority: "High", status: "Open", createdAt: "2024-07-30", assignedAgent: "Jane Doe" },
    { id: "TKT-002", subject: "API integration issue", company: "Quantum Dynamics", companyId: COMPANY_IDS.QUANTUM, priority: "High", status: "In Progress", createdAt: "2024-07-30", assignedAgent: "John Smith" },
    { id: "TKT-003", subject: "How to upgrade my plan?", company: "Visionary Ventures", companyId: COMPANY_IDS.VISIONARY, priority: "Medium", status: "Open", createdAt: "2024-07-29", assignedAgent: "Peter Jones" },
    { id: "TKT-004", subject: "System is running slow", company: "Innovate Inc.", companyId: COMPANY_IDS.INNOVATE, priority: "Low", status: "Resolved", createdAt: "2024-07-28", assignedAgent: "Jane Doe" },
    { id: "TKT-005", subject: "Feature Request: Dark Mode", company: "Apex Solutions", companyId: COMPANY_IDS.APEX, priority: "Low", status: "Open", createdAt: "2024-07-28", assignedAgent: "Unassigned" },
    { id: "TKT-006", subject: "Cannot reset password", company: "Momentum LLC", companyId: COMPANY_IDS.MOMENTUM, priority: "Medium", status: "Resolved", createdAt: "2024-07-27", assignedAgent: "John Smith" },
    { id: "TKT-007", subject: "Export data is failing", company: "Innovate Inc.", companyId: COMPANY_IDS.INNOVATE, priority: "High", status: "In Progress", createdAt: "2024-07-30", assignedAgent: "Peter Jones" },
    { id: "TKT-008", subject: "Question about terms of service", company: "Synergy Corp", companyId: COMPANY_IDS.SYNERGY, priority: "Low", status: "Closed", createdAt: "2024-07-26", assignedAgent: "Jane Doe" },
];

export let transactions: Transaction[] = [
    { invoice: "INV001", company: "Innovate Inc.", companyId: COMPANY_IDS.INNOVATE, amount: 2500.00, status: "Paid", date: "2024-07-23", nextBillingDate: "2024-08-23", paymentMethod: "Credit Card", plan: "Enterprise" },
    { invoice: "INV002", company: "Synergy Corp", companyId: COMPANY_IDS.SYNERGY, amount: 1500.00, status: "Paid", date: "2024-07-22", nextBillingDate: "2024-08-22", paymentMethod: "PayPal", plan: "Business" },
    { invoice: "INV003", company: "Apex Solutions", companyId: COMPANY_IDS.APEX, amount: 500.00, status: "Pending", date: "2024-07-21", nextBillingDate: "2024-08-21", paymentMethod: "Wire Transfer", plan: "Pro" },
    { invoice: "INV004", company: "Momentum LLC", companyId: COMPANY_IDS.MOMENTUM, amount: 500.00, status: "Paid", date: "2024-07-20", nextBillingDate: "2024-08-20", paymentMethod: "Credit Card", plan: "Pro" },
    { invoice: "INV005", company: "Quantum Dynamics", companyId: COMPANY_IDS.QUANTUM, amount: 5500.00, status: "Failed", date: "2024-07-19", nextBillingDate: "2024-08-19", paymentMethod: "Credit Card", plan: "Enterprise" },
    { invoice: "INV006", company: "Visionary Ventures", companyId: COMPANY_IDS.VISIONARY, amount: 2000.00, status: "Pending", date: "2024-07-18", nextBillingDate: "2024-08-18", paymentMethod: "PayPal", plan: "Business" },
    { invoice: "INV007", company: "Innovate Inc.", companyId: COMPANY_IDS.INNOVATE, amount: 2500.00, status: "Refunded", date: "2024-06-23", nextBillingDate: "2024-07-23", paymentMethod: "Credit Card", plan: "Enterprise" },
    { invoice: "INV008", company: "Synergy Corp", companyId: COMPANY_IDS.SYNERGY, amount: 1500.00, status: "Paid", date: "2024-06-22", nextBillingDate: "2024-07-22", paymentMethod: "PayPal", plan: "Business" },
];

export let auditLogs: AuditLog[] = [
    { id: "L001", timestamp: "2024-07-29T12:01:15Z", route: "/api/v1/companies", method: "GET", tokenOwner: "lcuzr_admin_panel", status: 200, duration: 55, ip: "73.15.22.101" },
    { id: "L002", timestamp: "2024-07-29T12:00:50Z", route: "/api/v1/company/C001", method: "GET", tokenOwner: "lcuzr_admin_panel", status: 200, duration: 32, ip: "73.15.22.101" },
    { id: "L003", timestamp: "2024-07-29T11:59:05Z", route: "/api/v1/company/C002/plan", method: "PATCH", tokenOwner: "billing_microservice", status: 403, duration: 15, ip: "192.168.1.100" },
    { id: "L004", timestamp: "2024-07-29T11:58:30Z", route: "/api/v1/logs/C003", method: "GET", tokenOwner: "lcuzr_auditor", status: 200, duration: 88, ip: "201.50.60.70" },
    { id: "L005", timestamp: "2024-07-29T11:55:00Z", route: "/api/v1/companies", method: "GET", tokenOwner: "unknown_token", status: 401, duration: 5, ip: "122.3.4.5" },
    { id: "L006", timestamp: "2024-07-29T11:50:10Z", route: "/api/v1/companies", method: "GET", tokenOwner: "lcuzr_admin_panel", status: 60, duration: 60, ip: "73.15.22.101" },
];

export const initialPlans: SubscriptionPlan[] = [
    {
      id: 'plan_free',
      name: 'Free',
      price: 0,
      description: 'For individuals and small projects.',
      features: [
        '1 User',
        '500 MB Storage',
        'Community Support',
      ],
      badge: null,
      status: 'active',
    },
    {
      id: 'plan_pro',
      name: 'Pro',
      price: 49,
      description: 'For small teams getting started.',
      features: [
        '5 Users',
        '10 GB Storage',
        'Email Support',
        'Lead Management',
      ],
      badge: null,
      status: 'active',
    },
    {
      id: 'plan_business',
      name: 'Business',
      price: 99,
      description: 'For growing businesses that need more power.',
      features: [
        '25 Users',
        '50 GB Storage',
        'Priority Support',
        'Advanced Reporting',
        'API Access',
      ],
      badge: 'Popular',
      status: 'active',
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise',
      price: null,
      description: 'For large organizations with custom needs.',
      features: [
        'Unlimited Users',
        '1 TB Storage',
        'Dedicated Support',
        'SSO & Security Audits',
        'Custom Integrations',
      ],
      badge: 'Best Value',
      status: 'active',
      notes: 'Custom pricing depends on user seats and required integrations. Contact sales for a quote.'
    },
  ];
    
