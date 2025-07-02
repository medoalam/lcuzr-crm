
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, FunnelChart, Funnel, LabelList, PieChart, Pie, Cell } from 'recharts';
import { Download, Users, DollarSign, TrendingUp, Activity, Bot, Filter, FileText, Share2, MoreVertical } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

// --- MOCK DATA ---
const kpiData = {
  all: { totalLeads: 1250, totalSales: 350, conversionRate: 0.28, totalRevenue: 98500, topRep: 'Alice Johnson' },
  'Sales Manager': { totalLeads: 450, totalSales: 120, conversionRate: 0.26, totalRevenue: 35000, topRep: 'Bob Williams' },
  'Showroom Rep': { totalLeads: 88, totalSales: 25, conversionRate: 0.28, totalRevenue: 9500 },
  'Field Rep': { totalLeads: 65, totalSales: 18, conversionRate: 0.27, totalRevenue: 7800 },
};

const salesOverTimeData = [
  { name: 'Jan', Revenue: 4000, Orders: 24, WinRate: 0.22 },
  { name: 'Feb', Revenue: 3000, Orders: 13, WinRate: 0.25 },
  { name: 'Mar', Revenue: 5000, Orders: 42, WinRate: 0.31 },
  { name: 'Apr', Revenue: 4780, Orders: 39, WinRate: 0.29 },
  { name: 'May', Revenue: 6890, Orders: 48, WinRate: 0.35 },
  { name: 'Jun', Revenue: 5390, Orders: 38, WinRate: 0.32 },
];

const leadFunnelData = [
  { value: 10000, name: 'Visitors', fill: '#8884d8' },
  { value: 4500, name: 'Leads', fill: '#83a6ed' },
  { value: 2000, name: 'Qualified', fill: '#8dd1e1' },
  { value: 1100, name: 'Quoted', fill: '#82ca9d' },
  { value: 350, name: 'Won', fill: '#a4de6c' },
];

const teamPerformanceData = [
  { id: 1, rep: 'Alice Johnson', type: 'Field Rep', leads: 45, conversion: 0.31, avgDeal: 2200, status: 'On Track' },
  { id: 2, rep: 'Bob Williams', type: 'Showroom Rep', leads: 62, conversion: 0.25, avgDeal: 1800, status: 'On Track' },
  { id: 3, rep: 'Charlie Brown', type: 'Field Rep', leads: 33, conversion: 0.28, avgDeal: 2500, status: 'High Potential' },
  { id: 4, rep: 'Diana Miller', type: 'Showroom Rep', leads: 51, conversion: 0.22, avgDeal: 1650, status: 'Needs Attention' },
  { id: 5, rep: 'Eve Davis', type: 'Field Rep', leads: 48, conversion: 0.35, avgDeal: 2800, status: 'Top Performer' },
];

const productAnalyticsData = [
    { name: 'Product A', value: 400, fill: 'hsl(var(--chart-1))' },
    { name: 'Service B', value: 300, fill: 'hsl(var(--chart-2))' },
    { name: 'Product C', value: 300, fill: 'hsl(var(--chart-3))' },
    { name: 'Service D', value: 200, fill: 'hsl(var(--chart-4))' },
];

// --- SUB-COMPONENTS ---

const AnalyticsHeader = ({ date, setDate }: { date: DateRange | undefined, setDate: (d: DateRange | undefined) => void }) => {
  const { user } = useUser();
  const { t } = useTranslation();
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">{t('analytics.description')}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DatePickerWithRange date={date} setDate={setDate} />
        {user?.role !== 'Field Rep' && user?.role !== 'Showroom Rep' && (
          <Select defaultValue="all">
            <SelectTrigger className="w-full md:w-[160px]">
              <SelectValue placeholder={t('analytics.filter_by_rep')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('analytics.all_reps')}</SelectItem>
              <SelectItem value="alice">Alice Johnson</SelectItem>
              <SelectItem value="bob">Bob Williams</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant="outline"><Download className="me-2 h-4 w-4" /> {t('analytics.export')}</Button>
      </div>
    </div>
  );
};

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

const AiInsights = () => {
    const { t } = useTranslation();
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot /> {t('analytics.ai_insights.title')}</CardTitle>
                <CardDescription>{t('analytics.ai_insights.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100%-8rem)]">
                <div className="flex-grow space-y-4 text-sm overflow-y-auto pe-2">
                    <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="font-semibold text-accent-foreground">{t('analytics.ai_insights.trend_alert')}</p>
                        <p className="text-muted-foreground">Lead conversion dropped 12% this week in Jeddah branch. Recommend reviewing recent lead sources.</p>
                    </div>
                     <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="font-semibold text-accent-foreground">{t('analytics.ai_insights.prediction')}</p>
                        <p className="text-muted-foreground">Revenue is forecasted to increase by 8% next month based on current pipeline velocity.</p>
                    </div>
                     <div className="p-3 bg-accent/50 rounded-lg">
                        <p className="font-semibold text-accent-foreground">{t('analytics.ai_insights.suggestion')}</p>
                        <p className="text-muted-foreground">Focus on 'Product C' upsells for existing customers, as it shows growing interest in your top region.</p>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <Textarea placeholder={t('analytics.ai_insights.ask_ai_placeholder')} />
                    <Button className="w-full">{t('analytics.ai_insights.get_insight')}</Button>
                </div>
            </CardContent>
        </Card>
    );
};

// --- MAIN PAGE COMPONENT ---

export default function AnalyticsPage() {
  const { user } = useUser();
  const { t } = useTranslation();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -29),
    to: new Date(),
  });

  const roleKpiData = user?.role ? kpiData[user.role] || kpiData.all : kpiData.all;
  
  const userPerformance = React.useMemo(() => {
    if (!user) return [];
    if (user.role === 'Admin' || user.role === 'Sales Manager') return teamPerformanceData;
    return teamPerformanceData.filter(rep => rep.rep.includes(user.name.split(' ')[0]));
  }, [user]);

  if (!user) return null;

  return (
    <div className="flex-1 space-y-6">
      <AnalyticsHeader date={date} setDate={setDate} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <KpiCard title={t('analytics.kpi.total_leads')} value={roleKpiData.totalLeads.toLocaleString()} change={t('analytics.kpi.change_from_last_month', { change: '+20.1%' })} icon={Users} />
        <KpiCard title={t('analytics.kpi.total_sales')} value={roleKpiData.totalSales.toLocaleString()} change={t('analytics.kpi.change_from_last_month', { change: '+18.3%' })} icon={DollarSign} />
        <KpiCard title={t('analytics.kpi.conversion_rate')} value={`${(roleKpiData.conversionRate * 100).toFixed(1)}%`} change={t('analytics.kpi.change_from_last_month', { change: '+2.1%' })} icon={TrendingUp} />
        <KpiCard title={t('analytics.kpi.revenue')} value={`$${roleKpiData.totalRevenue.toLocaleString()}`} change={t('analytics.kpi.change_from_last_month', { change: '+22.5%' })} icon={Activity} />
        { (user.role === 'Admin' || user.role === 'Sales Manager') && 
            <KpiCard title={t('analytics.kpi.top_rep')} value={roleKpiData.topRep} change={t('analytics.kpi.this_month')} icon={Users} />
        }
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('analytics.sales_over_time.title')}</CardTitle>
                    <CardDescription>{t('analytics.sales_over_time.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesOverTimeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" fontSize={12} />
                        <YAxis yAxisId="left" stroke="#8884d8" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="Revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line yAxisId="right" type="monotone" dataKey="WinRate" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('analytics.lead_funnel.title')}</CardTitle>
                        <CardDescription>{t('analytics.lead_funnel.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                        <FunnelChart>
                            <Tooltip />
                            <Funnel dataKey="value" data={leadFunnelData} isAnimationActive>
                                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>{t('analytics.product_analytics.title')}</CardTitle>
                        <CardDescription>{t('analytics.product_analytics.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={productAnalyticsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {productAnalyticsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            { (user.role === 'Admin' || user.role === 'Sales Manager') &&
              <Card>
                  <CardHeader>
                      <CardTitle>{t('analytics.team_performance.title')}</CardTitle>
                      <CardDescription>{t('analytics.team_performance.description')}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>{t('analytics.team_performance.rep')}</TableHead>
                                  <TableHead>{t('analytics.team_performance.type')}</TableHead>
                                  <TableHead>{t('analytics.team_performance.leads')}</TableHead>
                                  <TableHead>{t('analytics.team_performance.conversion')}</TableHead>
                                  <TableHead className="text-end">{t('analytics.team_performance.avg_deal')}</TableHead>
                                  <TableHead className="text-end">{t('analytics.team_performance.status')}</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {userPerformance.map(rep => (
                                  <TableRow key={rep.id}>
                                      <TableCell className="font-medium">{rep.rep}</TableCell>
                                      <TableCell>{rep.type}</TableCell>
                                      <TableCell>{rep.leads}</TableCell>
                                      <TableCell>{rep.conversion}</TableCell>
                                      <TableCell className="text-end">${rep.avgDeal.toLocaleString()}</TableCell>
                                      <TableCell className="text-end"><Badge variant={rep.status === 'Top Performer' ? 'default' : 'outline'}>{rep.status}</Badge></TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
            }
        </div>
        <div className="lg:col-span-1">
          <AiInsights />
        </div>
      </div>
    </div>
  );
}
