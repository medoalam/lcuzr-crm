
'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Header } from '@/components/dashboard/header';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { CompaniesTab } from '@/components/dashboard/companies-tab';
import { BillingTab } from '@/components/dashboard/billing-tab';
import { DashboardTab } from '@/components/dashboard/dashboard-tab';
import { SupportTab } from '@/components/dashboard/support-tab';
import { UserManagementTab } from '@/components/dashboard/user-management-tab';
import { GatewayTab } from '@/components/dashboard/gateway-tab';
import { SettingsTab } from '@/components/dashboard/settings-tab';
import { PermissionsTab } from '@/components/dashboard/permissions-tab';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { t } = useTranslation();

  return (
    <SidebarProvider>
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset>
            <Header />
            <main className="flex-1 p-4 lg:p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsContent value="dashboard">
                <DashboardTab />
                </TabsContent>
                <TabsContent value="companies">
                <CompaniesTab />
                </TabsContent>
                <TabsContent value="billing">
                <BillingTab />
                </TabsContent>
                <TabsContent value="permissions">
                <PermissionsTab />
                </TabsContent>
                <TabsContent value="support">
                <SupportTab />
                </TabsContent>
                <TabsContent value="users">
                <UserManagementTab />
                </TabsContent>
                <TabsContent value="gateway">
                <GatewayTab />
                </TabsContent>
                <TabsContent value="settings">
                <SettingsTab />
                </TabsContent>
            </Tabs>
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
