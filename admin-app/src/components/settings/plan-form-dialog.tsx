
"use client";

import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription as FormDescriptionComponent
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { SubscriptionPlan } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const planSchema = z.object({
  name: z.string().min(2, { message: 'Plan name must be at least 2 characters.' }),
  price: z.string().min(1, { message: 'Price is required (e.g., "49" or "Custom").' }),
  description: z.string().min(5, { message: 'Description must be at least 5 characters.' }),
  features: z.string().min(1, { message: 'Please list at least one feature.' }),
  badge: z.enum(['Popular', 'Best Value', '']).transform(v => v === '' ? null : v),
  status: z.enum(['active', 'archived']),
  notes: z.string().optional(),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  plan: SubscriptionPlan | null;
  onSubmitted: (data: Omit<SubscriptionPlan, 'id'>, id?: string) => void;
}

export function PlanFormDialog({ isOpen, onOpenChange, plan, onSubmitted }: PlanFormDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: '',
      price: '',
      description: '',
      features: '',
      badge: null,
      status: 'active',
      notes: '',
    },
  });

  useEffect(() => {
    if (plan) {
      form.reset({
        name: plan.name,
        price: plan.price === null ? 'Custom' : String(plan.price),
        description: plan.description,
        features: plan.features.join('\n'),
        badge: plan.badge,
        status: plan.status,
        notes: plan.notes || '',
      });
    } else {
      form.reset({
        name: '',
        price: '',
        description: '',
        features: '',
        badge: null,
        status: 'active',
        notes: '',
      });
    }
  }, [plan, form, isOpen]);

  const onSubmit = (values: PlanFormValues) => {
    startTransition(() => {
        const numericPrice = values.price.toLowerCase() === 'custom' ? null : Number(values.price);
        if (isNaN(numericPrice as number) && numericPrice !== null) {
            form.setError('price', { message: 'Price must be a valid number or "Custom".' });
            return;
        }

        const submissionData = {
          ...values,
          features: values.features.split('\n').filter((f: string) => f.trim() !== ''),
          price: numericPrice,
          badge: values.badge || null,
        };

        onSubmitted(submissionData, plan?.id);
        
        toast({
            title: t('common.success'),
            description: t(plan ? 'settings.plans.toast.updated' : 'settings.plans.toast.created'),
        });
        onOpenChange(false);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{plan ? t('settings.plans.form.editTitle') : t('settings.plans.form.createTitle')}</DialogTitle>
          <DialogDescription>
            {plan ? t('settings.plans.form.editDescription') : t('settings.plans.form.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('settings.plans.form.labels.name')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('settings.plans.form.placeholders.name')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('settings.plans.form.labels.price')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('settings.plans.form.placeholders.price')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.plans.form.labels.description')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('settings.plans.form.placeholders.description')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.plans.form.labels.features')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('settings.plans.form.placeholders.features')} {...field} rows={5}/>
                  </FormControl>
                  <FormDescriptionComponent>
                    {t('settings.plans.form.featuresDescription')}
                  </FormDescriptionComponent>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.plans.form.labels.notes')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('settings.plans.form.placeholders.notes')} {...field} rows={3}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('common.status')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('settings.plans.form.placeholders.status')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="active">{t('settings.plans.status.active')}</SelectItem>
                            <SelectItem value="archived">{t('settings.plans.status.archived')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="badge"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('settings.plans.form.labels.badge')}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('settings.plans.form.placeholders.badge')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="">{t('settings.plans.badge.none')}</SelectItem>
                            <SelectItem value="Popular">{t('settings.plans.badge.popular')}</SelectItem>
                            <SelectItem value="Best Value">{t('settings.plans.badge.best_value')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{t('common.cancel')}</Button>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                    {plan ? t('common.save') : t('common.create')}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
