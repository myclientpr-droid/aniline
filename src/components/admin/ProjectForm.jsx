'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import ImageUploadField from '@/components/admin/ImageUploadField';
import MediaListEditor from '@/components/admin/MediaListEditor';
import { useToast } from '@/components/admin/ToastProvider';
import { PROJECT_CATEGORIES, PROJECT_VIDEO_ASPECT_RATIOS } from '@/lib/constants';
import { slugify } from '@/lib/slug';

const EMPTY = {
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: '',
    client: '',
    location: '',
    year: '',
    videoPublicId: '',
    videoUrl: '',
    videoAspectRatio: PROJECT_VIDEO_ASPECT_RATIOS[0],
    featured: false,
    published: 'draft',
    servicesProvidedText: '',
    featuredImage: null,
    gallery: [],
    seoTitle: '',
    seoDescription: '',
};

function fromProject(project) {
    if (!project) return EMPTY;
    return {
        title: project.title || '',
        slug: project.slug || '',
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        category: project.category || '',
        client: project.client || '',
        location: project.location || '',
        year: project.year ?? '',
        videoPublicId: project.videoPublicId || '',
        videoUrl: project.videoUrl || '',
        videoAspectRatio: project.videoAspectRatio || PROJECT_VIDEO_ASPECT_RATIOS[0],
        featured: Boolean(project.featured),
        published: project.published || 'draft',
        servicesProvidedText: Array.isArray(project.servicesProvided)
            ? project.servicesProvided.join(', ')
            : '',
        featuredImage: project.featuredImage?.publicId ? { ...project.featuredImage } : null,
        gallery: Array.isArray(project.gallery) ? project.gallery.map((g) => ({ ...g })) : [],
        seoTitle: project.seoTitle || '',
        seoDescription: project.seoDescription || '',
    };
}

export default function ProjectForm({ project }) {
    const router = useRouter();
    const toast = useToast();
    const isEdit = Boolean(project?._id);

    const [values, setValues] = useState(() => fromProject(project));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const update = (field) => (e) => {
        const v = e?.target?.type === 'checkbox' ? e.target.checked : e.target.value;
        setValues((prev) => ({ ...prev, [field]: v }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const autoSlug = () => {
        if (!values.title) return;
        setValues((prev) => ({ ...prev, slug: slugify(prev.title) }));
    };

    const buildPayload = () => ({
        title: values.title,
        slug: values.slug || slugify(values.title),
        shortDescription: values.shortDescription,
        fullDescription: values.fullDescription,
        category: values.category,
        client: values.client,
        location: values.location,
        year: values.year === '' ? undefined : Number(values.year),
        videoPublicId: values.videoPublicId,
        videoUrl: values.videoUrl,
        videoAspectRatio: values.videoAspectRatio,
        featured: values.featured,
        published: values.published,
        servicesProvided: values.servicesProvidedText
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        featuredImage: values.featuredImage?.publicId ? values.featuredImage : null,
        gallery: values.gallery.filter((g) => g?.publicId),
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
    });

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setFormError('');
        setSubmitting(true);
        try {
            const url = isEdit
                ? `/api/admin/projects/${project._id}`
                : '/api/admin/projects';
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
            toast.success(isEdit ? 'Project updated.' : 'Project created.');
            router.push('/admin/projects');
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
                            hint="URL segment, e.g. my-project-title"
                        />
                        <button
                            type="button"
                            onClick={autoSlug}
                            className="text-xs font-semibold text-orange hover:text-navy mt-1"
                        >
                            Generate from title
                        </button>
                    </div>
                    <FormField
                        id="category"
                        label="Category"
                        as="select"
                        value={values.category}
                        onChange={update('category')}
                        error={errors.category}
                        options={[
                            { value: '', label: 'Select\u2026' },
                            ...PROJECT_CATEGORIES.map((c) => ({ value: c, label: c })),
                        ]}
                    />

                    <FormField
                        id="client"
                        label="Client name"
                        value={values.client}
                        onChange={update('client')}
                        error={errors.client}
                        hint="Free text. Leave blank if not to be shown."
                    />
                    <FormField
                        id="location"
                        label="Location"
                        value={values.location}
                        onChange={update('location')}
                        error={errors.location}
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
                    hint="Appears on cards. Keep under 300 characters."
                />
                <FormField
                    id="fullDescription"
                    label="Full description"
                    as="textarea"
                    rows={8}
                    value={values.fullDescription}
                    onChange={update('fullDescription')}
                    error={errors.fullDescription}
                />
                <FormField
                    id="servicesProvidedText"
                    label="Services provided"
                    value={values.servicesProvidedText}
                    onChange={update('servicesProvidedText')}
                    hint="Comma-separated, e.g. Shooting, Editing, Color"
                />
                <FormField
                    id="featured"
                    label="Feature this project"
                    as="checkbox"
                    value={values.featured}
                    onChange={update('featured')}
                    hint="Featured projects appear on the homepage."
                />
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Media</h2>
                <ImageUploadField
                    id="featuredImage"
                    label="Featured image"
                    folder="aniline/admin/projects"
                    value={values.featuredImage}
                    onChange={(next) =>
                        setValues((prev) => ({ ...prev, featuredImage: next }))
                    }
                />
                <FormField
                    id="featuredImageAlt"
                    label="Featured image alt text"
                    value={values.featuredImage?.alt || ''}
                    onChange={(e) =>
                        setValues((prev) => ({
                            ...prev,
                            featuredImage: prev.featuredImage
                                ? { ...prev.featuredImage, alt: e.target.value }
                                : { publicId: '', alt: e.target.value },
                        }))
                    }
                />
                <MediaListEditor
                    folder="aniline/admin/projects"
                    items={values.gallery}
                    onChange={(gallery) => setValues((prev) => ({ ...prev, gallery }))}
                />
                <FormField
                    id="videoPublicId"
                    label="Video public ID"
                    value={values.videoPublicId}
                    onChange={update('videoPublicId')}
                    hint="Cloudinary public ID only, no extension and no URL. For YouTube or Vimeo use the link field below."
                />
                <FormField
                    id="videoUrl"
                    label="External video URL"
                    type="url"
                    value={values.videoUrl}
                    onChange={update('videoUrl')}
                    error={errors.videoUrl}
                    hint="YouTube or Vimeo link. Takes precedence over the Cloudinary ID, and plays through a click-to-load player so nothing loads until a visitor presses play."
                />
                <FormField
                    id="videoAspectRatio"
                    label="Video aspect ratio"
                    as="select"
                    value={values.videoAspectRatio}
                    onChange={update('videoAspectRatio')}
                    error={errors.videoAspectRatio}
                    options={PROJECT_VIDEO_ASPECT_RATIOS.map((ratio) => ({
                        value: ratio,
                        label: ratio === '9:16' ? '9:16 (Vertical, phone)' : '16:9 (Landscape)',
                    }))}
                    hint="Shapes the player on the project page and this project's tile in the portfolio grids."
                />
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Search listing</h2>
                <FormField
                    id="seoTitle"
                    label="SEO title"
                    value={values.seoTitle}
                    onChange={update('seoTitle')}
                    error={errors.seoTitle}
                    hint="Optional. Falls back to the project title."
                />
                <FormField
                    id="seoDescription"
                    label="SEO description"
                    as="textarea"
                    rows={2}
                    value={values.seoDescription}
                    onChange={update('seoDescription')}
                    error={errors.seoDescription}
                    hint="Optional. Falls back to the short description."
                />
            </div>

            {formError && (
                <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {formError}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                    {submitting ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Create project'}
                </Button>
                <Button
                    href="/admin/projects"
                    variant="secondary"
                    size="lg"
                    type="button"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}