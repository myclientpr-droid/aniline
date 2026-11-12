import Link from 'next/link';
import { Suspense } from 'react';
import AuthShell from '@/components/admin/AuthShell';
import LoginForm from '@/components/admin/LoginForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
    title: 'Admin login',
    path: '/admin/login',
    noIndex: true,
});

export default function AdminLoginPage() {
    return (
        <AuthShell
            eyebrow="AniLine Admin"
            title="Sign in"
            description="Sign in with your owner or member account."
            footer={
                <>
                    New here?{' '}
                    <Link
                        href="/admin/signup"
                        className="font-semibold text-white transition-colors hover:text-orange"
                    >
                        Create a member account
                    </Link>
                </>
            }
        >
            <Suspense fallback={<div className="min-h-80" />}>
                <LoginForm />
            </Suspense>
        </AuthShell>
    );
}
