import AdminPageHeader from '@/components/admin/AdminPageHeader';
import InquiriesTable from '@/components/admin/InquiriesTable';
import { listInquiries } from '@/lib/data/inquiries';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';
import { redirect } from 'next/navigation';

export const metadata = {
    title: 'Inquiries',
};

async function safeList(params) {
    try {
        return await listInquiries(params);
    } catch {
        return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 };
    }
}

export default async function AdminInquiriesPage({ searchParams }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');
    if (user.role !== 'owner') redirect('/admin/projects');

    const params = await Promise.resolve(searchParams);
    const page = Math.max(1, Number(params?.page) || 1);
    const q = typeof params?.q === 'string' ? params.q : '';
    const status = typeof params?.status === 'string' ? params.status : '';

    const { items, total, totalPages } = await safeList({ page, pageSize: 20, q, status });

    return (
        <>
            <AdminPageHeader
                title="Inquiries"
                description={`${total} inquiry${total === 1 ? '' : 'ies'} in total.`}
            />
            <InquiriesTable
                items={items}
                page={page}
                totalPages={totalPages}
                q={q}
                status={status}
            />
        </>
    );
}
