
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DollarSign, AlertCircle, Download, MoreHorizontal, Calendar as CalendarIcon, ArrowUpDown, RefreshCw, CreditCard, ArrowUp } from "lucide-react";
import { getTransactions } from "@/app/actions";
import type { Transaction } from "@/lib/types";
import { format, addDays } from "date-fns";
import type { DateRange } from "react-day-picker";

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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Terminal } from "lucide-react";

export function BillingTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  // Filter and sort state
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter] = useState("All");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [sortKey, setSortKey] = useState<keyof Transaction | ''>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getTransactions();
        if ('error' in result) {
          throw new Error(result.error);
        }
        setTransactions(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
        const searchMatch = filter === "" || 
            transaction.company.toLowerCase().includes(filter.toLowerCase()) || 
            transaction.invoice.toLowerCase().includes(filter.toLowerCase());
        const statusMatch = statusFilter === "All" || transaction.status === statusFilter;
        const planMatch = planFilter === "All" || transaction.plan === planFilter;
        const dateMatch = !dateRange || (
            new Date(transaction.date) >= (dateRange.from || new Date(0)) &&
            new Date(transaction.date) <= (dateRange.to || new Date())
        );
        return searchMatch && statusMatch && planMatch && dateMatch;
    });

    if (sortKey) {
        filtered.sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            // Handle date sorting
            if (sortKey === 'date' || sortKey === 'nextBillingDate') {
                const dateA = new Date(aValue).getTime();
                const dateB = new Date(bValue).getTime();
                 if (dateA < dateB) return sortDirection === 'asc' ? -1 : 1;
                 if (dateA > dateB) return sortDirection === 'asc' ? 1 : -1;
                 return 0;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }

    return filtered;
  }, [transactions, filter, statusFilter, planFilter, dateRange, sortKey, sortDirection]);

  const handleSort = (key: keyof Transaction) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    const variants: Record<Transaction["status"], string> = {
      Paid: "bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400",
      Pending: "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400",
      Failed: "bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400",
      Refunded: "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30 dark:bg-gray-500/10 dark:text-gray-400",
    };
    return <Badge className={variants[status]}>{t(`billing.status.${status.toLowerCase()}`)}</Badge>;
  };
  
  const summaryStats = useMemo(() => {
    const now = new Date();
    const next30Days = addDays(now, 30);
    return {
        activeSubscriptions: new Set(transactions.filter(t => t.status === "Paid").map(t => t.companyId)).size,
        overdueCount: transactions.filter(t => t.status === "Failed" || t.status === "Pending").length,
        upcomingRenewals: transactions.filter(t => {
            if (t.status !== "Paid" || !t.nextBillingDate) return false;
            const nextBilling = new Date(t.nextBillingDate);
            return nextBilling > now && nextBilling <= next30Days;
        }).length
    }
  }, [transactions]);

  const uniquePlans = Array.from(new Set(transactions.map(t => t.plan)));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>{t('billing.summary.activeSubscriptions')}</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{loading ? "..." : summaryStats.activeSubscriptions}</div>
                <p className="text-xs text-muted-foreground">{t('billing.summary.activeSubscriptionsDesc')}</p>
            </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{t('billing.summary.mrr')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 me-1" />
              {t('billing.summary.mrrDesc')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{t('billing.summary.upcomingRenewals')}</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : summaryStats.upcomingRenewals}</div>
            <p className="text-xs text-muted-foreground">{t('billing.summary.upcomingRenewalsDesc')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>{t('billing.summary.overdueInvoices')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : summaryStats.overdueCount}</div>
            <p className="text-xs text-muted-foreground">{t('billing.summary.overdueInvoicesDesc')}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>{t('billing.history.title')}</CardTitle>
            <CardDescription>{t('billing.history.description')}</CardDescription>
            <div className="flex flex-wrap items-center gap-2 pt-4">
                <Input 
                    placeholder={t('billing.history.filterPlaceholder')}
                    className="max-w-sm"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder={t('billing.history.filterByStatus')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">{t('billing.history.allStatuses')}</SelectItem>
                        <SelectItem value="Paid">{t('billing.status.paid')}</SelectItem>
                        <SelectItem value="Pending">{t('billing.status.pending')}</SelectItem>
                        <SelectItem value="Failed">{t('billing.status.failed')}</SelectItem>
                        <SelectItem value="Refunded">{t('billing.status.refunded')}</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder={t('billing.history.filterByPlan')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">{t('billing.history.allPlans')}</SelectItem>
                        {uniquePlans.map(plan => <SelectItem key={plan} value={plan}>{plan}</SelectItem>)}
                    </SelectContent>
                </Select>
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className="w-full sm:w-[240px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="me-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>{t('billing.history.pickDateRange')}</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                    />
                    </PopoverContent>
                </Popover>
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
                    <TableHead>
                        <Button variant="ghost" className="-ms-4" onClick={() => handleSort('invoice')}>
                            {t('billing.table.invoiceId')} <ArrowUpDown className="ms-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                         <Button variant="ghost" className="-ms-4" onClick={() => handleSort('company')}>
                            {t('billing.table.company')} <ArrowUpDown className="ms-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead>
                         <Button variant="ghost" className="-ms-4" onClick={() => handleSort('date')}>
                            {t('billing.table.date')} <ArrowUpDown className="ms-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                     <TableHead>{t('billing.table.paymentMethod')}</TableHead>
                    <TableHead>{t('billing.table.plan')}</TableHead>
                    <TableHead>
                         <Button variant="ghost" className="-ms-4" onClick={() => handleSort('nextBillingDate')}>
                            {t('billing.table.nextBilling')} <ArrowUpDown className="ms-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead className="text-center">
                        <Button variant="ghost" onClick={() => handleSort('status')}>
                            {t('common.status')} <ArrowUpDown className="ms-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead className="text-right">
                         <Button variant="ghost" className="ms-4" onClick={() => handleSort('amount')}>
                            {t('billing.table.amount')} <ArrowUpDown className="ms-2 h-4 w-4" />
                        </Button>
                    </TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredAndSortedTransactions.map((transaction) => (
                    <TableRow key={transaction.invoice}>
                        <TableCell className="font-medium">
                            <a href="#" className="hover:underline">{transaction.invoice}</a>
                        </TableCell>
                        <TableCell>
                            <a href="#" className="hover:underline">{transaction.company}</a>
                        </TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell>{transaction.paymentMethod}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{transaction.plan}</Badge>
                        </TableCell>
                        <TableCell>{new Date(transaction.nextBillingDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">
                            {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="text-right">
                        ${transaction.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t('common.openMenu')}</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t('billing.actions.invoiceActions')}</DropdownMenuLabel>
                                    <DropdownMenuItem>{t('common.viewDetails')}</DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Download className="me-2 h-4 w-4"/> {t('billing.actions.download')}
                                    </DropdownMenuItem>
                                    {transaction.status === 'Failed' ? (
                                        <>
                                            <DropdownMenuItem>{t('billing.actions.retryPayment')}</DropdownMenuItem>
                                            <DropdownMenuItem>{t('billing.actions.sendReminder')}</DropdownMenuItem>
                                        </>
                                    ) : (
                                       <DropdownMenuItem>{t('billing.actions.resendInvoice')}</DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuLabel>{t('billing.actions.subscription')}</DropdownMenuLabel>
                                    <DropdownMenuItem disabled>{t('billing.actions.suspend')}</DropdownMenuItem>
                                    <DropdownMenuItem disabled>{t('billing.actions.cancel')}</DropdownMenuItem>
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
