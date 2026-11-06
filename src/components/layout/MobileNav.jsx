'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { NAV_LINKS, PRIMARY_CTA, SITE } from '@/lib/site';
import Image from "next/image"

/**
 * @param {{ open: boolean, onClose: () => void }} props
 */
export default function MobileNav({ open, onClose }) {
    const pathname = usePathname();
    const panelRef = useRef(null);
    const closeBtnRef = useRef(null);

    // Close on route change
    useEffect(() => {
        if (open) onClose();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Lock body scroll + Escape key + initial focus
    useEffect(() => {
        if (!open) return undefined;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);

        // Focus close button for keyboard users
        const t = setTimeout(() => closeBtnRef.current?.focus(), 30);

        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', onKey);
            clearTimeout(t);
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="fixed inset-0 z-50 md:hidden"
        >
            {/* Backdrop */}
            <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                className="absolute right-0 top-0 h-full w-full max-w-sm bg-navy-dark text-white flex flex-col"
            >
                <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
                    <Link
                        href="/"
                        className="font-extrabold tracking-tight text-navy text-lg"
                        aria-label={`${SITE.name} home`}
                    >
                        <div>
                            <Image
                                src="/aniline-5555x1330.png"
                                alt="Logo"
                                width={120}
                                height={30}
                                className='w-auto h-auto' />
                            <h1 className="sr-only">{SITE.name}</h1>
                        </div>
                    </Link>
                    <button
                        ref={closeBtnRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="p-2 -mr-2 rounded-md hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-5 py-6">
                    <ul className="space-y-1">
                        {NAV_LINKS.map((link) => {
                            const active =
                                link.href === '/'
                                    ? pathname === '/'
                                    : pathname.startsWith(link.href);
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={onClose}
                                        aria-current={active ? 'page' : undefined}
                                        className={`block rounded-md px-3 py-3 text-base font-medium transition-colors ${active
                                            ? 'text-orange'
                                            : 'text-white/90 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <Button
                            href={PRIMARY_CTA.href}
                            variant="primary"
                            size="lg"
                            className="w-full"
                            onClick={onClose}
                        >
                            {PRIMARY_CTA.label}
                        </Button>
                    </div>
                </nav>
            </div>
        </div>
    );
}