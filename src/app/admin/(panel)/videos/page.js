import AdminPageHeader from '@/components/admin/AdminPageHeader';
import VideosTable from '@/components/admin/VideosTable';
import { listAllVideos } from '@/lib/data/videos';
import { VIDEO_CATEGORIES } from '@/lib/constants';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';

export const metadata = {
    title: 'Videography',
};

async function safeList(params) {
    try {
        return await listAllVideos(params);
    } catch {
        return { items: [], total: 0, page: 1, pageSize: 20, totalPages: 1 };
    }
}

export default async function AdminVideosPage({ searchParams }) {
    const params = await Promise.resolve(searchParams);
    const page = Math.max(1, Number(params?.page) || 1);
    const q = typeof params?.q === 'string' ? params.q : '';
    const status = typeof params?.status === 'string' ? params.status : '';
    const category = typeof params?.category === 'string' ? params.category : '';

    const user = await getAuthorizedAdminUser();
    const canWrite = user?.role === 'owner';

    const { items, total, totalPages } = await safeList({
        page,
        pageSize: 20,
        q,
        status,
        category,
    });

    return (
        <>
            <AdminPageHeader
                title="Videography"
                description={`${total} film${total === 1 ? '' : 's'} in total.`}
                actionLabel={canWrite ? 'New film' : undefined}
                actionHref={canWrite ? '/admin/videos/new' : undefined}
            />
            <VideosTable
                items={items}
                page={page}
                totalPages={totalPages}
                q={q}
                status={status}
                category={category}
                categoryOptions={VIDEO_CATEGORIES}
                canWrite={canWrite}
            />
        </>
    );
}
