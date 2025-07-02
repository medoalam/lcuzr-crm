
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import type { Branch } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Image from 'next/image';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';

import { 
    PlusCircle, Search, Map, MoreVertical, Edit, Trash2, Building, Users, Mail, Phone, MapPin, BarChart2, Globe, Filter
} from 'lucide-react';

// --- MOCK DATA ---

const initialBranches: Branch[] = [
  { id: 'branch-1', name: 'Riyadh Main Showroom', code: 'RUH-01', type: 'Showroom', status: 'Active', manager: 'S. Manager', teamSize: 12, address: '123 King Fahd Rd', city: 'Riyadh', country: 'Saudi Arabia', phone: '9200-12345', email: 'riyadh.main@lcuzr.com', kpis: { sales: 125000, leads: 45, walkins: 88 }, location: { lat: 24.7136, lng: 46.6753 }, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'branch-2', name: 'Jeddah Corniche Office', code: 'JED-01', type: 'Office', status: 'Active', manager: 'F. Rep', teamSize: 8, address: '456 Corniche Rd', city: 'Jeddah', country: 'Saudi Arabia', phone: '9200-67890', email: 'jeddah.office@lcuzr.com', kpis: { sales: 88000, leads: 32, walkins: 25 }, location: { lat: 21.5433, lng: 39.1728 }, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'branch-3', name: 'Dammam Warehouse', code: 'DMM-01', type: 'Warehouse', status: 'Active', manager: 'Admin User', teamSize: 5, address: '789 Port Rd', city: 'Dammam', country: 'Saudi Arabia', phone: '9200-11223', email: 'dammam.wh@lcuzr.com', kpis: { sales: 0, leads: 5, walkins: 2 }, location: { lat: 26.4207, lng: 50.0888 }, imageUrl: 'https://placehold.co/600x400.png' },
  { id: 'branch-4', name: 'Dubai Remote Team', code: 'DXB-01', type: 'Remote Team', status: 'Inactive', manager: 'S. Manager', teamSize: 4, address: 'N/A', city: 'Dubai', country: 'UAE', phone: 'N/A', email: 'dubai.remote@lcuzr.com', kpis: { sales: 45000, leads: 22, walkins: 0 }, location: { lat: 25.276987, lng: 55.296249 }, imageUrl: 'https://placehold.co/600x400.png' },
];

const mockTeam = [
    { name: 'S. Manager', role: 'Sales Manager', avatar: 'https://placehold.co/40x40.png' },
    { name: 'S. Rep', role: 'Showroom Rep', avatar: 'https://placehold.co/40x40.png' },
    { name: 'F. Rep', role: 'Field Rep', avatar: 'https://placehold.co/40x40.png' },
    { name: 'Alice Johnson', role: 'Showroom Rep', avatar: 'https://placehold.co/40x40.png' },
    { name: 'Bob Williams', role: 'Field Rep', avatar: 'https://placehold.co/40x40.png' },
];

// --- SUB-COMPONENTS ---

const BranchesToolbar = ({ onAddBranch, onSearch }: { onAddBranch: (branch: Branch) => void, onSearch: (term: string) => void }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Branches & Locations</h1>
            <p className="text-muted-foreground">Manage and monitor all your business locations.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search branches..." className="ps-8 w-full md:w-64" onChange={e => onSearch(e.target.value)} />
            </div>
            <Button variant="outline"><Filter className="me-2" /> Filters</Button>
            <Button variant="outline"><Map className="me-2" /> Map View</Button>
            <BranchFormDialog onSave={onAddBranch} trigger={
                <Button><PlusCircle className="me-2" /> New Branch</Button>
            }/>
        </div>
    </div>
);

const BranchFormDialog = ({ branch, onSave, trigger }: { branch?: Branch; onSave: (branch: Branch) => void; trigger: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState<Partial<Branch>>(branch || { status: 'Active', type: 'Showroom' });

    React.useEffect(() => {
        if (open) {
            setFormData(branch || { status: 'Active', type: 'Showroom' });
        }
    }, [open, branch]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const fullBranchData: Branch = {
            id: formData.id || `branch-${Date.now()}`,
            kpis: formData.kpis || { sales: 0, leads: 0, walkins: 0 },
            location: formData.location || { lat: 0, lng: 0 },
            imageUrl: formData.imageUrl || 'https://placehold.co/600x400.png',
            ...formData,
        } as Branch;
        onSave(fullBranchData);
        setOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: keyof Branch, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{branch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
                    <DialogDescription>{branch ? 'Update the details for this location.' : 'Fill in the information for the new branch.'}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-end">Name</Label>
                        <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} className="col-span-3" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-end">Type</Label>
                        <Select name="type" value={formData.type} onValueChange={(v) => handleSelectChange('type', v as Branch['type'])}>
                            <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Showroom">Showroom</SelectItem>
                                <SelectItem value="Office">Office</SelectItem>
                                <SelectItem value="Warehouse">Warehouse</SelectItem>
                                <SelectItem value="Remote Team">Remote Team</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-end">Address</Label>
                        <Input id="address" name="address" value={formData.address || ''} onChange={handleChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-end">City</Label>
                        <Input id="city" name="city" value={formData.city || ''} onChange={handleChange} className="col-span-3" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="manager" className="text-end">Manager</Label>
                        <Select name="manager" value={formData.manager} onValueChange={(v) => handleSelectChange('manager', v)}>
                            <SelectTrigger className="col-span-3"><SelectValue placeholder="Assign a manager" /></SelectTrigger>
                            <SelectContent>
                                {mockTeam.map(t => <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Branch</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const BranchCard = ({ branch }: { branch: Branch }) => (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="p-0 relative">
            <Badge variant={branch.status === 'Active' ? 'default' : 'destructive'} className="absolute top-2 end-2 z-10">{branch.status}</Badge>
            <Image src={branch.imageUrl} alt={branch.name} width={600} height={400} className="rounded-t-lg object-cover aspect-video" data-ai-hint="building exterior" />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
            <p className="text-xs text-muted-foreground">{branch.type}</p>
            <h3 className="text-lg font-semibold mt-1 leading-tight">{branch.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {branch.address}, {branch.city}
            </p>
        </CardContent>
        <CardFooter className="p-4 border-t flex flex-col items-start space-y-3">
            <div className="flex justify-between w-full text-sm">
                <span className="text-muted-foreground">Manager</span>
                <span className="font-medium">{branch.manager}</span>
            </div>
             <div className="flex justify-between w-full text-sm">
                <span className="text-muted-foreground">Team Size</span>
                <span className="font-medium">{branch.teamSize} members</span>
            </div>
            <div className="flex justify-between w-full text-sm">
                <span className="text-muted-foreground">Monthly Sales</span>
                <span className="font-medium text-primary">${branch.kpis.sales.toLocaleString()}</span>
            </div>
        </CardFooter>
    </Card>
);

const BranchDetailSheet = ({ branch, onEdit }: { branch: Branch, onEdit: (b: Branch) => void }) => {
    if (!branch) return null;
    return (
        <SheetContent className="w-full sm:max-w-2xl p-0">
            <SheetHeader className="p-6">
                <SheetTitle className="text-2xl">{branch.name}</SheetTitle>
                <SheetDescription>{branch.address}, {branch.city}, {branch.country}</SheetDescription>
            </SheetHeader>
            <div className="flex items-center gap-2 p-6 border-y">
                <BranchFormDialog branch={branch} onSave={onEdit} trigger={<Button size="sm"><Edit className="me-2" />Edit</Button>} />
                <Button size="sm" variant="outline"><Trash2 className="me-2" />Delete</Button>
            </div>
            <Tabs defaultValue="overview" className="p-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="team">Team</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 space-y-4">
                    <Card>
                        <CardHeader><CardTitle>Branch Details</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-sm">
                            <p><strong>Branch Code:</strong> {branch.code}</p>
                            <p><strong>Type:</strong> {branch.type}</p>
                            <p><strong>Status:</strong> <Badge variant={branch.status === 'Active' ? 'default' : 'outline'}>{branch.status}</Badge></p>
                            <p><strong>Manager:</strong> {branch.manager}</p>
                            <p><strong>Email:</strong> {branch.email}</p>
                            <p><strong>Phone:</strong> {branch.phone}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="team" className="mt-4">
                     <Card>
                        <CardHeader><CardTitle>Assigned Team ({mockTeam.length})</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Member</TableHead>
                                        <TableHead>Role</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTeam.map(member => (
                                        <TableRow key={member.name}>
                                            <TableCell className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={member.avatar} data-ai-hint="person face" />
                                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                {member.name}
                                            </TableCell>
                                            <TableCell>{member.role}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="performance" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Performance Snapshot</CardTitle></CardHeader>
                        <CardContent>
                             <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={[branch.kpis]}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <RechartsTooltip />
                                    <Bar dataKey="sales" name="Sales ($)" fill="hsl(var(--primary))" />
                                    <Bar dataKey="leads" name="Leads" fill="hsl(var(--accent))" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="location" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Map Location</CardTitle></CardHeader>
                        <CardContent className="h-64 bg-muted rounded-lg flex items-center justify-center">
                            <p className="text-muted-foreground">Map view placeholder</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </SheetContent>
    )
}

// --- MAIN PAGE COMPONENT ---
export default function BranchesPage() {
    const { user } = useUser();
    const [branches, setBranches] = React.useState<Branch[]>(initialBranches);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredBranches = React.useMemo(() => {
        let userBranches = branches;
        // Role-based filtering
        if (user && (user.role === 'Showroom Rep' || user.role === 'Field Rep')) {
            userBranches = branches.filter(b => b.manager === user.name);
        }
        
        // Search term filtering
        if (!searchTerm) return userBranches;
        return userBranches.filter(b => 
            b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.code.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [user, branches, searchTerm]);

    const handleSaveBranch = (branchToSave: Branch) => {
        setBranches(prev => {
            const exists = prev.find(b => b.id === branchToSave.id);
            if (exists) {
                return prev.map(b => b.id === branchToSave.id ? branchToSave : b);
            }
            return [branchToSave, ...prev];
        });
    };
    
    if (!user) return null;
    const canManage = user.role === 'Admin' || user.role === 'Sales Manager';

    return (
        <div className="flex flex-col h-full">
            <BranchesToolbar onAddBranch={handleSaveBranch} onSearch={setSearchTerm} />
            {filteredBranches.length > 0 ? (
                <div className="flex-grow grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredBranches.map(branch => (
                         <Sheet key={branch.id}>
                            <SheetTrigger asChild>
                               <div><BranchCard branch={branch} /></div>
                            </SheetTrigger>
                            <BranchDetailSheet branch={branch} onEdit={handleSaveBranch} />
                        </Sheet>
                    ))}
                </div>
            ) : (
                <div className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <Building className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Branches Found</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            No branches match your current filters or you have not been assigned to a branch.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
