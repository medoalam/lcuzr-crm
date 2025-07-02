
import type { Role, PermissionGroup, UserRole } from '@/lib/types';

export const initialPermissionGroups: PermissionGroup[] = [
  {
    group: 'Companies',
    permissions: [
      { id: 'companies:view', label: 'View Companies', description: 'Can view company list and profiles.' },
      { id: 'companies:edit', label: 'Edit Companies', description: 'Can edit company details.' },
      { id: 'companies:create', label: 'Create Companies', description: 'Can add new companies.' },
      { id: 'companies:delete', label: 'Delete Companies', description: 'Can delete companies.' },
    ],
  },
  {
    group: 'Billing',
    permissions: [
      { id: 'billing:view', label: 'View Billing', description: 'Can view billing history and invoices.' },
      { id: 'billing:manage', label: 'Manage Subscriptions', description: 'Can upgrade/downgrade plans.' },
      { id: 'billing:export', label: 'Export Invoices', description: 'Can download PDF invoices.' },
    ],
  },
  {
    group: 'Support',
    permissions: [
        { id: 'support:view', label: 'View Tickets', description: 'Can view support tickets.' },
        { id: 'support:reply', label: 'Reply to Tickets', description: 'Can reply to support tickets.' },
        { id: 'support:manage', label: 'Manage Tickets', description: 'Can change ticket status, priority, and assignment.' },
    ],
  },
  {
    group: 'Users',
    permissions: [
        { id: 'users:view', label: 'View Users', description: 'Can view list of users.' },
        { id: 'users:invite', label: 'Invite Users', description: 'Can invite new users to the platform.' },
        { id: 'users:manage', label: 'Manage Users', description: 'Can suspend, activate, and edit user details.' },
    ],
  },
   {
    group: 'Gateway',
    permissions: [
      { id: 'gateway:admin', label: 'Manage API Gateway', description: 'Can create, manage, and revoke API tokens.' },
      { id: 'logs:read', label: 'View Audit Logs', description: 'Can view the audit log trail.' },
    ],
  },
  {
    group: 'Settings',
    permissions: [
      { id: 'settings:view', label: 'View Settings', description: 'Can view system settings.' },
      { id: 'settings:edit', label: 'Edit Settings', description: 'Can change system settings.' },
      { id: 'roles:manage', label: 'Manage Roles & Permissions', description: 'Can create, edit, and delete roles.' },
    ],
  },
];

export const initialRoles: Role[] = [
  {
    id: 'role_01',
    name: 'Super Admin',
    description: 'Full access to all modules and settings.',
    permissions: initialPermissionGroups.flatMap(g => g.permissions.map(p => p.id)),
  },
  {
    id: 'role_02',
    name: 'Operations Manager',
    description: 'Can manage companies and users.',
    permissions: [
      'companies:view', 'companies:edit', 'companies:create', 
      'users:view', 'users:invite', 'users:manage', 
      'support:view'
    ],
  },
  {
    id: 'role_03',
    name: 'Finance Team',
    description: 'Full access to billing and invoices.',
    permissions: ['billing:view', 'billing:manage', 'billing:export', 'companies:view'],
  },
  {
    id: 'role_04',
    name: 'Support Agent',
    description: 'Can view and manage support tickets.',
    permissions: ['support:view', 'support:reply', 'support:manage', 'companies:view'],
  },
  {
    id: 'role_05',
    name: 'Viewer',
    description: 'Read-only access to most modules.',
    permissions: ['companies:view', 'billing:view', 'support:view', 'users:view', 'logs:read'],
  },
];

// Mock mapping of users to roles
export const initialUserRoles: UserRole[] = [
    { userId: 'U001', roleId: 'role_01' }, // Alice Johnson - Super Admin
    { userId: 'U002', roleId: 'role_02' }, // Bob Williams - Operations Manager
    { userId: 'U003', roleId: 'role_03' }, // Charlie Brown - Finance Team
    { userId: 'U004', roleId: 'role_04' }, // Diana Prince - Support Agent
    { userId: 'U005', roleId: 'role_05' }, // Ethan Hunt - Viewer
];
