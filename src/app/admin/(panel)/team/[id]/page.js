import { notFound, redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TeamMemberForm from '@/components/admin/TeamMemberForm';
import { getTeamMemberById } from '@/lib/data/team';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Edit team member',
};

export default async function EditTeamMemberPage({ params }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/team');

    const { id } = await Promise.resolve(params);
    const member = await getTeamMemberById(id).catch(() => null);
    if (!member) notFound();

    return (
        <>
            <AdminPageHeader
                title="Edit team member"
                description={member.name}
                backHref="/admin/team"
                backLabel="Back to team"
            />
            <TeamMemberForm member={member} />
        </>
    );
}
