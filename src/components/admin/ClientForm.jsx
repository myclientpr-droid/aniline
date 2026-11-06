'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useToast } from '@/components/admin/ToastProvider';
import { CLIENT_TYPES } from '@/lib/constants';
import { slugify } from '@/lib/slug';

const EMPTY = {
    name: '',
    slug: '',
    shortDescription: '',
    type: '',
    location: '',
    website: '',
    logo: null,
    order: '',
    featured: false,
    published: 'draft',
};

function fromClient(client) {
    if (!client) return EMPTY;
    return {
        name: client.name || '',
        slug: client.slug || '',
        shortDescription: client.shortDescription || '',
        type: client.type || '',
        location: client.location || '',
        website: client.website || '',
        logo: client.logo?.publicId ? { ...client.logo } : null,
        order: client.order ?? '',
        featured: Boolean(client.featured),
        published: client.published || 'draft',
    };
}

export default function ClientForm({ client }) {
    const router = useRouter();
    const toast = useToast();
    const isEdit = Boolean(client?._id);

    const [values, setValues] = useState(() => fromClient(client));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const update = (field) => (e) => {
        const v = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
        setValues((prev) => ({ ...prev, [field]: v }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const buildPayload = () => ({
        name: values.name,
        slug: values.slug || slugify(values.name),
        shortDescription: values.shortDescription,
        type: values.type,
        location: values.location,
        website: values.website,
        logo: values.logo?.publicId
            ? { publicId: values.logo.publicId, alt: values.logo.alt || '' }
            : null,
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
            const url = isEdit ? `/api/admin/clients/${client._id}` : '/api/admin/clients';
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
            toast.success(isEdit ? 'Client updated.' : 'Client created.');
            router.push('/admin/clients');
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
                <h2 className="text-navy text-lg">Basics</h2>
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        id="name"
                        label="Name"
                        required
                        value={values.name}
                        onChange={update('name')}
                        error={errors.name}
                    />
                    <div>
                        <FormField
                            id="slug"
                            label="Slug"
                            value={values.slug}
                            onChange={update('slug')}
                            error={errors.slug}
                            hint="URL segment, e.g. green-root-foundation"
                        />
                        <button
                            type="button"
                            onClick={() => values.name && setValues((p) => ({ ...p, slug: slugify(p.name) }))}
                            className="text-xs font-semibold text-orange hover:text-navy mt-1"
                        >
                            Generate from name
                        </button>
                    </div>
                    <FormField
                        id="type"
                        label="Client type"
                        as="select"
                        value={values.type}
                        onChange={update('type')}
                        error={errors.type}
                        options={[
                            { value: '', label: 'Select\u2026' },
                            ...CLIENT_TYPES.map((t) => ({ value: t, label: t })),
                        ]}
                    />
                    <FormField
                        id="location"
                        label="Location"
                        value={values.location}
                        onChange={update('location')}
                        error={errors.location}
                    />
                    <FormField
                        id="website"
                        label="Website"
                        type="url"
                        value={values.website}
                        onChange={update('website')}
                        error={errors.website}
                        hint="Only if the client has approved being linked."
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
                </div>

                <FormField
                    id="shortDescription"
                    label="Short description"
                    as="textarea"
                    rows={3}
                    value={values.shortDescription}
                    onChange={update('shortDescription')}
                    error={errors.shortDescription}
                    hint="Under 300 characters."
                />
                <FormField
                    id="featured"
                    label="Feature this client"
                    as="checkbox"
                    value={values.featured}
                    onChange={update('featured')}
                    hint="Featured clients appear on the homepage."
                />
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Logo</h2>
                <ImageUploadField
                    id="logo"
                    label="Logo"
                    folder="aniline/admin/clients"
                    value={values.logo}
                    onChange={(next) => setValues((prev) => ({ ...prev, logo: next }))}
                />
                <FormField
                    id="logoAlt"
                    label="Logo alt text"
                    value={values.logo?.alt || ''}
                    onChange={(e) =>
                        setValues((prev) => ({
                            ...prev,
                            logo: prev.logo
                                ? { ...prev.logo, alt: e.target.value }
                                : { publicId: '', alt: e.target.value },
                        }))
                    }
                />
            </div>

            {formError && (
                <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {formError}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                    {submitting ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Create client'}
                </Button>
                <Button href="/admin/clients" variant="secondary" size="lg" type="button">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
