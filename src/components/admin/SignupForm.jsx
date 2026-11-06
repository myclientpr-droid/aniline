'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';

export default function SignupForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.ok) {
                setError(data.error || 'Signup failed. Please try again.');
                return;
            }
            router.replace('/admin/projects');
            router.refresh();
        } catch {
            setError('Network error. Please check your connection.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
            <FormField
                id="name"
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
            />
            <FormField
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
            />
            <FormField
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                hint="Use at least 12 characters."
                required
            />
            {error && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {error}
                </div>
            )}
            <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={submitting}
                className="w-full"
            >
                {submitting ? 'Creating account…' : 'Create account'}
            </Button>
        </form>
    );
}
