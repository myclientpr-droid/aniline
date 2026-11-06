import Link from 'next/link';
import Button from '@/components/ui/Button';

/**
 * @param {{
 *   title: string,
 *   description?: string,
 *   actionLabel?: string,
 *   actionHref?: string,
 *   backHref?: string,
 *   backLabel?: string,
 * }} props
 */
export default function AdminPageHeader({
    title,
    description,
    actionLabel,
    actionHref,
    backHref,
    backLabel = 'Back',
}) {
    return (
        <div className="mb-6 md:mb-8">
            {backHref && (
                <Link
                    href={backHref}
                    className="inline-block text-xs font-semibold text-slate hover:text-navy mb-3"
                >
                    &larr; {backLabel}
                </Link>
            )}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h1 className="text-navy text-2xl md:text-3xl">{title}</h1>
                    {description && <p className="text-slate mt-2">{description}</p>}
                </div>
                {actionLabel && actionHref && (
                    <Button href={actionHref} variant="primary" size="md">
                        {actionLabel}
                    </Button>
                )}
            </div>
        </div>
    );
}