
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, Package, Package2, Settings, ShoppingCart, Users, Bot, FileText, Building, LogOut, PanelLeft, Network, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import type { NavItem } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './language-switcher';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './theme-toggle';

// Defines the props for the sidebar, including the collapsed state.
interface CrmSidebarProps {
  isCollapsed: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'dashboard', icon: Home, roles: ['Admin', 'Sales Manager', 'Showroom Rep', 'Field Rep'] },
  { href: '/analytics', label: 'analytics', icon: LineChart, roles: ['Admin', 'Sales Manager'] },
  { href: '/leads', label: 'leads', icon: Users, roles: ['Admin', 'Sales Manager', 'Showroom Rep', 'Field Rep'] },
  { href: '/sales', label: 'sales', icon: ShoppingCart, roles: ['Admin', 'Sales Manager', 'Showroom Rep', 'Field Rep'] },
  { href: '/products', label: 'products', icon: Package, roles: ['Admin', 'Sales Manager'] },
  { href: '/branches', label: 'branches', icon: Building, roles: ['Admin', 'Sales Manager'] },
  { href: '/team-structure', label: 'team_structure', icon: Network, roles: ['Admin', 'Sales Manager', 'Showroom Rep', 'Field Rep'] },
  { href: '/billing', label: 'billing', icon: CreditCard, roles: ['Admin', 'Sales Manager'] },
  { href: '/ai-insights', label: 'ai_insights', icon: Bot, roles: ['Admin', 'Sales Manager', 'Showroom Rep', 'Field Rep'] },
  { href: '/reports', label: 'reports', icon: FileText, roles: ['Admin', 'Sales Manager'] },
];

const settingsItem: NavItem = { href: '/settings', label: 'settings', icon: Settings, roles: ['Admin'] };

// A reusable NavLink component that handles tooltips automatically when the sidebar is collapsed.
const NavLink = ({ item, isCollapsed, t }: { item: NavItem, isCollapsed: boolean, t: (key: string) => string }) => {
    const pathname = usePathname();
    const linkContent = (
      <Link
        href={item.href}
        aria-label={t(`sidebar.${item.label}`)}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground",
            isCollapsed && "justify-center"
        )}
      >
        <item.icon className="h-4 w-4 flex-shrink-0" />
        <span className={cn("truncate", isCollapsed && "hidden")}>{t(`sidebar.${item.label}`)}</span>
      </Link>
    );

    // Only show tooltips when the sidebar is collapsed for better UX.
    if (isCollapsed) {
        return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right">{t(`sidebar.${item.label}`)}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }
    
    return linkContent;
}

export function CrmSidebar({ isCollapsed }: CrmSidebarProps) {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const { t, i18n } = useTranslation();

  if (!user) return null;

  const accessibleNavItems = navItems.filter(item => item.roles.includes(user.role));
  const canAccessSettings = settingsItem.roles.includes(user.role);
  
  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className={cn("flex h-14 items-center border-b px-4 lg:h-[60px]", isCollapsed ? "justify-center" : "lg:px-6")}>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-primary" />
          <span className={cn(isCollapsed && "hidden")}>LCUZR CRM</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className={cn("grid items-start text-sm font-medium", isCollapsed ? "px-2" : "px-2 lg:px-4")}>
          {accessibleNavItems.map(item => (
            <NavLink key={item.label} item={item} isCollapsed={isCollapsed} t={t} />
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 space-y-4">
        <Card className={cn("bg-transparent border-none shadow-none", isCollapsed && "p-0")}>
          <CardHeader className="p-0 md:p-2 flex flex-row items-center gap-4">
              <Avatar className="h-9 w-9">
                  <AvatarImage src={user.avatar} alt="Avatar" data-ai-hint="user avatar" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={cn("grid gap-0.5", isCollapsed && "hidden")}>
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
              </div>
              <div className={cn("ms-auto flex items-center gap-1", isCollapsed && "hidden")}>
                  <LanguageSwitcher />
                  <ThemeToggle />
                  {canAccessSettings && (
                      <Link href={settingsItem.href}>
                           <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Settings className="h-4 w-4" />
                          </Button>
                      </Link>
                  )}
                  <Button onClick={logout} variant="ghost" size="icon" className="h-8 w-8">
                      <LogOut className="h-4 w-4" />
                  </Button>
              </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
  
  // The desktop sidebar is now fixed and its width is controlled by the layout.
  const desktopSidebar = (
    <div
        className="hidden md:flex flex-col fixed inset-y-0 start-0 z-10 border-e bg-card transition-[width] duration-300 ease-in-out"
        style={{ width: isCollapsed ? '60px' : '280px' }}
    >
        {sidebarContent}
    </div>
  );

  // The mobile sidebar remains a sheet, which is the best pattern for small screens.
  const mobileSidebar = (
     <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6 md:hidden">
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0">
                    <PanelLeft className="h-5 w-5 rtl:-scale-x-100" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side={i18n.dir() === 'rtl' ? 'right' : 'left'} className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
                        <Package2 className="h-6 w-6 text-primary" />
                        <span>LCUZR CRM</span>
                    </Link>
                    {accessibleNavItems.map(item => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-primary ${pathname === item.href ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                        >
                            <item.icon className="h-5 w-5" />
                            {t(`sidebar.${item.label}`)}
                        </Link>
                    ))}
                    {canAccessSettings && (
                        <Link
                            href={settingsItem.href}
                             className={`flex items-center gap-4 rounded-xl px-3 py-2 transition-all hover:text-primary ${pathname === settingsItem.href ? 'bg-muted text-primary' : 'text-muted-foreground'}`}
                        >
                            <settingsItem.icon className="h-5 w-5" />
                            {t(`sidebar.${settingsItem.label}`)}
                        </Link>
                    )}
                </nav>
                <div className="mt-auto p-4 space-y-4">
                    <div className="flex gap-2">
                        <LanguageSwitcher />
                        <ThemeToggle />
                    </div>
                    <Button onClick={logout} className="w-full gap-2">
                        <LogOut /> {t('sidebar.logout')}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
        <div className="w-full flex-1">
            {/* Can add search here if needed */}
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={user.avatar} alt="Avatar" data-ai-hint="user avatar" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>{t('sidebar.logout')}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
     </header>
  )

  return (
    <>
        {desktopSidebar}
        {mobileSidebar}
    </>
  )
}
