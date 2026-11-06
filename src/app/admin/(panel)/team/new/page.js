import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TeamMemberForm from '@/components/admin/TeamMemberForm';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'New team member',
};

export default async function NewTeamMemberPage() {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/team');

    return (
        <>
            <AdminPageHeader
                title="New team member"
                backHref="/admin/team"
                backLabel="Back to team"
            />
            <TeamMemberForm />
        </>
    );
}
