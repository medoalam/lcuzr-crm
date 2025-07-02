
"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, Tag, Clock, Check, PlusCircle } from "lucide-react";
import { getTickets, updateTicketStatus } from "@/app/actions";
import type { Ticket, TicketStatus, TicketPriority } from "@/lib/types";

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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SupportTab() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [isUpdating, startUpdateTransition] = useTransition();
  const { toast } = useToast();
  const { t } = useTranslation();

  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTickets();
      if ('error' in result) {
        throw new Error(result.error);
      }
      setTickets(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    startUpdateTransition(async () => {
      const result = await updateTicketStatus(ticketId, newStatus);
      if (result.error) {
        toast({ variant: "destructive", title: t('common.error'), description: result.error });
      } else {
        toast({ title: t('common.success'), description: t('support.toast.statusUpdated') });
        fetchTickets();
      }
    });
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const searchMatch = filter === "" || ticket.subject.toLowerCase().includes(filter.toLowerCase()) || ticket.company.toLowerCase().includes(filter.toLowerCase());
      const statusMatch = statusFilter === "All" || ticket.status === statusFilter;
      const priorityMatch = priorityFilter === "All" || ticket.priority === priorityFilter;
      return searchMatch && statusMatch && priorityMatch;
    });
  }, [tickets, filter, statusFilter, priorityFilter]);

  const getPriorityBadge = (priority: TicketPriority) => {
    const variants = {
      High: "bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400",
      Medium: "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400",
      Low: "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400",
    };
    return <Badge className={variants[priority]}>{t(`support.priority.${priority.toLowerCase()}`)}</Badge>;
  };

  const getStatusBadge = (status: TicketStatus) => {
     const variants: Record<TicketStatus, string> = {
      Open: "bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400",
      "In Progress": "bg-amber-500/20 text-amber-700 hover:bg-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400",
      Resolved: "bg-sky-500/20 text-sky-700 hover:bg-sky-500/30 dark:bg-sky-500/10 dark:text-sky-400",
      Closed: "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30 dark:bg-gray-500/10 dark:text-gray-400",
    };
    return <Badge className={variants[status]}>{t(`support.status.${status.replace(' ', '').toLowerCase()}`)}</Badge>;
  };

  return (
    <div className="space-y-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('support.summary.openTickets')}</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : tickets.filter(t => t.status === 'Open').length}</div>
            <p className="text-xs text-muted-foreground">{t('support.summary.openTicketsDesc')}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('support.summary.inProgress')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : tickets.filter(t => t.status === 'In Progress').length}</div>
            <p className="text-xs text-muted-foreground">{t('support.summary.inProgressDesc')}</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader  className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('support.summary.avgResponse')}</CardTitle>
                 <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                 <div className="text-2xl font-bold">{t('support.summary.avgResponseTime')}</div>
                <p className="text-xs text-muted-foreground">{t('support.summary.avgResponseDesc')}</p>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('support.summary.resolvedToday')}</CardTitle>
                <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">12</div>
                 <p className="text-xs text-muted-foreground">{t('support.summary.resolvedTodayDesc')}</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                  <CardTitle>{t('support.title')}</CardTitle>
                  <CardDescription>{t('support.description')}</CardDescription>
              </div>
              <Button>
                  <PlusCircle className="me-2 h-4 w-4" />
                  {t('support.newTicket')}
              </Button>
          </div>
          <div className="flex items-center gap-2 pt-4">
              <Input 
                placeholder={t('support.filterPlaceholder')}
                className="max-w-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('support.filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="All">{t('support.allStatuses')}</SelectItem>
                      <SelectItem value="Open">{t('support.status.open')}</SelectItem>
                      <SelectItem value="In Progress">{t('support.status.inprogress')}</SelectItem>
                      <SelectItem value="Resolved">{t('support.status.resolved')}</SelectItem>
                      <SelectItem value="Closed">{t('support.status.closed')}</SelectItem>
                  </SelectContent>
              </Select>
               <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={t('support.filterByPriority')} />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="All">{t('support.allPriorities')}</SelectItem>
                      <SelectItem value="High">{t('support.priority.high')}</SelectItem>
                      <SelectItem value="Medium">{t('support.priority.medium')}</SelectItem>
                      <SelectItem value="Low">{t('support.priority.low')}</SelectItem>
                  </SelectContent>
              </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
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
                        <TableHead>{t('support.table.subject')}</TableHead>
                        <TableHead>{t('support.table.company')}</TableHead>
                        <TableHead>{t('support.table.priority')}</TableHead>
                        <TableHead>{t('common.status')}</TableHead>
                        <TableHead>{t('support.table.createdDate')}</TableHead>
                        <TableHead>{t('support.table.assignedTo')}</TableHead>
                        <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id} className={isUpdating && ticket.id === tickets.find(t => t.status !== ticket.status)?.id ? "opacity-50" : ""}>
                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                        <TableCell>{ticket.company}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{new Date(ticket.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>{ticket.assignedAgent}</TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdating}>
                                <span className="sr-only">{t('common.openMenu')}</span>
                                <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                                <DropdownMenuItem>{t('common.viewDetails')}</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>{t('support.actions.changeStatus')}</DropdownMenuLabel>
                                <DropdownMenuRadioGroup 
                                value={ticket.status} 
                                onValueChange={(value) => handleStatusChange(ticket.id, value as TicketStatus)}
                                >
                                <DropdownMenuRadioItem value="Open">{t('support.status.open')}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="In Progress">{t('support.status.inprogress')}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Resolved">{t('support.status.resolved')}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Closed">{t('support.status.closed')}</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
