
"use client";

import { useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { initialPermissionGroups } from '@/lib/data/permissions-data';
import type { Role } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const roleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters.'),
  description: z.string().min(5, 'Description must be at least 5 characters.'),
  permissions: z.array(z.string()).min(1, 'At least one permission must be selected.'),
});

type RoleFormValues = z.infer<typeof roleSchema>;

interface RoleFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  role: Role | null;
  onSubmitted: (data: RoleFormValues, id?: string) => void;
}

export function RoleFormDialog({ isOpen, onOpenChange, role, onSubmitted }: RoleFormDialogProps) {
  const { t } = useTranslation();
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      description: '',
      permissions: [],
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (role) {
        form.reset({
          name: role.name,
          description: role.description,
          permissions: role.permissions,
        });
      } else {
        form.reset({
          name: '',
          description: '',
          permissions: [],
        });
      }
    }
  }, [role, form, isOpen]);

  const onSubmit = (values: RoleFormValues) => {
    onSubmitted(values, role?.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{role ? t('settings.roles.form.editTitle') : t('settings.roles.form.createTitle')}</DialogTitle>
          <DialogDescription>
            {role ? t('settings.roles.form.editDescription') : t('settings.roles.form.createDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.roles.form.labels.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('settings.roles.form.placeholders.name')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('settings.roles.form.labels.description')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('settings.roles.form.placeholders.description')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="permissions"
                render={() => (
                    <FormItem>
                        <FormLabel>{t('settings.roles.form.labels.permissions')}</FormLabel>
                        <p className="text-sm text-muted-foreground">{t('settings.roles.form.permissionsDescription')}</p>
                         <ScrollArea className="h-72 w-full rounded-md border p-4">
                            <Accordion type="multiple" className="w-full">
                                {initialPermissionGroups.map((group) => (
                                    <AccordionItem key={group.group} value={group.group}>
                                        <AccordionTrigger className="text-base font-semibold">{t(`settings.roles.permissionGroups.${group.group.toLowerCase()}`)}</AccordionTrigger>
                                        <AccordionContent>
                                        <FormField
                                            control={form.control}
                                            name="permissions"
                                            render={({ field }) => (
                                                <div className="space-y-3 ps-2">
                                                {group.permissions.map((item) => (
                                                    <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(field.value?.filter((value) => value !== item.id));
                                                            }}
                                                            />
                                                        </FormControl>
                                                        <div className="space-y-1 leading-none">
                                                            <FormLabel>{t(`settings.roles.permissions.${item.id.replace(':', '_')}_label`)}</FormLabel>
                                                            <p className="text-xs text-muted-foreground">{t(`settings.roles.permissions.${item.id.replace(':', '_')}_desc`)}</p>
                                                        </div>
                                                    </FormItem>
                                                ))}
                                                </div>
                                            )}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                         </ScrollArea>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{role ? t('common.save') : t('common.create')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
