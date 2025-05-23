
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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

const inter = Inter({
  variable: '--font-sans', // CSS variable name, used in globals.css
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
    // Apply the font variable class to the <html> tag.
    // This makes the CSS variable --font-sans available.
    <html lang="en" className={`${inter.variable}`}>
      {/* The font-family is applied via globals.css using var(--font-sans) */}
      <body className="antialiased">
        <SidebarProvider defaultOpen={true}>
          <Sidebar collapsible="icon" variant="sidebar" side="left">
            <SidebarHeader className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 100 35"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                >
                  <text
                    x="50%"
                    y="50%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fontFamily="var(--font-sans), Arial, sans-serif" /* Updated font-family */
                    fontSize="30"
                    fontWeight="bold"
                    fill="hsl(var(--destructive))" /* Red color using CSS variable */
                  >
                    ABB
                  </text>
                </svg>
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
