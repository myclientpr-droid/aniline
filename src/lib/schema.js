import { ABOUT, SITE, SERVICES_PAGE } from '@/lib/site';
import { buildImageUrl } from '@/lib/cloudinary';

/**
 * JSON-LD for the whole site.
 *
 * One graph is emitted from the root layout (`siteGraph`), and every page adds nodes that point at
 * it by `@id` instead of restating the business. That keeps Google seeing a single entity no matter
 * how many pages restate it.
 *
 * Only facts the site can support are emitted: no street address, no opening hours, no prices.
 */

export const ORG_ID = `${SITE.url}/#organization`;
export const SERVICE_ID = `${SITE.url}/#professionalservice`;
export const WEBSITE_ID = `${SITE.url}/#website`;

const LOGO = {
  '@type': 'ImageObject',
  url: `${SITE.url}/aniline-5555x1330.png`,
  width: 5555,
  height: 1330,
  caption: `${SITE.name} logo`,
};

const AREA_SERVED = [
  // The community the studio belongs to, and the country it works from.
  { '@type': 'Country', name: 'Bangladesh' },
  { '@type': 'Country', name: 'Myanmar' },
  // International crews book us to travel; "Worldwide" is not a Country, so it stays a Place.
  { '@type': 'Place', name: 'Worldwide' },
];

function socials() {
  return Object.values(SITE.social).filter(Boolean);
}

/** The root-layout graph: one Organization, one ProfessionalService, one WebSite, all linked. */
export function siteGraph() {
  const sameAs = socials();

  const organization = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    logo: LOGO,
    foundingDate: SITE.founded,
    description: SITE.description,
    ...(sameAs.length ? { sameAs } : {}),
  };

  const professionalService = {
    '@type': 'ProfessionalService',
    '@id': SERVICE_ID,
    name: SITE.name,
    alternateName: SITE.legalName,
    url: SITE.url,
    logo: LOGO,
    image: LOGO.url,
    description: SITE.description,
    slogan: SITE.tagline,
    foundingDate: SITE.founded,
    parentOrganization: { '@id': ORG_ID },
    areaServed: AREA_SERVED,
    knowsAbout: [
      ...ABOUT.capabilities.items,
      'video production',
      'documentary filmmaking',
      'cinematography',
      'video editing',
      'colour grading',
      'photography',
      'Rohingya community storytelling',
      'NGO and humanitarian communications',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Production services',
      itemListElement: offerCatalogItems(),
    },
    ...(sameAs.length ? { sameAs } : {}),
    ...(contactPoint() ? { contactPoint: contactPoint() } : {}),
  };

  const website = {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, professionalService, website],
  };
}

function offerCatalogItems() {
  return SERVICES_PAGE.fallbackServices.map((service) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: service.title,
      description: service.shortDescription,
      url: `${SITE.url}/services/${service.slug}`,
      serviceType: service.title,
    },
  }));
}

function contactPoint() {
  const { email, phone, whatsapp } = SITE.contact;
  const telephone = phone || whatsapp;
  if (!email && !telephone) return null;
  return {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    ...(telephone ? { telephone } : {}),
    ...(email ? { email } : {}),
    availableLanguage: ['en', 'bn'],
    areaServed: 'Worldwide',
  };
}

/* ------------------------------------------------------------------ */
/* Page-level nodes                                                    */
/* ------------------------------------------------------------------ */

/**
 * @param {{ path: string, name: string, description?: string, type?: string, about?: object, primaryImage?: string }} page
 */
export function webPageJsonLd({ path, name, description, type = 'WebPage', about, primaryImage }) {
  const url = `${SITE.url}${path}`;
  const id = `${url}#webpage`;
  return {
    '@type': type,
    '@id': id,
    url,
    name,
    ...(description ? { description } : {}),
    isPartOf: { '@id': WEBSITE_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
    ...(about ? { about } : {}),
    ...(primaryImage ? { primaryImageOfPage: { '@type': 'ImageObject', url: primaryImage } } : {}),
    mainEntityOfPage: { '@id': id },
  };
}

/**
 * Build a BreadcrumbList JSON-LD. Home is implied as position 1 by the caller's first crumb.
 * @param {Array<{ name: string, path: string }>} crumbs
 */
export function breadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE.url}${c.path}`,
    })),
  };
}

/**
 * @param {{ name: string, url: string }[]} items - In display order.
 */
export function itemListJsonLd({ name, items, itemType = 'ListItem' }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': itemType,
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/**
 * @param {{ title: string, slug: string, shortDescription?: string, description?: string, audience?: string[], deliverables?: string[] }} service
 */
export function serviceJsonLd(service) {
  const url = `${SITE.url}/services/${service.slug}`;
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: service.title,
    description: service.shortDescription || service.description || undefined,
    url,
    serviceType: service.title,
    provider: { '@id': SERVICE_ID },
    areaServed: AREA_SERVED,
    ...(service.audience?.length
      ? { audience: service.audience.map((a) => ({ '@type': 'Audience', audienceType: a })) }
      : {}),
    ...(service.deliverables?.length
      ? { serviceOutput: service.deliverables.map((d) => ({ '@type': 'CreativeWork', name: d })) }
      : {}),
  };
}

/**
 * A role landing page's Service node: the offering, not a second business.
 * @param {{ slug: string, serviceName: string, seoTitle: string, description: string, forWhom?: { title: string }[], deliverables?: string[] }} role
 */
export function roleServiceJsonLd(role) {
  const url = `${SITE.url}/${role.slug}`;
  return {
    '@type': 'Service',
    '@id': `${url}#service`,
    name: role.serviceName,
    description: role.description,
    url,
    serviceType: role.seoTitle,
    provider: { '@id': SERVICE_ID },
    areaServed: AREA_SERVED,
    ...(role.forWhom?.length
      ? { audience: role.forWhom.map((a) => ({ '@type': 'Audience', audienceType: a.title })) }
      : {}),
    ...(role.deliverables?.length
      ? { serviceOutput: role.deliverables.map((d) => ({ '@type': 'CreativeWork', name: d })) }
      : {}),
  };
}

/**
 * VideoObject. Google requires uploadDate and thumbnailUrl; duration is emitted only when the record
 * stores one, because a guessed duration is worse than none.
 * `contentUrl` is only ever a directly fetchable media file — an embedded player has `embedUrl`.
 * `path` overrides the page the video lives on; a film on /videography is not a project on /work.
 * @param {{ title: string, slug: string, path?: string, shortDescription?: string, fullDescription?: string, videoUrl?: string, embedUrl?: string, posterUrl?: string, uploadDate?: string, duration?: string }} project
 */
export function videoObjectJsonLd(project) {
  const url = project.path ? `${SITE.url}${project.path}` : `${SITE.url}/work/${project.slug}`;
  return {
    '@type': 'VideoObject',
    '@id': `${url}#video`,
    name: project.title,
    description: project.shortDescription || project.fullDescription || undefined,
    thumbnailUrl: project.posterUrl ? [project.posterUrl] : undefined,
    uploadDate: project.uploadDate,
    contentUrl: project.videoUrl || undefined,
    ...(project.embedUrl ? { embedUrl: project.embedUrl } : {}),
    ...(project.duration ? { duration: project.duration } : {}),
    url,
    publisher: { '@id': ORG_ID },
    creator: { '@id': SERVICE_ID },
  };
}

/** A project as a page node, with its production credits. */
export function creativeWorkJsonLd(project) {
  const url = `${SITE.url}/work/${project.slug}`;
  return {
    '@type': 'CreativeWork',
    '@id': `${url}#work`,
    name: project.title,
    description: project.shortDescription || undefined,
    url,
    creator: { '@id': SERVICE_ID },
    ...(project.category ? { genre: project.category } : {}),
    ...(project.year ? { dateCreated: String(project.year) } : {}),
    ...(project.location ? { locationCreated: { '@type': 'Place', name: project.location } } : {}),
    ...(project.client
      ? { sourceOrganization: { '@type': 'Organization', name: project.client } }
      : {}),
    ...(project.servicesProvided?.length
      ? {
          about: project.servicesProvided.map((s) => ({
            '@type': 'Thing',
            name: s,
          })),
        }
      : {}),
    ...(project.images?.length
      ? { image: project.images.map((src) => ({ '@type': 'ImageObject', url: src })) }
      : {}),
  };
}

/**
 * @param {{ title: string, description: string, slug: string, heroUrl?: string, datePublished: string, dateModified: string, authorName: string, section?: string, tags?: string[] }} article
 */
export function articleJsonLd(article) {
  const url = `${SITE.url}/journal/${article.slug}`;
  return {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${url}#webpage` },
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: { '@type': 'Organization', name: article.authorName, '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
    ...(article.heroUrl ? { image: [article.heroUrl] } : {}),
    ...(article.section ? { articleSection: article.section } : {}),
    ...(article.tags?.length ? { keywords: article.tags.join(', ') } : {}),
  };
}

/**
 * @param {{ q: string, a: string }[]} faqs
 */
export function faqJsonLd(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/**
 * Person nodes, only for members with real names and roles. Placeholder rows would otherwise be
 * published as people who do not exist.
 * @param {Array<{ name: string, role?: string, bio?: string, photo?: { publicId: string }, social?: { linkedin?: string, instagram?: string } }>} members
 */
export function personNodes(members) {
  return (members || [])
    .filter((m) => m?.name && !/^team member$/i.test(m.name.trim()))
    .filter((m) => m.role || m.bio)
    .map((m) => {
      const image = m.photo?.publicId
        ? buildImageUrl(m.photo.publicId, { width: 800, height: 800, crop: 'fill' })
        : undefined;
      const sameAs = [m.social?.linkedin, m.social?.instagram].filter(Boolean);
      // Placeholder rows have no slug and therefore no page to identify them by.
      const url = m.slug ? new URL(`/team/${m.slug}`, SITE.url).toString() : undefined;
      return {
        '@type': 'Person',
        ...(url ? { '@id': `${url}#person`, url } : {}),
        name: m.name,
        ...(m.role ? { jobTitle: m.role } : {}),
        ...(m.bio ? { description: m.bio } : {}),
        ...(image ? { image } : {}),
        ...(sameAs.length ? { sameAs } : {}),
        worksFor: { '@id': ORG_ID },
        ...(m.expertise?.length ? { knowsAbout: m.expertise } : {}),
      };
    });
}

/**
 * Serialize JSON-LD for embedding in <script type="application/ld+json">.
 * @param {object|object[]} data
 * @returns {string}
 */
export function stringifyJsonLd(data) {
  // `<` is escaped so a value containing `</script>` cannot close the element early.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
