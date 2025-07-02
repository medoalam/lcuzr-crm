
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import type { User, Deal, DealStatus } from '@/lib/types';
import { addDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

import { 
    Download, List, Calendar, Map, Handshake, DollarSign, TrendingUp, Target, Bot, CheckCircle, XCircle, Clock, PlusCircle, UserCheck, Navigation
} from 'lucide-react';

// --- MOCK DATA ---

const allDeals: Deal[] = [
  { id: 'deal-101', name: 'Innovate Corp Website', client: 'Alice Johnson', amount: 15000, status: 'Proposal', rep: { name: 'F. Rep', avatar: 'https://placehold.co/40x40.png' }, createdDate: '2024-07-15', probability: 75, lastUpdate: '2024-07-20' },
  { id: 'deal-102', name: 'Solutions Inc SEO', client: 'Bob Williams', amount: 8000, status: 'Negotiation', rep: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, createdDate: '2024-07-12', probability: 90, lastUpdate: '2024-07-21' },
  { id: 'deal-103', name: 'Tech Gadgets Branding', client: 'Charlie Brown', amount: 22000, status: 'Won', rep: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, createdDate: '2024-06-20', probability: 100, lastUpdate: '2024-07-18' },
  { id: 'deal-104', name: 'Global Exports Logistics', client: 'Diana Miller', amount: 35000, status: 'Lost', rep: { name: 'F. Rep', avatar: 'https://placehold.co/40x40.png' }, createdDate: '2024-06-10', probability: 0, lastUpdate: '2024-07-10' },
  { id: 'deal-105', name: 'Marketing Pros Campaign', client: 'Eve Davis', amount: 12500, status: 'Quotation', rep: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, createdDate: '2024-07-18', probability: 50, lastUpdate: '2024-07-19' },
  { id: 'deal-106', name: 'Innovate Corp App', client: 'Frank White', amount: 45000, status: 'Quotation', rep: { name: 'F. Rep', avatar: 'https://placehold.co/40x40.png' }, createdDate: '2024-07-20', probability: 60, lastUpdate: '2024-07-21' },
];

const showroomWalkins = [
    { id: 'walk-1', customer: 'Ken Adams', interest: 'Product C', status: 'Quoted', rep: 'S. Rep', time: '11:30 AM' },
    { id: 'walk-2', customer: 'Linda Harris', interest: 'Service B', status: 'Browsing', rep: 'S. Rep', time: '01:45 PM' },
    { id: 'walk-3', customer: 'Mike Urban', interest: 'Product A', status: 'Deal Won', rep: 'S. Rep', time: '03:00 PM' },
];

const fieldVisits = [
    { id: 'visit-1', client: 'Global Exports', location: '123 Business Rd', status: 'Completed', purpose: 'Final Negotiation', time: '10:00 AM' },
    { id: 'visit-2', client: 'Innovate Corp', location: '456 Tech Park', status: 'Scheduled', purpose: 'Initial Pitch', time: '02:30 PM' },
]

const performanceData = [
    { rank: 1, rep: 'F. Rep', deals: 25, closeRate: 0.35, avgDeal: 28000 },
    { rank: 2, rep: 'S. Rep', deals: 42, closeRate: 0.28, avgDeal: 19500 },
];

const dealStatusOptions: DealStatus[] = ['Quotation', 'Proposal', 'Negotiation', 'Won', 'Lost'];

const statusConfig: Record<DealStatus, { icon: React.ElementType; color: string; }> = {
    Quotation: { icon: Clock, color: 'text-gray-500' },
    Proposal: { icon: UserCheck, color: 'text-blue-500' },
    Negotiation: { icon: Handshake, color: 'text-yellow-500' },
    Won: { icon: CheckCircle, color: 'text-green-500' },
    Lost: { icon: XCircle, color: 'text-red-500' },
};


// --- SUB-COMPONENTS ---

const SalesHeader = ({ onNewDeal }: { onNewDeal: (deal: Deal) => void }) => (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Tracker</h1>
            <p className="text-muted-foreground">Monitor and manage your entire sales pipeline.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" className="gap-2"><List/> List</Button>
            <Button variant="ghost" className="gap-2"><Calendar/> Calendar</Button>
            <Button variant="ghost" className="gap-2"><Map/> Map</Button>
            <NewDealDialog onNewDeal={onNewDeal} />
        </div>
    </div>
);

const KpiCard = ({ title, value, change, icon: Icon }: { title: string; value: string; change: string; icon: React.ElementType }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{change}</p>
    </CardContent>
  </Card>
);

const NewDealDialog = ({ onNewDeal }: { onNewDeal: (deal: Deal) => void }) => {
    const { user } = useUser();
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newDeal: Deal = {
            id: `deal-${Date.now()}`,
            name: formData.get('name') as string,
            client: formData.get('client') as string,
            amount: parseFloat(formData.get('amount') as string),
            status: 'Quotation',
            rep: user ? { name: user.name, avatar: user.avatar } : { name: 'Unassigned', avatar: '' },
            createdDate: new Date().toISOString().split('T')[0],
            probability: 20,
            lastUpdate: new Date().toISOString().split('T')[0],
        };
        onNewDeal(newDeal);
        setOpen(false);
        event.currentTarget.reset();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2"><PlusCircle /> New Deal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create a New Deal</DialogTitle>
                    <DialogDescription>Fill in the details to add a new deal.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-end">Deal Name</Label>
                        <Input id="name" name="name" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="client" className="text-end">Client Name</Label>
                        <Input id="client" name="client" className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-end">Amount ($)</Label>
                        <Input id="amount" name="amount" type="number" className="col-span-3" required />
                    </div>
                     <DialogFooter>
                        <Button type="submit">Create Deal</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};


const SalesDataTable = ({ deals }: { deals: Deal[] }) => (
    <Card>
        <CardHeader>
            <CardTitle>All Deals</CardTitle>
            <CardDescription>Comprehensive list of all sales activities.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Deal Name</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rep</TableHead>
                        <TableHead className="text-end">Amount</TableHead>
                        <TableHead className="text-end">Close Probability</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {deals.map(deal => {
                        const Icon = statusConfig[deal.status].icon;
                        const color = statusConfig[deal.status].color;
                        return (
                            <TableRow key={deal.id}>
                                <TableCell className="font-medium">{deal.name}</TableCell>
                                <TableCell>{deal.client}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Icon className={`h-4 w-4 ${color}`} />
                                        <span className={color}>{deal.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={deal.rep.avatar} data-ai-hint="person avatar" />
                                            <AvatarFallback>{deal.rep.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span>{deal.rep.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-end">${deal.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-end font-medium">{deal.probability}%</TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const FieldRepView = () => (
    <Card>
        <CardHeader>
            <CardTitle>Field Operations</CardTitle>
            <CardDescription>Your daily route and visit summary.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map View of Today's Route</p>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Visit Log</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Client</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Time</TableHead>
                             <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                       {fieldVisits.map(visit => (
                           <TableRow key={visit.id}>
                               <TableCell>{visit.client}</TableCell>
                               <TableCell><Badge variant={visit.status === 'Completed' ? 'default' : 'outline'}>{visit.status}</Badge></TableCell>
                               <TableCell>{visit.time}</TableCell>
                               <TableCell className="text-end">
                                   <Button variant="ghost" size="sm" className="gap-2"><Navigation /> Navigate</Button>
                               </TableCell>
                           </TableRow>
                       ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
    </Card>
);

const ShowroomRepView = () => (
    <Card>
        <CardHeader>
            <CardTitle>Showroom Activity</CardTitle>
            <CardDescription>Log of walk-ins and deals for today.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {showroomWalkins.map(walkin => (
                        <TableRow key={walkin.id}>
                            <TableCell>{walkin.customer}</TableCell>
                            <TableCell>{walkin.interest}</TableCell>
                            <TableCell><Badge variant="outline">{walkin.status}</Badge></TableCell>
                            <TableCell>{walkin.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const PerformanceLeaderboard = () => (
    <Card>
        <CardHeader>
            <CardTitle>Rep Performance</CardTitle>
            <CardDescription>Leaderboard based on this month's performance.</CardDescription>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Rep</TableHead>
                        <TableHead>Deals</TableHead>
                        <TableHead>Close Rate</TableHead>
                        <TableHead className="text-end">Avg. Deal</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {performanceData.map(rep => (
                        <TableRow key={rep.rank}>
                            <TableCell className="font-bold">#{rep.rank}</TableCell>
                            <TableCell>{rep.rep}</TableCell>
                            <TableCell>{rep.deals}</TableCell>
                            <TableCell>{(rep.closeRate * 100).toFixed(0)}%</TableCell>
                            <TableCell className="text-end">${rep.avgDeal.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);

const AiSalesInsights = () => (
    <Card className="h-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> AI Sales Assistant</CardTitle>
            <CardDescription>Actionable insights for your sales pipeline.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
            <div className="flex-grow space-y-4 text-sm overflow-y-auto pe-2">
                <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="font-semibold text-accent-foreground">Forecast</p>
                    <p className="text-muted-foreground">Deal closure rate is projected to increase by 5% next week.</p>
                </div>
                 <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="font-semibold text-accent-foreground">Opportunity</p>
                    <p className="text-muted-foreground">Client 'Innovate Corp' has a new quotation. Suggest upselling 'Service B'.</p>
                </div>
                 <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="font-semibold text-accent-foreground">Risk Alert</p>
                    <p className="text-muted-foreground">Deal 'Solutions Inc SEO' has been in negotiation for 9 days. Recommend a follow-up call.</p>
                </div>
            </div>
            <div className="mt-4 space-y-2">
                <Textarea placeholder="Ask AI: e.g., 'Which deals are at risk of being lost?'" />
                <Button className="w-full">Get Insight</Button>
            </div>
        </CardContent>
    </Card>
)

// --- MAIN PAGE COMPONENT ---

export default function SalesPage() {
    const { user } = useUser();
    const [deals, setDeals] = React.useState<Deal[]>(allDeals);
    const [date, setDate] = React.useState<DateRange | undefined>({ from: addDays(new Date(), -29), to: new Date() });

    const userDeals = React.useMemo(() => {
        if (!user) return [];
        if (user.role === 'Admin' || user.role === 'Sales Manager') return deals;
        return deals.filter(d => d.rep.name === user.name);
    }, [user, deals]);

    const handleNewDeal = (newDeal: Deal) => {
        setDeals(prev => [newDeal, ...prev]);
    }

    if (!user) return null;

    const dealStats = {
        total: userDeals.length,
        open: userDeals.filter(d => d.status !== 'Won' && d.status !== 'Lost').length,
        won: userDeals.filter(d => d.status === 'Won').length,
        lost: userDeals.filter(d => d.status === 'Lost').length,
    }

    return (
        <div className="flex-1 space-y-6">
            <SalesHeader onNewDeal={handleNewDeal} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title="Total Deals" value={dealStats.total.toString()} change="+10.2% this month" icon={Handshake} />
                <KpiCard title="Open Deals" value={dealStats.open.toString()} change="5 waiting for proposal" icon={Clock} />
                <KpiCard title="Deals Won" value={dealStats.won.toString()} change="+15% vs last month" icon={CheckCircle} />
                <KpiCard title="Deals Lost" value={dealStats.lost.toString()} change="-5% vs last month" icon={XCircle} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                   { (user.role === 'Admin' || user.role === 'Sales Manager') && (
                       <div className="grid md:grid-cols-2 gap-6">
                           <PerformanceLeaderboard />
                            <Card>
                                <CardHeader><CardTitle>Revenue by Rep</CardTitle></CardHeader>
                                <CardContent>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={performanceData.map(d => ({ name: d.rep, Revenue: d.avgDeal * d.deals }))}>
                                            <XAxis dataKey="name" fontSize={12} />
                                            <YAxis fontSize={12} tickFormatter={(value) => `$${Number(value)/1000}k`} />
                                            <Tooltip />
                                            <Bar dataKey="Revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                       </div>
                   )}

                    { user.role === 'Field Rep' && <FieldRepView /> }
                    { user.role === 'Showroom Rep' && <ShowroomRepView /> }
                    
                    <SalesDataTable deals={userDeals} />

                </div>
                 <div className="lg:col-span-1">
                    <AiSalesInsights />
                </div>
            </div>
        </div>
    );
}
