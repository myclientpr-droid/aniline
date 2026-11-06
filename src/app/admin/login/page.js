import Link from 'next/link';
import { Suspense } from 'react';
import Container from '@/components/ui/Container';
import LoginForm from '@/components/admin/LoginForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
    title: 'Admin login',
    path: '/admin/login',
    noIndex: true,
});

export default function AdminLoginPage() {
    return (
        <section className="min-h-[calc(100vh-4rem)] bg-light flex items-center">
            <Container variant="narrow">
                <div className="mx-auto max-w-md rounded-lg border border-navy/10 bg-white p-8 md:p-10">
                    <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em]">
                        AniLine Admin
                    </p>
                    <h1 className="text-navy mt-3 text-2xl">Sign in</h1>
                    <p className="text-slate text-sm mt-2">
                        Sign in with your owner or member account.
                    </p>
                    <div className="mt-8">
                        <Suspense fallback={<div className="min-h-80" />}>
                            <LoginForm />
                        </Suspense>
                    </div>
                    <p className="text-center text-sm text-slate mt-6">
                        New here?{' '}
                        <Link
                            href="/admin/signup"
                            className="font-semibold text-navy hover:text-orange"
                        >
                            Create a member account
                        </Link>
                    </p>
                </div>
            </Container>
        </section>
    );
}