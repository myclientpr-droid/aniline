'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import FormField from '@/components/admin/FormField';
import ImageUploadField from '@/components/admin/ImageUploadField';
import { useToast } from '@/components/admin/ToastProvider';
import { TEAM_ROLES } from '@/lib/constants';
import { slugify } from '@/lib/slug';

const EMPTY = {
    name: '',
    slug: '',
    role: '',
    bio: '',
    expertiseText: '',
    photo: null,
    linkedin: '',
    instagram: '',
    order: '',
    published: 'draft',
};

function fromMember(member) {
    if (!member) return EMPTY;
    return {
        name: member.name || '',
        slug: member.slug || '',
        role: member.role || '',
        bio: member.bio || '',
        expertiseText: Array.isArray(member.expertise) ? member.expertise.join(', ') : '',
        photo: member.photo?.publicId ? { ...member.photo } : null,
        linkedin: member.social?.linkedin || '',
        instagram: member.social?.instagram || '',
        order: member.order ?? '',
        published: member.published || 'draft',
    };
}

export default function TeamMemberForm({ member }) {
    const router = useRouter();
    const toast = useToast();
    const isEdit = Boolean(member?._id);

    const [values, setValues] = useState(() => fromMember(member));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState('');

    const update = (field) => (e) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const autoSlug = () => {
        if (!values.name) return;
        setValues((prev) => ({ ...prev, slug: slugify(prev.name) }));
    };

    const buildPayload = () => ({
        name: values.name,
        slug: values.slug || slugify(values.name),
        role: values.role,
        bio: values.bio,
        expertise: values.expertiseText.split(',').map((s) => s.trim()).filter(Boolean),
        photo: values.photo?.publicId
            ? { publicId: values.photo.publicId, alt: values.photo.alt || '' }
            : null,
        social: { linkedin: values.linkedin, instagram: values.instagram },
        order: values.order === '' ? 0 : Number(values.order),
        published: values.published,
    });

    const submit = async (e) => {
        e.preventDefault();
        setErrors({});
        setFormError('');
        setSubmitting(true);
        try {
            const url = isEdit ? `/api/admin/team/${member._id}` : '/api/admin/team';
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
            toast.success(isEdit ? 'Team member updated.' : 'Team member created.');
            router.push('/admin/team');
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
                <h2 className="text-navy text-lg">Profile</h2>
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
                            hint="URL segment, e.g. member-name"
                        />
                        <button
                            type="button"
                            onClick={autoSlug}
                            className="text-xs font-semibold text-orange hover:text-navy mt-1"
                        >
                            Generate from name
                        </button>
                    </div>
                    <FormField
                        id="role"
                        label="Role"
                        as="select"
                        value={values.role}
                        onChange={update('role')}
                        error={errors.role}
                        options={[
                            { value: '', label: 'Select\u2026' },
                            ...TEAM_ROLES.map((r) => ({ value: r, label: r })),
                        ]}
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
                    id="bio"
                    label="Biography"
                    as="textarea"
                    rows={6}
                    value={values.bio}
                    onChange={update('bio')}
                    error={errors.bio}
                    hint="Under 3000 characters."
                />
                <FormField
                    id="expertiseText"
                    label="Expertise"
                    value={values.expertiseText}
                    onChange={update('expertiseText')}
                    hint="Comma-separated, e.g. Documentary, Color grading"
                />
            </div>

            <div className="rounded-lg border border-navy/10 bg-white p-6 space-y-5">
                <h2 className="text-navy text-lg">Photo &amp; social</h2>
                <ImageUploadField
                    id="photo"
                    label="Profile photo"
                    folder="aniline/admin/team"
                    value={values.photo}
                    onChange={(next) => setValues((prev) => ({ ...prev, photo: next }))}
                />
                <FormField
                    id="photoAlt"
                    label="Photo alt text"
                    value={values.photo?.alt || ''}
                    onChange={(e) =>
                        setValues((prev) => ({
                            ...prev,
                            photo: prev.photo
                                ? { ...prev.photo, alt: e.target.value }
                                : { publicId: '', alt: e.target.value },
                        }))
                    }
                />
                <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                        id="linkedin"
                        label="LinkedIn URL"
                        type="url"
                        value={values.linkedin}
                        onChange={update('linkedin')}
                        error={errors.social_linkedin}
                    />
                    <FormField
                        id="instagram"
                        label="Instagram URL"
                        type="url"
                        value={values.instagram}
                        onChange={update('instagram')}
                        error={errors.social_instagram}
                    />
                </div>
            </div>

            {formError && (
                <div role="alert" className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                    {formError}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                    {submitting ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Create member'}
                </Button>
                <Button href="/admin/team" variant="secondary" size="lg" type="button">
                    Cancel
                </Button>
            </div>
        </form>
    );
}
