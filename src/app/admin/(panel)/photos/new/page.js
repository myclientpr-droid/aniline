import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PhotoForm from '@/components/admin/PhotoForm';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'New photo',
};

export default async function NewPhotoPage() {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/photos');

    return (
        <>
            <AdminPageHeader
                title="New photo"
                backHref="/admin/photos"
                backLabel="Back to photography"
            />
            <PhotoForm />
        </>
    );
}
