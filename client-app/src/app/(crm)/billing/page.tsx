
'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Check, CreditCard, Download, MoreVertical, PlusCircle, Star, Info, AlertTriangle, ShieldOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

// --- MOCK DATA ---
const plansData = [
    { id: 'plan-free', name: 'Free', price: 0, users: 1, leads: 100, features: ['Basic CRM Access', '100 Leads/Month', 'Community Support'] },
    { id: 'plan-pro', name: 'Pro', price: 99, users: 10, leads: 5000, features: ['Full CRM Access', '5,000 Leads/Month', 'Advanced Reporting', 'API Access'], badge: 'Most Popular' },
    { id: 'plan-business', name: 'Business', price: 249, users: 50, leads: 10000, features: ['Full CRM Access', '10,000 Leads/Month', 'Advanced Reporting', 'API Access', 'Priority Support'] },
    { id: 'plan-enterprise', name: 'Enterprise', price: 0, users: 0, leads: 0, features: ['Custom User/Lead Limits', 'Dedicated Support', 'On-premise option', 'Custom Integrations'] },
];

const featureTooltips: Record<string, string> = {
    'API Access': 'Programmatically interact with your CRM data.',
    '100 Leads/Month': 'The maximum number of new leads you can add each month.',
    '5,000 Leads/Month': 'The maximum number of new leads you can add each month.',
    '10,000 Leads/Month': 'The maximum number of new leads you can add each month.',
    'Priority Support': 'Get faster response times from our support team.',
};

const initialSubscription = {
    planId: 'plan-pro',
    status: 'Active',
    nextPayment: '2024-08-15',
    currentUsage: {
        users: 8,
        leads: 1250,
    }
};

const initialPaymentMethods = [
    { id: 'pm-1', type: 'Visa', last4: '4242', isDefault: true, expiry: '12/26' },
    { id: 'pm-2', type: 'Mastercard', last4: '5555', isDefault: false, expiry: '08/25' },
];

const initialBillingHistory = [
    { id: 'inv-001', date: '2024-07-15', amount: 99.00, status: 'Paid' },
    { id: 'inv-002', date: '2024-06-15', amount: 99.00, status: 'Paid' },
    { id: 'inv-003', date: '2024-05-15', amount: 99.00, status: 'Paid' },
    { id: 'inv-004', date: '2024-04-15', amount: 99.00, status: 'Failed' },
];
// --- END MOCK DATA ---


// --- SUB-COMPONENTS ---

const ContactSalesDialog = ({ trigger }: { trigger: React.ReactNode }) => (
    <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Contact Sales</DialogTitle>
                <DialogDescription>
                    Fill out the form below and our enterprise team will get back to you shortly.
                </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 py-4" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Your Name" />
                <Input placeholder="Company Name" />
                <Input placeholder="Work Email" />
                <Textarea placeholder="Tell us about your requirements..." />
                <DialogFooter>
                     <Button type="button" variant="ghost">Cancel</Button>
                     <Button type="submit">Submit</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
);

const PlanCard = ({ plan, isCurrentPlan, billingCycle, onSelectPlan }: { plan: typeof plansData[0], isCurrentPlan: boolean, billingCycle: 'monthly' | 'annually', onSelectPlan: (planId: string) => void }) => {
    const isAnnual = billingCycle === 'annually';
    const displayPrice = isAnnual ? plan.price * 0.6 : plan.price;

    return (
        <Card className={cn("flex flex-col", isCurrentPlan ? 'border-primary ring-2 ring-primary' : '')}>
            <CardHeader className="relative">
                {plan.badge && <Badge className="absolute top-[-10px] right-4">{plan.badge}</Badge>}
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                     {plan.price > 0 ? (
                        <div className="space-y-1 pt-2">
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-foreground">
                                    ${displayPrice.toFixed(2)}
                                </span>
                                {isAnnual && plan.price > 0 && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        ${plan.price.toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                per user / month
                            </p>
                        </div>
                    ) : (
                        <span className="text-2xl font-bold text-foreground pt-2 block">Contact Us</span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <TooltipProvider>
                    {plan.features.map(feature => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>{feature}</span>
                            {featureTooltips[feature] && (
                                <Tooltip>
                                    <TooltipTrigger><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                                    <TooltipContent><p>{featureTooltips[feature]}</p></TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                    ))}
                </TooltipProvider>
            </CardContent>
            <CardFooter>
                {plan.price === 0 && plan.id !== 'plan-free' ? (
                   <ContactSalesDialog trigger={<Button className="w-full">Contact Sales</Button>} />
                ) : (
                    <Button className="w-full" disabled={isCurrentPlan} onClick={() => onSelectPlan(plan.id)}>
                        {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};


const AddPaymentMethodDialog = ({ onSave }: { onSave: (method: Omit<typeof initialPaymentMethods[0], 'id'>) => void }) => {
    const [open, setOpen] = React.useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newMethod = {
            type: 'Visa', // Placeholder
            last4: formData.get('cardNumber')?.toString().slice(-4) || '0000',
            expiry: formData.get('expiryDate') as string,
            isDefault: false
        };
        onSave(newMethod);
        setOpen(false);
    };
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Add New Method</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>Your payment information is stored securely.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" name="cardNumber" placeholder="**** **** **** ****" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="***" required />
                        </div>
                    </div>
                    <DialogFooter>
                         <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                         <Button type="submit">Save Card</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const SubscriptionOverview = ({ subscription, plans }: { subscription: typeof initialSubscription; plans: typeof plansData }) => {
    const currentPlan = plans.find(p => p.id === subscription.planId);
    if (!currentPlan) return null;

    const userProgress = (subscription.currentUsage.users / currentPlan.users) * 100;
    const leadProgress = (subscription.currentUsage.leads / currentPlan.leads) * 100;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Plan</CardTitle>
                <CardDescription>
                    You are currently on the <span className="font-semibold text-primary">{currentPlan.name}</span> plan.
                    Your next payment is scheduled for {subscription.nextPayment}.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>User Limit ({subscription.currentUsage.users}/{currentPlan.users})</Label>
                    <Progress value={userProgress} />
                </div>
                <div className="space-y-2">
                    <Label>Lead Limit ({subscription.currentUsage.leads}/{currentPlan.leads})</Label>
                    <Progress value={leadProgress} />
                </div>
            </CardContent>
            <CardFooter>
                 <Button variant="ghost" className="text-destructive hover:text-destructive">Cancel Subscription</Button>
            </CardFooter>
        </Card>
    )
};

const PaymentMethods = ({ methods, onAdd, onDelete, onSetDefault }: { methods: typeof initialPaymentMethods; onAdd: (method: Omit<typeof initialPaymentMethods[0], 'id'>) => void; onDelete: (id: string) => void; onSetDefault: (id: string) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage your saved payment methods.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            {methods.map(method => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                        <CreditCard className="h-8 w-8 text-muted-foreground" />
                        <div>
                            <p className="font-semibold">{method.type} ending in {method.last4}</p>
                            <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                        </div>
                        {method.isDefault && <Badge>Default</Badge>}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4"/></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem disabled={method.isDefault} onClick={() => onSetDefault(method.id)}>Make Default</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(method.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ))}
        </CardContent>
        <CardFooter>
            <AddPaymentMethodDialog onSave={onAdd} />
        </CardFooter>
    </Card>
);

const BillingHistory = ({ history }: { history: typeof initialBillingHistory }) => (
    <Card>
        <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>View and download your past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.map(invoice => (
                        <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.date}</TableCell>
                            <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                            <TableCell><Badge variant={invoice.status === 'Paid' ? 'default' : invoice.status === 'Failed' ? 'destructive' : 'outline'}>{invoice.status}</Badge></TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


const BillingPageSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div>
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <section>
            <div className="flex items-center justify-center gap-4 mb-8">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-12 rounded-full" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="flex flex-col">
                        <CardHeader className="space-y-2"><Skeleton className="h-6 w-1/2" /><Skeleton className="h-10 w-3/4" /></CardHeader>
                        <CardContent className="space-y-3 flex-grow">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                        <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                    </Card>
                ))}
            </div>
        </section>
        <div className="space-y-6">
            <div className="flex space-x-1 border-b">
                <Skeleton className="h-10 w-36 rounded-t-md" />
                <Skeleton className="h-10 w-36 rounded-t-md" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader>
                    <CardContent className="space-y-4"><Skeleton className="h-8 w-full" /><Skeleton className="h-8 w-full" /></CardContent>
                    <CardFooter><Skeleton className="h-10 w-48" /></CardFooter>
                </Card>
                <Card>
                    <CardHeader><Skeleton className="h-6 w-1/4" /><Skeleton className="h-4 w-3/4 mt-2" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                    <CardFooter><Skeleton className="h-10 w-48" /></CardFooter>
                </Card>
            </div>
        </div>
    </div>
);


// --- MAIN PAGE COMPONENT ---
export default function BillingPage() {
    const { user } = useUser();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = React.useState(true);
    const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annually'>('monthly');
    const [subscription, setSubscription] = React.useState(initialSubscription);
    const [paymentMethods, setPaymentMethods] = React.useState(initialPaymentMethods);
    const [billingHistory, setBillingHistory] = React.useState(initialBillingHistory);
    const [dialogState, setDialogState] = React.useState({
        deletePayment: { open: false, id: '' },
        changePlan: { open: false, id: '' }
    });
    
    React.useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500); // Simulate data fetching
        return () => clearTimeout(timer);
    }, []);

    const hasFailedPayment = billingHistory.some(inv => inv.status === 'Failed');

    const handleAddPayment = (newMethod: Omit<typeof initialPaymentMethods[0], 'id'>) => {
        const fullMethod = { id: `pm-${Date.now()}`, ...newMethod };
        setPaymentMethods(prev => [fullMethod, ...prev]);
        toast({ title: 'Success', description: 'New payment method added.' });
    };

    const handleDeletePayment = (id: string) => {
        setDialogState(prev => ({ ...prev, deletePayment: { open: true, id } }));
    };

    const confirmDeletePayment = () => {
        setPaymentMethods(prev => prev.filter(p => p.id !== dialogState.deletePayment.id));
        toast({ title: 'Success', description: 'Payment method removed.' });
        setDialogState(prev => ({ ...prev, deletePayment: { open: false, id: '' } }));
    };
    
    const handleSetDefault = (id: string) => {
        setPaymentMethods(prev => prev.map(p => ({ ...p, isDefault: p.id === id })));
        toast({ title: 'Success', description: 'Default payment method updated.' });
    };

    const handleChangePlan = (planId: string) => {
        setDialogState(prev => ({ ...prev, changePlan: { open: true, id: planId } }));
    };

    const confirmChangePlan = () => {
        const newPlan = plansData.find(p => p.id === dialogState.changePlan.id);
        if (newPlan) {
            setSubscription(prev => ({ ...prev, planId: newPlan.id }));
            toast({ title: 'Plan Changed!', description: `You are now on the ${newPlan.name} plan.` });
        }
        setDialogState(prev => ({ ...prev, changePlan: { open: false, id: '' } }));
    };

    if (!user) return null;

    if (!user.scopes?.includes('billing:view')) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center">
                <ShieldOff className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">Your account is missing the required 'billing:view' permission.</p>
                <p className="text-sm text-muted-foreground mt-2">Please contact your administrator to get access to this page.</p>
            </div>
        );
    }
    
    if (isLoading) return <BillingPageSkeleton />;


    return (
        <div className="space-y-8">
             <AlertDialog open={dialogState.deletePayment.open} onOpenChange={(open) => setDialogState(prev => ({...prev, deletePayment: {...prev.deletePayment, open}}))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete your payment method.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeletePayment}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={dialogState.changePlan.open} onOpenChange={(open) => setDialogState(prev => ({...prev, changePlan: {...prev.changePlan, open}}))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Plan Change</AlertDialogTitle>
                        <AlertDialogDescription>You are about to switch to the {plansData.find(p=>p.id === dialogState.changePlan.id)?.name} plan. Do you want to continue?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmChangePlan}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div>
                <h1 className="text-3xl font-bold tracking-tight">Billing & Subscriptions</h1>
                <p className="text-muted-foreground">Manage your subscription, payment methods, and view invoices.</p>
            </div>
            
            {hasFailedPayment && (
                <Card className="border-destructive bg-destructive/10">
                    <CardHeader className="flex-row gap-4 items-center">
                        <AlertTriangle className="w-8 h-8 text-destructive"/>
                        <div>
                            <CardTitle className="text-destructive">Payment Failed</CardTitle>
                            <CardDescription className="text-destructive/80">Your last payment failed. Please update your payment method to keep your account active.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardFooter>
                        <Button variant="destructive">Update Payment Method</Button>
                    </CardFooter>
                </Card>
            )}

             <section>
                <h2 className="text-2xl font-semibold tracking-tight mb-2 text-center">Choose Your Plan</h2>
                 <div className="flex items-center justify-center gap-4 mb-8">
                    <Label htmlFor="billing-cycle" className={cn(billingCycle === 'monthly' ? 'text-primary' : 'text-muted-foreground')}>Monthly</Label>
                    <Switch
                        id="billing-cycle"
                        checked={billingCycle === 'annually'}
                        onCheckedChange={(checked) => {
                            setBillingCycle(checked ? 'annually' : 'monthly');
                        }}
                    />
                    <Label htmlFor="billing-cycle" className={cn(billingCycle === 'annually' ? 'text-primary' : 'text-muted-foreground')}>Annually</Label>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Save 40%</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plansData.map(plan => (
                        <PlanCard 
                          key={plan.id} 
                          plan={plan} 
                          isCurrentPlan={plan.id === subscription.planId} 
                          billingCycle={billingCycle}
                          onSelectPlan={handleChangePlan}
                        />
                    ))}
                </div>
            </section>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Current Subscription</TabsTrigger>
                    <TabsTrigger value="history">Billing History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SubscriptionOverview subscription={subscription} plans={plansData} />
                        <PaymentMethods methods={paymentMethods} onAdd={handleAddPayment} onDelete={handleDeletePayment} onSetDefault={handleSetDefault} />
                    </div>
                </TabsContent>
                
                <TabsContent value="history">
                    <BillingHistory history={billingHistory}/>
                </TabsContent>
            </Tabs>
        </div>
    )
}

    
