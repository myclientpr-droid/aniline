import { notFound, redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PhotoForm from '@/components/admin/PhotoForm';
import { getPhotoById } from '@/lib/data/photos';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Edit photo',
};

export default async function EditPhotoPage({ params }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/photos');

    const { id } = await Promise.resolve(params);
    const photo = await getPhotoById(id).catch(() => null);
    if (!photo) notFound();

    return (
        <>
            <AdminPageHeader
                title="Edit photo"
                description={photo.title || photo.publicId}
                backHref="/admin/photos"
                backLabel="Back to photography"
            />
            <PhotoForm photo={photo} />
        </>
    );
}
