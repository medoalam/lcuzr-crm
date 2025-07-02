
"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getAuditLogs } from "@/app/actions";
import type { AuditLog } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { Input } from "@/components/ui/input";

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      const result = await getAuditLogs();
      if ("error" in result) {
        setError(result.error);
      } else {
        setLogs(result);
      }
      setLoading(false);
    };

    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    if (!filter) return logs;
    const lowercasedFilter = filter.toLowerCase();
    return logs.filter(log =>
      log.route.toLowerCase().includes(lowercasedFilter) ||
      log.tokenOwner.toLowerCase().includes(lowercasedFilter) ||
      log.ip.includes(filter) ||
      String(log.status).includes(filter)
    );
  }, [logs, filter]);

  const getStatusBadge = (status: number) => {
    const statusClass = 
        status >= 500 ? "bg-red-500/20 text-red-700 hover:bg-red-500/30 dark:bg-red-500/10 dark:text-red-400" :
        status >= 400 ? "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30 dark:bg-yellow-500/10 dark:text-yellow-400" :
        status >= 300 ? "bg-blue-500/20 text-blue-700 hover:bg-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400" :
        status >= 200 ? "bg-green-500/20 text-green-700 hover:bg-green-500/30 dark:bg-green-500/10 dark:text-green-400" :
        "bg-gray-500/20 text-gray-700 hover:bg-gray-500/30 dark:bg-gray-500/10 dark:text-gray-400";
    
    return <Badge className={`${statusClass}`}>{status}</Badge>;
  };

  const getMethodBadge = (method: string) => {
      let colorClass = "bg-gray-500/20 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
      switch(method.toUpperCase()) {
          case 'GET': colorClass = "bg-blue-500/20 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"; break;
          case 'POST': colorClass = "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400"; break;
          case 'PATCH': colorClass = "bg-yellow-500/20 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"; break;
          case 'DELETE': colorClass = "bg-red-500/20 text-red-700 dark:bg-red-500/10 dark:text-red-400"; break;
      }
      return <Badge className={`${colorClass} w-16 justify-center`}>{method}</Badge>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('gateway.audit.title')}</CardTitle>
        <CardDescription>{t('gateway.audit.description')}</CardDescription>
        <div className="flex gap-2 pt-4">
            <Input 
                placeholder={t('gateway.audit.filterPlaceholder')}
                className="max-w-sm"
                value={filter}
                onChange={e => setFilter(e.target.value)}
            />
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
            <div className="relative w-full overflow-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>{t('gateway.audit.table.timestamp')}</TableHead>
                    <TableHead>{t('gateway.audit.table.action')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('gateway.audit.table.user')}</TableHead>
                    <TableHead>{t('gateway.audit.table.ip')}</TableHead>
                    <TableHead className="text-right">{t('gateway.audit.table.duration')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {getMethodBadge(log.method)}
                                <span className="font-mono text-xs">{log.route}</span>
                            </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(log.status)}</TableCell>
                        <TableCell className="font-medium">{log.tokenOwner}</TableCell>
                        <TableCell className="font-mono">{log.ip}</TableCell>
                        <TableCell className="text-right">{log.duration}ms</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
                {filteredLogs.length === 0 && !loading && (
                    <div className="text-center p-8 text-muted-foreground">
                        {t('gateway.audit.noLogs')}
                    </div>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
