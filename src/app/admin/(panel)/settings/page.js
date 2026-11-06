import { redirect } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import MemberAccounts from '@/components/admin/MemberAccounts';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';
import { listMemberAccounts } from '@/lib/auth';

export default async function AdminSettingsPage() {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/projects');
    const members = await listMemberAccounts();

    return (
        <div>
            <AdminPageHeader
                title="Settings"
                description="Manage the accounts that can access the admin area."
            />
            <MemberAccounts initialUsers={members} />
        </div>
    );
}
