'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useToast } from '@/components/admin/ToastProvider';
import { PROJECT_VIDEO_ASPECT_RATIOS, VIDEO_CATEGORIES } from '@/lib/constants';
import { formatDuration } from '@/lib/videography';
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
    videoUrl: '',
    aspectRatio: PROJECT_VIDEO_ASPECT_RATIOS[0],
    duration: '',
    poster: null,
    featured: false,
    published: 'draft',
    seoTitle: '',
    seoDescription: '',
};

function fromFilm(film) {
    if (!film) return EMPTY;
    return {
        title: film.title || '',
        slug: film.slug || '',
        shortDescription: film.shortDescription || '',
        fullDescription: film.fullDescription || '',
        category: film.category || '',
        client: film.client || '',
        location: film.location || '',
        year: film.year ?? '',
        videoUrl: film.videoUrl || '',
        aspectRatio: film.aspectRatio || PROJECT_VIDEO_ASPECT_RATIOS[0],
        // Shown as the owner types it, stored as seconds.
        duration: film.durationSeconds ? formatDuration(film.durationSeconds) : '',
        poster: film.poster?.publicId ? { ...film.poster } : null,
        featured: Boolean(film.featured),
        published: film.published || 'draft',
        seoTitle: film.seoTitle || '',
        seoDescription: film.seoDescription || '',
    };
}

export default function VideoForm({ film }) {
    const router = useRouter();
    const toast = useToast();
    const isEdit = Boolean(film?._id);

    const [values, setValues] = useState(() => fromFilm(film));
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
        videoUrl: values.videoUrl,
        aspectRatio: values.aspectRatio,
        duration: values.duration,
        poster: values.poster?.publicId ? values.poster : null,
        featured: values.featured,
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
            const url = isEdit ? `/api/admin/videos/${film._id}` : '/api/admin/videos';
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
            toast.success(isEdit ? 'Film updated.' : 'Film added.');
            router.push('/admin/videos');
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
                            hint="URL segment, e.g. river-light"
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
                            ...VIDEO_CATEGORIES.map((c) => ({ value: c, label: c })),
                        ]}
                    />
                    <FormField
                        id="year"
                        label="Year"
                        type="number"
                        value={values.year}
                        onChange={update('year')}
                        error={errors.year}
                        placeholder="2026"
                    />
                    <FormField
                        id="location"
                        label="Location"
                        value={values.location}
                        onChange={update('location')}
                        error={errors.location}
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
                    id="featured"
                    label="Feature this film"
                    as="checkbox"
                    value={values.featured}
                    onChange={update('featured')}
                    hint="Featured films open the videography page. Only the top one is shown."
                />
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">The film</h2>
                <FormField
                    id="videoUrl"
                    label="Video link"
                    type="url"
                    required
                    value={values.videoUrl}
                    onChange={update('videoUrl')}
                    error={errors.videoUrl}
                    placeholder="https://youtu.be/aqz-KE-bpKQ"
                    hint="YouTube or Vimeo link only — this is where the film plays from."
                />
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        id="aspectRatio"
                        label="Aspect ratio"
                        as="select"
                        value={values.aspectRatio}
                        onChange={update('aspectRatio')}
                        error={errors.aspectRatio}
                        options={PROJECT_VIDEO_ASPECT_RATIOS.map((ratio) => ({
                            value: ratio,
                            label: ratio === '9:16' ? '9:16 (Vertical, phone)' : '16:9 (Landscape)',
                        }))}
                        hint="Shapes the player and this film's tile in the archive."
                    />
                    <FormField
                        id="duration"
                        label="Duration"
                        value={values.duration}
                        onChange={update('duration')}
                        error={errors.duration}
                        placeholder="4:13"
                        hint="As it runs on the platform, e.g. 4:13 or 1:02:15."
                    />
                </div>
                <p className="text-slate text-xs">
                    Nothing is downloaded from YouTube or Vimeo until a visitor presses play.
                </p>
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Poster</h2>
                <ImageUploadField
                    id="poster"
                    label="Poster still"
                    folder="aniline/admin/videos"
                    value={values.poster}
                    onChange={(next) => setValues((prev) => ({ ...prev, poster: next }))}
                    error={errors.poster}
                    hint="The frame shown before play. Required for Vimeo, which publishes no thumbnail URL."
                />
                <FormField
                    id="posterAlt"
                    label="Poster alt text"
                    value={values.poster?.alt || ''}
                    onChange={(e) =>
                        setValues((prev) => ({
                            ...prev,
                            poster: prev.poster
                                ? { ...prev.poster, alt: e.target.value }
                                : { publicId: '', alt: e.target.value },
                        }))
                    }
                    error={errors.poster_alt}
                    hint="Describe the frame for screen readers."
                />
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">About this film</h2>
                <FormField
                    id="shortDescription"
                    label="Short description"
                    as="textarea"
                    rows={3}
                    value={values.shortDescription}
                    onChange={update('shortDescription')}
                    error={errors.shortDescription}
                    hint="Appears on tiles and in search results. Keep under 300 characters."
                />
                <FormField
                    id="fullDescription"
                    label="Full description"
                    as="textarea"
                    rows={8}
                    value={values.fullDescription}
                    onChange={update('fullDescription')}
                    hint="Line breaks are kept. Credits, context, where it screened."
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
                    hint="Optional. Falls back to the film title."
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
                    {submitting ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Add film'}
                </Button>
                <Button href="/admin/videos" variant="secondary" size="lg" type="button">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
