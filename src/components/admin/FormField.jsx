/**
 * @param {{
 *   id: string,
 *   label: string,
 *   type?: string,
 *   as?: 'input'|'textarea'|'select'|'checkbox',
 *   value: any,
 *   onChange: (e: any) => void,
 *   error?: string,
 *   hint?: string,
 *   required?: boolean,
 *   placeholder?: string,
 *   rows?: number,
 *   options?: Array<{ value: string, label: string }>,
 *   className?: string,
 * }} props
 */
export default function FormField({
    id,
    label,
    type = 'text',
    as = 'input',
    value,
    onChange,
    error,
    hint,
    required = false,
    placeholder,
    rows,
    options,
    className = '',
}) {
    const base =
        'w-full rounded-md border bg-white px-3.5 py-2.5 text-navy placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-colors';
    const borderCls = error ? 'border-red-300' : 'border-navy/15';

    const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
        .filter(Boolean)
        .join(' ') || undefined;

    if (as === 'checkbox') {
        return (
            <div className={className}>
                <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                        id={id}
                        name={id}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={onChange}
                        className="h-4 w-4 rounded border-navy/30 text-orange focus:ring-orange"
                    />
                    <span className="text-sm font-medium text-navy">{label}</span>
                </label>
                {hint && !error && (
                    <p id={`${id}-hint`} className="text-slate text-xs mt-1.5 ml-6">
                        {hint}
                    </p>
                )}
                {error && (
                    <p id={`${id}-error`} className="text-red-600 text-xs mt-1.5 ml-6">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-sm font-medium text-navy mb-1.5">
                {label}
                {required && <span className="text-orange ml-1" aria-hidden="true">*</span>}
            </label>

            {as === 'textarea' ? (
                <textarea
                    id={id}
                    name={id}
                    rows={rows || 5}
                    value={value ?? ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={`${base} ${borderCls}`}
                />
            ) : as === 'select' ? (
                <select
                    id={id}
                    name={id}
                    value={value ?? ''}
                    onChange={onChange}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={`${base} ${borderCls}`}
                >
                    {(options || []).map((o) => (
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
                    value={value ?? ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy}
                    className={`${base} ${borderCls}`}
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