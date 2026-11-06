import Button from '@/components/ui/Button';

/**
 * @param {{
 *   title?: string,
 *   message?: string,
 *   retryHref?: string,
 *   retryLabel?: string,
 * }} props
 */
export default function ErrorState({
    title = 'Something went wrong',
    message = 'We couldn\u2019t load this content. Please try again.',
    retryHref,
    retryLabel = 'Try again',
}) {
    return (
        <div
            role="alert"
            className="mx-auto max-w-lg text-center py-16 px-5"
        >
            <h3 className="text-navy">{title}</h3>
            <p className="text-slate mt-3">{message}</p>
            {retryHref && (
                <div className="mt-6">
                    <Button href={retryHref} variant="secondary">
                        {retryLabel}
                    </Button>
                </div>
            )}
        </div>
    );
}