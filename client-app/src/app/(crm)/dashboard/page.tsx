
'use client';
import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
    BarChart as BarChartIcon, Bot, DollarSign, Users, Activity, Navigation, PlusCircle,
    ShieldCheck, RefreshCw, AlertTriangle, CheckCircle, Download, UserPlus, Send, Lock
} from 'lucide-react';
import { AreaChart, Area, Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

import { CreateLeadSheet } from '@/components/crm/create-lead-sheet';
import { AddQuotationSheet } from '@/components/crm/add-quotation-sheet';
import { AssignTaskSheet } from '@/components/crm/assign-task-sheet';
import { useTranslation, Trans } from 'react-i18next';
import { motion } from 'framer-motion';


const salesData = [
  { name: 'Jan', total: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 4000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 4000) + 1000 },
];

const leadData = [
  { name: 'Alice Johnson', email: 'a.j@example.com', status: 'New', score: 88 },
  { name: 'Bob Williams', email: 'b.w@example.com', status: 'Contacted', score: 72 },
  { name: 'Charlie Brown', email: 'c.b@example.com', status: 'Qualified', score: 95 },
  { name: 'Diana Miller', email: 'd.m@example.com', status: 'Proposal', score: 65 },
  { name: 'Eve Davis', email: 'e.d@example.com', status: 'New', score: 91 },
];

const KpiCard = ({ title, value, icon: Icon, trend, description }: { title: string, value: string, icon: React.ElementType, trend: string, description: string }) => (
    <motion.div whileHover={{ translateY: -5, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{trend} {description}</p>
            </CardContent>
        </Card>
    </motion.div>
);

export default function DashboardPage() {
    const { user } = useUser();
    const { t } = useTranslation();
    const [isLeadSheetOpen, setLeadSheetOpen] = React.useState(false);
    const [isQuoteSheetOpen, setQuoteSheetOpen] = React.useState(false);
    const [isTaskSheetOpen, setTaskSheetOpen] = React.useState(false);
    
    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey) {
                switch(event.key.toLowerCase()) {
                    case 'l':
                        event.preventDefault();
                        setLeadSheetOpen(true);
                        break;
                    case 'q':
                        event.preventDefault();
                        setQuoteSheetOpen(true);
                        break;
                    case 't':
                        event.preventDefault();
                        setTaskSheetOpen(true);
                        break;
                }
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!user) return null;

    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
                    <p className="text-muted-foreground">{t('dashboard.welcome', { name: user.name })}</p>
                </div>
                 <div className="flex flex-wrap items-center gap-2">
                    <CreateLeadSheet open={isLeadSheetOpen} onOpenChange={setLeadSheetOpen}>
                        <Button>
                            <PlusCircle className="me-2 h-4 w-4" /> {t('dashboard.create_lead')}
                        </Button>
                    </CreateLeadSheet>
                    <AddQuotationSheet open={isQuoteSheetOpen} onOpenChange={setQuoteSheetOpen}>
                        <Button variant="outline">
                            <PlusCircle className="me-2 h-4 w-4" /> {t('dashboard.add_quotation')}
                        </Button>
                    </AddQuotationSheet>
                    <AssignTaskSheet open={isTaskSheetOpen} onOpenChange={setTaskSheetOpen}>
                        <Button variant="outline">
                            <PlusCircle className="me-2 h-4 w-4" /> {t('dashboard.assign_task')}
                        </Button>
                    </AssignTaskSheet>
                </div>
            </div>
            
            {user.role === 'Admin' && <AdminDashboard />}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KpiCard title={t('dashboard.total_revenue')} value="$45,231.89" icon={DollarSign} trend="+20.1%" description={t('dashboard.from_last_month')} />
                <KpiCard title={t('dashboard.active_leads')} value="+2350" icon={Users} trend="+180.1%" description={t('dashboard.from_last_month')} />
                <KpiCard title={t('dashboard.conversion_rate')} value="12.57%" icon={BarChartIcon} trend="+19%" description={t('dashboard.from_last_month')} />
                <KpiCard title={t('dashboard.sales')} value="+12,234" icon={Activity} trend="+5.2%" description={t('dashboard.from_last_month')} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('dashboard.revenue_overview')}</CardTitle>
                    </CardHeader>
                    <CardContent className="ps-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={salesData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        borderColor: 'hsl(var(--border))'
                                    }}
                                />
                                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t('dashboard.recent_leads')}</CardTitle>
                        <CardDescription>{t('dashboard.you_have_n_active_leads', { count: leadData.length })}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>{t('dashboard.customer')}</TableHead>
                                   <TableHead>{t('dashboard.status')}</TableHead>
                                   <TableHead className="text-end">{t('dashboard.score')}</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                               {leadData.map(lead => (
                                   <TableRow key={lead.email}>
                                       <TableCell>
                                           <div className="font-medium">{lead.name}</div>
                                           <div className="text-sm text-muted-foreground">{lead.email}</div>
                                       </TableCell>
                                       <TableCell><Badge variant="outline">{t(`common.status.${lead.status.toLowerCase()}`)}</Badge></TableCell>
                                       <TableCell className="text-end">{lead.score}</TableCell>
                                   </TableRow>
                               ))}
                           </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </div>
            
            {user.role === 'Sales Manager' && <SalesManagerDashboard />}
            {user.role === 'Showroom Rep' && <ShowroomRepDashboard />}
            {user.role === 'Field Rep' && <FieldRepDashboard />}
        </div>
    );
}

const BusinessPulseCard = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t('dashboard.admin_cockpit.business_pulse')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="text-2xl font-bold">$1.2M <span className="text-sm font-normal text-muted-foreground">{t('dashboard.admin_cockpit.per_month')}</span></div>
                <div className="text-xs text-muted-foreground grid grid-cols-2 gap-x-2 gap-y-1">
                    <p><strong>78</strong> {t('dashboard.admin_cockpit.new_leads_today')}</p>
                    <p><strong>23.5%</strong> {t('dashboard.admin_cockpit.conv_rate')}</p>
                    <p><strong>42</strong> {t('dashboard.admin_cockpit.active_quotes')}</p>
                    <p><strong>Riyadh</strong> {t('dashboard.admin_cockpit.top_branch')}</p>
                </div>
            </CardContent>
        </Card>
    )
};

const SystemHealthCard = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t('dashboard.admin_cockpit.system_health')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                 <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="text-green-500 h-4 w-4"/> {t('dashboard.admin_cockpit.crm_status')}</span>
                    <span className="font-semibold text-green-500">{t('dashboard.admin_cockpit.nominal')}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><RefreshCw className="h-4 w-4"/> {t('dashboard.admin_cockpit.last_sync')}</span>
                    <span className="font-semibold">2m {t('dashboard.admin_cockpit.ago')}</span>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4"/> {t('dashboard.admin_cockpit.inactive_users')}</span>
                    <span className="font-semibold">3</span>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground"><AlertTriangle className="text-yellow-500 h-4 w-4"/> {t('dashboard.admin_cockpit.failed_jobs')}</span>
                    <span className="font-semibold">1</span>
                </div>
            </CardContent>
        </Card>
    );
};

const TeamSnapshotCard = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t('dashboard.admin_cockpit.team_snapshot')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('dashboard.admin_cockpit.online_staff')}</span>
                    <span className="font-semibold">34 / 52</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('dashboard.admin_cockpit.most_active')}</span>
                    <span className="font-semibold">S. Rep</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('dashboard.admin_cockpit.late_follow_ups')}</span>
                    <span className="font-semibold text-red-500">12</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t('dashboard.admin_cockpit.unassigned_leads')}</span>
                    <span className="font-semibold text-orange-500">5</span>
                </div>
            </CardContent>
        </Card>
    );
};

const AdminActionsCard = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{t('dashboard.admin_cockpit.quick_actions')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm"><UserPlus /> {t('dashboard.admin_cockpit.add_user')}</Button>
                <Button variant="outline" size="sm"><ShieldCheck /> {t('dashboard.admin_cockpit.roles')}</Button>
                <Button variant="outline" size="sm"><Download /> {t('dashboard.admin_cockpit.export')}</Button>
                <Button variant="outline" size="sm"><Send /> {t('dashboard.admin_cockpit.broadcast')}</Button>
                <Button variant="destructive" size="sm" className="col-span-2 mt-2"><Lock /> {t('dashboard.admin_cockpit.lockdown')}</Button>
            </CardContent>
        </Card>
    );
};

const AdminDashboard = () => {
    const { t } = useTranslation();
    return (
        <Card className="border-primary/20 border-2 mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                    <ShieldCheck className="text-primary h-6 w-6" />
                    {t('dashboard.admin_cockpit.title')}
                </CardTitle>
                <CardDescription>
                    {t('dashboard.admin_cockpit.description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="p-4 border-s-4 border-yellow-500 bg-yellow-500/10 rounded-e-lg">
                    <h3 className="flex items-center gap-2 font-semibold text-yellow-800"><AlertTriangle /> {t('dashboard.admin_cockpit.critical_alerts', { count: 2 })}</h3>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1 text-yellow-700">
                        <li><Trans i18nKey="dashboard.admin_cockpit.alert1_text" count={5}><a href="/leads" className="underline font-medium hover:text-yellow-900">Assign Now</a></Trans></li>
                        <li><Trans i18nKey="dashboard.admin_cockpit.alert2_text" count={3}><a href="/sales" className="underline font-medium hover:text-yellow-900">Review</a></Trans></li>
                    </ul>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <BusinessPulseCard />
                    <SystemHealthCard />
                    <TeamSnapshotCard />
                    <AdminActionsCard />
                </div>
            </CardContent>
        </Card>
    );
};


const SalesManagerDashboard = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader><CardTitle>{t('dashboard.sales_manager_overview.title')}</CardTitle></CardHeader>
            <CardContent><p>{t('dashboard.sales_manager_overview.description')}</p></CardContent>
        </Card>
    );
};

const ShowroomRepDashboard = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader><CardTitle>{t('dashboard.showroom_rep_overview.title')}</CardTitle></CardHeader>
            <CardContent><p>{t('dashboard.showroom_rep_overview.description')}</p></CardContent>
        </Card>
    );
};

const FieldRepDashboard = () => {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader><CardTitle>{t('dashboard.field_rep_overview.title')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <p>{t('dashboard.field_rep_overview.description')}</p>
                <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{t('dashboard.field_rep_overview.next_visit')}</h3>
                    <p>ACME Corp - 123 Business Rd, Suite 404</p>
                    <p className="text-sm text-muted-foreground">{t('dashboard.field_rep_overview.scheduled_for', { time: '2:30 PM' })}</p>
                    <Button variant="outline" size="sm" className="mt-2"><Navigation className="me-2 h-4 w-4"/> {t('dashboard.field_rep_overview.start_navigation')}</Button>
                </div>
            </CardContent>
        </Card>
    );
};
