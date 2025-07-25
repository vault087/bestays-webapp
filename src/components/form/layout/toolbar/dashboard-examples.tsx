"use client";

import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { DashboardLayout, DashboardSidebar, DashboardNavigation } from "@/components/form/layout/dashboard-layout";
import { DashboardPage, DashboardPageContent } from "@/components/form/layout/dashboard-page";
import { Badge } from "@/modules/shadcn/components/ui/badge";
import { Button } from "@/modules/shadcn/components/ui/button";
import { Input } from "@/modules/shadcn/components/ui/input";

// Example: Properties Overview Page
export const PropertiesOverviewExample = memo(function PropertiesOverviewExample() {
  const t = useTranslations("Dashboard");

  const toolbar = (
    <>
      <div className="flex items-center space-x-4">
        <h1 className="text-foreground text-xl font-semibold">{t("properties_overview")}</h1>
        <Badge variant="secondary">{new Date().toLocaleDateString()}</Badge>
      </div>
      <div className="text-muted-foreground text-sm">Last updated: {new Date().toLocaleTimeString()}</div>
    </>
  );

  return (
    <DashboardPage toolbar={toolbar}>
      <DashboardPageContent>
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="text-muted-foreground text-sm font-medium">Total Properties</h3>
            <p className="text-foreground text-2xl font-bold">1,234</p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="text-muted-foreground text-sm font-medium">Active Listings</h3>
            <p className="text-foreground text-2xl font-bold">856</p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="text-muted-foreground text-sm font-medium">Revenue</h3>
            <p className="text-foreground text-2xl font-bold">$42,500</p>
          </div>
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <h3 className="text-muted-foreground text-sm font-medium">Growth</h3>
            <p className="text-2xl font-bold text-green-600">+12.5%</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="text-foreground mb-4 text-lg font-medium">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">Property #1234 was updated</span>
              <span className="text-muted-foreground text-xs">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground text-sm">New listing created</span>
              <span className="text-muted-foreground text-xs">4 hours ago</span>
            </div>
          </div>
        </div>
      </DashboardPageContent>
    </DashboardPage>
  );
});

// Example: Properties List Page
export const PropertiesListExample = memo(function PropertiesListExample() {
  const t = useTranslations("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  const toolbar = (
    <>
      <div className="flex items-center space-x-4">
        <h1 className="text-foreground text-xl font-semibold">{t("properties")}</h1>
        <Input
          type="text"
          placeholder={t("search_properties")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          {t("export")}
        </Button>
        <Button size="sm">{t("add_property")}</Button>
      </div>
    </>
  );

  const mockProperties = [1, 2, 3, 4, 5].filter(
    (id) => searchTerm === "" || `Property #${id}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <DashboardPage toolbar={toolbar}>
      <DashboardPageContent>
        <div className="bg-card rounded-lg border shadow-sm">
          <div className="overflow-x-auto">
            <table className="divide-border min-w-full divide-y">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Property
                  </th>
                  <th className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Location
                  </th>
                  <th className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Price
                  </th>
                  <th className="text-muted-foreground px-6 py-3 text-left text-xs font-medium tracking-wider uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-border divide-y">
                {mockProperties.map((id) => (
                  <tr key={id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-foreground text-sm font-medium">Property #{id}</div>
                    </td>
                    <td className="text-muted-foreground px-6 py-4 text-sm whitespace-nowrap">New York, NY</td>
                    <td className="text-foreground px-6 py-4 text-sm whitespace-nowrap">$450,000</td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <Button variant="link" size="sm" className="text-primary hover:text-primary/80">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardPageContent>
    </DashboardPage>
  );
});

// Example: Full Dashboard Layout with Sidebar
export const DashboardLayoutExample = memo(function DashboardLayoutExample() {
  const t = useTranslations("Dashboard");

  const navigationLinks = [
    { href: "/dashboard", label: t("overview") },
    { href: "/dashboard/properties", label: t("properties") },
    { href: "/dashboard/analytics", label: t("analytics") },
  ];

  const sidebar = (
    <DashboardSidebar title={t("dashboard")}>
      <DashboardNavigation links={navigationLinks} />
    </DashboardSidebar>
  );

  return (
    <DashboardLayout sidebar={sidebar}>
      <PropertiesOverviewExample />
    </DashboardLayout>
  );
});
