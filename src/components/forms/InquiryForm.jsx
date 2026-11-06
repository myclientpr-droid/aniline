'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { PROJECT_CATEGORIES } from '@/lib/constants';

const INITIAL = {
    name: '',
    organization: '',
    email: '',
    phone: '',
    projectCategory: '',
    location: '',
    preferredDate: '',
    timeline: '',
    description: '',
    referenceLinks: '',
    // Honeypot — must remain empty.
    website: '',
};

/**
 * @param {{
 *   successTitle?: string,
 *   successMessage?: string,
 * }} props
 */
export default function InquiryForm({ successTitle, successMessage }) {
    const [values, setValues] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formError, setFormError] = useState('');

    const update = (field) => (e) => {
        setValues((v) => ({ ...v, [field]: e.target.value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setErrors({});

        // Honeypot
        if (values.website.trim() !== '') {
            // Silently pretend to succeed — bots don't get feedback.
            setSubmitted(true);
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch('/api/inquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.ok) {
                if (data.errors) setErrors(data.errors);
                setFormError(data.error || 'Something went wrong. Please try again.');
                return;
            }
            setSubmitted(true);
            setValues(INITIAL);
        } catch {
            setFormError('Network error. Please check your connection and try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="elevate-3 rounded-lg border border-navy/10 bg-white p-8">
                <h2 className="text-navy">{successTitle || 'Thank you.'}</h2>
                <p className="text-slate mt-3">
                    {successMessage || 'Your message has been received.'}
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            className="elevate-3 space-y-6 rounded-lg border border-navy/10 bg-white p-6 md:p-8"
        >
            {/* Honeypot — hidden from users, visible to bots */}
            <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                    id="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={update('website')}
                />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
                <Field
                    id="name"
                    label="Your name"
                    required
                    value={values.name}
                    onChange={update('name')}
                    error={errors.name}
                    autoComplete="name"
                />
                <Field
                    id="organization"
                    label="Organization or company"
                    value={values.organization}
                    onChange={update('organization')}
                    error={errors.organization}
                    autoComplete="organization"
                />
                <Field
                    id="email"
                    label="Email"
                    type="email"
                    required
                    value={values.email}
                    onChange={update('email')}
                    error={errors.email}
                    autoComplete="email"
                />
                <Field
                    id="phone"
                    label="Phone or WhatsApp"
                    type="tel"
                    value={values.phone}
                    onChange={update('phone')}
                    error={errors.phone}
                    autoComplete="tel"
                />

                <Field
                    id="projectCategory"
                    label="Project type"
                    required
                    as="select"
                    value={values.projectCategory}
                    onChange={update('projectCategory')}
                    error={errors.projectCategory}
                    options={[
                        { value: '', label: 'Select\u2026' },
                        ...PROJECT_CATEGORIES.map((t) => ({ value: t, label: t })),
                    ]}
                />
                <Field
                    id="location"
                    label="Project location"
                    value={values.location}
                    onChange={update('location')}
                    error={errors.location}
                />

                <Field
                    id="preferredDate"
                    label="Preferred date"
                    value={values.preferredDate}
                    onChange={update('preferredDate')}
                    error={errors.preferredDate}
                    placeholder="e.g. Mid-March 2026"
                />
                <Field
                    id="timeline"
                    label="Estimated timeline"
                    value={values.timeline}
                    onChange={update('timeline')}
                    error={errors.timeline}
                    placeholder="e.g. 2\u20133 weeks"
                />
            </div>

            <Field
                id="description"
                label="Project description"
                required
                as="textarea"
                rows={6}
                value={values.description}
                onChange={update('description')}
                error={errors.description}
                hint="Tell us about the story, the goal, and anything we should know."
            />

            <Field
                id="referenceLinks"
                label="Reference links (optional)"
                value={values.referenceLinks}
                onChange={update('referenceLinks')}
                error={errors.referenceLinks}
                hint="Up to 5 links to inspiration, mood boards, or past work."
            />

            {formError && (
                <div
                    role="alert"
                    className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm"
                >
                    {formError}
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <Button type="submit" variant="primary" size="lg" disabled={submitting}>
                    {submitting ? 'Sending\u2026' : 'Send inquiry'}
                </Button>
                <p className="text-slate text-xs">
                    We&apos;ll use your details only to respond to this inquiry.
                </p>
            </div>
        </form>
    );
}

/**
 * Shared field renderer: input, select, or textarea.
 */
function Field({
    id,
    label,
    type = 'text',
    as = 'input',
    required = false,
    value,
    onChange,
    error,
    hint,
    placeholder,
    autoComplete,
    options,
    rows,
}) {
    const baseInput =
        'w-full rounded-md border bg-white px-3.5 py-2.5 text-navy placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-shadow shadow-[inset_0_1px_2px_rgba(0,19,62,0.07)]';
    const borderCls = error ? 'border-red-300' : 'border-navy/15';

    const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
        .filter(Boolean)
        .join(' ') || undefined;

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-navy mb-1.5">
                {label}
                {required && <span className="text-orange ml-1" aria-hidden="true">*</span>}
            </label>

            {as === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    rows={rows || 4}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={`${baseInput} ${borderCls}`}
                />
            ) : as === 'select' ? (
                <select
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={`${baseInput} ${borderCls}`}
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    id={id}
                    name={id}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={`${baseInput} ${borderCls}`}
                />
            )}

            {hint && !error && (
                <p id={`${id}-hint`} className="text-slate text-xs mt-1.5">
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className="text-red-600 text-xs mt-1.5">
                    {error}
                </p>
            )}
        </div>
    );
}