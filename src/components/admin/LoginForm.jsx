'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lock, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import useCooldown from '@/components/admin/useCooldown';
import { validateCredentials } from '@/lib/authValidation';

export default function LoginForm() {
    const searchParams = useSearchParams();
    const requestedFrom = searchParams.get('from');
    const from =
        requestedFrom?.startsWith('/') &&
        !requestedFrom.startsWith('//') &&
        !requestedFrom.startsWith('/\\')
            ? requestedFrom
            : '/admin';

    const [values, setValues] = useState({ email: '', password: '' });
    const [touched, setTouched] = useState({});
    const [attempted, setAttempted] = useState(false);
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [startCooldown, cooldownLabel] = useCooldown();

    // Derived, so a field can never display an error that the current value no longer has.
    const errors = validateCredentials(values);
    const errorFor = (field) => (touched[field] || attempted ? errors[field] : undefined);

    const setValue = (field) => (event) =>
        setValues((current) => ({ ...current, [field]: event.target.value }));
    const markTouched = (field) => () =>
        setTouched((current) => ({ ...current, [field]: true }));

    const onSubmit = async (event) => {
        event.preventDefault();
        setAttempted(true);
        setServerError('');

        if (Object.keys(errors).length > 0) {
            const firstInvalid = Object.keys(errors)[0];
            document.getElementById(`login-${firstInvalid}`)?.focus();
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                // The limiter allows 5 attempts per 15 minutes and retries push the window
                // further out, so the wait is surfaced instead of swallowed by a banner.
                if (res.status === 429) {
                    startCooldown(Number(res.headers.get('Retry-After')) || 60);
                }
                setServerError(data.error || 'Login failed. Please try again.');
                return;
            }
            const destination = new URL(from, window.location.origin);
            window.location.assign(
                destination.origin === window.location.origin ? destination.href : '/admin'
            );
        } catch {
            setServerError('Network error. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            <FormField
                id="login-email"
                tone="dark"
                label="Email"
                type="email"
                inputMode="email"
                autoComplete="email"
                icon={Mail}
                value={values.email}
                onChange={setValue('email')}
                onBlur={markTouched('email')}
                error={errorFor('email')}
                required
            />

            <FormField
                id="login-password"
                tone="dark"
                label="Password"
                autoComplete="current-password"
                icon={Lock}
                revealable
                value={values.password}
                onChange={setValue('password')}
                onBlur={markTouched('password')}
                error={errorFor('password')}
                required
            />

            <div aria-live="polite">
                {serverError && (
                    <p
                        role="alert"
                        className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                        {serverError}
                    </p>
                )}
            </div>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={submitting || Boolean(cooldownLabel)}
                loading={submitting}
            >
                {cooldownLabel ?? (submitting ? 'Signing in\u2026' : 'Sign in')}
            </Button>
        </form>
    );
}
