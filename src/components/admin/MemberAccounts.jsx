'use client';

import { useCallback, useState } from 'react';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import { useToast } from '@/components/admin/ToastProvider';

export default function MemberAccounts({ initialUsers }) {
    const toast = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const loadUsers = useCallback(async () => {
        setError('');
        try {
            const response = await fetch('/api/admin/users', { cache: 'no-store' });
            const data = await response.json();
            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Could not load member accounts.');
            }
            setUsers(data.users);
        } catch (err) {
            setError(err.message || 'Could not load member accounts.');
        }
    }, []);

    const createAccount = async (event) => {
        event.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const response = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Could not create the account.');
            }
            setName('');
            setEmail('');
            setPassword('');
            toast.success('Member account created.');
            await loadUsers();
        } catch (err) {
            const message = err.message || 'Could not create the account.';
            setError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const removeAccount = async (user) => {
        if (!window.confirm(`Remove the account for ${user.email}?`)) return;
        setError('');
        try {
            const response = await fetch(`/api/admin/users/${user.id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!response.ok || !data.ok) {
                throw new Error(data.error || 'Could not remove the account.');
            }
            toast.success('Member account removed.');
            await loadUsers();
        } catch (err) {
            const message = err.message || 'Could not remove the account.';
            setError(message);
            toast.error(message);
        }
    };

    return (
        <div className="space-y-6">
            <form
                onSubmit={createAccount}
                className="rounded-lg border border-navy/10 bg-white p-6 space-y-5"
            >
                <div>
                    <h2 className="text-navy text-lg">Add a member</h2>
                    <p className="text-slate text-sm mt-1">
                        Members can manage content but cannot view inquiries or manage accounts.
                    </p>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                    <FormField
                        id="member-name"
                        label="Name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                    <FormField
                        id="member-email"
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
                    <FormField
                        id="member-password"
                        label="Temporary password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        hint="At least 12 characters."
                        required
                    />
                </div>
                {error && (
                    <p role="alert" className="text-red-700 text-sm">{error}</p>
                )}
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating…' : 'Create member account'}
                </Button>
            </form>

            <section className="rounded-lg border border-navy/10 bg-white p-6">
                <h2 className="text-navy text-lg">Member accounts</h2>
                {users.length === 0 ? (
                    <p className="text-slate text-sm mt-4">No member accounts yet.</p>
                ) : (
                    <ul className="mt-4 divide-y divide-navy/10">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                className="flex items-center justify-between gap-4 py-4"
                            >
                                <div className="min-w-0">
                                    <p className="text-navy font-medium truncate">
                                        {user.name || user.email}
                                    </p>
                                    {user.name && (
                                        <p className="text-slate text-sm truncate">{user.email}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeAccount(user)}
                                    className="text-sm font-semibold text-red-700 hover:text-red-900"
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
