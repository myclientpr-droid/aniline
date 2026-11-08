'use client';

import { useEffect, useRef, useState } from 'react';
import { ListTree, X } from 'lucide-react';
import { LEGAL, SITE } from '@/lib/site';

/**
 * Reading rail for the legal documents.
 *
 * Desktop gets a sticky table of contents; mobile gets a pinned bar that opens the
 * same list as a sheet. The only "clever" part is the reading readout: a two-stop
 * hero/body ruler that marks how much of the document you have passed, which works
 * uniformly for a 12-section policy and a 13-section terms page without measuring
 * scrollable content.
 *
 * @param {{ sections: Array<{ id: string, title: string }> }} props
 */
export default function LegalNav({ sections }) {
    const sheetRef = useRef(null);
    const triggerRef = useRef(null);
    const [activeId, setActiveId] = useState(sections[0]?.id ?? '');
    const [ratio, setRatio] = useState(0);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [pct, setPct] = useState(0);

    useEffect(() => {
        // The section you are "in" is the last one whose heading is above the reading line —
        // a flat scan rather than an observer: a jump that skips several headings reports the
        // intermediate sections as intersecting, and would leave the wrong one highlighted.
        const line = () => window.innerHeight * 0.3;
        const onScroll = () => {
            let current = sections[0]?.id ?? '';
            for (const s of sections) {
                const el = document.getElementById(s.id);
                if (el && el.getBoundingClientRect().top <= line()) current = s.id;
            }
            setActiveId(current);
        };
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [sections]);

    useEffect(() => {
        let frame = 0;
        const measure = () => {
            frame = 0;
            // Read the document, not the rail: the rail is sticky (it never travels) and is
            // `display: none` on mobile (it has no height). Scrolling ends when the document's
            // last pixel is at the bottom of the viewport.
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const next = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
            setRatio(next);
            setPct(Math.round(next * 100));
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(measure);
        };
        measure();
        // Remeasure once the page settles (fonts load, images resize) and again when it grows.
        const settle = setTimeout(measure, 400);
        const resize = new ResizeObserver(onScroll);
        resize.observe(document.body);
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            clearTimeout(settle);
            resize.disconnect();
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (frame) cancelAnimationFrame(frame);
        };
    }, []);

    useEffect(() => {
        if (!sheetOpen) return;
        const onKey = (e) => {
            if (e.key === 'Escape') setSheetOpen(false);
        };
        window.addEventListener('keydown', onKey);
        const trigger = triggerRef.current;
        const focusTimer = setTimeout(() => {
            sheetRef.current?.querySelector('a')?.focus();
        }, 60);
        return () => {
            window.removeEventListener('keydown', onKey);
            clearTimeout(focusTimer);
            trigger?.focus?.();
        };
    }, [sheetOpen]);

    const activeIndex = Math.max(
        0,
        sections.findIndex((s) => s.id === activeId)
    );

    const list = (onNavigate) => (
        <ol className="space-y-0.5">
            {sections.map((s, i) => {
                const isActive = s.id === activeId;
                return (
                    <li key={s.id}>
                        <a
                            href={`#${s.id}`}
                            aria-current={isActive ? 'location' : undefined}
                            onClick={onNavigate}
                            className={`group flex items-baseline gap-2.5 rounded-md px-2.5 py-1.5 text-sm leading-snug transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange ${
                                isActive
                                    ? 'bg-orange/10 font-semibold text-navy'
                                    : 'text-slate hover:bg-light hover:text-navy'
                            }`}
                        >
                            <span
                                className={`w-4 shrink-0 text-[0.6875rem] font-semibold tabular-nums ${
                                    isActive ? 'text-orange' : 'text-slate/60'
                                }`}
                                aria-hidden="true"
                            >
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            {s.title}
                        </a>
                    </li>
                );
            })}
        </ol>
    );

    return (
        <>
            {/* Mobile: pinned readout + sheet */}
            <div className="sticky top-16 z-30 -mx-5 mb-6 border-b border-navy/10 bg-white/85 backdrop-blur-md md:px-8 lg:hidden">
                <div className="flex items-center justify-between gap-3 px-5 py-2.5">
                    <button
                        ref={triggerRef}
                        type="button"
                        onClick={() => setSheetOpen(true)}
                        aria-expanded={sheetOpen}
                        aria-controls="legal-toc-sheet"
                        className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-navy transition-colors hover:text-orange focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                    >
                        <ListTree className="h-4 w-4" aria-hidden="true" />
                        On this page
                        <span className="text-slate font-normal">
                            {activeIndex + 1}/{sections.length}
                        </span>
                    </button>
                    <span className="text-xs tabular-nums text-slate" aria-hidden="true">
                        {pct}% read
                    </span>
                </div>
                <div className="h-0.5 bg-navy/10" aria-hidden="true">
                    <div
                        className="h-full origin-left bg-orange"
                        style={{ transform: `scaleX(${ratio})` }}
                    />
                </div>
            </div>

            {sheetOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-navy-dark/50 backdrop-blur-[2px]"
                        onClick={() => setSheetOpen(false)}
                        aria-hidden="true"
                    />
                    <div
                        ref={sheetRef}
                        id="legal-toc-sheet"
                        role="dialog"
                        aria-modal="true"
                        aria-label="On this page"
                        className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <p className="text-navy text-xs font-semibold uppercase tracking-[0.18em]">
                                On this page
                            </p>
                            <button
                                type="button"
                                onClick={() => setSheetOpen(false)}
                                className="rounded-md p-2 text-navy hover:bg-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                                aria-label="Close table of contents"
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </button>
                        </div>
                        {list(() => setSheetOpen(false))}
                    </div>
                </div>
            )}

            {/* Desktop rail */}
            <nav
                aria-labelledby="legal-toc-title"
                className="legal-rail hidden lg:block"
            >
                <div className="sticky top-24">
                    <div className="rounded-xl bg-white/90 p-4 elevate-1 backdrop-blur-sm">
                        <div className="mb-3 flex items-baseline justify-between gap-2 px-1">
                            <p
                                id="legal-toc-title"
                                className="text-navy text-[0.6875rem] font-semibold uppercase tracking-[0.18em]"
                            >
                                On this page
                            </p>
                            <span className="text-[0.6875rem] tabular-nums text-slate">
                                {pct}%
                            </span>
                        </div>
                        <div
                            className="mb-3 flex gap-[3px] px-1"
                            role="img"
                            aria-label={`Reading progress: ${pct}% of the document`}
                        >
                            {sections.map((s, i) => (
                                <span
                                    key={s.id}
                                    className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                                        i <= activeIndex ? 'bg-orange' : 'bg-navy/12'
                                    }`}
                                />
                            ))}
                        </div>
                        {list()}
                        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-navy/10 px-1 pt-3 text-[0.6875rem]">
                            <div>
                                <dt className="uppercase tracking-[0.14em] text-slate/70">
                                    Version
                                </dt>
                                <dd className="mt-0.5 font-semibold text-navy">
                                    {LEGAL.version}
                                </dd>
                            </div>
                            <div>
                                <dt className="uppercase tracking-[0.14em] text-slate/70">
                                    Practice
                                </dt>
                                <dd className="mt-0.5 font-semibold text-navy">
                                    Since {SITE.founded}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </nav>
        </>
    );
}
