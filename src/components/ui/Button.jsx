import Link from 'next/link';

const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-tight transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-orange disabled:opacity-50 disabled:pointer-events-none';

const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-base md:text-lg',
};

const variants = {
    primary:
        'bg-orange text-navy-dark hover:bg-[#e09400] active:bg-[#c98500]',
    secondary:
        'bg-transparent text-navy border border-navy/20 hover:border-navy/50 hover:bg-navy/5',
    ghost:
        'bg-transparent text-navy hover:bg-navy/5',
    light:
        'bg-white text-navy hover:bg-light',
    outlineLight:
        'bg-transparent text-white border border-white/30 hover:border-white hover:bg-white/10',
};

/**
 * @param {{
 *   children: React.ReactNode,
 *   href?: string,
 *   type?: 'button'|'submit'|'reset',
 *   variant?: 'primary'|'secondary'|'ghost'|'light'|'outlineLight',
 *   size?: 'sm'|'md'|'lg',
 *   className?: string,
 *   disabled?: boolean,
 *   onClick?: (e: React.MouseEvent) => void,
 *   'aria-label'?: string,
 * }} props
 */
export default function Button({
    children,
    href,
    type = 'button',
    variant = 'primary',
    size = 'md',
    className = '',
    disabled = false,
    onClick,
    ...rest
}) {
    const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`.trim();

    if (href) {
        return (
            <Link href={href} className={cls} {...rest}>
                {children}
            </Link>
        );
    }
    return (
        <button type={type} className={cls} disabled={disabled} onClick={onClick} {...rest}>
            {children}
        </button>
    );
}