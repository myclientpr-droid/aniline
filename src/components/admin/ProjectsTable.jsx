'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TableToolbar from '@/components/admin/TableToolbar';
import TablePagination from '@/components/admin/TablePagination';
import { useToast } from '@/components/admin/ToastProvider';

export default function ProjectsTable({
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
            const res = await fetch(`/api/admin/projects/${deleteTarget._id}`, {
                method: 'DELETE',
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed.');
            toast.success('Project deleted.');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not delete.');
        } finally {
            setBusy(false);
        }
    };

    const togglePublish = async (project) => {
        const next = project.published === 'published' ? 'draft' : 'published';
        try {
            const res = await fetch(`/api/admin/projects/${project._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...project, published: next }),
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
            <TableToolbar basePath="/admin/projects" q={q} status={status} />

            {!items || items.length === 0 ? (
                <div className="rounded-lg border border-navy/10 bg-white p-10 text-center">
                    <p className="text-slate">
                        {isFiltered ? 'No projects match your filters.' : 'No projects yet.'}
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-navy/10 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-light text-left">
                            <tr>
                                <th className="px-5 py-3 font-semibold text-navy">Title</th>
                                <th className="px-5 py-3 font-semibold text-navy hidden md:table-cell">Category</th>
                                <th className="px-5 py-3 font-semibold text-navy hidden md:table-cell">Year</th>
                                <th className="px-5 py-3 font-semibold text-navy">Status</th>
                                <th className="px-5 py-3 font-semibold text-navy text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-navy/10">
                            {items.map((p) => (
                                <tr key={String(p._id)}>
                                    <td className="px-5 py-3">
                                        <p className="text-navy font-medium">{p.title}</p>
                                        <p className="text-slate text-xs mt-0.5">/{p.slug}</p>
                                    </td>
                                    <td className="px-5 py-3 text-slate hidden md:table-cell">{p.category || '—'}</td>
                                    <td className="px-5 py-3 text-slate hidden md:table-cell">{p.year || '—'}</td>
                                    <td className="px-5 py-3">
                                        {canWrite ? (
                                            <button
                                                type="button"
                                                onClick={() => togglePublish(p)}
                                                className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${p.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {p.published}
                                            </button>
                                        ) : (
                                            <span
                                                className={`inline-block text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${p.published === 'published'
                                                    ? 'text-orange bg-orange/10'
                                                    : 'text-slate bg-navy/5'
                                                    }`}
                                            >
                                                {p.published}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            {p.published === 'published' && (
                                                <Link
                                                    href={`/work/${p.slug}`}
                                                    target="_blank"
                                                    className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                    aria-label={`View ${p.title} on public site`}
                                                >
                                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                </Link>
                                            )}
                                            {canWrite && (
                                                <>
                                                    <Link
                                                        href={`/admin/projects/${p._id}`}
                                                        className="p-2 rounded-md text-slate hover:text-navy hover:bg-navy/5"
                                                        aria-label={`Edit ${p.title}`}
                                                    >
                                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteTarget(p)}
                                                        className="p-2 rounded-md text-slate hover:text-red-600 hover:bg-red-50"
                                                        aria-label={`Delete ${p.title}`}
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

            <TablePagination basePath="/admin/projects" page={page} totalPages={totalPages} />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={`Delete "${deleteTarget?.title}"?`}
                message="This cannot be undone. The project will be removed from the public site immediately."
                onConfirm={remove}
                onCancel={() => setDeleteTarget(null)}
                busy={busy}
            />
        </>
    );
}
