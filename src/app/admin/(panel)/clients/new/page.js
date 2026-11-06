import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ClientForm from '@/components/admin/ClientForm';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'New client',
};

export default async function NewClientPage() {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/clients');

    return (
        <>
            <AdminPageHeader
                title="New client"
                backHref="/admin/clients"
                backLabel="Back to clients"
            />
            <ClientForm />
        </>
    );
}
