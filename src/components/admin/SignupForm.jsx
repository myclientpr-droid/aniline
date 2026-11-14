'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import PasswordStrength from '@/components/admin/PasswordStrength';
import useCooldown from '@/components/admin/useCooldown';
import { useToast } from '@/components/admin/ToastProvider';
import { validateAccount } from '@/lib/authValidation';

export default function SignupForm() {
    const router = useRouter();
    const toast = useToast();
    const [values, setValues] = useState({ name: '', email: '', password: '' });
    const [touched, setTouched] = useState({});
    const [attempted, setAttempted] = useState(false);
    const [serverError, setServerError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [startCooldown, cooldownLabel] = useCooldown();

    const errors = validateAccount(values);
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
            document.getElementById(`signup-${Object.keys(errors)[0]}`)?.focus();
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.ok) {
                if (response.status === 429) {
                    startCooldown(Number(response.headers.get('Retry-After')) || 60);
                }
                const message = data.error || 'Signup failed. Please try again.';
                setServerError(message);
                toast.error(message);
                return;
            }
            toast.success('Account created.');
            router.replace('/admin/projects');
            router.refresh();
        } catch {
            const message = 'Network error. Please check your connection.';
            setServerError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const showMeter = values.password.length > 0;

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            <FormField
                id="signup-name"
                tone="dark"
                label="Name"
                autoComplete="name"
                icon={User}
                value={values.name}
                onChange={setValue('name')}
                onBlur={markTouched('name')}
                error={errorFor('name')}
                required
            />

            <FormField
                id="signup-email"
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

            <div>
                <FormField
                    id="signup-password"
                    tone="dark"
                    label="Password"
                    autoComplete="new-password"
                    icon={Lock}
                    revealable
                    value={values.password}
                    onChange={setValue('password')}
                    onBlur={markTouched('password')}
                    error={errorFor('password')}
                    describedBy={showMeter ? 'signup-password-strength' : undefined}
                    required
                />
                {showMeter && <PasswordStrength id="signup-password" value={values.password} />}
            </div>

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
                {cooldownLabel ?? (submitting ? 'Creating account\u2026' : 'Create account')}
            </Button>
        </form>
    );
}
