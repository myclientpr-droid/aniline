import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TeamTable from '@/components/admin/TeamTable';
import { listAllTeamMembers } from '@/lib/data/team';
import { TEAM_ROLES } from '@/lib/constants';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Team',
};

async function safeList(params) {
    try {
        return await listAllTeamMembers(params);
    } catch {
        return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 };
    }
}

export default async function AdminTeamPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const page = Math.max(1, Number(params?.page) || 1);
    const q = typeof params?.q === 'string' ? params.q : '';
    const status = typeof params?.status === 'string' ? params.status : '';
    const role = typeof params?.role === 'string' ? params.role : '';

    const user = await getAuthorizedAdminUser();
    const canWrite = user?.role === 'owner';

    const { items, total, totalPages } = await safeList({ page, pageSize: 20, q, status, role });

    return (
        <>
            <AdminPageHeader
                title="Team"
                description={`${total} team member${total === 1 ? '' : 's'} in total.`}
                actionLabel={canWrite ? 'New member' : undefined}
                actionHref={canWrite ? '/admin/team/new' : undefined}
            />
            <TeamTable
                items={items}
                page={page}
                totalPages={totalPages}
                q={q}
                status={status}
                role={role}
                roleOptions={TEAM_ROLES}
                canWrite={canWrite}
            />
        </>
    );
}
