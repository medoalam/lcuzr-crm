
"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, PlusCircle, User, Users, Terminal } from "lucide-react";
import { getUsers, updateUser, deleteUser } from "@/app/actions";
import type { User as UserType } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { UserFormDialog } from './user-form-dialog';

export function UserManagementTab() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const { toast } = useToast();
  const { t } = useTranslation();
  const [isTransitioning, startTransition] = useTransition();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getUsers();
      if ('error' in result) {
        throw new Error(result.error);
      }
      setUsers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase()) ||
      user.company.toLowerCase().includes(filter.toLowerCase())
    );
  }, [users, filter]);

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleStatusToggle = (user: UserType) => {
    startTransition(async () => {
      const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
      const result = await updateUser({ id: user.id, status: newStatus });
      if (result.error) {
        toast({ variant: 'destructive', title: t('common.error'), description: result.error });
      } else {
        toast({ title: t('common.success'), description: t('userManagement.toast.statusUpdated') });
        fetchUsers();
      }
    });
  };

  const handleDelete = (userId: string) => {
    startTransition(async () => {
        const result = await deleteUser(userId);
        if (result.error) {
            toast({ variant: 'destructive', title: t('common.error'), description: result.error });
        } else {
            toast({ title: t('common.success'), description: t('userManagement.toast.deleted') });
            fetchUsers();
        }
    });
  };

  const getStatusBadge = (status: UserType["status"]) => {
    const variants = {
      Active: "bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400",
      Suspended: "bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400"
    };
    return <Badge className={variants[status]}>{t(`userManagement.status.${status.toLowerCase()}`)}</Badge>;
  };
  
  return (
    <>
    <UserFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
    />
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{t('userManagement.summary.totalUsers')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : users.length}</div>
                <p className="text-xs text-muted-foreground">{t('userManagement.summary.totalUsersDesc')}</p>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{t('userManagement.summary.activeUsers')}</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : users.filter(u => u.status === 'Active').length}</div>
                <p className="text-xs text-muted-foreground">{t('userManagement.summary.activeUsersDesc')}</p>
            </CardContent>
            </Card>
        </div>
        <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <CardTitle>{t('userManagement.title')}</CardTitle>
                    <CardDescription>{t('userManagement.description')}</CardDescription>
                </div>
                <Button onClick={handleAddNew}>
                    <PlusCircle className="me-2 h-4 w-4" />
                    {t('userManagement.inviteUser')}
                </Button>
            </div>
            <div className="pt-4">
                <Input 
                placeholder={t('userManagement.filterPlaceholder')}
                className="max-w-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                />
            </div>
        </CardHeader>
        <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : error ? (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>{t('common.error')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        ) : (
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>{t('userManagement.table.user')}</TableHead>
                    <TableHead>{t('userManagement.table.company')}</TableHead>
                    <TableHead>{t('userManagement.table.role')}</TableHead>
                    <TableHead>{t('userManagement.table.lastLogin')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>
                    <span className="sr-only">{t('common.actions')}</span>
                    </TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                    <TableCell className="font-medium">
                        <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </TableCell>
                    <TableCell>{user.company}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{new Date(user.lastLogin).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isTransitioning}>
                                    <span className="sr-only">{t('common.openMenu')}</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => handleEdit(user)}>{t('userManagement.actions.edit')}</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleStatusToggle(user)}>
                                        {user.status === 'Active' ? t('userManagement.actions.suspend') : t('userManagement.actions.activate')}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                            {t('userManagement.actions.delete')}
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('userManagement.deleteDialog.title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('userManagement.deleteDialog.description', { name: user.name })}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive hover:bg-destructive/90">
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
        )}
        </CardContent>
        </Card>
    </div>
    </>
  );
}
