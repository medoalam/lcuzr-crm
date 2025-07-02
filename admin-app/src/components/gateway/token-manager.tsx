
"use client";

import { useState, useEffect, useTransition } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Edit, MoreVertical, PlusCircle, Trash2, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { getAdminTokensAction, createApiToken, revokeApiToken } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { AdminTokenView } from '@/lib/types';

const ALL_SCOPES = [
  "companies:view", "companies:create", "companies:edit", "companies:delete",
  "billing:view", "billing:manage", "billing:export",
  "support:view", "support:reply", "support:manage",
  "users:view", "users:invite", "users:manage",
  "gateway:admin", "logs:read",
  "settings:view", "settings:edit", "roles:manage"
];

function CreateTokenDialog({ onTokenCreated }: { onTokenCreated: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [owner, setOwner] = useState("");
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
  
    const { toast } = useToast();
  
    const handleCreateToken = () => {
      if (!owner) {
        setError(t('gateway.token.form.ownerRequired'));
        return;
      }
      if (selectedScopes.length === 0) {
        setError(t('gateway.token.form.scopeRequired'));
        return;
      }
      setError(null);
  
      startTransition(async () => {
        const result = await createApiToken({ owner, scopes: selectedScopes });
        if ("error" in result) {
          setError(result.error);
          toast({ variant: 'destructive', title: t('common.error'), description: result.error });
        } else {
          toast({ title: t('common.success'), description: t('gateway.token.toast.created') });
          onTokenCreated();
          setIsOpen(false);
          setOwner("");
          setSelectedScopes([]);
        }
      });
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle className="me-2"/>
            {t('gateway.token.createToken')}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('gateway.token.form.title')}</DialogTitle>
            <DialogDescription>{t('gateway.token.form.description')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                {t('gateway.token.form.ownerLabel')}
              </Label>
              <Input
                id="owner"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="col-span-3"
                placeholder={t('gateway.token.form.ownerPlaceholder')}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">{t('gateway.token.form.scopesLabel')}</Label>
              <div className="col-span-3 grid grid-cols-2 gap-2">
                {ALL_SCOPES.map(scope => (
                  <div key={scope} className="flex items-center space-x-2">
                    <Checkbox
                      id={scope}
                      checked={selectedScopes.includes(scope)}
                      onCheckedChange={(checked) => {
                        setSelectedScopes(prev => 
                          checked ? [...prev, scope] : prev.filter(s => s !== scope)
                        );
                      }}
                    />
                    <label
                      htmlFor={scope}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {scope}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="text-sm text-destructive col-span-4 text-center">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateToken} disabled={isPending}>
              {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
              {t('gateway.token.form.createButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}

function RevokeTokenDialog({ token, onRevoked }: { token: AdminTokenView, onRevoked: () => void }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    const { t } = useTranslation();

    const handleRevoke = () => {
        startTransition(async () => {
            const result = await revokeApiToken(token.id);
            if (result.error) {
                toast({ variant: 'destructive', title: t('common.error'), description: result.error });
            } else {
                toast({ title: t('common.success'), description: t('gateway.token.toast.revoked', { owner: token.owner }) });
                onRevoked();
            }
        });
    }

    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{t('gateway.token.revokeDialog.title')}</AlertDialogTitle>
                <AlertDialogDescription>
                    {t('gateway.token.revokeDialog.description', { owner: token.owner, id: token.id.substring(0,8) })}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleRevoke} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                    {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
                    {t('gateway.token.revokeDialog.confirm')}
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    )
}

export function TokenManager() {
  const [tokens, setTokens] = useState<AdminTokenView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenToRevoke, setTokenToRevoke] = useState<AdminTokenView | null>(null);
  const { t } = useTranslation();

  const fetchTokens = async () => {
    setLoading(true);
    setError(null);
    const result = await getAdminTokensAction();
    if ("error" in result) {
      setError(result.error);
    } else {
      setTokens(result);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const getStatusBadge = (status: 'active' | 'revoked') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">{t('gateway.token.status.active')}</Badge>;
      case 'revoked':
        return <Badge variant="destructive" className="bg-red-500/20 text-red-700 hover:bg-red-500/30">{t('gateway.token.status.revoked')}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AlertDialog>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle>{t('gateway.token.title')}</CardTitle>
                <CardDescription>{t('gateway.token.description')}</CardDescription>
            </div>
            <CreateTokenDialog onTokenCreated={fetchTokens} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
            <div className="space-y-2">
                {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
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
                <TableHead>{t('gateway.token.table.owner')}</TableHead>
                <TableHead>{t('common.status')}</TableHead>
                <TableHead>{t('gateway.token.table.scopes')}</TableHead>
                <TableHead>{t('gateway.token.table.lastUsed')}</TableHead>
                <TableHead>{t('gateway.token.table.tokenId')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tokens.map((token) => (
                <TableRow key={token.id}>
                    <TableCell className="font-medium">{token.owner}</TableCell>
                    <TableCell>{getStatusBadge(token.status)}</TableCell>
                    <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-xs">
                            {token.scopes.map(scope => (
                                <Badge key={scope} variant="secondary" className="font-normal">{scope}</Badge>
                            ))}
                        </div>
                    </TableCell>
                    <TableCell>{new Date(token.last_used).toLocaleString()}</TableCell>
                    <TableCell className="font-mono text-xs">{token.id}</TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem disabled><Copy className="me-2"/> {t('gateway.token.actions.copy')}</DropdownMenuItem>
                            <DropdownMenuItem disabled><Edit className="me-2"/> {t('gateway.token.actions.edit')}</DropdownMenuItem>
                             <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => { e.preventDefault(); setTokenToRevoke(token); }}
                                >
                                    <Trash2 className="me-2"/> {t('gateway.token.actions.revoke')}
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
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
    {tokenToRevoke && <RevokeTokenDialog token={tokenToRevoke} onRevoked={() => { setTokenToRevoke(null); fetchTokens(); }} />}
    </AlertDialog>
  );
}
