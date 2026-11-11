'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ExternalLink, Star } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TableToolbar from '@/components/admin/TableToolbar';
import TablePagination from '@/components/admin/TablePagination';
import { useToast } from '@/components/admin/ToastProvider';
import { buildImageUrl } from '@/lib/cloudinary';
import { formatDuration } from '@/lib/videography';

/**
 * Row table rather than the photo card grid: a film's identity is its slug, and a slug is only
 * worth showing next to the title it was generated from.
 */
export default function VideosTable({
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
            const res = await fetch(`/api/admin/videos/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed.');
            toast.success('Film deleted.');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not delete.');
        } finally {
            setBusy(false);
        }
    };

    // The API validates a whole film payload, so the row is sent as-is with the new state.
    const togglePublish = async (film) => {
        const next = film.published === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch(`/api/admin/videos/${film._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...film, published: next }),
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
                basePath="/admin/videos"
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
                        {isFiltered ? 'No films match your filters.' : 'No films yet.'}
                    </p>
                    {!isFiltered && canWrite && (
                        <p className="text-slate text-sm mt-2">
                            Add a YouTube or Vimeo link to start the archive.
                        </p>
                    )}
                </div>
            ) : (
                <div className="rounded-lg border border-navy/10 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-light text-left">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-navy">Film</th>
                                <th className="px-5 py-3 font-semibold text-navy hidden md:table-cell">
                                    Category
                                </th>
                                <th className="px-5 py-3 font-semibold text-navy hidden md:table-cell">
                                    Duration
                                </th>
                                <th className="px-5 py-3 font-semibold text-navy">Status</th>
                                <th className="px-5 py-3 font-semibold text-navy text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                            {items.map((film) => (
                                <tr key={String(film._id)}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <span className="h-12 w-20 flex-none aspect-[16/9] overflow-hidden rounded bg-navy/5">
                                                {film.poster?.publicId ? (
                                                    // eslint-disable-next-line @next/next/no-img-element -- external asset, dynamic dimensions
                                                    <img
                                                        src={buildImageUrl(film.poster.publicId, {
                                                            width: 160,
                                                            height: 90,
                                                        })}
                                                        alt=""
                                                        loading="lazy"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : null}
                                            </span>
                                            <span className="min-w-0">
                                                <span className="flex items-center gap-1.5">
                                                    <span className="text-navy font-medium truncate">
                                                        {film.title}
                                                    </span>
                                                    {film.featured && (
                                                        <Star
                                                            className="h-3.5 w-3.5 flex-none text-orange fill-current"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </span>
                                                <span className="block text-slate text-xs mt-0.5">
                                                    /{film.slug}
                                                </span>
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate hidden md:table-cell">
                                        {film.category || '—'}
                                    </td>
                                    <td className="px-5 py-3 text-slate hidden md:table-cell tabular-nums">
                                        {formatDuration(film.durationSeconds) || '—'}
                                    </td>
                                    <td className="px-5 py-3">
                                        {canWrite ? (
                                            <button
                                                type="button"
                                                onClick={() => togglePublish(film)}
                                                className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${
                                                    film.published === 'published'
                                                        ? 'text-orange bg-orange/10'
                                                        : 'text-slate bg-navy/5'
                                                }`}
                                            >
                                                {film.published}
                                            </button>
                                        ) : (
                                            <span
                                                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${
                                                    film.published === 'published'
                                                        ? 'text-orange bg-orange/10'
                                                        : 'text-slate bg-navy/5'
                                                }`}
                                            >
                                                {film.published}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {film.published === 'published' && (
                                                <Link
                                                    href={`/videography/${film.slug}`}
                                                    target="_blank"
                                                    className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                    aria-label={`View ${film.title} on public site`}
                                                >
                                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                </Link>
                                            )}
                                            {canWrite && (
                                                <>
                                                    <Link
                                                        href={`/admin/videos/${film._id}`}
                                                        className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                        aria-label={`Edit ${film.title}`}
                                                    >
                                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(film)}
                                                        className="p-2 rounded-md text-slate hover:text-red-600 hover:bg-red-50"
                                                        aria-label={`Delete ${film.title}`}
                                                    >
                                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <TablePagination basePath="/admin/videos" page={page} totalPages={totalPages} />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={`Delete "${deleteTarget?.title}"?`}
                message="This cannot be undone. The film will be removed from the videography page immediately."
                onConfirm={remove}
                onCancel={() => setDeleteTarget(null)}
                busy={busy}
            />
        </>
    );
}
