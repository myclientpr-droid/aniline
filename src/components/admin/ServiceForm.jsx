'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useToast } from '@/components/admin/ToastProvider';
import { slugify } from '@/lib/slug';

const EMPTY = {
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    audienceText: '',
    deliverablesText: '',
    heroImage: null,
    order: '',
    published: 'draft',
    seoTitle: '',
    seoDescription: '',
};

function fromService(service) {
    if (!service) return EMPTY;
    return {
        title: service.title || '',
        slug: service.slug || '',
        shortDescription: service.shortDescription || '',
        description: service.description || '',
        audienceText: Array.isArray(service.audience) ? service.audience.join(', ') : '',
        deliverablesText: Array.isArray(service.deliverables)
            ? service.deliverables.join(', ')
            : '',
        heroImage: service.heroImage?.publicId ? { ...service.heroImage } : null,
        order: service.order ?? '',
        published: service.published || 'draft',
        seoTitle: service.seoTitle || '',
        seoDescription: service.seoDescription || '',
    };
}

export default function ServiceForm({ service }) {
    const router = useRouter();
    const toast = useToast();
    const isEdit = Boolean(service?._id);

    const [values, setValues] = useState(() => fromService(service));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const update = (field) => (e) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const buildPayload = () => ({
        title: values.title,
        slug: values.slug || slugify(values.title),
        shortDescription: values.shortDescription,
        description: values.description,
        audience: values.audienceText.split(',').map((s) => s.trim()).filter(Boolean),
        deliverables: values.deliverablesText.split(',').map((s) => s.trim()).filter(Boolean),
        heroImage: values.heroImage?.publicId
            ? { publicId: values.heroImage.publicId, alt: values.heroImage.alt || '' }
            : null,
        order: values.order === '' ? 0 : Number(values.order),
        published: values.published,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
    });

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setFormError('');
        setSubmitting(true);
        try {
            const url = isEdit ? `/api/admin/services/${service._id}` : '/api/admin/services';
            const method = isEdit ? 'PATCH' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildPayload()),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.ok) {
                const message = data.error || 'Could not save. Please try again.';
                if (data.errors) setErrors(data.errors);
                setFormError(message);
                toast.error(message);
                return;
            }
            toast.success(isEdit ? 'Service updated.' : 'Service created.');
            router.push('/admin/services');
            router.refresh();
        } catch {
            const message = 'Network error. Please try again.';
            setFormError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submit} noValidate className="space-y-6">
            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Basics</h2>
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        id="title"
                        label="Title"
                        required
                        value={values.title}
                        onChange={update('title')}
                        error={errors.title}
                    />
                    <div>
                        <FormField
                            id="slug"
                            label="Slug"
                            value={values.slug}
                            onChange={update('slug')}
                            error={errors.slug}
                            hint="URL segment, e.g. documentary-filmmaking"
                        />
                        <button
                            type="button"
                            onClick={() => values.title && setValues((p) => ({ ...p, slug: slugify(p.title) }))}
                            className="text-xs font-semibold text-orange hover:text-navy mt-1"
                        >
                            Generate from title
                        </button>
                    </div>
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
                </div>

                <FormField
                    id="shortDescription"
                    label="Short description"
                    as="textarea"
                    rows={3}
                    value={values.shortDescription}
                    onChange={update('shortDescription')}
                    error={errors.shortDescription}
                    hint="Shown on cards and lists. Under 300 characters."
                />
                <FormField
                    id="description"
                    label="Full description"
                    as="textarea"
                    rows={8}
                    value={values.description}
                    onChange={update('description')}
                    error={errors.description}
                />
                <FormField
                    id="audienceText"
                    label="Who it's for"
                    value={values.audienceText}
                    onChange={update('audienceText')}
                    hint="Comma-separated, e.g. NGOs, Schools, Brands"
                />
                <FormField
                    id="deliverablesText"
                    label="Deliverables"
                    value={values.deliverablesText}
                    onChange={update('deliverablesText')}
                    hint="Comma-separated, e.g. 5-minute film, Social cuts"
                />
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Media &amp; SEO</h2>
                <ImageUploadField
                    id="heroImage"
                    label="Hero image"
                    folder="aniline/admin/services"
                    value={values.heroImage}
                    onChange={(next) => setValues((prev) => ({ ...prev, heroImage: next }))}
                />
                <FormField
                    id="heroImageAlt"
                    label="Hero image alt text"
                    value={values.heroImage?.alt || ''}
                    onChange={(e) =>
                        setValues((prev) => ({
                            ...prev,
                            heroImage: prev.heroImage
                                ? { ...prev.heroImage, alt: e.target.value }
                                : { publicId: '', alt: e.target.value },
                        }))
                    }
                />
                <FormField
                    id="seoTitle"
                    label="SEO title"
                    value={values.seoTitle}
                    onChange={update('seoTitle')}
                    error={errors.seoTitle}
                    hint="Optional. Falls back to the service title."
                />
                <FormField
                    id="seoDescription"
                    label="SEO description"
                    as="textarea"
                    rows={2}
                    value={values.seoDescription}
                    onChange={update('seoDescription')}
                    error={errors.seoDescription}
                />
            </div>

            {formError && (
                <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {formError}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                    {submitting ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Create service'}
                </Button>
                <Button href="/admin/services" variant="secondary" size="lg" type="button">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
