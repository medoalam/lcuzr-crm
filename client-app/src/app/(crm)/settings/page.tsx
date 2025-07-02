
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';

import { 
    Users, ShieldCheck, Puzzle, Bell, Globe, Code, MoreHorizontal, PlusCircle, Search, Edit, Trash2, KeySquare
} from 'lucide-react';
import type { UserRole } from '@/lib/types';


// --- MOCK DATA & CONFIGURATION ---
const mockUsersList = [
  { id: 'usr-1', name: 'Admin User', email: 'admin@lcuzr.com', role: 'Admin', branch: 'All Branches', status: 'Active', avatar: 'https://placehold.co/40x40.png' },
  { id: 'usr-2', name: 'S. Manager', email: 'manager.s@lcuzr.com', role: 'Sales Manager', branch: 'Riyadh Main Showroom', status: 'Active', avatar: 'https://placehold.co/40x40.png' },
  { id: 'usr-3', name: 'S. Rep', email: 'rep.s@lcuzr.com', role: 'Showroom Rep', branch: 'Jeddah Corniche Office', status: 'Active', avatar: 'https://placehold.co/40x40.png' },
  { id: 'usr-4', name: 'F. Rep', email: 'rep.f@lcuzr.com', role: 'Field Rep', branch: 'Jeddah Corniche Office', status: 'Inactive', avatar: 'https://placehold.co/40x40.png' },
  { id: 'usr-5', name: 'Ali Ahmed', email: 'ali.a@lcuzr.com', role: 'Field Rep', branch: 'Dammam Warehouse', status: 'Active', avatar: 'https://placehold.co/40x40.png' },
];

const modules = ['Dashboard', 'Leads', 'Sales', 'Products', 'Branches', 'Analytics', 'AI Insights', 'Reports', 'Settings', 'Billing'];
const permissionKeys = { V: 'View', C: 'Create', E: 'Edit', D: 'Delete', X: 'Export', A: 'Assign' };
type PermissionKey = keyof typeof permissionKeys;

const mockPermissions: Record<UserRole, Record<string, PermissionKey[]>> = {
  'Admin': {
      Dashboard: ['V'], Leads: ['V', 'C', 'E', 'D', 'X', 'A'], Sales: ['V', 'C', 'E', 'D', 'X', 'A'],
      Products: ['V', 'C', 'E', 'D', 'X'], Branches: ['V', 'C', 'E', 'D'], Analytics: ['V', 'X'],
      AIInsights: ['V'], Reports: ['V', 'C', 'E', 'D', 'X'], Settings: ['V', 'C', 'E', 'D'], Billing: ['V']
  },
  'Sales Manager': {
      Dashboard: ['V'], Leads: ['V', 'C', 'E', 'D', 'X', 'A'], Sales: ['V', 'C', 'E', 'D', 'X'],
      Products: ['V', 'E', 'X'], Branches: ['V'], Analytics: ['V', 'X'],
      AIInsights: ['V'], Reports: ['V', 'C', 'X'], Settings: [], Billing: ['V']
  },
  'Showroom Rep': {
      Dashboard: ['V'], Leads: ['V', 'C', 'E'], Sales: ['V', 'C'], Products: ['V'], Branches: [],
      Analytics: [], AIInsights: ['V'], Reports: [], Settings: [], Billing: []
  },
  'Field Rep': {
      Dashboard: ['V'], Leads: ['V', 'C', 'E'], Sales: ['V', 'C'], Products: ['V'], Branches: [],
      Analytics: [], AIInsights: ['V'], Reports: [], Settings: [], Billing: []
  },
};

// --- Sub-components for Settings ---

const PermissionEditDialog = ({ user, open, onOpenChange }: { user: typeof mockUsersList[0] | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    if (!user) return null;
    
    // In a real app, you'd fetch user-specific overrides, here we just use their role's permissions as a base
    const [userPermissions, setUserPermissions] = React.useState(mockPermissions[user.role as UserRole] || {});

    const handlePermissionChange = (module: string, pKey: PermissionKey, checked: boolean) => {
        setUserPermissions(prev => {
            const currentModulePerms = prev[module] || [];
            let newModulePerms;
            if (checked) {
                newModulePerms = [...currentModulePerms, pKey];
            } else {
                newModulePerms = currentModulePerms.filter(p => p !== pKey);
            }
            return { ...prev, [module]: newModulePerms };
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Permissions for {user.name}</DialogTitle>
                    <DialogDescription>Override base role permissions for this user.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pe-4">
                    <Accordion type="multiple" className="w-full" defaultValue={modules}>
                        {modules.map(module => (
                            <AccordionItem key={module} value={module}>
                                <AccordionTrigger>{module}</AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(permissionKeys).map(([pKey, pLabel]) => (
                                            <div key={pKey} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`${module}-${pKey}`}
                                                    checked={userPermissions[module]?.includes(pKey as PermissionKey) || false}
                                                    onCheckedChange={(checked) => handlePermissionChange(module, pKey as PermissionKey, !!checked)}
                                                />
                                                <Label htmlFor={`${module}-${pKey}`} className="font-normal">{pLabel}</Label>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={() => onOpenChange(false)}>Save Permissions</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


const UserManagementTab = () => {
    const [users, setUsers] = React.useState(mockUsersList);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [isPermissionDialogOpen, setPermissionDialogOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<typeof mockUsersList[0] | null>(null);

    const handleEditPermissions = (user: typeof mockUsersList[0]) => {
        setSelectedUser(user);
        setPermissionDialogOpen(true);
    };

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Add, edit, and manage CRM users and their roles.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative">
                         <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                         <Input placeholder="Search users..." className="ps-8 w-64"/>
                    </div>
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                             <Button className="gap-2"><PlusCircle /> Add User</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add New User</DialogTitle></DialogHeader>
                            <div className="grid gap-4 py-4">
                                <Input placeholder="Full Name" name="name" />
                                <Input placeholder="Email Address" name="email" type="email" />
                                <Select name="role">
                                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                                        <SelectItem value="Showroom Rep">Showroom Rep</SelectItem>
                                        <SelectItem value="Field Rep">Field Rep</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setOpenDialog(false)}>Create User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Assigned Branch</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-end">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map(user => (
                             <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} data-ai-hint="person face" />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.branch}</TableCell>
                                <TableCell><Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                                <TableCell className="text-end">
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="gap-2"><Edit /> Edit User</DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => handleEditPermissions(user)} className="gap-2">
                                                <ShieldCheck /> Edit Permissions
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="text-red-500 focus:text-red-500 gap-2"><Trash2 /> Delete User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <PermissionEditDialog user={selectedUser} open={isPermissionDialogOpen} onOpenChange={setPermissionDialogOpen} />
        </>
    );
};

const RolesPermissionsTab = () => (
    <Card>
        <CardHeader>
            <CardTitle>Roles & Permissions</CardTitle>
            <CardDescription>Define what users can see and do in the CRM based on their role.</CardDescription>
        </CardHeader>
        <CardContent>
            <Accordion type="single" collapsible className="w-full">
                {Object.keys(mockPermissions).map(role => (
                    <AccordionItem key={role} value={role}>
                        <AccordionTrigger className="text-lg font-semibold">{role}</AccordionTrigger>
                        <AccordionContent>
                             <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-1/4">Module</TableHead>
                                        {Object.values(permissionKeys).map(pLabel => <TableHead key={pLabel} className="text-center">{pLabel}</TableHead>)}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {modules.map(module => (
                                        <TableRow key={module}>
                                            <TableCell className="font-medium">{module}</TableCell>
                                            {Object.keys(permissionKeys).map(pKey => (
                                                <TableCell key={pKey} className="text-center">
                                                    <Checkbox checked={mockPermissions[role as UserRole][module]?.includes(pKey as PermissionKey)} />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
        <CardFooter>
            <Button>Save All Role Permissions</Button>
        </CardFooter>
    </Card>
);

const IntegrationsTab = () => (
    <Card>
        <CardHeader><CardTitle>Integrations</CardTitle><CardDescription>Connect LCUZR CRM with your other tools.</CardDescription></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Google Calendar', 'Microsoft Outlook', 'WhatsApp', 'Shopify', 'Slack', 'Zapier'].map(name => (
                 <Card key={name} className="flex items-center p-4 justify-between">
                    <div>
                        <p className="font-semibold">{name}</p>
                        <p className="text-sm text-muted-foreground">Sync your data seamlessly.</p>
                    </div>
                    <Button variant="outline">Connect</Button>
                </Card>
            ))}
        </CardContent>
    </Card>
)

const NotificationsTab = () => (
    <Card>
        <CardHeader><CardTitle>Notification Settings</CardTitle><CardDescription>Manage how you and your team receive alerts.</CardDescription></CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <h3 className="font-semibold">Lead Notifications</h3>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="n-lead-assign">When a new lead is assigned to you</Label>
                    <Switch id="n-lead-assign" defaultChecked/>
                </div>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold">Sales Notifications</h3>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="n-deal-won">When a deal you own is marked 'Won'</Label>
                    <Switch id="n-deal-won" defaultChecked/>
                </div>
                 <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label htmlFor="n-quote-approve">When a quotation requires your approval</Label>
                    <Switch id="n-quote-approve"/>
                </div>
            </div>
        </CardContent>
    </Card>
)

const LocalizationTab = () => (
     <Card>
        <CardHeader><CardTitle>Localization</CardTitle><CardDescription>Set default language, currency, and timezone for your organization.</CardDescription></CardHeader>
        <CardContent className="space-y-4 max-w-md">
             <div className="space-y-2">
                <Label>Default Language</Label>
                <Select defaultValue="en">
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">Arabic (العربية)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Default Currency</Label>
                <Select defaultValue="SAR">
                    <SelectTrigger><SelectValue/></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                        <SelectItem value="USD">US Dollar (USD)</SelectItem>
                        <SelectItem value="AED">UAE Dirham (AED)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
    </Card>
)

const ApiTab = () => (
     <Card>
        <CardHeader><CardTitle>API & Webhooks</CardTitle><CardDescription>Manage API keys for custom integrations.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="api-key">Your API Key</Label>
                <div className="flex items-center gap-2">
                    <Input id="api-key" value="**********" readOnly />
                    <Button variant="outline">Copy</Button>
                </div>
            </div>
            <Button className="gap-2"><KeySquare /> Generate New Key</Button>
        </CardContent>
    </Card>
)


// --- Main Page Component ---
export default function SettingsPage() {
    const { user } = useUser();

    if (!user) return null;

    if (!user.scopes?.includes('users:view')) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <ShieldCheck className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to access the settings page.</p>
                <p className="text-sm text-muted-foreground mt-2">Required scope: 'users:view'</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your entire CRM ecosystem from one place.</p>
            </div>

            <Tabs defaultValue="user-management" className="w-full" orientation="vertical">
                <TabsList className="w-full md:w-56 h-auto">
                    <TabsTrigger value="user-management" className="w-full justify-start gap-2"><Users/> User Management</TabsTrigger>
                    <TabsTrigger value="roles-permissions" className="w-full justify-start gap-2"><ShieldCheck/> Roles & Permissions</TabsTrigger>
                    <TabsTrigger value="integrations" className="w-full justify-start gap-2"><Puzzle/> Integrations</TabsTrigger>
                    <TabsTrigger value="notifications" className="w-full justify-start gap-2"><Bell/> Notifications</TabsTrigger>
                    <TabsTrigger value="localization" className="w-full justify-start gap-2"><Globe/> Localization</TabsTrigger>
                    <TabsTrigger value="api" className="w-full justify-start gap-2"><Code/> API & Webhooks</TabsTrigger>
                </TabsList>
                
                <TabsContent value="user-management"><UserManagementTab /></TabsContent>
                <TabsContent value="roles-permissions"><RolesPermissionsTab /></TabsContent>
                <TabsContent value="integrations"><IntegrationsTab /></TabsContent>
                <TabsContent value="notifications"><NotificationsTab /></TabsContent>
                <TabsContent value="localization"><LocalizationTab /></TabsContent>
                <TabsContent value="api"><ApiTab /></TabsContent>
            </Tabs>
        </div>
    );
}
