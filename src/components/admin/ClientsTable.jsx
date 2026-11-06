'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TableToolbar from '@/components/admin/TableToolbar';
import TablePagination from '@/components/admin/TablePagination';
import { useToast } from '@/components/admin/ToastProvider';
import { buildImageUrl } from '@/lib/cloudinary';

export default function ClientsTable({
    items,
    page = 1,
    totalPages = 1,
    q = '',
    status = '',
    type = '',
    typeOptions = [],
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
            const res = await fetch(`/api/admin/clients/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed.');
            toast.success('Client deleted.');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not delete.');
        } finally {
            setBusy(false);
        }
    };

    const togglePublish = async (client) => {
        const next = client.published === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch(`/api/admin/clients/${client._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...client, published: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Update failed.');
            toast.success(next === 'published' ? 'Published.' : 'Moved to draft.');
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not update.');
        }
    };

    const isFiltered = Boolean(q || (status && status !== 'all') || (type && type !== 'all'));

    return (
        <>
            <TableToolbar
                basePath="/admin/clients"
                q={q}
                status={status}
                filters={[
                    {
                        name: 'type',
                        label: 'All types',
                        value: type,
                        options: typeOptions.map((t) => ({ value: t, label: t })),
                    },
                ]}
            />

            {!items || items.length === 0 ? (
                <div className="rounded-lg border border-navy/10 bg-white p-10 text-center">
                    <p className="text-slate">
                        {isFiltered ? 'No clients match your filters.' : 'No clients yet.'}
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-navy/10 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-light text-left">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-navy">Name</th>
                                <th className="px-5 py-3 font-semibold text-navy hidden md:table-cell">Type</th>
                                <th className="px-5 py-3 font-semibold text-navy">Status</th>
                                <th className="px-5 py-3 font-semibold text-navy text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                            {items.map((c) => (
                                <tr key={String(c._id)}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 flex-none overflow-hidden rounded bg-navy/5">
                                                {c.logo?.publicId ? (
                                                    // eslint-disable-next-line @next/next/no-img-element -- external asset, tiny thumbnail
                                                    <img
                                                        src={buildImageUrl(c.logo.publicId, { width: 96 })}
                                                        alt=""
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : null}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-navy font-medium truncate">{c.name}</p>
                                                <p className="text-slate text-xs mt-0.5">/{c.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate hidden md:table-cell">{c.type || '—'}</td>
                                    <td className="px-5 py-3">
                                        {canWrite ? (
                                            <button
                                                type="button"
                                                onClick={() => togglePublish(c)}
                                                className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${c.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {c.published}
                                            </button>
                                        ) : (
                                            <span
                                                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${c.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {c.published}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {canWrite && (
                                                <>
                                                    <Link
                                                        href={`/admin/clients/${c._id}`}
                                                        className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                        aria-label={`Edit ${c.name}`}
                                                    >
                                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(c)}
                                                        className="p-2 rounded-md text-slate hover:text-red-600 hover:bg-red-50"
                                                        aria-label={`Delete ${c.name}`}
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

            <TablePagination basePath="/admin/clients" page={page} totalPages={totalPages} />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={`Delete "${deleteTarget?.name}"?`}
                message="This cannot be undone. Projects referencing this client keep their free-text client name."
                onConfirm={remove}
                onCancel={() => setDeleteTarget(null)}
                busy={busy}
            />
        </>
    );
}
