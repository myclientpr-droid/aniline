import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import VideoForm from '@/components/admin/VideoForm';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'New film',
};

export default async function NewVideoPage() {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/videos');

    return (
        <>
            <AdminPageHeader
                title="New film"
                backHref="/admin/videos"
                backLabel="Back to videography"
            />
            <VideoForm />
        </>
    );
}
