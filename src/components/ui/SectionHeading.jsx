/**
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   description?: string,
 *   align?: 'left'|'center',
 *   tone?: 'dark'|'light',
 *   className?: string,
 * }} props
 */
export default function SectionHeading({
    eyebrow,
    title,
    description,
    align = 'left',
    tone = 'dark',
    className = '',
}) {
    const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
    const titleColor = tone === 'dark' ? 'text-navy' : 'text-white';
    const descColor = tone === 'dark' ? 'text-slate' : 'text-white/70';
    const eyebrowColor = 'text-orange';

    return (
        <div className={`${alignCls} ${className}`.trim()}>
            <span
                aria-hidden="true"
                className={`depth-rule mb-4 block ${align === 'center' ? 'mx-auto' : ''}`}
            />
            {eyebrow && (
                <p
                    className={`${eyebrowColor} text-xs font-semibold uppercase tracking-[0.18em] mb-3`}
                >
                    {eyebrow}
                </p>
            )}
            <h2 className={`${titleColor} text-balance`}>{title}</h2>
            {description && (
                <p className={`${descColor} mt-4 max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
                    {description}
                </p>
            )}
        </div>
    );
}