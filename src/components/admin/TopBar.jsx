'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Sidebar from '@/components/admin/Sidebar';
import LogoutButton from '@/components/admin/LogoutButton';

export default function TopBar({ userEmail, role = 'owner' }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <header className="sticky top-0 z-30 h-16 bg-white border-b border-navy/10 flex items-center">
                <div className="w-full px-4 md:px-6 flex items-center justify-between gap-4">
                    {/* Mobile menu toggle */}
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="lg:hidden p-2 -ml-2 rounded-md hover:bg-navy/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                        aria-label="Open admin menu"
                        aria-expanded={open}
                        aria-controls="admin-mobile-nav"
                    >
                        <Menu className="h-5 w-5 text-navy" aria-hidden="true" />
                    </button>

                    <div className="flex-1 min-w-0">
                        <p className="text-slate text-xs uppercase tracking-wider">
                            Signed in
                        </p>
                        <p className="text-navy text-sm font-medium truncate">
                            {userEmail || role}
                        </p>
                    </div>

                    <LogoutButton />
                </div>
            </header>

            {/* Mobile drawer */}
            <div id="admin-mobile-nav">
                {open && (
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Admin navigation"
                        className="fixed inset-0 z-50 lg:hidden"
                    >
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setOpen(false)}
                            className="absolute inset-0 bg-navy-dark/70 backdrop-blur-sm"
                        />
                        <div className="absolute left-0 top-0 h-full w-full max-w-xs">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close menu"
                                className="absolute top-4 right-4 z-10 p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                            <Sidebar role={role} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}