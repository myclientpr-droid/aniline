/**
 * Shared chrome for the two unauthenticated admin screens. Both previously rendered the same
 * flat white card independently, which is why they looked like a different product from the
 * rest of the site.
 *
 * The depth stack mirrors PageHero's layer order so the site has one dark-surface recipe.
 * The card is a white veil rather than `.elevate-*`, because those shadows are navy-on-white
 * and read as nothing at all on navy.
 *
 * @param {{
 *   eyebrow: string,
 *   title: string,
 *   description?: import('react').ReactNode,
 *   children: import('react').ReactNode,
 *   footer?: import('react').ReactNode,
 * }} props
 */
export default function AuthShell({ eyebrow, title, description, children, footer }) {
    return (
        <section className="stage flex min-h-[calc(100svh-4rem)] items-center justify-center px-5 py-14 text-white">
            <div className="stage-layer stage__pool" aria-hidden="true" />
            <div className="stage-layer stage__beam" aria-hidden="true" />
            <div className="stage-layer stage__floor" aria-hidden="true" />
            <div className="stage-layer stage__grain" aria-hidden="true" />
            <div className="stage-layer stage__vignette" aria-hidden="true" />
            <div className="stage-layer stage__seam" aria-hidden="true" />

            <div className="rise-load relative w-full max-w-[26rem]">
                <div className="relative overflow-hidden rounded-lg border border-white/10 bg-white/[0.05] p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md sm:p-9">
                    <span
                        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/70 to-transparent"
                        aria-hidden="true"
                    />

                    <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em]">
                        <span className="rec-dot" aria-hidden="true" />
                        {eyebrow}
                    </p>

                    {/* Explicit size: the global h1 clamp resolves to 4.5rem, which is a poster
                        scale and would swallow a login card. */}
                    <h1 className="mt-3 text-[1.75rem] leading-tight text-white text-balance">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-2 text-sm leading-relaxed text-white/60">{description}</p>
                    )}

                    <div className="mt-8">{children}</div>

                    {footer && (
                        <div className="mt-7 border-t border-white/10 pt-5 text-center text-sm text-white/55">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
