'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV } from '@/lib/adminNav';
import { SITE } from '@/lib/site';

export default function Sidebar({ role = 'owner' }) {
    const pathname = usePathname();
    const visibleItems = ADMIN_NAV.filter(
        (item) => !item.roles || item.roles.includes(role)
    );

    const isActive = (item) => {
        if (item.exact) return pathname === item.href;
        return pathname === item.href || pathname.startsWith(`${item.href}/`);
    };

    return (
        <nav
            aria-label="Admin navigation"
            className="w-full h-full flex flex-col bg-navy-dark text-white"
        >
            <div className="h-16 flex items-center px-5 border-b border-white/10">
                <Link href="/admin" className="font-bold tracking-tight text-lg">
                    {SITE.name}
                    <span className="ml-2 text-xs font-medium text-white/50">Admin</span>
                </Link>
            </div>

            <ul className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                {visibleItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item);
                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${active
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className="h-4 w-4 flex-none" aria-hidden="true" />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="p-4 border-t border-white/10">
                <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/60 hover:text-white transition-colors"
                >
                    View public site &rarr;
                </Link>
            </div>
        </nav>
    );
}