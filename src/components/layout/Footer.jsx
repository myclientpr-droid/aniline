import Link from 'next/link';
import { SITE, NAV_LINKS, PRIMARY_CTA, LEGAL, LEGAL_LINKS } from '@/lib/site';
import { ROLE_LINKS } from '@/content/roles';
import SocialIcon, { SOCIAL_META } from '@/components/ui/SocialIcon';
import Image from 'next/image';

const SERVICE_LINKS = [
  { label: 'Documentary', href: '/services' },
  { label: 'Promotional', href: '/services' },
  { label: 'Commercial', href: '/services' },
  { label: 'Wedding Films', href: '/services' },
  { label: 'Photography', href: '/services' },
  { label: 'Post-Production', href: '/services' },
];

const WORK_WITH_US_LINKS = [
  ...ROLE_LINKS.map((role) => ({ label: role.label, href: `/${role.slug}` })),
  { label: 'Journal', href: '/journal' },
];

// `NAV_LINKS` feeds the header too, so a footer-only page is appended here instead of added there.
const FOOTER_EXPLORE = [
  ...NAV_LINKS.filter((link) => link.href !== '/contact'),
  { label: 'Developer', href: '/developer' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const { email, phone, whatsapp, address } = SITE.contact;
  const socials = Object.entries(SITE.social).filter(([, url]) => Boolean(url));

  // Only render WhatsApp link if number looks like digits
  const whatsappDigits = whatsapp ? whatsapp.replace(/[^\d]/g, '') : '';

  return (
    <footer className="site-footer stage text-white/80">
      <div className="stage-layer stage__pool" aria-hidden="true" />
      <div className="stage-layer stage__vignette" aria-hidden="true" />
      <div className="container-default relative py-14 md:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="text-white font-extrabold text-xl tracking-tight">
              <Image
                src="/aniline-5555x1330.png"
                alt=""
                width={5555}
                height={1330}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-orange text-xs font-semibold uppercase tracking-[0.18em] mt-3">
              {SITE.tagline}
            </p>
            <p className="text-white/60 text-sm mt-4 max-w-sm">{SITE.description}</p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer" className="col-span-1 md:col-span-2">
            <h3 className="text-white text-sm font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              {FOOTER_EXPLORE.map((link) => (
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
          <div className="col-span-1 md:col-span-2">
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

          {/* Roles + Journal */}
          <nav aria-label="Work with us" className="col-span-1 md:col-span-2">
            <h3 className="text-white text-sm font-semibold mb-4">Work with us</h3>
            <ul className="space-y-2">
              {WORK_WITH_US_LINKS.map((link) => (
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

          {/* Contact */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white text-sm font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-white/70 empty:hidden">
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
              {address && <li className="text-white/50">{address}</li>}
            </ul>

            {!email && !phone && !address && (
              <Link
                href="/contact"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                Write to us &rarr;
              </Link>
            )}

            {(socials.length > 0 || whatsappDigits) && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {whatsappDigits && (
                  <li>
                    <SocialIcon
                      network="whatsapp"
                      href={`https://wa.me/${whatsappDigits}`}
                      label={`${SITE.name} on WhatsApp`}
                    />
                  </li>
                )}
                {socials.map(([key, url]) => (
                  <li key={key}>
                    <SocialIcon
                      network={key}
                      href={url}
                      label={`${SITE.name} on ${SOCIAL_META[key]?.label}`}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/50">
            &copy; {year} {SITE.legalName}. All rights reserved.
          </p>
          <nav aria-label="Legal" className="order-last md:order-none">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li className="text-xs text-white/40">Policy v{LEGAL.version}</li>
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
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
