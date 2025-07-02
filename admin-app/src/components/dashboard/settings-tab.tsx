

"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Globe, Shield, CreditCard, Puzzle, Bell, Users, Layers } from "lucide-react"
import { RolesAndPermissionsTab } from "@/components/settings/roles-permissions-tab"
import { PlansTab } from "@/components/settings/plans-tab"

export function SettingsTab() {
  const { toast } = useToast()
  const { t } = useTranslation();
  
  // Mock state for settings
  const [settings, setSettings] = useState({
    general: {
      appName: "LCUZR Command Center",
      contactEmail: "admin@lcuzr.com",
      defaultLanguage: "en-US",
      timezone: "UTC",
    },
    security: {
      sessionTimeout: 30,
      twoFactorAuth: true,
      passwordPolicy: "medium",
    },
    billing: {
      taxRate: 20,
      defaultCurrency: "USD",
      invoiceFooter: "Thank you for your business!",
    },
    notifications: {
      systemAlerts: true,
      dailySummary: false,
      billingReminders: true,
    }
  })

  const handleSave = (section: keyof typeof settings) => {
    // Here you would typically call a server action to save the settings
    console.log(`Saving ${section} settings:`, settings[section])
    toast({
      title: t('settings.toast.saveSuccessTitle'),
      description: t('settings.toast.saveSuccessDescription', { section: t(`settings.tabs.${section}`) }),
    })
  }

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
        <TabsTrigger value="general"><Globe className="me-2 h-4 w-4" />{t('settings.tabs.general')}</TabsTrigger>
        <TabsTrigger value="security"><Shield className="me-2 h-4 w-4" />{t('settings.tabs.security')}</TabsTrigger>
        <TabsTrigger value="billing"><CreditCard className="me-2 h-4 w-4" />{t('settings.tabs.billing')}</TabsTrigger>
        <TabsTrigger value="plans"><Layers className="me-2 h-4 w-4" />{t('settings.tabs.plans')}</TabsTrigger>
        <TabsTrigger value="integrations"><Puzzle className="me-2 h-4 w-4" />{t('settings.tabs.integrations')}</TabsTrigger>
        <TabsTrigger value="notifications"><Bell className="me-2 h-4 w-4" />{t('settings.tabs.notifications')}</TabsTrigger>
        <TabsTrigger value="permissions"><Users className="me-2 h-4 w-4" />{t('settings.tabs.roles')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.general.title')}</CardTitle>
            <CardDescription>{t('settings.general.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">{t('settings.general.appNameLabel')}</Label>
              <Input id="appName" defaultValue={settings.general.appName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">{t('settings.general.contactEmailLabel')}</Label>
              <Input id="contactEmail" type="email" defaultValue={settings.general.contactEmail} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">{t('settings.general.languageLabel')}</Label>
                <Select defaultValue={settings.general.defaultLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder={t('settings.general.languagePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">English (United States)</SelectItem>
                    <SelectItem value="es-ES">Español (España)</SelectItem>
                    <SelectItem value="fr-FR">Français (France)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">{t('settings.general.timezoneLabel')}</Label>
                <Select defaultValue={settings.general.timezone}>
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder={t('settings.general.timezonePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="PST">Pacific Standard Time</SelectItem>
                    <SelectItem value="EST">Eastern Standard Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handleSave("general")}>{t('common.save')}</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.security.title')}</CardTitle>
            <CardDescription>{t('settings.security.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth" className="text-base">{t('settings.security.twoFactorAuthLabel')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.security.twoFactorAuthDescription')}</p>
                </div>
                <Switch id="twoFactorAuth" defaultChecked={settings.security.twoFactorAuth} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">{t('settings.security.sessionTimeoutLabel')}</Label>
              <Input id="sessionTimeout" type="number" defaultValue={settings.security.sessionTimeout} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="passwordPolicy">{t('settings.security.passwordPolicyLabel')}</Label>
                <Select defaultValue={settings.security.passwordPolicy}>
                  <SelectTrigger id="passwordPolicy">
                    <SelectValue placeholder={t('settings.security.passwordPolicyPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t('settings.security.passwordPolicyLow')}</SelectItem>
                    <SelectItem value="medium">{t('settings.security.passwordPolicyMedium')}</SelectItem>
                    <SelectItem value="strong">{t('settings.security.passwordPolicyStrong')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
           <CardFooter>
            <Button onClick={() => handleSave("security")}>{t('common.save')}</Button>
          </CardFooter>
        </Card>
      </TabsContent>

       <TabsContent value="billing" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.billing.title')}</CardTitle>
            <CardDescription>{t('settings.billing.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="taxRate">{t('settings.billing.taxRateLabel')}</Label>
                    <Input id="taxRate" type="number" defaultValue={settings.billing.taxRate} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="currency">{t('settings.billing.currencyLabel')}</Label>
                    <Select defaultValue={settings.billing.defaultCurrency}>
                    <SelectTrigger id="currency">
                        <SelectValue placeholder={t('settings.billing.currencyPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceFooter">{t('settings.billing.invoiceFooterLabel')}</Label>
              <Input id="invoiceFooter" defaultValue={settings.billing.invoiceFooter} />
            </div>
          </CardContent>
           <CardFooter>
            <Button onClick={() => handleSave("billing")}>{t('common.save')}</Button>
          </CardFooter>
        </Card>
      </TabsContent>

       <TabsContent value="plans" className="mt-6">
        <PlansTab />
      </TabsContent>

      <TabsContent value="integrations" className="mt-6">
         <Card>
          <CardHeader>
            <CardTitle>{t('settings.integrations.title')}</CardTitle>
            <CardDescription>{t('settings.integrations.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Puzzle className="h-8 w-8 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">Slack</p>
                        <p className="text-sm text-muted-foreground">{t('settings.integrations.slackDescription')}</p>
                    </div>
                </div>
                <Button variant="outline">{t('settings.integrations.connect')}</Button>
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                    <Puzzle className="h-8 w-8 text-muted-foreground"/>
                    <div>
                        <p className="font-semibold">Zapier</p>
                        <p className="text-sm text-muted-foreground">{t('settings.integrations.zapierDescription')}</p>
                    </div>
                </div>
                 <Button variant="outline">{t('settings.integrations.connect')}</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications" className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.notifications.title')}</CardTitle>
            <CardDescription>{t('settings.notifications.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="systemAlerts" className="text-base">{t('settings.notifications.systemAlertsLabel')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.notifications.systemAlertsDescription')}</p>
                </div>
                <Switch id="systemAlerts" defaultChecked={settings.notifications.systemAlerts} />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="dailySummary" className="text-base">{t('settings.notifications.dailySummaryLabel')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.notifications.dailySummaryDescription')}</p>
                </div>
                <Switch id="dailySummary" defaultChecked={settings.notifications.dailySummary} />
            </div>
             <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <Label htmlFor="billingReminders" className="text-base">{t('settings.notifications.billingRemindersLabel')}</Label>
                    <p className="text-sm text-muted-foreground">{t('settings.notifications.billingRemindersDescription')}</p>
                </div>
                <Switch id="billingReminders" defaultChecked={settings.notifications.billingReminders} />
            </div>
          </CardContent>
           <CardFooter>
            <Button onClick={() => handleSave("notifications")}>{t('common.save')}</Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="permissions" className="mt-6">
        <RolesAndPermissionsTab />
      </TabsContent>

    </Tabs>
  )
}
