
'use client';

import { useTranslation } from 'react-i18next';
import {
  Building2,
  CreditCard,
  Headset,
  LayoutDashboard,
  Settings,
  Users,
  ShieldCheck,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { useEffect, useState } from 'react';

interface MainNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function MainNav({ activeTab, setActiveTab }: MainNavProps) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
    { id: 'companies', icon: Building2, labelKey: 'sidebar.companies' },
    { id: 'billing', icon: CreditCard, labelKey: 'sidebar.billing' },
    { id: 'support', icon: Headset, labelKey: 'sidebar.support' },
    { id: 'users', icon: Users, labelKey: 'sidebar.users' },
    { id: 'gateway', icon: ShieldCheck, labelKey: 'sidebar.gateway' },
    { id: 'settings', icon: Settings, labelKey: 'sidebar.settings' },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => setActiveTab(item.id)}
            isActive={activeTab === item.id}
            tooltip={isClient ? t(item.labelKey) : item.id.charAt(0).toUpperCase() + item.id.slice(1)}
          >
            <item.icon />
            {isClient && <span>{t(item.labelKey)}</span>}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
