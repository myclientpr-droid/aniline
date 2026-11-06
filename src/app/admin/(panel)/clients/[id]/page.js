import { notFound, redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ClientForm from '@/components/admin/ClientForm';
import { getClientById } from '@/lib/data/clients';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Edit client',
};

export default async function EditClientPage({ params }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/clients');

    const { id } = await Promise.resolve(params);
    const client = await getClientById(id).catch(() => null);
    if (!client) notFound();

    return (
        <>
            <AdminPageHeader
                title="Edit client"
                description={client.name}
                backHref="/admin/clients"
                backLabel="Back to clients"
            />
            <ClientForm client={client} />
        </>
    );
}
