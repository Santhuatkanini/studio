import type { Metadata } from 'next';
import { GeistSans } from 'next/font/google'; // Corrected import
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarInset,
} from '@/components/ui/sidebar';
import NavLink from '@/components/nav-link';
import { LayoutDashboard, DatabaseZap, Cog, TrendingUp, BrainCircuit } from 'lucide-react';

const geistSans = GeistSans({ // Corrected variable name
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DomainFlow',
  description: 'Fine-tune and deploy LLMs with domain-specific data.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} antialiased`}>
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon" variant="sidebar" side="left">
            <SidebarHeader className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <BrainCircuit className="text-primary h-7 w-7" />
                <h1 className="text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
                  DomainFlow
                </h1>
              </div>
              <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <NavLink href="/" icon={<LayoutDashboard />} tooltip="Dashboard">
                    Dashboard
                  </NavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <NavLink href="/data-workbench" icon={<DatabaseZap />} tooltip="Data Workbench">
                    Data Workbench
                  </NavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <NavLink href="/model-management" icon={<Cog />} tooltip="Model Management">
                    Model Management
                  </NavLink>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <NavLink href="/continuous-improvement" icon={<TrendingUp />} tooltip="Continuous Improvement">
                    Improvement
                  </NavLink>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
