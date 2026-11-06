import { notFound, redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ServiceForm from '@/components/admin/ServiceForm';
import { getServiceById } from '@/lib/data/services';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Edit service',
};

export default async function EditServicePage({ params }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/services');

    const { id } = await Promise.resolve(params);
    const service = await getServiceById(id).catch(() => null);
    if (!service) notFound();

    return (
        <>
            <AdminPageHeader
                title="Edit service"
                description={service.title}
                backHref="/admin/services"
                backLabel="Back to services"
            />
            <ServiceForm service={service} />
        </>
    );
}
