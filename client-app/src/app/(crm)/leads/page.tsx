
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import type { User, Lead, LeadStatus } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { 
    PlusCircle, Search, ListFilter, Users, Building, Monitor, Phone, Mail, Calendar, 
    MoreHorizontal, Sparkles, CheckCircle, GripVertical, FileText, Clock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';

// --- MOCK DATA ---
const initialLeads: Lead[] = [
  { id: 'lead-1', name: 'Alice Johnson', company: 'Innovate Corp', email: 'alice.j@innovate.com', phone: '555-0101', status: 'New', source: 'Website', owner: { name: 'F. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 85, lastActivity: '2024-07-20T10:00:00Z', nextTask: 'Initial Call', interest: 'Product A' },
  { id: 'lead-2', name: 'Bob Williams', company: 'Solutions Inc', email: 'bob.w@solutions.com', phone: '555-0102', status: 'Contacted', source: 'Referral', owner: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 72, lastActivity: '2024-07-19T14:30:00Z', nextTask: 'Follow-up Email', interest: 'Service B' },
  { id: 'lead-3', name: 'Charlie Brown', company: 'Tech Gadgets', email: 'charlie.b@techgadgets.com', phone: '555-0103', status: 'Qualified', source: 'Exhibition', owner: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 91, lastActivity: '2024-07-18T11:00:00Z', nextTask: 'Send Proposal', interest: 'Product C' },
  { id: 'lead-4', name: 'Diana Miller', company: 'Global Exports', email: 'diana.m@globalexports.com', phone: '555-0104', status: 'Proposal', source: 'Website', owner: { name: 'F. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 78, lastActivity: '2024-07-17T09:00:00Z', nextTask: 'Negotiation Call', interest: 'Product A' },
  { id: 'lead-5', name: 'Eve Davis', company: 'Marketing Pros', email: 'eve.d@marketingpros.com', phone: '555-0105', status: 'Won', source: 'Walk-in', owner: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 95, lastActivity: '2024-07-16T16:00:00Z', nextTask: 'Onboarding', interest: 'Service D' },
  { id: 'lead-6', name: 'Frank White', company: 'Innovate Corp', email: 'frank.w@innovate.com', phone: '555-0106', status: 'Lost', source: 'Referral', owner: { name: 'F. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 45, lastActivity: '2024-07-15T12:00:00Z', nextTask: '-', interest: 'Product B' },
  { id: 'lead-7', name: 'Grace Lee', company: 'Solutions Inc', email: 'grace.l@solutions.com', phone: '555-0107', status: 'New', source: 'Website', owner: { name: 'Admin User', avatar: 'https://placehold.co/40x40.png' }, score: 88, lastActivity: '2024-07-21T09:00:00Z', nextTask: 'Assign to Rep', interest: 'Service C' },
];

const leadStatuses: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

const statusColors: Record<LeadStatus, string> = {
    New: 'bg-blue-500',
    Contacted: 'bg-cyan-500',
    Qualified: 'bg-yellow-500',
    Proposal: 'bg-orange-500',
    Won: 'bg-green-500',
    Lost: 'bg-red-500',
};

// --- SUB-COMPONENTS ---

const LeadsToolbar = ({ onNewLead, onSearch }: { onNewLead: (lead: Lead) => void, onSearch: (term: string) => void }) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex-1">
                <h1 className="text-3xl font-bold tracking-tight">{t('leads.title')}</h1>
                <p className="text-muted-foreground">{t('leads.description')}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="relative flex-1 md:flex-none">
                    <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder={t('leads.search_placeholder')} className="ps-8 w-full md:w-64" onChange={e => onSearch(e.target.value)} />
                </div>
                <Button variant="outline"><ListFilter className="me-2 h-4 w-4" /> {t('leads.filters')}</Button>
                <NewLeadDialog onNewLead={onNewLead} />
            </div>
        </div>
    );
};

const NewLeadDialog = ({ onNewLead }: { onNewLead: (lead: Lead) => void }) => {
    const { user } = useUser();
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newLead: Lead = {
            id: `lead-${Date.now()}`,
            name: formData.get('name') as string,
            company: formData.get('company') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            interest: formData.get('interest') as string,
            status: 'New',
            source: formData.get('source') as Lead['source'],
            owner: user ? { name: user.name, avatar: user.avatar } : { name: 'Unassigned', avatar: '' },
            score: Math.floor(Math.random() * 30) + 60, // Start with a decent score
            lastActivity: new Date().toISOString(),
            nextTask: 'Initial Call',
        };
        onNewLead(newLead);
        setOpen(false);
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><PlusCircle className="me-2 h-4 w-4" /> {t('leads.new_lead')}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('leads.create_new_lead')}</DialogTitle>
                    <DialogDescription>{t('leads.create_new_lead_desc')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-end">{t('leads.name')}</Label>
                        <Input id="name" name="name" className="col-span-3" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="company" className="text-end">{t('leads.company')}</Label>
                        <Input id="company" name="company" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-end">{t('leads.email')}</Label>
                        <Input id="email" name="email" type="email" className="col-span-3" required/>
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-end">{t('leads.phone')}</Label>
                        <Input id="phone" name="phone" className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="interest" className="text-end">{t('leads.interest')}</Label>
                        <Input id="interest" name="interest" className="col-span-3" placeholder={t('leads.interest_placeholder')} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="source" className="text-end">{t('leads.source')}</Label>
                        <Select name="source" required>
                             <SelectTrigger className="col-span-3">
                                <SelectValue placeholder={t('leads.select_source')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Website">{t('common.sources.website')}</SelectItem>
                                <SelectItem value="Referral">{t('common.sources.referral')}</SelectItem>
                                <SelectItem value="Exhibition">{t('common.sources.exhibition')}</SelectItem>
                                <SelectItem value="Walk-in">{t('common.sources.walk_in')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="submit">{t('leads.create_lead_button')}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const LeadCard = ({ lead, onDragStart }: { lead: Lead; onDragStart: (e: React.DragEvent<HTMLDivElement>, leadId: string) => void; }) => {
    const { t } = useTranslation();
    const getScoreColor = (score: number) => {
        if (score > 80) return 'text-green-500';
        if (score > 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const sourceIcons: Record<Lead['source'], React.ElementType> = {
        'Website': Monitor,
        'Referral': Users,
        'Exhibition': Building,
        'Walk-in': Users
    };
    const SourceIcon = sourceIcons[lead.source];

    return (
        <SheetTrigger asChild>
            <div 
                draggable 
                onDragStart={(e) => onDragStart(e, lead.id)}
                className="bg-card p-4 rounded-lg border shadow-sm mb-4 cursor-pointer hover:shadow-md transition-shadow active:cursor-grabbing"
            >
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.company}</p>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={lead.owner.avatar} data-ai-hint="person avatar" />
                                    <AvatarFallback>{lead.owner.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent><p>{lead.owner.name}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <SourceIcon className="h-4 w-4" />
                        <span>{t(`common.sources.${lead.source.toLowerCase().replace('-', '_')}`)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Sparkles className={`h-4 w-4 ${getScoreColor(lead.score)}`} />
                        <span className="font-medium">{lead.score}</span>
                    </div>
                </div>
            </div>
        </SheetTrigger>
    );
};


const LeadDetailSheet = ({ lead }: { lead: Lead | null }) => {
    const { t } = useTranslation();
    if (!lead) return null;
    return (
        <SheetContent className="w-full sm:max-w-lg p-0">
            <SheetHeader className="p-6">
                <SheetTitle className="text-2xl">{lead.name}</SheetTitle>
                <SheetDescription>{lead.company}</SheetDescription>
            </SheetHeader>
            <div className="flex gap-2 p-6 border-y">
                <Button size="sm"><Phone className="me-2"/>{t('leads.call')}</Button>
                <Button size="sm" variant="outline"><Mail className="me-2"/>{t('leads.email')}</Button>
                <Button size="sm" variant="outline"><Calendar className="me-2"/>{t('leads.schedule')}</Button>
                <Button size="sm" variant="outline"><CheckCircle className="me-2"/>{t('leads.convert')}</Button>
            </div>
            <Tabs defaultValue="overview" className="p-6">
                <TabsList>
                    <TabsTrigger value="overview">{t('leads.overview')}</TabsTrigger>
                    <TabsTrigger value="timeline">{t('leads.timeline')}</TabsTrigger>
                    <TabsTrigger value="files">{t('leads.files')}</TabsTrigger>
                    <TabsTrigger value="ai">{t('leads.ai_assistant')}</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="mt-4 space-y-4">
                     <Card>
                         <CardHeader><CardTitle>{t('leads.lead_details')}</CardTitle></CardHeader>
                         <CardContent className="space-y-2 text-sm">
                             <p><strong>{t('leads.email')}:</strong> {lead.email}</p>
                             <p><strong>{t('leads.phone')}:</strong> {lead.phone}</p>
                             <p><strong>{t('leads.interest')}:</strong> {lead.interest}</p>
                             <p><strong>{t('leads.source')}:</strong> {t(`common.sources.${lead.source.toLowerCase().replace('-', '_')}`)}</p>
                             <p><strong>Owner:</strong> {lead.owner.name}</p>
                             <p><strong>{t('leads.ai_score')}:</strong> {lead.score}</p>
                         </CardContent>
                     </Card>
                </TabsContent>
                <TabsContent value="timeline" className="mt-4">
                    <p className="text-muted-foreground">Activity timeline will be shown here.</p>
                </TabsContent>
                <TabsContent value="files" className="mt-4">
                    <p className="text-muted-foreground">File uploads and management will be here.</p>
                </TabsContent>
                 <TabsContent value="ai" className="mt-4">
                    <p className="text-muted-foreground">AI-powered summary and suggestions will appear here.</p>
                </TabsContent>
            </Tabs>
        </SheetContent>
    )
}

const KanbanColumn = ({ status, leads, onDragOver, onDrop }: { status: LeadStatus; leads: Lead[]; onDragOver: (e: React.DragEvent<HTMLDivElement>) => void; onDrop: (e: React.DragEvent<HTMLDivElement>, status: LeadStatus) => void; }) => {
    const { t } = useTranslation();
    return (
        <div 
            className="flex-1 min-w-[300px] h-full"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
        >
            <Card className="bg-muted/50 h-full">
                <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
                        {t(`common.status.${status.toLowerCase()}`)}
                    </CardTitle>
                    <Badge variant="secondary">{leads.length}</Badge>
                </CardHeader>
                <CardContent className="p-4 overflow-y-auto h-[calc(100vh-20rem)]">
                    {leads.length > 0 ? leads.map(lead => (
                        <LeadSheetWrapper key={lead.id} lead={lead} />
                    )) : (
                        <p className="text-sm text-muted-foreground text-center mt-4">{t('leads.drag_leads_here')}</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const LeadSheetWrapper = ({ lead }: { lead: Lead }) => {
    const [dragging, setDragging] = React.useState(false);
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
        setDragging(true);
    };

    const handleDragEnd = () => {
        setDragging(false);
    };

    return (
        <Sheet>
            <div onDragEnd={handleDragEnd}>
                 <LeadCard lead={lead} onDragStart={handleDragStart} />
            </div>
             {!dragging && <LeadDetailSheet lead={lead} />}
        </Sheet>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function LeadsPage() {
    const { user } = useUser();
    const [leads, setLeads] = React.useState<Lead[]>(initialLeads);
    const [filteredLeads, setFilteredLeads] = React.useState<Lead[]>(initialLeads);

    React.useEffect(() => {
        if (user) {
            if (user.role === 'Admin' || user.role === 'Sales Manager') {
                setLeads(initialLeads);
                setFilteredLeads(initialLeads);
            } else {
                const userLeads = initialLeads.filter(l => l.owner.name === user.name);
                setLeads(userLeads);
                setFilteredLeads(userLeads);
            }
        }
    }, [user]);

    const handleSearch = (term: string) => {
        const lowercasedTerm = term.toLowerCase();
        const results = leads.filter(lead => 
            lead.name.toLowerCase().includes(lowercasedTerm) ||
            lead.company.toLowerCase().includes(lowercasedTerm) ||
            lead.email.toLowerCase().includes(lowercasedTerm)
        );
        setFilteredLeads(results);
    };
    
    const handleNewLead = (newLead: Lead) => {
        const updatedLeads = [...leads, newLead];
        setLeads(updatedLeads);
        setFilteredLeads(updatedLeads);
    };
    
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, leadId: string) => {
        e.dataTransfer.setData('leadId', leadId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: LeadStatus) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        
        setLeads(prev => {
            const updated = prev.map(lead => {
                if (lead.id === leadId) {
                    return { ...lead, status: newStatus };
                }
                return lead;
            });
            // Also update the filtered list to reflect change immediately
            setFilteredLeads(updated);
            return updated;
        });
    };
    
    const leadsByStatus = React.useMemo(() => {
        return leadStatuses.reduce((acc, status) => {
            acc[status] = filteredLeads.filter(lead => lead.status === status);
            return acc;
        }, {} as Record<LeadStatus, Lead[]>);
    }, [filteredLeads]);


    if (!user) return null;

    return (
        <div className="flex flex-col h-full">
            <LeadsToolbar onNewLead={handleNewLead} onSearch={handleSearch} />
            <div className="flex-grow flex gap-6 overflow-x-auto pb-4">
                {leadStatuses.map(status => (
                    <KanbanColumn 
                        key={status} 
                        status={status}
                        leads={leadsByStatus[status]}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    />
                ))}
            </div>
        </div>
    );
}
