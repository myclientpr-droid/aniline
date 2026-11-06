import Container from '@/components/ui/Container';

/**
 * Opens every public route. Nine of them duplicated the same flat `bg-navy-dark` band verbatim,
 * which is why the site read as one designed page followed by ten undesigned ones.
 *
 * The depth stack is entirely CSS: `animation-timeline` parallax behind `@supports`, so a browser
 * without it renders the finished frame rather than nothing, and these routes stay zero-JS.
 *
 * @param {{
 *   eyebrow?: string,
 *   title: string,
 *   subheading?: string,
 *   actions?: import('react').ReactNode,
 * }} props
 */
export default function PageHero({ eyebrow, title, subheading, actions }) {
    return (
        <section className="stage section-padding text-white">
            {/* Decorative. Painted ahead of the content in DOM order and the content is
                `relative`, so no z-index juggling is needed inside the isolated context. */}
            <div className="stage-layer stage__pool" aria-hidden="true" />
            <div className="stage-layer stage__beam" aria-hidden="true" />
            <div className="stage-layer stage__floor" aria-hidden="true" />
            <div className="stage-layer stage__grain" aria-hidden="true" />
            <div className="stage-layer stage__vignette" aria-hidden="true" />
            <div className="stage-layer stage__seam" aria-hidden="true" />

            <Container className="relative">
                <div className="max-w-3xl">
                    {/* Every node here that can plausibly be the LCP element gets a transform-only
                        entrance (`rise-load-shift`), including the subheading — on /contact the
                        subheading measured larger than the h1 and an opacity fade would have
                        deferred the metric by the full delay plus duration. */}
                    {eyebrow && (
                        <p className="rise-load-shift text-orange text-xs font-semibold uppercase tracking-[0.18em]">
                            <span className="rec-dot" aria-hidden="true" />
                            {eyebrow}
                        </p>
                    )}

                    <h1 className="rise-load-shift mt-4 text-white text-balance">{title}</h1>

                    {subheading && (
                        <p className="rise-load-shift rise-d1 text-white/75 mt-6 text-base md:text-lg">
                            {subheading}
                        </p>
                    )}

                    {actions && <div className="rise-load rise-d2 mt-8">{actions}</div>}
                </div>
            </Container>
        </section>
    );
}
