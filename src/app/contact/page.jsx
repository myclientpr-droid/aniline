import Container from '@/components/ui/Container';
import PageHero from '@/components/layout/PageHero';
import InquiryForm from '@/components/forms/InquiryForm';
import CtaSection from '@/components/ui/CtaSection';
import { buildMetadata } from '@/lib/seo';
import { SITE, CONTACT_PAGE } from '@/lib/site';

export const metadata = buildMetadata({
    title: 'Contact',
    description:
        'Get in touch with AniLine \u2014 a Rohingya-led video production and photography studio established in 2020.',
    path: '/contact',
});

export default function ContactPage() {
    const { hero, note } = CONTACT_PAGE;
    const { email, phone, whatsapp, address } = SITE.contact;

    const whatsappDigits = whatsapp ? whatsapp.replace(/[^\d]/g, '') : '';
    const hasAnyContact = Boolean(email || phone || whatsappDigits || address);

    return (
        <>
            <PageHero eyebrow={hero.eyebrow} title={hero.title} subheading={hero.subheading} />

            <section className="section-padding bg-white">
                <Container>
                    <div className="grid gap-10 md:grid-cols-12">
                        {/* Contact details */}
                        <aside className="rise md:col-span-4">
                            <h2 className="text-navy text-lg">Contact details</h2>
                            {hasAnyContact ? (
                                <ul className="mt-5 space-y-3 text-sm">
                                    {email && (
                                        <li>
                                            <span className="text-slate block">Email</span>
                                            <a
                                                href={`mailto:${email}`}
                                                className="text-navy hover:text-orange transition-colors"
                                            >
                                                {email}
                                            </a>
                                        </li>
                                    )}
                                    {phone && (
                                        <li>
                                            <span className="text-slate block">Phone</span>
                                            <a
                                                href={`tel:${phone.replace(/\s/g, '')}`}
                                                className="text-navy hover:text-orange transition-colors"
                                            >
                                                {phone}
                                            </a>
                                        </li>
                                    )}
                                    {whatsappDigits && (
                                        <li>
                                            <span className="text-slate block">WhatsApp</span>
                                            <a
                                                href={`https://wa.me/${whatsappDigits}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-navy hover:text-orange transition-colors"
                                            >
                                                Message us on WhatsApp
                                            </a>
                                        </li>
                                    )}
                                    {address && (
                                        <li>
                                            <span className="text-slate block">Location</span>
                                            <span className="text-navy">{address}</span>
                                        </li>
                                    )}
                                </ul>
                            ) : (
                                <p className="text-slate text-sm mt-4 italic">
                                    Contact details are being finalised. In the meantime, use the form
                                    and we&apos;ll get back to you.
                                </p>
                            )}
                            <p className="text-slate text-xs mt-6">{note}</p>
                        </aside>

                        {/* Form */}
                        <div className="rise rise-2 md:col-span-8">
                            <InquiryForm
                                successTitle="Message sent."
                                successMessage="Thanks for reaching out. We&apos;ll respond as soon as we can."
                            />
                        </div>
                    </div>
                </Container>
            </section>

            <CtaSection />
        </>
    );
}