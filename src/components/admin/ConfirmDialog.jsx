'use client';

import { useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';

/**
 * @param {{
 *   open: boolean,
 *   title: string,
 *   message: string,
 *   confirmLabel?: string,
 *   cancelLabel?: string,
 *   onConfirm: () => void,
 *   onCancel: () => void,
 *   busy?: boolean,
 * }} props
 */
export default function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    busy = false,
}) {
    const cancelRef = useRef(null);

    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === 'Escape' && onCancel();
        document.addEventListener('keydown', onKey);
        const t = setTimeout(() => cancelRef.current?.focus(), 30);
        return () => {
            document.removeEventListener('keydown', onKey);
            clearTimeout(t);
        };
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="fixed inset-0 z-50 flex items-center justify-center"
        >
            <button
                type="button"
                aria-label="Cancel"
                onClick={onCancel}
                className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm"
            />
            <div className="relative w-full max-w-md mx-4 rounded-lg bg-white p-6 shadow-xl">
                <h2 id="confirm-title" className="text-navy text-lg">
                    {title}
                </h2>
                <p className="text-slate text-sm mt-3">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onCancel}
                        disabled={busy}
                        className="px-4 py-2 text-sm font-medium rounded-md border border-navy/15 text-navy hover:bg-navy/5 disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={busy}
                        className="px-4 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {busy ? 'Working\u2026' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}