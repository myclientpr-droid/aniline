import { listArticles } from '@/content/journal';
import { listRoles } from '@/content/roles';
import { CONTENT_UPDATED, SERVICES_PAGE, SITE } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * llms.txt — a plain-text map for answer engines. Same facts as the site's structured data, in the
 * format large-language tools read first.
 */
export function GET() {
  const services = SERVICES_PAGE.fallbackServices
    .filter((s) => s.slug)
    .map((s) => `- [${s.title}](${SITE.url}/services/${s.slug}): ${s.shortDescription}`)
    .join('\n');

  const roles = listRoles()
    .map((r) => `- [${r.seoTitle}](${SITE.url}/${r.slug}): ${r.description}`)
    .join('\n');

  const articles = listArticles()
    .map((a) => `- [${a.title}](${SITE.url}/journal/${a.slug}): ${a.excerpt}`)
    .join('\n');

  const contactLines = [
    `- Website: ${SITE.url}`,
    SITE.contact.email && `- Email: ${SITE.contact.email}`,
    `- WhatsApp: https://wa.me/${SITE.contact.whatsapp.replace(/[^\d]/g, '')}`,
    SITE.social.facebook && `- Facebook: ${SITE.social.facebook}`,
    SITE.social.instagram && `- Instagram: ${SITE.social.instagram}`,
    SITE.social.youtube && `- YouTube: ${SITE.social.youtube}`,
  ].filter(Boolean);

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} (legal name: ${SITE.legalName}) is a Rohingya-led video production, photography and
post-production studio established in ${SITE.founded} and based in ${SITE.location.region},
${SITE.location.country}. We work internationally with NGOs, humanitarian organizations,
filmmakers, journalists, universities, businesses and families. We do not publish a street
address; work is coordinated remotely and on site.

## Key pages

- [Home](${SITE.url}/): ${SITE.message}
- [About](${SITE.url}/about)
- [Services](${SITE.url}/services)
- [Our Work](${SITE.url}/work)
- [Videography](${SITE.url}/videography): Films, start to finish \u2014 documentary, campaign, wedding and event films.
- [Photography](${SITE.url}/photography)
- [Clients](${SITE.url}/clients)
- [Team](${SITE.url}/team)
- [Journal](${SITE.url}/journal)
- [Start a Project](${SITE.url}/start-a-project)
- [Contact](${SITE.url}/contact)
- [About Developer](${SITE.url}/developer): Mohammed Ismail \u2014 independent full-stack web and Android developer; built this site.

## Hire us by role

${roles}

## Services

${services}

## Notes and guides

${articles}

## Contact

${contactLines.join('\n')}

Content last updated: ${CONTENT_UPDATED}
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
