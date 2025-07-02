
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
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types';
import { addUser, updateUser } from '@/app/actions';

const userSchema = z.object({
  name: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  role: z.enum(['Admin', 'Member', 'Viewer']),
  status: z.enum(['Active', 'Suspended']),
  company: z.string().min(1, { message: "Company is required." }),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user: User | null;
  onSuccess: () => void;
}

export function UserFormDialog({ isOpen, onOpenChange, user, onSuccess }: UserFormDialogProps) {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'Member',
      status: 'Active',
      company: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (user) {
        form.reset({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          company: user.company,
        });
      } else {
        form.reset({
          name: '',
          email: '',
          role: 'Member',
          status: 'Active',
          company: '',
        });
      }
    }
  }, [user, form, isOpen]);

  const onSubmit = (values: UserFormValues) => {
    startTransition(async () => {
      const result = user
        ? await updateUser({ id: user.id, ...values })
        : await addUser(values);

      if (result.error) {
        toast({ variant: 'destructive', title: t('common.error'), description: result.error });
      } else {
        toast({
          title: t('common.success'),
          description: t(user ? 'userForm.toast.updateSuccess' : 'userForm.toast.addSuccess'),
        });
        onSuccess();
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? t('userForm.editTitle') : t('userForm.addTitle')}</DialogTitle>
          <DialogDescription>
            {user ? t('userForm.editDescription') : t('userForm.addDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userForm.labels.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('userForm.placeholders.name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('userForm.labels.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('userForm.placeholders.email')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('userForm.labels.company')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('userForm.placeholders.company')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
             <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('userForm.labels.role')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('userForm.selects.role.placeholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Admin">{t('userForm.selects.role.admin')}</SelectItem>
                        <SelectItem value="Member">{t('userForm.selects.role.member')}</SelectItem>
                        <SelectItem value="Viewer">{t('userForm.selects.role.viewer')}</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('userForm.labels.status')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('userForm.selects.status.placeholder')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Active">{t('userForm.selects.status.active')}</SelectItem>
                        <SelectItem value="Suspended">{t('userForm.selects.status.suspended')}</SelectItem>
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
                    {user ? t('userForm.save') : t('userForm.create')}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
