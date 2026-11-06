import Link from 'next/link';
import Container from '@/components/ui/Container';
import SignupForm from '@/components/admin/SignupForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
    title: 'Create admin account',
    path: '/admin/signup',
    noIndex: true,
});

export default function AdminSignupPage() {
    return (
        <section className="flex min-h-[calc(100vh-4rem)] items-center bg-light">
            <Container variant="narrow">
                <div className="mx-auto max-w-md rounded-lg border border-navy/10 bg-white p-8 md:p-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
                        AniLine Admin
                    </p>
                    <h1 className="mt-3 text-2xl text-navy">Create an account</h1>
                    <p className="mt-2 text-sm text-slate">
                        The first account created becomes the owner. Every account after
                        that is a member.
                    </p>
                    <div className="mt-8">
                        <SignupForm />
                    </div>
                    <p className="mt-6 text-center text-sm text-slate">
                        Already have an account?{' '}
                        <Link
                            href="/admin/login"
                            className="font-semibold text-navy hover:text-orange"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </Container>
        </section>
    );
}
