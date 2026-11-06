'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import TableToolbar from '@/components/admin/TableToolbar';
import TablePagination from '@/components/admin/TablePagination';
import { useToast } from '@/components/admin/ToastProvider';
import { INQUIRY_STATUS } from '@/lib/constants';

const STATUS_STYLES = {
    [INQUIRY_STATUS.NEW]: 'text-orange bg-orange/10',
    [INQUIRY_STATUS.REVIEWED]: 'text-navy bg-navy/5',
    [INQUIRY_STATUS.ARCHIVED]: 'text-slate bg-navy/5',
};

const STATUS_LABELS = [
    { value: 'all', label: 'All statuses' },
    { value: INQUIRY_STATUS.NEW, label: 'New' },
    { value: INQUIRY_STATUS.REVIEWED, label: 'Reviewed' },
    { value: INQUIRY_STATUS.ARCHIVED, label: 'Archived' },
];

function formatDate(date) {
    if (!date) return '';
    try {
        return new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(date));
    } catch {
        return '';
    }
}

export default function InquiriesTable({
    items,
    page = 1,
    totalPages = 1,
    q = '',
    status = '',
}) {
    const router = useRouter();
    const toast = useToast();
    const [expanded, setExpanded] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const [busyId, setBusyId] = useState(null);

    const setStatus = async (inquiry, next) => {
        if (inquiry.status === next) return;
        setBusyId(String(inquiry._id));
        try {
            const res = await fetch(`/api/admin/inquiries/${inquiry._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Update failed.');
            toast.success(next === INQUIRY_STATUS.REVIEWED ? 'Marked as reviewed.' : 'Status updated.');
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not update.');
        } finally {
            setBusyId(null);
        }
    };

    const remove = async () => {
        if (!deleteTarget) return;
        setBusy(true);
        try {
            const res = await fetch(`/api/admin/inquiries/${deleteTarget._id}`, {
                method: 'DELETE',
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) throw new Error(data.error || 'Delete failed.');
            toast.success('Inquiry deleted.');
            setDeleteTarget(null);
            router.refresh();
        } catch (err) {
            toast.error(err.message || 'Could not delete.');
        } finally {
            setBusy(false);
        }
    };

    const isFiltered = Boolean(q || (status && status !== 'all'));

    return (
        <>
            <TableToolbar
                basePath="/admin/inquiries"
                q={q}
                status={status}
                statusOptions={STATUS_LABELS}
            />

            {!items || items.length === 0 ? (
                <div className="rounded-lg border border-navy/10 bg-white p-10 text-center">
                    <p className="text-slate">
                        {isFiltered ? 'No inquiries match your filters.' : 'No inquiries yet.'}
                    </p>
                </div>
            ) : (
                <div className="rounded-lg border border-navy/10 bg-white overflow-hidden">
                    <ul className="divide-y divide-navy/10">
                        {items.map((inq) => {
                            const isOpen = expanded === String(inq._id);
                            return (
                                <li key={String(inq._id)}>
                                    <div className="flex items-start justify-between gap-4 p-5">
                                        <button
                                            type="button"
                                            onClick={() => setExpanded(isOpen ? null : String(inq._id))}
                                            aria-expanded={isOpen}
                                            className="flex items-start gap-3 text-left min-w-0 flex-1"
                                        >
                                            {isOpen ? (
                                                <ChevronDown className="h-4 w-4 mt-1 flex-none text-slate" aria-hidden="true" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 mt-1 flex-none text-slate" aria-hidden="true" />
                                            )}
                                            <span className="min-w-0">
                                                <span className="text-navy font-medium block truncate">
                                                    {inq.name}
                                                    {inq.organization ? ` · ${inq.organization}` : ''}
                                                </span>
                                                <span className="text-slate text-sm block mt-0.5 line-clamp-1">
                                                    {inq.description}
                                                </span>
                                            </span>
                                        </button>
                                        <div className="flex-none flex flex-col items-end gap-2">
                                            <span
                                                className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded ${STATUS_STYLES[inq.status] || 'text-slate bg-navy/5'}`}
                                            >
                                                {inq.status}
                                            </span>
                                            <span className="text-slate text-xs">{formatDate(inq.createdAt)}</span>
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div className="px-5 pb-5 pt-0 ml-7">
                                            <div className="rounded-lg bg-light p-4 space-y-3">
                                                <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2 text-sm">
                                                    <div>
                                                        <dt className="text-slate text-xs uppercase tracking-wider">Email</dt>
                                                        <dd className="text-navy mt-0.5 break-all">{inq.email}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-slate text-xs uppercase tracking-wider">Phone</dt>
                                                        <dd className="text-navy mt-0.5">{inq.phone || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-slate text-xs uppercase tracking-wider">Project type</dt>
                                                        <dd className="text-navy mt-0.5">{inq.projectCategory || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-slate text-xs uppercase tracking-wider">Location</dt>
                                                        <dd className="text-navy mt-0.5">{inq.location || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-slate text-xs uppercase tracking-wider">Preferred date</dt>
                                                        <dd className="text-navy mt-0.5">{inq.preferredDate || '—'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt className="text-slate text-xs uppercase tracking-wider">Timeline</dt>
                                                        <dd className="text-navy mt-0.5">{inq.timeline || '—'}</dd>
                                                    </div>
                                                </dl>
                                                <div>
                                                    <p className="text-slate text-xs uppercase tracking-wider">Description</p>
                                                    <p className="text-navy text-sm mt-1 whitespace-pre-wrap">
                                                        {inq.description}
                                                    </p>
                                                </div>
                                                {Array.isArray(inq.referenceLinks) && inq.referenceLinks.length > 0 && (
                                                    <div>
                                                        <p className="text-slate text-xs uppercase tracking-wider">
                                                            Reference links
                                                        </p>
                                                        <ul className="mt-1 space-y-1">
                                                            {inq.referenceLinks.map((link) => (
                                                                <li key={link}>
                                                                    <a
                                                                        href={link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer nofollow"
                                                                        className="text-sm text-orange hover:text-navy break-all"
                                                                    >
                                                                        {link}
                                                                    </a>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center justify-end gap-2 mt-3">
                                                {inq.status !== INQUIRY_STATUS.REVIEWED && (
                                                    <button
                                                        type="button"
                                                        disabled={busyId === String(inq._id)}
                                                        onClick={() => setStatus(inq, INQUIRY_STATUS.REVIEWED)}
                                                        className="rounded-md border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5 disabled:opacity-50"
                                                    >
                                                        Mark reviewed
                                                    </button>
                                                )}
                                                {inq.status !== INQUIRY_STATUS.ARCHIVED && (
                                                    <button
                                                        type="button"
                                                        disabled={busyId === String(inq._id)}
                                                        onClick={() => setStatus(inq, INQUIRY_STATUS.ARCHIVED)}
                                                        className="rounded-md border border-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-navy/5 disabled:opacity-50"
                                                    >
                                                        Archive
                                                    </button>
                                                )}
                                                {inq.status !== INQUIRY_STATUS.NEW && (
                                                    <button
                                                        type="button"
                                                        disabled={busyId === String(inq._id)}
                                                        onClick={() => setStatus(inq, INQUIRY_STATUS.NEW)}
                                                        className="rounded-md border border-orange/40 bg-orange/10 px-3 py-1.5 text-xs font-semibold text-orange hover:bg-orange/20 disabled:opacity-50"
                                                    >
                                                        Reopen as new
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => setDeleteTarget(inq)}
                                                    className="ml-2 inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate hover:text-red-600 hover:bg-red-50"
                                                    aria-label={`Delete inquiry from ${inq.name}`}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <TablePagination basePath="/admin/inquiries" page={page} totalPages={totalPages} />

            <ConfirmDialog
                open={Boolean(deleteTarget)}
                title={`Delete inquiry from "${deleteTarget?.name}"?`}
                message="This cannot be undone. The submission and its details will be permanently removed."
                onConfirm={remove}
                onCancel={() => setDeleteTarget(null)}
                busy={busy}
            />
        </>
    );
}
