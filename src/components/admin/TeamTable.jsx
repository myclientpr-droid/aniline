'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TableToolbar from '@/components/admin/TableToolbar';
import TablePagination from '@/components/admin/TablePagination';
import { useToast } from '@/components/admin/ToastProvider';
import { buildImageUrl } from '@/lib/cloudinary';

export default function TeamTable({
    items,
    page = 1,
    totalPages = 1,
    q = '',
    status = '',
    role = '',
    roleOptions = [],
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
            const res = await fetch(`/api/admin/team/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed.');
            toast.success('Team member deleted.');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not delete.');
        } finally {
            setBusy(false);
        }
    };

    const togglePublish = async (member) => {
        const next = member.published === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch(`/api/admin/team/${member._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...member, published: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Update failed.');
            toast.success(next === 'published' ? 'Published.' : 'Moved to draft.');
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not update.');
        }
    };

    const isFiltered = Boolean(q || (status && status !== 'all') || (role && role !== 'all'));

    return (
        <>
            <TableToolbar
                basePath="/admin/team"
                q={q}
                status={status}
                filters={[
                    {
                        name: 'role',
                        label: 'All roles',
                        value: role,
                        options: roleOptions.map((r) => ({ value: r, label: r })),
                    },
                ]}
            />

            {!items || items.length === 0 ? (
                <div className="rounded-lg border border-navy/10 bg-white p-10 text-center">
                    <p className="text-slate">
                        {isFiltered ? 'No team members match your filters.' : 'No team members yet.'}
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-navy/10 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-light text-left">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-navy">Name</th>
                                <th className="px-5 py-3 font-semibold text-navy hidden md:table-cell">Role</th>
                                <th className="px-5 py-3 font-semibold text-navy">Status</th>
                                <th className="px-5 py-3 font-semibold text-navy text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                            {items.map((m) => (
                                <tr key={String(m._id)}>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 flex-none overflow-hidden rounded-full bg-navy/5">
                                                {m.photo?.publicId ? (
                                                    // eslint-disable-next-line @next/next/no-img-element -- external asset, tiny thumbnail
                                                    <img
                                                        src={buildImageUrl(m.photo.publicId, { width: 96, height: 96 })}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : null}
                                            </div>
                                            <p className="text-navy font-medium">{m.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate hidden md:table-cell">{m.role || '—'}</td>
                                    <td className="px-5 py-3">
                                        {canWrite ? (
                                            <button
                                                type="button"
                                                onClick={() => togglePublish(m)}
                                                className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${m.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {m.published}
                                            </button>
                                        ) : (
                                            <span
                                                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${m.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {m.published}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {m.published === 'published' && m.slug && (
                                                <Link
                                                    href={`/team/${m.slug}`}
                                                    target="_blank"
                                                    className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                    aria-label={`View ${m.name} on public site`}
                                                >
                                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                </Link>
                                            )}
                                            {canWrite && (
                                                <>
                                                    <Link
                                                        href={`/admin/team/${m._id}`}
                                                        className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                        aria-label={`Edit ${m.name}`}
                                                    >
                                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(m)}
                                                        className="p-2 rounded-md text-slate hover:text-red-600 hover:bg-red-50"
                                                        aria-label={`Delete ${m.name}`}
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

            <TablePagination basePath="/admin/team" page={page} totalPages={totalPages} />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={`Delete "${deleteTarget?.name}"?`}
                message="This cannot be undone. The profile will be removed from the public team page."
                onConfirm={remove}
                onCancel={() => setDeleteTarget(null)}
                busy={busy}
            />
        </>
    );
}
