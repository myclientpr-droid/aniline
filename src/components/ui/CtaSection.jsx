import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

/**
 * @param {{
 *   eyebrow?: string,
 *   title?: string,
 *   description?: string,
 *   primaryLabel?: string,
 *   primaryHref?: string,
 *   secondaryLabel?: string,
 *   secondaryHref?: string,
 * }} props
 */
export default function CtaSection({
    eyebrow = 'Start a project',
    title = 'Have a story to tell?',
    description = 'Let\u2019s discuss your next production.',
    primaryLabel = 'Start a Project',
    primaryHref = '/start-a-project',
    secondaryLabel = 'Contact us',
    secondaryHref = '/contact',
}) {
    return (
        <section className="stage section-padding text-white">
            <div className="stage-layer stage__pool" aria-hidden="true" />
            <div className="stage-layer stage__beam" aria-hidden="true" />
            <div className="stage-layer stage__floor" aria-hidden="true" />
            <div className="stage-layer stage__grain" aria-hidden="true" />
            <div className="stage-layer stage__vignette" aria-hidden="true" />
            <div className="stage-layer stage__seam" aria-hidden="true" />
            <Container className="relative">
                <div className="rise mx-auto max-w-3xl text-center">
                    {eyebrow && (
                        <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mb-4">
                            {eyebrow}
                        </p>
                    )}
                    <h2 className="text-white text-balance">{title}</h2>
                    {description && (
                        <p className="text-white/70 mt-4 max-w-xl mx-auto">{description}</p>
                    )}
                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button href={primaryHref} variant="primary" size="lg">
                            {primaryLabel}
                        </Button>
                        {secondaryLabel && secondaryHref && (
                            <Button href={secondaryHref} variant="outlineLight" size="lg">
                                {secondaryLabel}
                            </Button>
                        )}
                    </div>
                </div>
            </Container>
        </section>
    );
}