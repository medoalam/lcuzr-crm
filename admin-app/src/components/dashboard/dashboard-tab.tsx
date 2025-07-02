
"use client";

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell, Legend } from "recharts";
import { DollarSign, Users, Building2, Headset, Activity, MoreVertical } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const revenueData = [
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 4200 },
  { month: "Mar", revenue: 5100 },
  { month: "Apr", revenue: 4800 },
  { month: "May", revenue: 5500 },
  { month: "Jun", revenue: 5300 },
];

const signupsData = [
  { date: "2024-01-01", signups: 20 },
  { date: "2024-02-01", signups: 25 },
  { date: "2024-03-01", signups: 18 },
  { date: "2024-04-01", signups: 30 },
  { date: "2024-05-01", signups: 28 },
  { date: "2024-06-01", signups: 35 },
];

const plansData = [
  { name: 'Enterprise', value: 400, fill: "hsl(var(--chart-1))" },
  { name: 'Pro', value: 300, fill: "hsl(var(--chart-2))" },
  { name: 'Basic', value: 300, fill: "hsl(var(--chart-3))" },
  { name: 'Trial', value: 200, fill: "hsl(var(--chart-4))" },
];

const recentActivities = [
  { user: 'Admin', action: 'Updated Company "Innovate Inc."', time: '2m ago' },
  { user: 'Admin', action: 'Revoked API Token for billing_service', time: '1h ago' },
  { user: 'system', action: 'Failed login attempt from IP 123.45.67.89', time: '3h ago' },
  { user: 'Admin', action: 'Added new company "Apex Solutions"', time: '5h ago' },
  { user: 'Admin', action: 'Viewed Audit Logs', time: '1d ago' },
]

const recentTickets = [
    { id: 'TKT-001', subject: 'Problem with billing invoice', company: 'Synergy Corp', status: 'Open' },
    { id: 'TKT-002', subject: 'API integration issue', company: 'Quantum Dynamics', status: 'In Progress' },
    { id: 'TKT-003', subject: 'How to upgrade my plan?', company: 'Visionary Ventures', status: 'Open' },
    { id: 'TKT-004', subject: 'System is running slow', company: 'Innovate Inc.', status: 'Resolved' },
    { id: 'TKT-005', subject: 'Feature Request: Dark Mode', company: 'Apex Solutions', status: 'Open' },
]


export function DashboardTab() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Section - 4 cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isClient ? t('dashboardTab.totalCompanies') : 'Total Companies'}</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">{isClient ? t('dashboardTab.totalCompaniesDesc') : '+25 since last month'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isClient ? t('dashboardTab.activeUsers') : 'Active Users'}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,349</div>
            <p className="text-xs text-muted-foreground">{isClient ? t('dashboardTab.activeUsersDesc') : '+180 since last month'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isClient ? t('dashboardTab.mrr') : 'Monthly Revenue (MRR)'}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">{isClient ? t('dashboardTab.mrrDesc') : '+2.1% from last month'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isClient ? t('dashboardTab.openSupportTickets') : 'Open Support Tickets'}</CardTitle>
            <Headset className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">{isClient ? t('dashboardTab.openSupportTicketsDesc') : '+5 new tickets today'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section - charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{isClient ? t('dashboardTab.revenueGrowthTitle') : 'Revenue Growth'}</CardTitle>
            <CardDescription>{isClient ? t('dashboardTab.revenueGrowthDesc') : 'Monthly revenue over the last 6 months.'}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-[250px] w-full">
              <BarChart data={revenueData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{isClient ? t('dashboardTab.subscriptionPlansTitle') : 'Subscription Plans'}</CardTitle>
            <CardDescription>{isClient ? t('dashboardTab.subscriptionPlansDesc') : 'Distribution of active plans.'}</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-[250px] w-full">
                <PieChart>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Pie data={plansData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={5}>
                         {plansData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Legend/>
                </PieChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section - recent activity */}
      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>{isClient ? t('dashboardTab.recentActivityTitle') : 'Recent Activity'}</CardTitle>
                <CardDescription>{isClient ? t('dashboardTab.recentActivityDesc') : 'A feed of the latest system and user actions.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center">
                            <Activity className="h-5 w-5 mr-3 text-muted-foreground" />
                            <div className="flex-grow">
                                <p className="text-sm">{activity.action}</p>
                                <p className="text-xs text-muted-foreground">{activity.user} &bull; {activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
         </Card>
         <Card>
            <CardHeader>
                <CardTitle>{isClient ? t('dashboardTab.recentSupportTicketsTitle') : 'Recent Support Tickets'}</CardTitle>
                <CardDescription>{isClient ? t('dashboardTab.recentSupportTicketsDesc') : 'Latest tickets from customers.'}</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{isClient ? t('dashboardTab.tableSubject') : 'Subject'}</TableHead>
                            <TableHead>{isClient ? t('dashboardTab.tableCompany') : 'Company'}</TableHead>
                            <TableHead>{isClient ? t('dashboardTab.tableStatus') : 'Status'}</TableHead>
                            <TableHead className="text-right">{isClient ? t('dashboardTab.tableActions') : 'Actions'}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentTickets.slice(0, 5).map((ticket) => (
                            <TableRow key={ticket.id}>
                                <TableCell className="font-medium">{ticket.subject}</TableCell>
                                <TableCell>{ticket.company}</TableCell>
                                <TableCell>
                                    <Badge variant={ticket.status === 'Resolved' ? 'secondary' : 'default'} className={
                                        ticket.status === 'Open' ? 'bg-blue-500/20 text-blue-700' :
                                        ticket.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-700' : ''
                                    }>{ticket.status}</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4"/>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
