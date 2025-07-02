
"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { initialPlans, companies } from '@/lib/data/mock-data';
import type { SubscriptionPlan } from '@/lib/types';
import { Badge } from '../ui/badge';
import { CheckCircle, Edit, PlusCircle, Trash2, Users } from 'lucide-react';
import { PlanFormDialog } from './plan-form-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

export function PlansTab() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>(initialPlans);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAddNew = () => {
    setSelectedPlan(null);
    setIsFormOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setIsFormOpen(true);
  };
  
  const onFormSubmitted = (data: Omit<SubscriptionPlan, 'id'>, id?: string) => {
    if (id) {
        setPlans(plans.map(p => p.id === id ? { id, ...data } : p));
    } else {
        const newPlan: SubscriptionPlan = { id: `plan_${Date.now()}`, ...data };
        setPlans([newPlan, ...plans]);
    }
  };

  const handleArchive = (planId: string) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, status: 'archived' } : p));
    toast({ title: t('common.success'), description: t('settings.plans.toast.archived') });
  }

  const handleActivate = (planId: string) => {
     setPlans(plans.map(p => p.id === planId ? { ...p, status: 'active' } : p));
     toast({ title: t('common.success'), description: t('settings.plans.toast.activated') });
  }

  const getSubscriberCount = (planName: string) => {
    if (!companies || !Array.isArray(companies)) return 0;
    return companies.filter(c => c.plan === planName).length;
  };

  return (
    <>
    <PlanFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        plan={selectedPlan}
        onSubmitted={onFormSubmitted}
    />
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>{t('settings.plans.title')}</CardTitle>
                <CardDescription>{t('settings.plans.description')}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
                <RadioGroup defaultValue="monthly" onValueChange={(value) => setBillingCycle(value as any)} className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">{t('settings.plans.monthly')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yearly" id="yearly" />
                        <Label htmlFor="yearly">{t('settings.plans.yearly')}</Label>
                    </div>
                </RadioGroup>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="me-2 h-4 w-4" />
                    {t('settings.plans.addPlan')}
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plans.map((plan) => {
            let displayPrice: string;
            if (plan.price === null) {
                displayPrice = t('settings.plans.customPrice');
            } else if (billingCycle === 'yearly') {
                const yearlyPrice = plan.price * 12 * 0.6;
                displayPrice = `$${yearlyPrice.toFixed(0)}`;
            } else {
                 displayPrice = plan.price > 0 ? `$${plan.price}` : t('settings.plans.free');
            }

            return (
            <Card key={plan.id} className={cn(
                "flex flex-col",
                plan.badge === "Popular" && "border-primary shadow-lg",
                plan.status === 'archived' && "bg-muted/50 text-muted-foreground"
            )}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>{plan.name}</CardTitle>
                         {plan.badge && <Badge variant={plan.badge === 'Popular' ? 'default' : 'secondary'}>{t(`settings.plans.badge.${plan.badge.toLowerCase().replace(' ', '_')}`)}</Badge>}
                         {plan.status === 'archived' && <Badge variant="outline">{t('settings.plans.status.archived')}</Badge>}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                    <div>
                        <span className="text-4xl font-bold">{displayPrice}</span>
                        {plan.price !== null && plan.price > 0 && <span className="text-muted-foreground">/{billingCycle === 'monthly' ? t('settings.plans.perMonth') : t('settings.plans.perYear')}</span>}
                    </div>
                    <ul className="space-y-2 text-sm">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary"/>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                     <div className="text-sm text-muted-foreground flex items-center gap-2 pt-4">
                        <Users className="h-4 w-4" />
                        <span>{t('settings.plans.subscriberCount', { count: getSubscriberCount(plan.name) })}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                     <Button variant="outline" className="w-full" onClick={() => handleEdit(plan)}>
                        <Edit className="me-2 h-4 w-4"/> {t('common.edit')}
                    </Button>
                    <AlertDialog>
                        {plan.status === 'active' ? (
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full" disabled={plan.name === 'Enterprise'}>
                                    <Trash2 className="me-2 h-4 w-4"/> {t('settings.plans.archive')}
                                </Button>
                            </AlertDialogTrigger>
                        ) : (
                             <Button variant="secondary" className="w-full" onClick={() => handleActivate(plan.id)}>
                                {t('settings.plans.activate')}
                            </Button>
                        )}
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('settings.plans.archiveDialog.title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                {t('settings.plans.archiveDialog.description', { name: plan.name })}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleArchive(plan.id)} className="bg-destructive hover:bg-destructive/90">
                                    {t('settings.plans.archiveDialog.confirm')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        )})}
      </CardContent>
    </Card>
    </>
  );
}
