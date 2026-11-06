import { notFound, redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProjectForm from '@/components/admin/ProjectForm';
import { getProjectById } from '@/lib/data/projects';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Edit project',
};

export default async function EditProjectPage({ params }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/projects');

    const { id } = await Promise.resolve(params);
    const project = await getProjectById(id).catch(() => null);
    if (!project) notFound();

    return (
        <>
            <AdminPageHeader
                title="Edit project"
                description={project.title}
                backHref="/admin/projects"
                backLabel="Back to projects"
            />
            <ProjectForm project={project} />
        </>
    );
}