'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Button from '@/components/ui/Button';
import MobileNav from '@/components/layout/MobileNav';
import { NAV_LINKS, PRIMARY_CTA, SITE } from '@/lib/site';
import Image from "next/image";

export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="site-header sticky top-0 z-40">
                <div className="w-full px-4 xl:px-16 flex items-center justify-between h-16">
                    <Link
                        href="/"
                        className="font-extrabold tracking-tight text-navy text-lg"
                        aria-label={`${SITE.name} home`}
                    >
                        <div>
                            <Image
                                src="/aniline-5555x1330.png"
                                alt=""
                                width={120}
                                height={30}
                                className='w-auto h-auto' />
                            {/* Not an h1: every page's hero owns the one h1. */}
                            <span className="sr-only">{SITE.name}</span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <nav aria-label="Primary" className="hidden lg:block">
                        <ul className="flex items-center gap-0.5">
                            {NAV_LINKS.map((link) => {
                                const active =
                                    link.href === '/'
                                        ? pathname === '/'
                                        : pathname.startsWith(link.href);
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            aria-current={active ? 'page' : undefined}
                                            className={`relative px-2.5 py-2 rounded-md text-md font-bold transition-colors ${active
                                                ? "text-orange after:absolute after:inset-x-2.5 after:-bottom-1 after:h-[3px] after:rounded-full after:bg-orange after:content-['']"
                                                : 'text-zinc-50 hover:text-orange'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    <div className="hidden lg:block">
                        <Button href={PRIMARY_CTA.href} variant="primary" size="sm">
                            {PRIMARY_CTA.label}
                        </Button>
                    </div>

                    {/* Mobile toggle */}
                    <button
                        type="button"
                        className="lg:hidden p-2 -mr-2 rounded-md hover:bg-navy/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                        aria-label="Open menu"
                        aria-expanded={open}
                        aria-controls="mobile-nav"
                        onClick={() => setOpen(true)}
                    >
                        <Menu className="h-5 w-5 text-white/95" aria-hidden="true" />
                    </button>
                </div>
            </header>

            <div id="mobile-nav">
                <MobileNav open={open} onClose={() => setOpen(false)} />
            </div>
        </>
    );
}