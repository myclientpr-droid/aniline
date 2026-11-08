import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SocialIcon, { SOCIAL_META } from '@/components/ui/SocialIcon';
import LegalNav from '@/components/legal/LegalNav';
import { LEGAL, SITE, legalContactHref } from '@/lib/site';

function formatDate(iso) {
    return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * Shared shell for the privacy and terms pages: meta strip, reading rail, numbered
 * sections, and a contact block. Every text node renders a plain string, so the
 * documents stay edit-safe while the presentation carries the design.
 *
 * @param {{
 *   page: typeof import('@/lib/site').PRIVACY_PAGE,
 *   counterpart: { label: string, href: string },
 * }} props
 */
export default function LegalDoc({ page, counterpart }) {
    const { email, whatsapp, address } = SITE.contact;
    const whatsappDigits = whatsapp ? whatsapp.replace(/[^\d]/g, '') : '';
    const toc = page.sections.map((s) => ({ id: s.id, title: s.title }));

    return (
        <section className="bg-light">
            <Container>
                <div className="grid gap-10 py-10 md:py-14 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[17rem_minmax(0,1fr)]">
                    <LegalNav sections={toc} />

                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-navy/10 pb-6 text-xs text-slate">
                            <p>
                                <span className="font-semibold uppercase tracking-[0.14em] text-navy/60">
                                    Effective
                                </span>{' '}
                                <time dateTime={LEGAL.effectiveDate}>
                                    {formatDate(LEGAL.effectiveDate)}
                                </time>
                            </p>
                            <p>
                                <span className="font-semibold uppercase tracking-[0.14em] text-navy/60">
                                    Version
                                </span>{' '}
                                {LEGAL.version}
                            </p>
                            <p className="ml-auto">
                                <Link
                                    href={counterpart.href}
                                    className="font-semibold text-navy underline decoration-navy/20 underline-offset-4 transition-colors hover:text-orange hover:decoration-orange"
                                >
                                    {counterpart.label}
                                </Link>
                            </p>
                        </div>

                        <div className="mt-8 max-w-2xl space-y-5 text-[0.9375rem] leading-7 md:text-base md:leading-8 xl:max-w-3xl">
                            {page.intro.map((paragraph) => (
                                <p key={paragraph} className="text-slate">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
                            {page.summary.items.map((item, i) => (
                                <div
                                    key={item.title}
                                    className="rounded-lg border border-navy/8 bg-white p-4 elevate-1"
                                >
                                    <p className="text-[0.625rem] font-semibold tabular-nums text-orange">
                                        {String(i + 1).padStart(2, '0')}
                                    </p>
                                    <p className="mt-1.5 text-sm font-semibold leading-snug text-navy">
                                        {item.title}
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-slate">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {page.sections.map((section, index) => (
                            <section
                                key={section.id}
                                id={section.id}
                                aria-labelledby={`${section.id}-title`}
                                className="legal-section scroll-mt-32 border-t border-navy/10 pt-10 mt-10 md:scroll-mt-28"
                            >
                                <div className="flex items-start gap-4">
                                    <span
                                        className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-navy text-xs font-bold tabular-nums text-orange"
                                        aria-hidden="true"
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <h2
                                        id={`${section.id}-title`}
                                        className="text-xl leading-snug text-balance md:text-2xl"
                                    >
                                        {section.title}
                                    </h2>
                                </div>

                                <div className="mt-4 space-y-4 pl-0 text-[0.9375rem] leading-7 md:pl-12 md:text-base md:leading-8">
                                    {section.body.map((paragraph) => (
                                        <p key={paragraph} className="text-slate">
                                            {paragraph}
                                        </p>
                                    ))}

                                    {section.definitions && (
                                        <dl className="overflow-hidden rounded-lg border border-navy/10 bg-white">
                                            {section.definitions.map((d) => (
                                                <div
                                                    key={d.term}
                                                    className="grid gap-1 border-b border-navy/8 px-4 py-3 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4"
                                                >
                                                    <dt className="text-sm font-semibold text-navy">
                                                        {d.term}
                                                    </dt>
                                                    <dd className="text-sm leading-6 text-slate">
                                                        {d.description}
                                                    </dd>
                                                </div>
                                            ))}
                                        </dl>
                                    )}

                                    {section.items && (
                                        <ul className="divide-y divide-navy/8 overflow-hidden rounded-lg border border-navy/10 bg-white">
                                            {section.items.map((item) => (
                                                <li
                                                    key={item.title}
                                                    className="grid gap-1 px-4 py-3.5 sm:grid-cols-[11rem_1fr] sm:gap-4"
                                                >
                                                    <p className="text-sm font-semibold leading-6 text-navy">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-sm leading-6 text-slate">
                                                        {item.description}
                                                    </p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {section.note && (
                                        <p className="rounded-md border-l-2 border-orange bg-orange/6 py-2.5 pl-4 pr-3 text-sm leading-6 text-navy/80">
                                            {section.note}
                                        </p>
                                    )}
                                </div>
                            </section>
                        ))}

                        {/* Contact block */}
                        <div id="contact-us" className="legal-section mt-12 scroll-mt-32 md:scroll-mt-28">
                            <div className="stage relative overflow-hidden rounded-xl p-6 text-white md:p-8">
                                <div className="stage-layer stage__pool" aria-hidden="true" />
                                <div className="relative">
                                    <p className="text-orange text-[0.6875rem] font-semibold uppercase tracking-[0.18em]">
                                        {page.contact.title}
                                    </p>
                                    <p className="mt-2 max-w-lg text-sm leading-6 text-white/75">
                                        {page.contact.body}
                                    </p>
                                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <Button href={legalContactHref()} variant="primary" size="md">
                                            {email ? `Email ${SITE.name}` : 'Message us on WhatsApp'}
                                        </Button>
                                        <div className="flex items-center gap-2">
                                            {whatsappDigits && (
                                                <SocialIcon
                                                    network="whatsapp"
                                                    href={`https://wa.me/${whatsappDigits}`}
                                                    label={`${SITE.name} on WhatsApp`}
                                                />
                                            )}
                                            {Object.entries(SITE.social)
                                                .filter(([, url]) => url)
                                                .map(([key, url]) => (
                                                    <SocialIcon
                                                        key={key}
                                                        network={key}
                                                        href={url}
                                                        label={`${SITE.name} on ${SOCIAL_META[key]?.label ?? key}`}
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                    {(email || address) && (
                                        <ul className="mt-5 space-y-1 border-t border-white/10 pt-4 text-sm text-white/60">
                                            {email && <li>{email}</li>}
                                            {address && <li>{address}</li>}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-navy/10 pt-6 text-xs text-slate">
                            <p>
                                Last updated{' '}
                                <time dateTime={LEGAL.platformLastUpdated}>
                                    {formatDate(LEGAL.platformLastUpdated)}
                                </time>{' '}
                                &middot; {LEGAL.version}
                            </p>
                            <a
                                href="#main-content"
                                className="inline-flex items-center gap-1.5 font-semibold text-navy transition-colors hover:text-orange"
                            >
                                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                                Back to top
                            </a>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
