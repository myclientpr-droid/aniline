import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceForm from '@/components/admin/ServiceForm';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'New service',
};

export default async function NewServicePage() {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/services');

    return (
        <>
            <AdminPageHeader
                title="New service"
                backHref="/admin/services"
                backLabel="Back to services"
            />
            <ServiceForm />
        </>
    );
}
