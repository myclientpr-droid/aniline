'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TableToolbar from '@/components/admin/TableToolbar';
import TablePagination from '@/components/admin/TablePagination';
import { useToast } from '@/components/admin/ToastProvider';

export default function ServicesTable({
    items,
    page = 1,
    totalPages = 1,
    q = '',
    status = '',
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
            const res = await fetch(`/api/admin/services/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed.');
            toast.success('Service deleted.');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not delete.');
        } finally {
            setBusy(false);
        }
    };

    const togglePublish = async (service) => {
        const next = service.published === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch(`/api/admin/services/${service._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...service, published: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Update failed.');
            toast.success(next === 'published' ? 'Published.' : 'Moved to draft.');
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not update.');
        }
    };

    const isFiltered = Boolean(q || (status && status !== 'all'));

    return (
        <>
            <TableToolbar basePath="/admin/services" q={q} status={status} />

            {!items || items.length === 0 ? (
                <div className="rounded-lg border border-navy/10 bg-white p-10 text-center">
                    <p className="text-slate">
                        {isFiltered ? 'No services match your filters.' : 'No services yet.'}
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-navy/10 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-light text-left">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-navy">Title</th>
                                <th className="px-5 py-3 font-semibold text-navy hidden md:table-cell">Order</th>
                                <th className="px-5 py-3 font-semibold text-navy">Status</th>
                                <th className="px-5 py-3 font-semibold text-navy text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                            {items.map((s) => (
                                <tr key={String(s._id)}>
                                    <td className="px-5 py-3">
                                        <p className="text-navy font-medium">{s.title}</p>
                                        <p className="text-slate text-xs mt-0.5">/{s.slug}</p>
                                    </td>
                                    <td className="px-5 py-3 text-slate hidden md:table-cell">{s.order ?? 0}</td>
                                    <td className="px-5 py-3">
                                        {canWrite ? (
                                            <button
                                                type="button"
                                                onClick={() => togglePublish(s)}
                                                className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${s.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {s.published}
                                            </button>
                                        ) : (
                                            <span
                                                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${s.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {s.published}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {s.published === 'published' && (
                                                <Link
                                                    href={`/services/${s.slug}`}
                                                    target="_blank"
                                                    className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                    aria-label={`View ${s.title} on public site`}
                                                >
                                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                </Link>
                                            )}
                                            {canWrite && (
                                                <>
                                                    <Link
                                                        href={`/admin/services/${s._id}`}
                                                        className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                        aria-label={`Edit ${s.title}`}
                                                    >
                                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(s)}
                                                        className="p-2 rounded-md text-slate hover:text-red-600 hover:bg-red-50"
                                                        aria-label={`Delete ${s.title}`}
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

            <TablePagination basePath="/admin/services" page={page} totalPages={totalPages} />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={`Delete "${deleteTarget?.title}"?`}
                message="This cannot be undone. The service will be removed from the public site immediately."
                onConfirm={remove}
                onCancel={() => setDeleteTarget(null)}
                busy={busy}
            />
        </>
    );
}
