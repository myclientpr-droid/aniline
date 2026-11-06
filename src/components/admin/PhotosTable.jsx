'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2, Star } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TableToolbar from '@/components/admin/TableToolbar';
import TablePagination from '@/components/admin/TablePagination';
import { useToast } from '@/components/admin/ToastProvider';
import { buildImageUrl } from '@/lib/cloudinary';

export default function PhotosTable({
    items,
    page = 1,
    totalPages = 1,
    q = '',
    status = '',
    category = '',
    categoryOptions = [],
    canWrite = false,
}) {
    const router = useRouter();
    const toast = useToast();
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [busy, setBusy] = useState(false);

    const remove = async () => {
        if (!deleteTarget) return;
        setBusy(true);
        try {
            const res = await fetch(`/api/admin/photos/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed.');
            toast.success('Photo deleted.');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not delete.');
        } finally {
            setBusy(false);
        }
    };

    const togglePublish = async (photo) => {
        const next = photo.published === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch(`/api/admin/photos/${photo._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...photo, published: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Update failed.');
            toast.success(next === 'published' ? 'Published.' : 'Moved to draft.');
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not update.');
        }
    };

    const isFiltered = Boolean(
        q || (status && status !== 'all') || (category && category !== 'all')
    );

    return (
        <>
            <TableToolbar
                basePath="/admin/photos"
                q={q}
                status={status}
                filters={[
                    {
                        name: 'category',
                        label: 'All categories',
                        value: category,
                        options: categoryOptions.map((c) => ({ value: c, label: c })),
                    },
                ]}
            />

            {!items || items.length === 0 ? (
                <div className="rounded-lg border border-navy/10 bg-white p-10 text-center">
                    <p className="text-slate">
                        {isFiltered ? 'No photos match your filters.' : 'No photos yet.'}
                    </p>
                </div>
            ) : (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {items.map((photo) => (
                        <li
                            key={String(photo._id)}
                            className="rounded-lg border border-navy/10 bg-white overflow-hidden"
                        >
                            <div className="relative aspect-[4/3] bg-navy/5">
                                {photo.publicId ? (
                                    // eslint-disable-next-line @next/next/no-img-element -- external asset, dynamic dimensions
                                    <img
                                        src={buildImageUrl(photo.publicId, { width: 480 })}
                                        alt={photo.alt || photo.title || 'Photo'}
                                        loading="lazy"
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                                <button
                                    type="button"
                                    onClick={() => togglePublish(photo)}
                                    disabled={!canWrite}
                                    className={`absolute top-2 left-2 text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${photo.published === 'published'
                                        ? 'text-orange bg-orange/10'
                                        : 'text-slate bg-white/90'
                                        } ${canWrite ? '' : 'pointer-events-none'}`}
                                    aria-label={
                                        canWrite ? `Toggle ${photo.title || 'photo'} publish state` : undefined
                                    }
                                >
                                    {photo.published}
                                </button>
                                {photo.featured && (
                                    <span className="absolute top-2 right-2 rounded bg-navy-dark/70 p-1.5 text-orange">
                                        <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                                        <span className="sr-only">Featured</span>
                                    </span>
                                )}
                            </div>
                            <div className="p-3">
                                <p className="text-navy text-sm font-medium truncate">
                                    {photo.title || photo.publicId}
                                </p>
                                <p className="text-slate text-xs mt-0.5">
                                    {photo.category || 'Uncategorized'}
                                    {photo.year ? ` · ${photo.year}` : ''}
                                </p>
                                {canWrite && (
                                    <div className="flex items-center justify-end gap-1 mt-2">
                                        <Link
                                            href={`/admin/photos/${photo._id}`}
                                            className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                            aria-label={`Edit ${photo.title || 'photo'}`}
                                        >
                                            <Pencil className="h-4 w-4" aria-hidden="true" />
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(photo)}
                                            className="p-2 rounded-md text-slate hover:text-red-600 hover:bg-red-50"
                                            aria-label={`Delete ${photo.title || 'photo'}`}
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <TablePagination basePath="/admin/photos" page={page} totalPages={totalPages} />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={`Delete "${deleteTarget?.title || 'this photo'}"?`}
                message="This cannot be undone. The photo will be removed from the public gallery."
                onConfirm={remove}
                onCancel={() => setDeleteTarget(null)}
                busy={busy}
            />
        </>
    );
}
