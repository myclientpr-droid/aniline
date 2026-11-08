import PageHero from '@/components/layout/PageHero';
import LegalDoc from '@/components/legal/LegalDoc';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/schema';
import { LEGAL, TERMS_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Terms of Use',
    description:
        'The terms for using the AniLine website, plus how projects, quotes, rights, and deliverables work under our written project agreements.',
    path: LEGAL.termsHref,
});

export default function TermsPage() {
    const { hero } = TERMS_PAGE;

    const page = {
        ...webPageJsonLd({
            path: LEGAL.termsHref,
            name: `${hero.title} | AniLine`,
            description: hero.subheading,
            type: 'WebPage',
        }),
        datePublished: LEGAL.effectiveDate,
        dateModified: LEGAL.effectiveDate,
        version: LEGAL.version,
    };

    return (
        <>
            <JsonLd
                data={[
                    page,
                    breadcrumbJsonLd([
                        { name: 'Home', path: '/' },
                        { name: 'Terms of Use', path: LEGAL.termsHref },
                    ]),
                ]}
            />

            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            <LegalDoc
                page={TERMS_PAGE}
                counterpart={{ label: 'Read our Privacy Policy', href: LEGAL.privacyHref }}
            />

            <CtaSection
                eyebrow="Work with us"
                title="Ready to make something?"
                description={TERMS_PAGE.contact.body}
            />
        </>
    );
}
