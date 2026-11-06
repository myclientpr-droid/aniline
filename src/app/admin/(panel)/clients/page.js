import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ClientsTable from '@/components/admin/ClientsTable';
import { listAllClients } from '@/lib/data/clients';
import { CLIENT_TYPES } from '@/lib/constants';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Clients',
};

async function safeList(params) {
    try {
        return await listAllClients(params);
    } catch {
        return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 };
    }
}

export default async function AdminClientsPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const page = Math.max(1, Number(params?.page) || 1);
    const q = typeof params?.q === 'string' ? params.q : '';
    const status = typeof params?.status === 'string' ? params.status : '';
    const type = typeof params?.type === 'string' ? params.type : '';

    const user = await getAuthorizedAdminUser();
    const canWrite = user?.role === 'owner';

    const { items, total, totalPages } = await safeList({ page, pageSize: 20, q, status, type });

    return (
        <>
            <AdminPageHeader
                title="Clients"
                description={`${total} client${total === 1 ? '' : 's'} in total.`}
                actionLabel={canWrite ? 'New client' : undefined}
                actionHref={canWrite ? '/admin/clients/new' : undefined}
            />
            <ClientsTable
                items={items}
                page={page}
                totalPages={totalPages}
                q={q}
                status={status}
                type={type}
                typeOptions={CLIENT_TYPES}
                canWrite={canWrite}
            />
        </>
    );
}
