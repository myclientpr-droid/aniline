import PageHero from '@/components/layout/PageHero';
import LegalDoc from '@/components/legal/LegalDoc';
import CtaSection from '@/components/ui/CtaSection';
import JsonLd from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/schema';
import { LEGAL, PRIVACY_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Privacy Policy',
    description:
        'How AniLine collects, uses, shares, and protects personal information \u2014 covering enquiry forms, cookies, service providers, and your data rights.',
    path: LEGAL.privacyHref,
});

export default function PrivacyPage() {
    const { hero } = PRIVACY_PAGE;

    const page = {
        ...webPageJsonLd({
            path: LEGAL.privacyHref,
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
                        { name: 'Privacy Policy', path: LEGAL.privacyHref },
                    ]),
                ]}
            />

            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            <LegalDoc
                page={PRIVACY_PAGE}
                counterpart={{ label: 'Read our Terms of Use', href: LEGAL.termsHref }}
            />

            <CtaSection
                eyebrow="Work with us"
                title="Ready to make something?"
                description={PRIVACY_PAGE.contact.body}
            />
        </>
    );
}
