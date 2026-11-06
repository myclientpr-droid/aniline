import AdminPageHeader from '@/components/admin/AdminPageHeader';
import PhotosTable from '@/components/admin/PhotosTable';
import { listAllPhotos } from '@/lib/data/photos';
import { PHOTOGRAPHY_CATEGORIES } from '@/lib/constants';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Photography',
};

async function safeList(params) {
    try {
        return await listAllPhotos(params);
    } catch {
        return { items: [], total: 0, page: 1, pageSize: 24, totalPages: 1 };
    }
}

export default async function AdminPhotosPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const page = Math.max(1, Number(params?.page) || 1);
    const q = typeof params?.q === 'string' ? params.q : '';
    const status = typeof params?.status === 'string' ? params.status : '';
    const category = typeof params?.category === 'string' ? params.category : '';

    const user = await getAuthorizedAdminUser();
    const canWrite = user?.role === 'owner';

    const { items, total, totalPages } = await safeList({
        page,
        pageSize: 24,
        q,
        status,
        category,
    });

    return (
        <>
            <AdminPageHeader
                title="Photography"
                description={`${total} photo${total === 1 ? '' : 's'} in total.`}
                actionLabel={canWrite ? 'New photo' : undefined}
                actionHref={canWrite ? '/admin/photos/new' : undefined}
            />
            <PhotosTable
                items={items}
                page={page}
                totalPages={totalPages}
                q={q}
                status={status}
                category={category}
                categoryOptions={PHOTOGRAPHY_CATEGORIES}
                canWrite={canWrite}
            />
        </>
    );
}
