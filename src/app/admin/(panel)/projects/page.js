import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ProjectsTable from '@/components/admin/ProjectsTable';
import { listAllProjects } from '@/lib/data/projects';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Projects',
};

async function safeList(params) {
    try {
        return await listAllProjects(params);
    } catch {
        return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 };
    }
}

export default async function AdminProjectsPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const page = Math.max(1, Number(params?.page) || 1);
    const q = typeof params?.q === 'string' ? params.q : '';
    const status = typeof params?.status === 'string' ? params.status : '';

    const user = await getAuthorizedAdminUser();
    const canWrite = user?.role === 'owner';

    const { items, total, totalPages } = await safeList({ page, pageSize: 20, q, status });

    return (
        <>
            <AdminPageHeader
                title="Projects"
                description={`${total} project${total === 1 ? '' : 's'} in total.`}
                actionLabel={canWrite ? 'New project' : undefined}
                actionHref={canWrite ? '/admin/projects/new' : undefined}
            />
            <ProjectsTable
                items={items}
                page={page}
                totalPages={totalPages}
                q={q}
                status={status}
                canWrite={canWrite}
            />
        </>
    );
}
