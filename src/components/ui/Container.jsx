/**
 * Layout container. `wide` variant used for full-bleed cinematic sections.
 * @param {{ children: React.ReactNode, variant?: 'default'|'wide'|'narrow', className?: string }} props
 */
export default function Container({ children, variant = 'default', className = '' }) {
    const cls =
        variant === 'wide'
            ? 'container-wide'
            : variant === 'narrow'
                ? 'mx-auto w-full max-w-3xl px-5 md:px-8'
                : 'container-default';
    return <div className={`${cls} ${className}`.trim()}>{children}</div>;
}