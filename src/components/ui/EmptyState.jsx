import Button from '@/components/ui/Button';

/**
 * @param {{
 *   title?: string,
 *   message?: string,
 *   actionHref?: string,
 *   actionLabel?: string,
 * }} props
 */
export default function EmptyState({
    title = 'Nothing here yet',
    message = 'New work is on the way. Check back soon.',
    actionHref,
    actionLabel,
}) {
    return (
        <div className="mx-auto max-w-lg text-center py-16 px-5">
            <h3 className="text-navy">{title}</h3>
            <p className="text-slate mt-3">{message}</p>
            {actionHref && actionLabel && (
                <div className="mt-6">
                    <Button href={actionHref} variant="secondary">
                        {actionLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}