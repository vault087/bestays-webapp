import type { Metadata } from "next";
// import { redirect } from "next/navigation";
import RootLayout from "@/components/layout/root-layout";
import { getUser } from "@/entities/users/user.libs";

export const metadata: Metadata = {
  title: "Bestays",
  description: "Best Stays App",
};

export default async function DashboardLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user) {
    // redirect("/login");
  }

  return (
    <RootLayout params={params}>
      <div className="flex min-h-screen flex-col">{children}</div>
    </RootLayout>
  );
}
