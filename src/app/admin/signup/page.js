import Link from 'next/link';
import AuthShell from '@/components/admin/AuthShell';
import SignupForm from '@/components/admin/SignupForm';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
    title: 'Create admin account',
    path: '/admin/signup',
    noIndex: true,
});

export default function AdminSignupPage() {
    return (
        <AuthShell
            eyebrow="AniLine Admin"
            title="Create an account"
            description="The first account created becomes the owner. Every account after that is a member."
            footer={
                <>
                    Already have an account?{' '}
                    <Link
                        href="/admin/login"
                        className="font-semibold text-white transition-colors hover:text-orange"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <SignupForm />
        </AuthShell>
    );
}
