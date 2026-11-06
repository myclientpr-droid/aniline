/**
 * Simple accessible loading indicator.
 * @param {{ label?: string, className?: string }} props
 */
export default function Loading({ label = 'Loading\u2026', className = '' }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`flex items-center justify-center gap-3 py-16 text-slate ${className}`.trim()}
        >
            <span
                aria-hidden="true"
                className="h-5 w-5 rounded-full border-2 border-slate/30 border-t-orange animate-spin"
            />
            <span className="text-sm">{label}</span>
        </div>
    );
}