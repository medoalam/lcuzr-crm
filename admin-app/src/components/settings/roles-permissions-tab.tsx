
"use client";

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Users, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import type { Role } from '@/lib/types';
import { initialRoles, initialUserRoles, initialPermissionGroups } from '@/lib/data/permissions-data';
import { RoleFormDialog } from './role-form-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export function RolesAndPermissionsTab() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleAddNew = () => {
    setSelectedRole(null);
    setIsFormOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsFormOpen(true);
  };

  const onFormSubmitted = (data: Omit<Role, 'id'>, id?: string) => {
    if (id) {
      setRoles(roles.map(r => r.id === id ? { ...r, ...data } : r));
      toast({ title: t('common.success'), description: t('settings.roles.toast.updated') });
    } else {
      const newRole: Role = {
        id: `role_${Date.now()}`,
        ...data,
      };
      setRoles([newRole, ...roles]);
      toast({ title: t('common.success'), description: t('settings.roles.toast.created') });
    }
  };

  const handleDelete = (roleId: string) => {
    if (roleId === 'role_01') {
        toast({ variant: 'destructive', title: t('common.error'), description: t('settings.roles.toast.deleteAdminError') });
        return;
    }
    setRoles(roles.filter(r => r.id !== roleId));
    toast({ title: t('common.success'), description: t('settings.roles.toast.deleted') });
  };
  
  const getUserCountForRole = (roleId: string) => {
    return initialUserRoles.filter(ur => ur.roleId === roleId).length;
  };

  return (
    <TooltipProvider>
        <div className="space-y-6">
        <RoleFormDialog
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            role={selectedRole}
            onSubmitted={onFormSubmitted}
        />
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
            <div>
                <CardTitle>{t('settings.roles.title')}</CardTitle>
                <CardDescription>{t('settings.roles.description')}</CardDescription>
            </div>
            <Button onClick={handleAddNew}>
                <PlusCircle className="me-2 h-4 w-4" />
                {t('settings.roles.createRole')}
            </Button>
            </CardHeader>
            <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{t('settings.roles.table.roleName')}</TableHead>
                    <TableHead>{t('settings.roles.table.description')}</TableHead>
                    <TableHead className="text-center">{t('settings.roles.table.users')}</TableHead>
                    <TableHead className="text-center">{t('settings.roles.table.permissions')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {roles.map((role) => (
                    <TableRow key={role.id}>
                    <TableCell className="font-semibold">{role.name}</TableCell>
                    <TableCell className="text-muted-foreground max-w-sm">{role.description}</TableCell>
                    <TableCell className="text-center">
                        <Badge variant="secondary" className="gap-1.5 ps-2 pe-2.5">
                            <Users className="h-3.5 w-3.5" />
                            {getUserCountForRole(role.id)}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <Badge variant="outline" className="gap-1.5 ps-2 pe-2.5">
                            <Shield className="h-3.5 w-3.5" />
                            {role.permissions.length}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t('common.openMenu')}</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(role)}>
                                    <Edit className="me-2 h-4 w-4" />
                                    {t('settings.roles.actions.edit')}
                                </DropdownMenuItem>
                                <AlertDialogTrigger asChild>
                                    <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={role.id === 'role_01'}>
                                        <Trash2 className="me-2 h-4 w-4" />
                                        {t('settings.roles.actions.delete')}
                                    </DropdownMenuItem>
                                </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('settings.roles.deleteDialog.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('settings.roles.deleteDialog.description', { name: role.name })}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(role.id)} className="bg-destructive hover:bg-destructive/90">
                                    {t('common.delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t('settings.roles.reference.title')}</CardTitle>
                <CardDescription>{t('settings.roles.reference.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {initialPermissionGroups.map(group => (
                        <AccordionItem key={group.group} value={group.group}>
                             <AccordionTrigger className="text-base font-semibold">{t(`settings.roles.permissionGroups.${group.group.toLowerCase()}`)}</AccordionTrigger>
                             <AccordionContent>
                                <div className="space-y-2 ps-4">
                                {group.permissions.map(permission => (
                                    <div key={permission.id} className="flex items-center gap-2">
                                        <code className="text-sm font-mono p-1 bg-muted rounded-md">{permission.id}</code>
                                        <span>-</span>
                                        <p className="text-sm text-muted-foreground">{t(`settings.roles.permissions.${permission.id.replace(':', '_')}_desc`)}</p>
                                    </div>
                                ))}
                                </div>
                             </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
        </div>
    </TooltipProvider>
  );
}
