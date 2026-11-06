'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LoginForm() {
    const searchParams = useSearchParams();
    const requestedFrom = searchParams.get('from');
    const from =
        requestedFrom?.startsWith('/') &&
        !requestedFrom.startsWith('//') &&
        !requestedFrom.startsWith('/\\')
            ? requestedFrom
            : '/admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                setError(data.error || 'Login failed. Please try again.');
                return;
            }
            const destination = new URL(from, window.location.origin);
            window.location.assign(
                destination.origin === window.location.origin
                    ? destination.href
                    : '/admin'
            );
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-navy mb-1.5">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-medium text-navy mb-1.5">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-navy/15 bg-white px-3.5 py-2.5 text-navy focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange"
                />
            </div>

            {error && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm"
                >
                    {error}
                </div>
            )}

            <Button type="submit" variant="primary" size="lg" disabled={submitting} className="w-full">
                {submitting ? 'Signing in\u2026' : 'Sign in'}
            </Button>
        </form>
    );
}