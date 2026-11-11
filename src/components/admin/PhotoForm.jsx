'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useToast } from '@/components/admin/ToastProvider';
import { PHOTOGRAPHY_CATEGORIES, PHOTO_GRID_SHAPES } from '@/lib/constants';

const GRID_SHAPE_LABELS = {
    '4:5': '4:5 (portrait)',
    '4:3': '4:3',
    '3:2': '3:2 (landscape)',
};

const EMPTY = {
    image: null,
    title: '',
    category: '',
    alt: '',
    caption: '',
    location: '',
    gridShape: '',
    year: '',
    order: '',
    featured: false,
    published: 'draft',
};

function fromPhoto(photo) {
    if (!photo) return EMPTY;
    return {
        image: photo.publicId
            ? {
                  publicId: photo.publicId,
                  alt: photo.alt || '',
                  width: photo.width,
                  height: photo.height,
              }
            : null,
        title: photo.title || '',
        category: photo.category || '',
        alt: photo.alt || '',
        caption: photo.caption || '',
        location: photo.location || '',
        gridShape: photo.gridShape || '',
        year: photo.year ?? '',
        order: photo.order ?? '',
        featured: Boolean(photo.featured),
        published: photo.published || 'draft',
    };
}

export default function PhotoForm({ photo }) {
    const router = useRouter();
    const toast = useToast();
    const isEdit = Boolean(photo?._id);

    const [values, setValues] = useState(() => fromPhoto(photo));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const update = (field) => (e) => {
        const v = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
        setValues((prev) => ({ ...prev, [field]: v }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const buildPayload = () => ({
        title: values.title,
        category: values.category,
        publicId: values.image?.publicId || '',
        alt: values.image?.alt || values.alt,
        width: values.image?.width,
        height: values.image?.height,
        caption: values.caption,
        location: values.location,
        gridShape: values.gridShape,
        year: values.year === '' ? undefined : Number(values.year),
        order: values.order === '' ? 0 : Number(values.order),
        featured: values.featured,
        published: values.published,
    });

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setFormError('');
        setSubmitting(true);
        try {
            const url = isEdit ? `/api/admin/photos/${photo._id}` : '/api/admin/photos';
            const method = isEdit ? 'PATCH' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload()),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                if (data.errors) setErrors(data.errors);
                setFormError(data.error || 'Could not save. Please try again.');
                return;
            }
            toast.success(isEdit ? 'Photo updated.' : 'Photo added.');
            router.push('/admin/photos');
            router.refresh();
        } catch {
            setFormError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit} noValidate className="space-y-6">
            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Photo</h2>
                <ImageUploadField
                    id="image"
                    label="Image"
                    required
                    folder="aniline/admin/photos"
                    value={values.image}
                    onChange={(next) =>
                        setValues((prev) => ({
                            ...prev,
                            image: next,
                            alt: next?.alt ?? prev.alt,
                        }))
                    }
                    error={errors.publicId}
                    hint="Upload the original photo (or paste a Cloudinary public ID)."
                />
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        id="title"
                        label="Title"
                        value={values.title}
                        onChange={update('title')}
                        error={errors.title}
                    />
                    <FormField
                        id="category"
                        label="Category"
                        as="select"
                        value={values.category}
                        onChange={update('category')}
                        error={errors.category}
                        options={[
                            { value: '', label: 'Uncategorized' },
                            ...PHOTOGRAPHY_CATEGORIES.map((c) => ({ value: c, label: c })),
                        ]}
                    />
                    <FormField
                        id="year"
                        label="Year"
                        type="number"
                        value={values.year}
                        onChange={update('year')}
                        error={errors.year}
                        placeholder="2024"
                    />
                    <FormField
                        id="location"
                        label="Location"
                        value={values.location}
                        onChange={update('location')}
                        error={errors.location}
                    />
                    <FormField
                        id="order"
                        label="Display order"
                        type="number"
                        value={values.order}
                        onChange={update('order')}
                        hint="Lower numbers appear first."
                    />
                    <FormField
                        id="published"
                        label="Status"
                        as="select"
                        value={values.published}
                        onChange={update('published')}
                        error={errors.published}
                        options={[
                            { value: 'draft', label: 'Draft' },
                            { value: 'published', label: 'Published' },
                        ]}
                    />
                    <FormField
                        id="gridShape"
                        label="Grid shape"
                        as="select"
                        value={values.gridShape}
                        onChange={update('gridShape')}
                        error={errors.gridShape}
                        hint="Auto matches the tile to the photo's own proportions."
                        options={[
                            { value: '', label: 'Auto (from dimensions)' },
                            ...PHOTO_GRID_SHAPES.map((s) => ({ value: s, label: GRID_SHAPE_LABELS[s] })),
                        ]}
                    />
                </div>

                <FormField
                    id="alt"
                    label="Alt text"
                    value={values.alt}
                    onChange={update('alt')}
                    error={errors.alt}
                    hint="Describe the photo for screen readers."
                />
                <FormField
                    id="caption"
                    label="Caption"
                    as="textarea"
                    rows={2}
                    value={values.caption}
                    onChange={update('caption')}
                    error={errors.caption}
                />
                <FormField
                    id="featured"
                    label="Feature this photo"
                    as="checkbox"
                    value={values.featured}
                    onChange={update('featured')}
                    hint="Featured photos are prioritized in the public gallery."
                />
            </div>

            {formError && (
                <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {formError}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                    {submitting ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Add photo'}
                </Button>
                <Button href="/admin/photos" variant="secondary" size="lg" type="button">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
