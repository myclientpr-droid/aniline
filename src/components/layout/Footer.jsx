import Link from 'next/link';
import { SITE, NAV_LINKS, PRIMARY_CTA } from '@/lib/site';
import Image from "next/image";

const SERVICE_LINKS = [
    { label: 'Documentary', href: '/services' },
    { label: 'Promotional', href: '/services' },
    { label: 'Commercial', href: '/services' },
    { label: 'Wedding Films', href: '/services' },
    { label: 'Photography', href: '/services' },
    { label: 'Post-Production', href: '/services' },
];

export default function Footer() {
    const year = new Date().getFullYear();
    const { email, phone, whatsapp, address } = SITE.contact;
    const socials = Object.entries(SITE.social).filter(([, url]) => Boolean(url));

    // Only render WhatsApp link if number looks like digits
    const whatsappDigits = whatsapp ? whatsapp.replace(/[^\d]/g, '') : '';

    return (
        <footer className="stage text-white/80">
            <div className="stage-layer stage__pool" aria-hidden="true" />
            <div className="stage-layer stage__vignette" aria-hidden="true" />
            <div className="container-default relative py-14 md:py-20">
                <div className="grid gap-10 md:grid-cols-12">
                    {/* Brand */}
                    <div className="md:col-span-5">
                        <Link href="/" className="text-white font-extrabold text-xl tracking-tight">
                            <Image src="/aniline-5555x1330.png" alt="Aniline Logo" width={5555} height={1330} className="h-8 w-auto" />
                        </Link>
                        <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mt-3">
                            {SITE.tagline}
                        </p>
                        <p className="text-white/60 text-sm mt-4 max-w-sm">
                            {SITE.description}
                        </p>
                    </div>

                    {/* Nav */}
                    <nav aria-label="Footer" className="md:col-span-3">
                        <h3 className="text-white text-sm font-semibold mb-4">Explore</h3>
                        <ul className="space-y-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Services */}
                    <div className="md:col-span-2">
                        <h3 className="text-white text-sm font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            {SERVICE_LINKS.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/70 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="md:col-span-2">
                        <h3 className="text-white text-sm font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-white/70">
                            {email && (
                                <li>
                                    <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                                        {email}
                                    </a>
                                </li>
                            )}
                            {phone && (
                                <li>
                                    <a
                                        href={`tel:${phone.replace(/\s/g, '')}`}
                                        className="hover:text-white transition-colors"
                                    >
                                        {phone}
                                    </a>
                                </li>
                            )}
                            {whatsappDigits && (
                                <li>
                                    <a
                                        href={`https://wa.me/${whatsappDigits}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white transition-colors"
                                    >
                                        WhatsApp
                                    </a>
                                </li>
                            )}
                            {address && <li className="text-white/50">{address}</li>}
                            {!email && !phone && !whatsappDigits && !address && (
                                <li className="text-white/40 italic">Contact details coming soon</li>
                            )}
                        </ul>

                        {socials.length > 0 && (
                            <ul className="mt-5 flex flex-wrap gap-3">
                                {socials.map(([key, url]) => (
                                    <li key={key}>
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-white/60 hover:text-white capitalize transition-colors"
                                        >
                                            {key}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <p className="text-xs text-white/50">
                        &copy; {year} {SITE.legalName}. All rights reserved.
                    </p>
                    <Link
                        href={PRIMARY_CTA.href}
                        className="text-sm font-semibold text-orange hover:text-white transition-colors"
                    >
                        {PRIMARY_CTA.label} &rarr;
                    </Link>
                </div>
            </div>
        </footer>
    );
}