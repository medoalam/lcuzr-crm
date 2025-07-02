
'use client';

import {
  LayoutDashboard,
  Building2,
  ShieldCheck,
  CreditCard,
  Headset,
  Users,
  Network,
  Settings,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Icons } from './icons';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const menuItems = [
    { id: 'dashboard', labelKey: 'sidebar.dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'companies', labelKey: 'sidebar.companies', label: 'Companies', icon: Building2 },
    { id: 'billing', labelKey: 'sidebar.billing', label: 'Billing', icon: CreditCard },
    { id: 'support', labelKey: 'sidebar.support', label: 'Support', icon: Headset },
    { id: 'users', labelKey: 'sidebar.users', label: 'Users', icon: Users },
    { id: 'permissions', labelKey: 'sidebar.permissions', label: 'Permissions', icon: ShieldCheck },
    { id: 'gateway', labelKey: 'sidebar.gateway', label: 'Gateway', icon: Network },
    { id: 'settings', labelKey: 'sidebar.settings', label: 'Settings', icon: Settings },
];

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const { t } = useTranslation();
  const { isRtl } = useSidebar();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getLabel = (item: typeof menuItems[0]) => {
      if (!isClient) return item.label;
      return t(item.labelKey, item.label);
  }

  return (
    <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Icons.logo className={cn('size-6 text-primary')} />
                <h1 className={cn('text-lg font-bold')}>
                    Admin Panel
                </h1>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                            onClick={() => setActiveTab(item.id)}
                            isActive={activeTab === item.id}
                            tooltip={{
                                children: getLabel(item),
                                side: isRtl ? 'left' : 'right',
                            }}
                        >
                            <item.icon />
                            <span>{getLabel(item)}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
    </Sidebar>
  );
}
