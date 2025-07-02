
'use client';

import * as React from 'react';
import type { TeamMember, Department, TeamMemberPermission } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { 
    Search, LayoutGrid, Network, ChevronDown, ChevronRight, Mail, Phone, MessageSquare, Briefcase, MapPin, User, ArrowRight,
    PlusCircle, Edit, Trash2, MoreVertical, UserPlus, FolderPlus
} from 'lucide-react';

// --- MOCK DATA ---
const initialDepartments: Department[] = [
    { id: 'd1', name: 'Executive', color: 'bg-purple-500', parentId: null },
    { id: 'd2', name: 'Sales', color: 'bg-blue-500', parentId: null },
    { id: 'd3', name: 'Marketing', color: 'bg-green-500', parentId: null },
    { id: 'd4', name: 'Engineering', color: 'bg-orange-500', parentId: null },
];

const initialTeam: TeamMember[] = [
    { id: '1', name: 'Admin User', position: 'CEO', email: 'ceo@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd1', reportsTo: null, location: 'HQ', tags: ['Executive'], permissions: ['add_user', 'edit_team', 'view_reports'] },
    { id: '2', name: 'S. Manager', position: 'Head of Sales', email: 's.manager@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd2', reportsTo: '1', location: 'HQ', tags: ['Manager'], permissions: ['add_user', 'edit_team'] },
    { id: '3', name: 'S. Rep', position: 'Showroom Rep', email: 's.rep@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd2', reportsTo: '2', location: 'Riyadh Branch', tags: ['Sales'], permissions: ['view_reports'] },
    { id: '4', name: 'F. Rep', position: 'Field Rep', email: 'f.rep@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd2', reportsTo: '2', location: 'Jeddah Branch', tags: ['Sales'], permissions: ['view_reports'] },
    { id: '5', name: 'Marketing Lead', position: 'Head of Marketing', email: 'm.lead@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd3', reportsTo: '1', location: 'HQ', tags: ['Manager'], permissions: ['add_user'] },
    { id: '6', name: 'Content Creator', position: 'Content Creator', email: 'c.creator@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd3', reportsTo: '5', location: 'Remote', tags: ['Marketing'] },
    { id: '7', name: 'Lead Engineer', position: 'Head of Engineering', email: 'l.eng@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd4', reportsTo: '1', location: 'HQ', tags: ['Manager', 'Tech'], permissions: ['add_user', 'edit_team'] },
    { id: '8', name: 'Frontend Developer', position: 'Frontend Developer', email: 'f.dev@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd4', reportsTo: '7', location: 'Remote', tags: ['Tech', 'Developer'] },
    { id: '9', name: 'Backend Developer', position: 'Backend Developer', email: 'b.dev@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd4', reportsTo: '7', location: 'Remote', tags: ['Tech', 'Developer'] },
    { id: '10', name: 'Accountant', position: 'Senior Accountant', email: 'accountant@lcuzr.com', avatar: 'https://placehold.co/100x100.png', departmentId: 'd1', reportsTo: '1', location: 'HQ', tags: ['Finance'] },
];


const buildTree = (members: TeamMember[]): TeamMember[] => {
    const memberMap = new Map(members.map(m => [m.id, { ...m, children: [] as TeamMember[] }]));
    const tree: TeamMember[] = [];
    
    for (const member of memberMap.values()) {
        if (member.reportsTo && memberMap.has(member.reportsTo)) {
            const manager = memberMap.get(member.reportsTo);
            if (manager) {
                 manager.children.push(member);
            }
        } else {
            tree.push(member);
        }
    }
    return tree;
};

// --- Sub-Components ---

const Toolbar = ({ onAddMember, onAddDepartment, onSearch, onFilterChange, setViewMode, viewMode }: any) => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Team Structure</h1>
            <p className="text-muted-foreground">Visualize, manage, and explore your organization's hierarchy.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 md:flex-none">
                <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search members..." className="ps-8 w-full md:w-64" onChange={(e) => onSearch(e.target.value)} />
            </div>
            <Select onValueChange={onFilterChange} defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]"><SelectValue placeholder="Filter by Department" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {initialDepartments.map(dept => <SelectItem key={dept.id} value={dept.id}>{dept.name}</SelectItem>)}
                </SelectContent>
            </Select>
            <div className="flex items-center rounded-md border p-1">
                <Button variant={viewMode === 'tree' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('tree')}><Network className="h-4 w-4" /></Button>
                <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}><LayoutGrid className="h-4 w-4" /></Button>
            </div>
             <Button variant="outline" onClick={onAddDepartment} className="gap-2"><FolderPlus /> Add Department</Button>
            <Button onClick={onAddMember} className="gap-2"><UserPlus /> Add Member</Button>
        </div>
    </div>
);

const MemberFormDialog = ({ isOpen, setIsOpen, member, onSave, allMembers, departments }: { isOpen: boolean, setIsOpen: (o: boolean) => void, member: Partial<TeamMember> | null, onSave: (m: TeamMember) => void, allMembers: TeamMember[], departments: Department[] }) => {
    const [formData, setFormData] = React.useState<Partial<TeamMember>>({});
    
    React.useEffect(() => {
        if(isOpen) setFormData(member || {});
    }, [isOpen, member]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: keyof TeamMember, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalMember: TeamMember = {
            id: formData.id || `user-${Date.now()}`,
            avatar: formData.avatar || 'https://placehold.co/100x100.png',
            tags: formData.tags || [],
            ...formData,
        } as TeamMember;
        onSave(finalMember);
        setIsOpen(false);
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{member?.id ? 'Edit Team Member' : 'Add New Team Member'}</DialogTitle>
                </DialogHeader>
                 <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name || ''} onChange={handleChange} required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="position">Position / Title</Label>
                        <Input id="position" name="position" value={formData.position || ''} onChange={handleChange} required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleChange} required />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div className="grid gap-2">
                            <Label htmlFor="departmentId">Department</Label>
                            <Select name="departmentId" value={formData.departmentId} onValueChange={v => handleSelectChange('departmentId', v)}>
                                <SelectTrigger><SelectValue placeholder="Select department..." /></SelectTrigger>
                                <SelectContent>{departments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="reportsTo">Reports To</Label>
                             <Select name="reportsTo" value={formData.reportsTo || undefined} onValueChange={v => handleSelectChange('reportsTo', v)}>
                                <SelectTrigger><SelectValue placeholder="Select manager..." /></SelectTrigger>
                                <SelectContent>{allMembers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Member</Button>
                    </DialogFooter>
                 </form>
            </DialogContent>
        </Dialog>
    );
};

const DeleteConfirmationDialog = ({ isOpen, setIsOpen, onConfirm, itemName }: { isOpen: boolean, setIsOpen: (o: boolean) => void, onConfirm: () => void, itemName: string }) => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    This action cannot be undone. This will permanently delete <strong>{itemName}</strong>.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={() => { onConfirm(); setIsOpen(false); }}>Delete</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);


const MemberCard = ({ member, department, onEdit, onDelete }: { member: TeamMember, department?: Department, onEdit: () => void, onDelete: () => void }) => (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-2 end-2 h-7 w-7"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={onEdit} className="gap-2"><Edit />Edit</DropdownMenuItem>
                <DropdownMenuItem onSelect={onDelete} className="text-destructive focus:text-destructive gap-2"><Trash2 />Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <div className={cn("h-2 w-full", department?.color)}></div>
        <CardContent className="p-4 text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-background -mt-14 shadow-md">
                <AvatarImage src={member.avatar} alt={member.name} data-ai-hint="person face" />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-primary">{member.position}</p>
            <p className="text-sm text-muted-foreground mt-1">{department?.name}</p>
        </CardContent>
        <CardFooter className="p-2 bg-muted/50 flex justify-center gap-1">
             <Button variant="ghost" size="icon"><Mail className="h-4 w-4" /></Button>
             <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
             <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
        </CardFooter>
    </Card>
);

const TreeNode = ({ node, departments, expandedNodes, toggleNode, onEdit, onDelete }: { node: TeamMember, departments: Department[], expandedNodes: Record<string, boolean>, toggleNode: (id: string) => void, onEdit: (m: TeamMember) => void, onDelete: (m: TeamMember) => void }) => {
    const isExpanded = expandedNodes[node.id] ?? false;
    const department = departments.find(d => d.id === node.departmentId);

    return (
        <li className="relative group/treenode">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 flex justify-center">
                    {node.children && node.children.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={() => toggleNode(node.id)} className="h-8 w-8">
                            {isExpanded ? <ChevronDown className="rtl:-scale-x-100"/> : <ChevronRight className="rtl:-scale-x-100"/>}
                        </Button>
                    )}
                </div>
                <div className={cn("my-2 w-72 p-3 rounded-lg border flex items-center gap-3 relative", department?.color.replace('bg-', 'border-'))}>
                    <Avatar>
                        <AvatarImage src={node.avatar} alt={node.name} data-ai-hint="person face" />
                        <AvatarFallback>{node.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{node.name}</p>
                        <p className="text-sm text-muted-foreground">{node.position}</p>
                    </div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="absolute top-1 end-1 h-7 w-7 opacity-0 group-hover/treenode:opacity-100"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => onEdit(node)} className="gap-2"><Edit />Edit</DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => onDelete(node)} className="text-destructive focus:text-destructive gap-2"><Trash2 />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {isExpanded && node.children && node.children.length > 0 && (
                <ul className="ps-12 border-s-2 border-dashed ms-6">
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} departments={departments} expandedNodes={expandedNodes} toggleNode={toggleNode} onEdit={onEdit} onDelete={onDelete} />
                    ))}
                </ul>
            )}
        </li>
    );
};

// --- Main Page Component ---
export default function TeamStructurePage() {
    const { toast } = useToast();
    const [viewMode, setViewMode] = React.useState<'tree' | 'grid'>('tree');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [departmentFilter, setDepartmentFilter] = React.useState('all');
    
    const [members, setMembers] = React.useState<TeamMember[]>(initialTeam);
    const [departments, setDepartments] = React.useState<Department[]>(initialDepartments);
    
    const [isMemberDialogOpen, setIsMemberDialogOpen] = React.useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = React.useState(false);
    const [currentItem, setCurrentItem] = React.useState<TeamMember | null>(null);

    const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({'1': true, '2': true, '5': true, '7': true });
    const toggleNode = (id: string) => {
        setExpandedNodes(prev => ({...prev, [id]: !prev[id]}));
    };
    
    const filteredMembers = React.useMemo(() => {
        return members.filter(member => {
            const matchesSearch = searchTerm === '' || member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.position.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = departmentFilter === 'all' || member.departmentId === departmentFilter;
            return matchesSearch && matchesDept;
        });
    }, [searchTerm, departmentFilter, members]);

    const treeData = React.useMemo(() => buildTree(members), [members]);

    const handleSaveMember = (memberToSave: TeamMember) => {
        setMembers(prev => {
            const exists = prev.some(m => m.id === memberToSave.id);
            if (exists) {
                toast({ title: "Member Updated", description: `${memberToSave.name}'s details have been updated.` });
                return prev.map(m => m.id === memberToSave.id ? memberToSave : m);
            }
            toast({ title: "Member Added", description: `${memberToSave.name} has been added to the team.` });
            return [...prev, memberToSave];
        });
        setCurrentItem(null);
    };

    const handleDelete = () => {
        if (!currentItem) return;
        setMembers(prev => prev.filter(m => m.id !== currentItem.id));
        toast({ title: "Member Removed", description: `${currentItem.name} has been removed.` });
        setCurrentItem(null);
    };
    
    const handleEdit = (member: TeamMember) => {
        setCurrentItem(member);
        setIsMemberDialogOpen(true);
    };
    
    const handleAdd = () => {
        setCurrentItem(null);
        setIsMemberDialogOpen(true);
    }
    
    const handleDeleteClick = (member: TeamMember) => {
        setCurrentItem(member);
        setIsDeleteConfirmationOpen(true);
    };

    return (
        <div className="flex-1 space-y-6">
            <Toolbar 
                onAddMember={handleAdd}
                onAddDepartment={() => alert('Add department functionality coming soon!')}
                onSearch={setSearchTerm}
                onFilterChange={setDepartmentFilter}
                setViewMode={setViewMode}
                viewMode={viewMode}
            />

            {viewMode === 'tree' && (
                <Card>
                    <CardContent className="p-6 overflow-x-auto">
                        <ul>
                            {treeData.map(rootNode => (
                                <TreeNode key={rootNode.id} node={rootNode} departments={departments} expandedNodes={expandedNodes} toggleNode={toggleNode} onEdit={handleEdit} onDelete={handleDeleteClick} />
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {viewMode === 'grid' && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredMembers.map(member => {
                        const department = departments.find(d => d.id === member.departmentId);
                        return <MemberCard key={member.id} member={member} department={department} onEdit={() => handleEdit(member)} onDelete={() => handleDeleteClick(member)} />;
                    })}
                </div>
            )}
            
            <MemberFormDialog
                isOpen={isMemberDialogOpen}
                setIsOpen={setIsMemberDialogOpen}
                member={currentItem}
                onSave={handleSaveMember}
                allMembers={members}
                departments={departments}
            />
            
            <DeleteConfirmationDialog 
                isOpen={isDeleteConfirmationOpen}
                setIsOpen={setIsDeleteConfirmationOpen}
                onConfirm={handleDelete}
                itemName={currentItem?.name || ''}
            />
        </div>
    );
}
