
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { getAiInsights } from '@/ai/flows/ai-insights-flow';
import type { AiInsight, Lead, Deal, Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Lightbulb, TrendingUp, Wrench, Bot, ListFilter } from 'lucide-react';

// --- MOCK DATA (Simulating data from other parts of the CRM) ---
const mockLeads: Lead[] = [
  { id: 'lead-1', name: 'Alice Johnson', company: 'Innovate Corp', email: 'alice.j@innovate.com', phone: '555-0101', status: 'New', source: 'Website', owner: { name: 'F. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 85, lastActivity: '2024-07-20T10:00:00Z', nextTask: 'Initial Call', interest: 'prod-001' },
  { id: 'lead-2', name: 'Bob Williams', company: 'Solutions Inc', email: 'bob.w@solutions.com', phone: '555-0102', status: 'Contacted', source: 'Referral', owner: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 72, lastActivity: '2024-07-19T14:30:00Z', nextTask: 'Follow-up Email', interest: 'prod-005' },
  { id: 'lead-3', name: 'Charlie Brown', company: 'Tech Gadgets', email: 'charlie.b@techgadgets.com', phone: '555-0103', status: 'Proposal', source: 'Exhibition', owner: { name: 'S. Rep', avatar: 'https://placehold.co/40x40.png' }, score: 91, lastActivity: '2024-07-10T11:00:00Z', nextTask: 'Send Proposal', interest: 'prod-003' },
  { id: 'lead-7', name: 'Grace Lee', company: 'Solutions Inc', email: 'grace.l@solutions.com', phone: '555-0107', status: 'New', source: 'Website', owner: { name: 'Admin User', avatar: 'https://placehold.co/40x40.png' }, score: 88, lastActivity: '2024-07-21T09:00:00Z', nextTask: 'Assign to Rep', interest: 'prod-006' },
];

const mockDeals: Deal[] = [
  { id: 'deal-101', name: 'Innovate Corp Website', client: 'Alice Johnson', amount: 15000, status: 'Proposal', rep: { name: 'F. Rep', avatar: '' }, createdDate: '2024-07-15', probability: 75, lastUpdate: '2024-07-20' },
  { id: 'deal-102', name: 'Solutions Inc SEO', client: 'Bob Williams', amount: 8000, status: 'Negotiation', rep: { name: 'S. Rep', avatar: '' }, createdDate: '2024-07-12', probability: 90, lastUpdate: '2024-07-21' },
  { id: 'deal-103', name: 'Tech Gadgets Branding', client: 'Charlie Brown', amount: 22000, status: 'Won', rep: { name: 'S. Rep', avatar: '' }, createdDate: '2024-06-20', probability: 100, lastUpdate: '2024-07-18' },
  { id: 'deal-104', name: 'Global Exports Logistics', client: 'Diana Miller', amount: 35000, status: 'Lost', rep: { name: 'F. Rep', avatar: '' }, createdDate: '2024-06-10', probability: 0, lastUpdate: '2024-07-10' },
];

const mockProducts: Product[] = [
  { id: 'prod-001', name: 'Premium Office Chair', sku: 'CHR-001', category: 'Furniture', description: '', prices: { 'SAR': 1312.50 }, baseCurrency: 'SAR', stock: 150, status: 'Active', tags: ['Bestseller'], imageUrl: '', sales: 120, quotes: 350 },
  { id: 'prod-005', name: 'SEO Consulting Package', sku: 'SVC-001', category: 'Services', description: '', prices: { 'SAR': 5625 }, baseCurrency: 'SAR', stock: Infinity, status: 'Active', tags: ['Recurring'], imageUrl: '', sales: 25, quotes: 120 },
  { id: 'prod-003', name: '4K Webcam', sku: 'CAM-001', category: 'Electronics', description: '', prices: { 'SAR': 450 }, baseCurrency: 'SAR', stock: 300, status: 'Active', tags: [], imageUrl: '', sales: 450, quotes: 800 },
];
// --- END MOCK DATA ---

const insightConfig: Record<AiInsight['type'], { icon: React.ElementType, color: string, badge: string }> = {
    Alert: { icon: AlertTriangle, color: 'border-red-500/50', badge: 'bg-red-100 text-red-800' },
    Opportunity: { icon: Lightbulb, color: 'border-yellow-500/50', badge: 'bg-yellow-100 text-yellow-800' },
    Forecast: { icon: TrendingUp, color: 'border-blue-500/50', badge: 'bg-blue-100 text-blue-800' },
    Optimization: { icon: Wrench, color: 'border-green-500/50', badge: 'bg-green-100 text-green-800' },
};

const InsightCard = ({ insight }: { insight: AiInsight }) => {
    const { icon: Icon, color, badge } = insightConfig[insight.type];
    
    return (
        <Card className={`flex flex-col h-full border-l-4 ${color} hover:shadow-md transition-shadow`}>
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="bg-muted p-2 rounded-full"><Icon className={`h-6 w-6 ${color.replace('border-', 'text-')}`} /></div>
                <div className="flex-grow">
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <Badge variant="outline" className={`mt-1 text-xs ${badge}`}>{insight.type}</Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground">{insight.description}</p>
            </CardContent>
            <CardContent className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t">
                {insight.actionable && <Button size="sm">{insight.actionText || 'Take Action'}</Button>}
                <span>Confidence: <span className="font-semibold text-foreground">{(insight.confidence * 100).toFixed(0)}%</span></span>
            </CardContent>
        </Card>
    );
};


export default function AiInsightsPage() {
    const { user } = useUser();
    const [insights, setInsights] = React.useState<AiInsight[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [filter, setFilter] = React.useState<'all' | AiInsight['type']>('all');

    React.useEffect(() => {
        const fetchInsights = async () => {
            if (!user) return;
            setIsLoading(true);
            try {
                const result = await getAiInsights({
                    leadsJson: JSON.stringify(mockLeads),
                    salesJson: JSON.stringify(mockDeals),
                    productsJson: JSON.stringify(mockProducts),
                    userRole: user.role,
                });
                setInsights(result.insights);
            } catch (error) {
                console.error("Failed to fetch AI insights:", error);
                // In a real app, show a toast notification
            } finally {
                setIsLoading(false);
            }
        };
        fetchInsights();
    }, [user]);

    const filteredInsights = React.useMemo(() => {
        if (filter === 'all') return insights;
        return insights.filter(i => i.type === filter);
    }, [insights, filter]);

    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
                    <p className="text-muted-foreground">Your intelligent assistant for CRM performance.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select onValueChange={(v) => setFilter(v as any)} defaultValue="all">
                        <SelectTrigger className="w-full md:w-[180px]">
                             <ListFilter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Filter by type..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Insights</SelectItem>
                            <SelectItem value="Alert">Alerts</SelectItem>
                            <SelectItem value="Opportunity">Opportunities</SelectItem>
                            <SelectItem value="Forecast">Forecasts</SelectItem>
                            <SelectItem value="Optimization">Optimizations</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">Customize</Button>
                </div>
            </div>

            <Tabs defaultValue="feed" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="feed">Insight Feed</TabsTrigger>
                    <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
                    <TabsTrigger value="priority">Lead Priority</TabsTrigger>
                </TabsList>
                
                <TabsContent value="feed" className="mt-6">
                    {isLoading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className="flex flex-col">
                                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                    <CardContent className="space-y-2 flex-grow">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </CardContent>
                                    <CardContent className="pt-4 border-t">
                                        <Skeleton className="h-8 w-24" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredInsights.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredInsights.map((insight, index) => (
                                <InsightCard key={index} insight={insight} />
                            ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center text-center p-8 border-dashed rounded-lg mt-8">
                            <Bot className="h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Insights Generated</h3>
                            <p className="mt-1 text-muted-foreground">The AI engine didn't find any specific insights for you right now.</p>
                        </div>
                    )}
                </TabsContent>
                
                <TabsContent value="forecasts" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Forecast Dashboard</CardTitle>
                            <CardDescription>Predictive analytics for key business metrics. (Placeholder)</CardDescription>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center bg-muted/50 rounded-lg">
                            <p className="text-muted-foreground">Interactive forecast charts will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="priority" className="mt-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Lead Prioritization Matrix</CardTitle>
                            <CardDescription>AI-ranked leads based on urgency and potential value. (Placeholder)</CardDescription>
                        </CardHeader>
                        <CardContent className="h-96 flex items-center justify-center bg-muted/50 rounded-lg">
                            <p className="text-muted-foreground">A smart table of prioritized leads will be displayed here.</p>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
