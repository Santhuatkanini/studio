// src/components/nav-link.tsx
"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import type { LucideIcon } from 'lucide-react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
  icon?: ReactNode; // Accepts LucideIcon or any ReactNode
  tooltip?: string;
}

export default function NavLink({ href, children, icon, tooltip }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} passHref legacyBehavior>
      <SidebarMenuButton isActive={isActive} tooltip={tooltip} asChild={false} className="w-full justify-start">
        {icon}
        <span>{children}</span>
      </SidebarMenuButton>
    </Link>
  );
}
