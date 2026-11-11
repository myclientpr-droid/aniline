import { notFound, redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import VideoForm from '@/components/admin/VideoForm';
import { getVideoById } from '@/lib/data/videos';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Edit film',
};

export default async function EditVideoPage({ params }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/videos');

    const { id } = await Promise.resolve(params);
    const film = await getVideoById(id).catch(() => null);
    if (!film) notFound();

    return (
        <>
            <AdminPageHeader
                title="Edit film"
                description={film.title || film.slug}
                backHref="/admin/videos"
                backLabel="Back to videography"
            />
            <VideoForm film={film} />
        </>
    );
}
