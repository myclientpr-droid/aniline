'use client';

import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';
import FormField from '@/components/admin/FormField';

/**
 * Ordered list of gallery media entries ({ publicId, alt, caption }).
 */
export default function MediaListEditor({
    label = 'Gallery',
    folder = 'aniline/admin/projects',
    items = [],
    onChange,
    max = 24,
}) {
    const updateAt = (index, patch) => {
        const next = items.map((item, i) => (i === index ? { ...item, ...patch } : item));
        onChange(next);
    };

    const removeAt = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    const move = (index, delta) => {
        const target = index + delta;
        if (target < 0 || target >= items.length) return;
        const next = [...items];
        [next[index], next[target]] = [next[target], next[index]];
        onChange(next);
    };

    const iconBtn =
        'p-1.5 rounded-md text-slate hover:text-navy hover:bg-navy/5 disabled:opacity-40 disabled:pointer-events-none';

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-navy">{label}</p>
                <button
                    type="button"
                    onClick={() => onChange([...items, { publicId: '', alt: '', caption: '' }])}
                    disabled={items.length >= max}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-orange hover:text-navy disabled:opacity-40"
                >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Add image
                </button>
            </div>

            {items.length === 0 ? (
                <p className="text-slate text-sm rounded-md border border-dashed border-navy/25 bg-light px-4 py-4">
                    No gallery images yet.
                </p>
            ) : (
                <ul className="space-y-4">
                    {items.map((item, i) => (
                        <li
                            key={i}
                            className="rounded-lg border border-navy/10 bg-white p-4 space-y-4"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate">
                                    Image {i + 1}
                                </p>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => move(i, -1)}
                                        disabled={i === 0}
                                        className={iconBtn}
                                        aria-label="Move up"
                                    >
                                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => move(i, 1)}
                                        disabled={i === items.length - 1}
                                        className={iconBtn}
                                        aria-label="Move down"
                                    >
                                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeAt(i)}
                                        className="p-1.5 rounded-md text-slate hover:text-red-600 hover:bg-red-50"
                                        aria-label={`Remove image ${i + 1}`}
                                    >
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </div>
                            </div>
                            <ImageUploadField
                                id={`gallery-${i}-image`}
                                label="Image"
                                folder={folder}
                                value={item.publicId ? item : null}
                                onChange={(next) =>
                                    next === null
                                        ? removeAt(i)
                                        : updateAt(i, { ...next, alt: next.alt ?? item.alt, caption: next.caption ?? item.caption })
                                }
                            />
                            <FormField
                                id={`gallery-${i}-alt`}
                                label="Alt text"
                                value={item.alt || ''}
                                onChange={(e) => updateAt(i, { alt: e.target.value })}
                            />
                            <FormField
                                id={`gallery-${i}-caption`}
                                label="Caption"
                                value={item.caption || ''}
                                onChange={(e) => updateAt(i, { caption: e.target.value })}
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
