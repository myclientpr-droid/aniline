'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// Structural classes (w-full, px-3.5, py-2.5, rounded-md) are identical across both tones so a
// tone switch can never shift a layout. Only fill, text and the focus/hover treatment differ.
const FIELD_BASE = {
    light:
        'w-full rounded-md border bg-white px-3.5 py-2.5 text-navy placeholder:text-slate/60 shadow-[inset_0_1px_2px_rgba(0,19,62,0.06)] transition-[border-color,box-shadow,background-color] duration-200 hover:border-navy/25 focus:outline-none focus:ring-2 focus:ring-orange/35 focus:border-orange',
    dark: 'w-full rounded-md border bg-white/[0.04] px-3.5 py-2.5 text-white placeholder:text-white/35 transition-[background-color,border-color,box-shadow] duration-200 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-orange/35 focus:border-orange/70 focus:bg-white/[0.07]',
};

const FIELD_BORDER = {
    light: { normal: 'border-navy/15', error: 'border-red-400' },
    dark: { normal: 'border-white/12', error: 'border-red-400/70' },
};

// Native select arrow and option list are kept in both tones — `appearance-none` would need a
// hand-drawn replacement. On dark, `color-scheme` is what makes the OS render the popup dark
// instead of a white slab.
const FIELD_EXTRA = {
    light: { select: '' },
    dark: { select: '[color-scheme:dark]' },
};

const LABEL = {
    light: 'block text-sm font-medium text-navy mb-1.5',
    dark: 'block text-sm font-medium text-white/85 mb-1.5',
};

const HINT = { light: 'text-slate', dark: 'text-white/45' };
const ERROR_TEXT = { light: 'text-red-600', dark: 'text-red-300' };
const ICON_TONE = { light: 'text-slate/70', dark: 'text-white/40' };
const CHECKBOX = {
    light: 'h-4 w-4 rounded border-navy/30 bg-white text-orange focus:ring-orange',
    dark: 'h-4 w-4 rounded border-white/30 bg-white/10 text-orange focus:ring-orange',
};

/**
 * @param {{
 *   id: string,
 *   label: string,
 *   type?: string,
 *   as?: 'input'|'textarea'|'select'|'checkbox',
 *   tone?: 'light'|'dark',
 *   value: any,
 *   onChange: (e: any) => void,
 *   onBlur?: (e: any) => void,
 *   error?: string,
 *   hint?: string,
 *   describedBy?: string,
 *   required?: boolean,
 *   placeholder?: string,
 *   rows?: number,
 *   options?: Array<{ value: string, label: string }>,
 *   className?: string,
 *   icon?: any,
 *   revealable?: boolean,
 *   autoComplete?: string,
 *   inputMode?: 'text'|'email'|'numeric'|'tel'|'url'|'search'|'none',
 *   disabled?: boolean,
 * }} props
 */
export default function FormField({
    id,
    label,
    type = 'text',
    as = 'input',
    tone = 'light',
    value,
    onChange,
    onBlur,
    error,
    hint,
    describedBy,
    required = false,
    placeholder,
    rows,
    options,
    className = '',
    icon: Icon,
    revealable = false,
    autoComplete,
    inputMode,
    disabled = false,
}) {
    const [revealed, setRevealed] = useState(false);

    const inputType = revealable ? (revealed ? 'text' : 'password') : type;
    const bordered = as !== 'checkbox';
    const hasIcon = Boolean(Icon) && as !== 'textarea';
    const padStart = hasIcon ? 'pl-11' : '';
    const padEnd = revealable ? 'pr-11' : '';

    const classes = bordered
        ? `${FIELD_BASE[tone]} ${error ? FIELD_BORDER[tone].error : FIELD_BORDER[tone].normal} ${
            as === 'select' ? FIELD_EXTRA[tone].select : ''
        } ${padStart} ${padEnd}`.replace(/\s+/g, ' ').trim()
        : '';

    const ariaDescribedBy =
        [
            error ? `${id}-error` : null,
            hint ? `${id}-hint` : null,
            describedBy || null,
        ]
            .filter(Boolean)
            .join(' ') || undefined;

    if (as === 'checkbox') {
        return (
            <div className={className}>
                <label
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-2.5"
                >
                    <input
                        id={id}
                        name={id}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={onChange}
                        disabled={disabled}
                        className={CHECKBOX[tone]}
                    />
                    <span
                        className={
                            tone === 'dark'
                                ? 'text-sm font-medium text-white/85'
                                : 'text-sm font-medium text-navy'
                        }
                    >
                        {label}
                    </span>
                </label>
                {hint && !error && (
                    <p id={`${id}-hint`} className={`text-xs mt-1.5 ml-6 ${HINT[tone]}`}>
                        {hint}
                    </p>
                )}
                {error && (
                    <p id={`${id}-error`} className={`text-xs mt-1.5 ml-6 ${ERROR_TEXT[tone]}`}>
                        {error}
                    </p>
                )}
            </div>
        );
    }

    const control = {
        id: id,
        name: id,
        value: value ?? '',
        onChange,
        onBlur,
        placeholder,
        required,
        disabled,
        autoComplete,
        inputMode,
        'aria-invalid': Boolean(error) || undefined,
        'aria-describedby': ariaDescribedBy,
        className: classes,
    };

    return (
        <div className={className}>
            <label htmlFor={id} className={LABEL[tone]}>
                {label}
                {required && (
                    <span className="text-orange ml-1" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            <div className="relative">
                {hasIcon && (
                    <Icon
                        className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${ICON_TONE[tone]}`}
                        aria-hidden="true"
                    />
                )}

                {as === 'textarea' ? (
                    <textarea {...control} rows={rows || 5} />
                ) : as === 'select' ? (
                    <select {...control}>
                        {(options || []).map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input {...control} type={inputType} />
                )}

                {revealable && (
                    <button
                        type="button"
                        onClick={() => setRevealed((open) => !open)}
                        aria-pressed={revealed}
                        aria-label={revealed ? 'Hide password' : 'Show password'}
                        className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange ${
                            tone === 'dark'
                                ? 'text-white/45 hover:text-white/85'
                                : 'text-slate hover:text-navy'
                        }`}
                    >
                        {revealed ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                    </button>
                )}
            </div>

            {hint && !error && (
                <p id={`${id}-hint`} className={`text-xs mt-1.5 ${HINT[tone]}`}>
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} className={`text-xs mt-1.5 ${ERROR_TEXT[tone]}`}>
                    {error}
                </p>
            )}
        </div>
    );
}
