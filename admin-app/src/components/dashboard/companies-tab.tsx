
"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { MoreHorizontal, ArrowUpDown, Terminal, PlusCircle, ExternalLink, Bot, Loader2, Users, Trash2 } from "lucide-react";
import type { Company } from "@/lib/types";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCompanies, deleteCompany } from "@/app/actions";
import { CompanyFormDialog } from "./company-form-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

import { predictUsageAndSuggestUpgrade, UsagePredictionOutput } from "@/ai/flows/ai-usage-predictions";
import { suggestPlanUpgrades, SuggestPlanUpgradesOutput } from "@/ai/flows/upgrade-suggestions";
import { Checkbox } from "../ui/checkbox";

type SortKey = keyof Company | '';
type AiResult = SuggestPlanUpgradesOutput | UsagePredictionOutput | { error: string } | null;

export function CompaniesTab() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const { toast } = useToast();
  const { t } = useTranslation();
  const [isDeletePending, startDeleteTransition] = useTransition();

  const [isAiLoading, startAiTransition] = useTransition();
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false);
  const [aiDialogTitle, setAiDialogTitle] = useState("");
  const [aiResult, setAiResult] = useState<AiResult>(null);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCompanies();
      if ("error" in result) {
        throw new Error(result.error);
      }
      setCompanies(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  const sortedAndFilteredCompanies = useMemo(() => {
    let result = companies.filter((company) =>
      company.name.toLowerCase().includes(filter.toLowerCase()) ||
      company.industry.toLowerCase().includes(filter.toLowerCase())
    );

    if (sortKey) {
      result.sort((a, b) => {
        const aValue = a[sortKey];
        const bValue = b[sortKey];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [companies, filter, sortKey, sortDirection]);

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCompany(null);
    setIsFormOpen(true);
  };

  const onFormSubmitted = () => {
    setIsFormOpen(false);
    fetchCompanies(); // Refetch data after submission
  };

  const handleDelete = (id: string) => {
    startDeleteTransition(async () => {
        const result = await deleteCompany(id);
        if (result.error) {
            toast({ variant: 'destructive', title: t('common.error'), description: result.error });
        } else {
            toast({ title: t('common.success'), description: t('companies.toast.deleteSuccess') });
            fetchCompanies();
        }
    });
  };

  const handleDeleteSelected = () => {
    startDeleteTransition(async () => {
        const idsToDelete = Object.keys(rowSelection).filter(id => rowSelection[id]);
        const results = await Promise.all(idsToDelete.map(id => deleteCompany(id)));
        const failed = results.filter(r => r.error);
        if (failed.length > 0) {
            toast({ variant: 'destructive', title: t('common.error'), description: `${failed.length} companies could not be deleted.` });
        } else {
            toast({ title: t('common.success'), description: `${idsToDelete.length} companies deleted successfully.` });
        }
        setRowSelection({});
        fetchCompanies();
    });
  }

  const handlePredictUsage = (company: Company) => {
    setAiDialogTitle(t('companies.aiDialog.predictionTitle', { companyName: company.name }));
    setAiResult(null);
    setIsAiDialogOpen(true);
    startAiTransition(async () => {
        try {
            const usageData = JSON.stringify({ month: 'current', ...company.usage });
            const featureLimits = JSON.stringify({ users: 50, storageGB: company.usage.limit, leads: 3000 });
            const res = await predictUsageAndSuggestUpgrade({
                companyName: company.name,
                currentPlan: company.plan,
                resourceUsageData: usageData,
                featureLimits: featureLimits,
            });
            setAiResult(res);
        } catch (err) {
            setAiResult({ error: err instanceof Error ? err.message : "An unknown AI error occurred." });
        }
    });
  }

  const handleSuggestUpgrade = (company: Company) => {
    setAiDialogTitle(t('companies.aiDialog.suggestionTitle', { companyName: company.name }));
    setAiResult(null);
    setIsAiDialogOpen(true);
    startAiTransition(async () => {
        try {
            const usageData = JSON.stringify(company.usage);
            const featureLimits = JSON.stringify({ users: 50, storageGB: company.usage.limit, leads: 3000 });
            const res = await suggestPlanUpgrades({
                companyName: company.name,
                currentPlan: company.plan,
                usageData: usageData,
                featureLimits: featureLimits,
            });
            setAiResult(res);
        } catch(err) {
            setAiResult({ error: err instanceof Error ? err.message : "An unknown AI error occurred." });
        }
    });
  }

  const getStatusBadge = (status: Company["status"]) => {
    const variants = {
      Active: "bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400",
      Trial: "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400",
      Suspended: "bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400"
    };
    return <Badge className={variants[status]}>{t(`companies.status.${status.toLowerCase()}`)}</Badge>;
  };

  const renderAiResult = () => {
    if (!aiResult) return null;
    if ('error' in aiResult) {
        return <p className="text-destructive">{aiResult.error}</p>
    }
    if ('upgradeRecommendation' in aiResult) { // SuggestPlanUpgradesOutput
        return (
            <div className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold text-foreground">{t('companies.aiDialog.result.recommendation')}</h4>
                    <p className="text-muted-foreground">{aiResult.upgradeRecommendation}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{t('companies.aiDialog.result.reasoning')}</h4>
                    <p className="text-muted-foreground">{aiResult.reasoning}</p>
                </div>
            </div>
        )
    }
    if ('predictedUsage' in aiResult) { // UsagePredictionOutput
        return (
             <div className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold text-foreground">{t('companies.aiDialog.result.predictedUsage')}</h4>
                    <p className="text-muted-foreground">{aiResult.predictedUsage}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground">{t('companies.aiDialog.result.suggestion')}</h4>
                    <p className="text-muted-foreground">{aiResult.upgradeSuggestion}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-foreground">{t('companies.aiDialog.result.confidence')}</h4>
                    <p className="text-muted-foreground capitalize">{aiResult.confidenceLevel}</p>
                </div>
            </div>
        )
    }
    return null;
  }
  
  const numSelected = Object.values(rowSelection).filter(Boolean).length;

  return (
    <>
    <CompanyFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        company={selectedCompany}
        onSubmitted={onFormSubmitted}
    />
     <Dialog open={isAiDialogOpen} onOpenChange={setIsAiDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Bot className="text-primary"/> {aiDialogTitle}</DialogTitle>
                <DialogDescription>
                    {t('companies.aiDialog.description')}
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                {isAiLoading ? (
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{t('companies.aiDialog.analyzing')}</span>
                    </div>
                ) : (
                    renderAiResult()
                )}
            </div>
        </DialogContent>
    </Dialog>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <CardTitle>{t('companies.title')}</CardTitle>
                <CardDescription>
                {t('companies.description')}
                </CardDescription>
            </div>
            <Button onClick={handleAddNew}>
                <PlusCircle className="me-2 h-4 w-4" />
                {t('companies.addCompany')}
            </Button>
        </div>
        <div className="pt-4 flex items-center justify-between">
            <Input 
              placeholder={t('companies.filterPlaceholder')}
              className="max-w-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {numSelected > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {numSelected} selected
                    </span>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="me-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                             <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently delete {numSelected} companies. This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteSelected} disabled={isDeletePending} className="bg-destructive hover:bg-destructive/90">
                                    {isDeletePending ? "Deleting..." : "Yes, delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )}
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
                <TableHead className="w-12">
                    <Checkbox
                        checked={
                            (numSelected > 0 && numSelected === sortedAndFilteredCompanies.length)
                            ? true
                            : (numSelected > 0 && numSelected < sortedAndFilteredCompanies.length)
                            ? 'indeterminate'
                            : false
                        }
                        onCheckedChange={(checked) => {
                            const newRowSelection: Record<string, boolean> = {};
                            if (checked === true) {
                                sortedAndFilteredCompanies.forEach(c => newRowSelection[c.id] = true);
                            }
                            setRowSelection(newRowSelection);
                        }}
                    />
                </TableHead>
                <TableHead>
                  <Button variant="ghost" className="-ms-4" onClick={() => handleSort('name')}>
                    {t('companies.table.companyName')} <ArrowUpDown className="ms-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('industry')}>
                        {t('companies.table.industry')} <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead>{t('companies.table.country')}</TableHead>
                <TableHead>{t('companies.table.users')}</TableHead>
                <TableHead>{t('companies.table.usage')}</TableHead>
                 <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('plan')}>
                        {t('companies.table.plan')} <ArrowUpDown className="ms-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>
                  <span className="sr-only">{t('common.actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredCompanies.map((company) => (
                <TableRow key={company.id} data-state={rowSelection[company.id] ? 'selected' : undefined}>
                  <TableCell>
                      <Checkbox
                          checked={rowSelection[company.id] || false}
                          onCheckedChange={(checked) => {
                              setRowSelection(prev => ({...prev, [company.id]: !!checked}));
                          }}
                      />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                        <span>{company.name}</span>
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:underline flex items-center gap-1">
                            {company.website} <ExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                  </TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.location.split(',').pop()?.trim()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {company.usage.users}
                    </div>
                  </TableCell>
                  <TableCell>
                      <div className="flex flex-col gap-1 w-32">
                          <Progress value={(company.usage.storage / company.usage.limit) * 100} className="h-2" />
                          <span className="text-xs text-muted-foreground">
                            {company.usage.storage}GB / {company.usage.limit}GB
                          </span>
                      </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{company.plan}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(company.status)}</TableCell>
                  <TableCell>
                    <AlertDialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t('common.openMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(company)}>{t('companies.actions.edit')}</DropdownMenuItem>
                            <DropdownMenuItem disabled>{t('companies.actions.view')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                             <DropdownMenuLabel className="flex items-center gap-2 text-primary/80"><Bot className="size-3.5" /> {t('companies.actions.ai')}</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handlePredictUsage(company)}>{t('companies.actions.predictUsage')}</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuggestUpgrade(company)}>{t('companies.actions.suggestUpgrade')}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                {t('companies.actions.delete')}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('companies.deleteDialog.title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                {t('companies.deleteDialog.description', { name: company.name })}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={() => handleDelete(company.id)} 
                                    disabled={isDeletePending}
                                    className="bg-destructive hover:bg-destructive/90">
                                    {isDeletePending ? t('companies.deleteDialog.deleting') : t('common.delete')}
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
    </>
  );
}
