'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useToast } from '@/components/admin/ToastProvider';

export default function LogoutButton() {
    const toast = useToast();
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const onClick = async () => {
        if (busy) return;
        setError('');
        setBusy(true);
        try {
            const response = await fetch('/api/auth/logout', { method: 'POST' });
            if (!response.ok) throw new Error('Sign out failed.');
            window.location.assign(
                new URL('/admin/login', window.location.origin).href
            );
        } catch {
            const message = 'Could not sign out. Please try again.';
            setError(message);
            toast.error(message);
            setBusy(false);
        }
    };

    return (
        <div className="text-right">
            <button
                type="button"
                onClick={onClick}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-md border border-navy/15 px-3 py-2 text-sm font-medium text-navy hover:bg-navy/5 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange disabled:opacity-50"
            >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                {busy ? 'Signing out\u2026' : 'Sign out'}
            </button>
            {error && <p role="alert" className="text-red-700 text-xs mt-1">{error}</p>}
        </div>
    );
}