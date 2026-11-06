import Link from 'next/link';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
    title: 'Page not found',
    path: '/404',
    noIndex: true,
});

export default function NotFound() {
    return (
        <section className="stage flex min-h-[70vh] items-center section-padding text-white">
            <div className="stage-layer stage__pool" aria-hidden="true" />
            <div className="stage-layer stage__beam" aria-hidden="true" />
            <div className="stage-layer stage__floor" aria-hidden="true" />
            <div className="stage-layer stage__grain" aria-hidden="true" />
            <div className="stage-layer stage__vignette" aria-hidden="true" />
            <Container className="relative">
                <div className="max-w-xl">
                    <p className="rise-load text-orange text-xs font-semibold uppercase tracking-[0.18em]">
                        <span className="rec-dot" aria-hidden="true" />
                        404
                    </p>
                    <h1 className="rise-load-shift mt-4 text-white">
                        This page couldn&apos;t be found.
                    </h1>
                    <p className="rise-load rise-d1 text-white/70 mt-6">
                        The link may be broken, or the page may have moved. Try one of these instead.
                    </p>
                    <div className="rise-load rise-d2 mt-8 flex flex-col sm:flex-row gap-3">
                        <Button href="/" variant="primary" size="lg">
                            Go home
                        </Button>
                        <Button href="/work" variant="outlineLight" size="lg">
                            View our work
                        </Button>
                    </div>
                    <p className="rise-load rise-d3 text-white/50 text-sm mt-8">
                        Or{' '}
                        <Link href="/contact" className="text-orange hover:underline">
                            get in touch
                        </Link>{' '}
                        and we&apos;ll point you in the right direction.
                    </p>
                </div>
            </Container>
        </section>
    );
}