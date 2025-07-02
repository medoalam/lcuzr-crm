
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
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addCompany, updateCompany } from '@/app/actions';
import type { Company } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(2, { message: 'Company name must be at least 2 characters.' }),
  industry: z.string().min(1, { message: 'Industry is required.' }),
  contactEmail: z.string().email({ message: 'Please enter a valid email address.' }),
  location: z.string().min(1, { message: 'Country is required.' }),
  employees: z.string().min(1, { message: 'Number of employees is required.' }),
  status: z.enum(['Active', 'Trial', 'Suspended']),
  plan: z.string().min(1, { message: 'Plan is required.' }),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  company: Company | null;
  onSubmitted: () => void;
}

export function CompanyFormDialog({ isOpen, onOpenChange, company, onSubmitted }: CompanyFormDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      industry: '',
      contactEmail: '',
      location: '',
      employees: '',
      status: 'Trial',
      plan: 'Basic',
    },
  });

  useEffect(() => {
    if (company) {
      form.reset({
        name: company.name,
        industry: company.industry,
        contactEmail: company.contactEmail,
        location: company.location,
        employees: company.employees,
        status: company.status,
        plan: company.plan,
      });
    } else {
      form.reset({
        name: '',
        industry: '',
        contactEmail: '',
        location: '',
        employees: '1-10',
        status: 'Trial',
        plan: 'Basic',
      });
    }
  }, [company, form, isOpen]);

  const onSubmit = (values: CompanyFormValues) => {
    startTransition(async () => {
      const result = company
        ? await updateCompany({ id: company.id, ...values })
        : await addCompany(values);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: t('common.error'),
          description: result.error,
        });
      } else {
        toast({
          title: t('common.success'),
          description: t(company ? 'companyForm.toast.updateSuccess' : 'companyForm.toast.addSuccess'),
        });
        onSubmitted();
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{company ? t('companyForm.editTitle') : t('companyForm.addTitle')}</DialogTitle>
          <DialogDescription>
            {company ? t('companyForm.editDescription') : t('companyForm.addDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('companyForm.labels.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('companyForm.placeholders.name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('companyForm.labels.industry')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('companyForm.placeholders.industry')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('companyForm.labels.country')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('companyForm.placeholders.country')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('companyForm.labels.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('companyForm.placeholders.email')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="employees"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('companyForm.labels.employees')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('companyForm.selects.employees.placeholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="1-10">{t('companyForm.selects.employees.s1')}</SelectItem>
                            <SelectItem value="11-50">{t('companyForm.selects.employees.s2')}</SelectItem>
                            <SelectItem value="51-200">{t('companyForm.selects.employees.s3')}</SelectItem>
                            <SelectItem value="201-1000">{t('companyForm.selects.employees.s4')}</SelectItem>
                            <SelectItem value="1000+">{t('companyForm.selects.employees.s5')}</SelectItem>
                        </SelectContent>
                    </Select>
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
                    <FormLabel>{t('companyForm.labels.status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('companyForm.selects.status.placeholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Active">{t('companyForm.selects.status.active')}</SelectItem>
                        <SelectItem value="Trial">{t('companyForm.selects.status.trial')}</SelectItem>
                        <SelectItem value="Suspended">{t('companyForm.selects.status.suspended')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('companyForm.labels.plan')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('companyForm.selects.plan.placeholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Basic">{t('companyForm.selects.plan.basic')}</SelectItem>
                        <SelectItem value="Pro">{t('companyForm.selects.plan.pro')}</SelectItem>
                        <SelectItem value="Enterprise">{t('companyForm.selects.plan.enterprise')}</SelectItem>
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
                    {company ? t('companyForm.save') : t('companyForm.create')}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
