import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProjectForm from '@/components/admin/ProjectForm';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'New project',
};

export default async function NewProjectPage() {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/projects');

    return (
        <>
            <AdminPageHeader
                title="New project"
                backHref="/admin/projects"
                backLabel="Back to projects"
            />
            <ProjectForm />
        </>
    );
}