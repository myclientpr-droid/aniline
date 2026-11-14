'use client';

import { useRef, useState } from 'react';
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { buildImageUrl } from '@/lib/cloudinary.js';
import { useToast } from '@/components/admin/ToastProvider';

const MAX_BYTES = 25 * 1024 * 1024;

/**
 * Upload (or paste) a Cloudinary asset. Calls `onChange` with
 * `{ publicId, ...preserved, width, height }` on success and `null` on remove.
 */
export default function ImageUploadField({
    id,
    label,
    folder = 'aniline/admin/misc',
    value,
    onChange,
    accept = 'image/*',
    required = false,
    hint,
    error,
}) {
    const toast = useToast();
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [statusError, setStatusError] = useState('');
    const [manualOpen, setManualOpen] = useState(false);
    const [manualId, setManualId] = useState('');
    // Cloud name observed from the last signature response (env can diverge
    // from NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME otherwise).
    const [cloudName, setCloudName] = useState('');

    const previewUrl = (publicId) =>
        cloudName
            ? `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto,w_400/${publicId}`
            : buildImageUrl(publicId, { width: 400 });

    const upload = async (file) => {
        setStatusError('');
        if (!file) return;
        if (file.size > MAX_BYTES) {
            setStatusError('File is larger than 25 MB.');
            toast.error('File is larger than 25 MB.');
            return;
        }

        setUploading(true);
        try {
            const sigRes = await fetch('/api/admin/upload-signature', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folder }),
            });
            const sigData = await sigRes.json().catch(() => ({}));
            if (!sigRes.ok || !sigData.ok) {
                throw new Error(sigData.error || 'Could not prepare the upload.');
            }
            const { publicId, timestamp, signature, apiKey, cloudName: cloud } = sigData.data;
            setCloudName(cloud);

            const resourceType = accept.includes('video')
                ? accept.startsWith('video')
                    ? 'video'
                    : 'auto'
                : 'image';

            const form = new FormData();
            form.append('file', file);
            form.append('api_key', apiKey);
            form.append('timestamp', String(timestamp));
            form.append('signature', signature);
            form.append('public_id', publicId);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`,
                { method: 'POST', body: form }
            );
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data?.error?.message || 'Upload failed.');
            }

            onChange({
                ...(value || {}),
                publicId: data.public_id,
                width: data.width,
                height: data.height,
            });
            toast.success('Upload complete.');
        } catch (err) {
            const message = err.message || 'Upload failed.';
            setStatusError(message);
            toast.error(message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const applyManual = () => {
        const trimmed = manualId.trim();
        if (!trimmed) return;
        onChange({ ...(value || {}), publicId: trimmed, width: undefined, height: undefined });
        setManualId('');
        setManualOpen(false);
        setStatusError('');
    };

    const showError = error || statusError;
    const inputClass =
        'w-full rounded-md border bg-white px-3.5 py-2.5 text-navy placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-colors';

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-navy mb-1.5">
                {label}
                {required && <span className="text-orange ml-1" aria-hidden="true">*</span>}
            </label>

            {value?.publicId ? (
                <div className="rounded-md border border-navy/15 bg-light p-3">
                    <div className="flex items-start gap-3">
                        <div className="h-20 w-28 flex-none overflow-hidden rounded bg-navy/5">
                            {/* eslint-disable-next-line @next/next/no-img-element -- dynamic external asset, unknown dimensions */}
                            <img
                                src={previewUrl(value.publicId)}
                                alt={value.alt || label}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-navy text-xs font-mono break-all">
                                {value.publicId}
                            </p>
                            {hint && <p className="text-slate text-xs mt-1">{hint}</p>}
                            <button
                                type="button"
                                onClick={() => onChange(null)}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700"
                            >
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    aria-label={`Upload ${label}`}
                    className="w-full rounded-md border border-dashed border-navy/25 bg-light px-4 py-6 text-slate hover:border-orange hover:text-navy transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            Uploading…
                        </>
                    ) : (
                        <>
                            <Upload className="h-4 w-4" aria-hidden="true" />
                            Choose file to upload
                        </>
                    )}
                </button>
            )}

            <input
                ref={fileInputRef}
                id={id}
                type="file"
                accept={accept}
                className="sr-only"
                onChange={(e) => upload(e.target.files?.[0])}
            />

            {!value?.publicId && (
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={() => setManualOpen((o) => !o)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-slate hover:text-navy"
                        aria-expanded={manualOpen}
                    >
                        <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Enter a Cloudinary public ID manually
                    </button>
                    {manualOpen && (
                        <div className="mt-2 flex gap-2">
                            <input
                                type="text"
                                aria-label={`${label} public ID`}
                                value={manualId}
                                onChange={(e) => setManualId(e.target.value)}
                                placeholder="folder/name-of-asset"
                                className={inputClass}
                            />
                            <button
                                type="button"
                                onClick={applyManual}
                                className="flex-none rounded-md border border-navy/15 bg-white px-3 py-2 text-sm font-semibold text-navy hover:bg-navy/5"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            )}

            {showError && (
                <p id={`${id}-error`} role="alert" className="text-red-600 text-xs mt-1.5">
                    {showError}
                </p>
            )}
        </div>
    );
}
