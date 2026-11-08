export const SITE = {
    name: 'AniLine',
    legalName: 'AniLine Production',
    tagline: 'Crafting Stories One Frame at a Time',
    // Search results truncate around 60 characters; this variant leads with what we are hired for.
    seoTagline: 'Rohingya-led Video Production & Photography Studio',
    message: 'Your Story. Our Community. One Production Partner.',
    description:
        'AniLine is a Rohingya-led video production, photography, and post-production company established in 2020. We craft documentary, promotional, commercial, and event films for organizations, filmmakers, businesses, and families.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    founded: '2020',
    locale: 'en_US',
    location: {
        country: 'Bangladesh',
        region: 'Cox\u2019s Bazar',
    },
    contact: {
        email: '',
        phone: '',
        whatsapp: '+8801875558462',
        address: '',
    },
    social: {
        facebook: 'https://www.facebook.com/share/1YD1LswSkN/',
        instagram: '',
        youtube: 'https://youtube.com/@aniline.24',
        linkedin: '',
        tiktok: '',
    },
};

export const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Our Work', href: '/work' },
    { label: 'Photography', href: '/photography' },
    { label: 'Clients', href: '/clients' },
    { label: 'Our Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
];

/** Bumped when the core marketing pages' copy changes; the sitemap must not claim "now". */
export const CONTENT_UPDATED = '2026-11-08';

export const PRIMARY_CTA = {
    label: 'Start a Project',
    href: '/start-a-project',
};

/* ------------------------------------------------------------------ */
/* Homepage copy — placeholders marked. Replace with approved content. */
/* ------------------------------------------------------------------ */

export const HOME = {
    hero: {
        eyebrow: 'Crafting Stories, One Frame At a Time',
        // Reel played back-to-back on a loop, in order. Cloudinary video public IDs.
        videoPublicId: '',
        extraVideoPublicIds: [],
        // Absolute or same-origin video URLs that win over the public IDs — for footage hosted
        // outside Cloudinary, and for exercising the hero texture locally.
        // Demo: bundled reel in public/assets. Swap for Cloudinary IDs or your own footage.
        videoSrcOverrides: ['/assets/alt-bg-video1.mp4', '/assets/alt-bg-video2.mp4'],
        // Cloudinary image public ID for the poster; takes precedence over posterSrc.
        posterPublicId: '',
        // Bundled still used while no Cloudinary media is configured. With several overrides it
        // is the still for each of them in turn.
        posterSrc: '/assets/alt-bg-image1.webp',
        // Optional heading override; falls back to SITE.message
        heading: null,
        subheading:
            'A four-member creative team producing documentaries, campaigns, weddings, and stories that move people \u2014 from the heart of the Rohingya community.',
    },

    intro: {
        eyebrow: 'Who we are',
        title: 'A production studio built on stories that matter.',
        body: [
            'AniLine is a Rohingya-led visual production company established in 2020. We work as a compact four-member team, which means every project gets the full attention of the people actually shooting, editing, and delivering it.',
            'We produce documentary, promotional, commercial, wedding, and event films, along with photography and post-production. Some clients come to us for a full production. Others come for a local partner who knows the community, the locations, and the language.',
            'Either way, we treat the work the same way: carefully, honestly, and with the story first.',
        ],
    },

    community: {
        eyebrow: 'A community-based advantage',
        title: 'Local understanding. Human-centered storytelling.',
        body:
            'We live and work within the community we film. That means we understand context, language, and trust in ways an outside crew cannot replicate. It also means we approach every story \u2014 whether a wedding, a classroom, a business, or an organization \u2014 with the same respect and care.',
        pillars: [
            {
                title: 'Local knowledge',
                description:
                    'Locations, access, and relationships that save productions time and money.',
            },
            {
                title: 'Cultural fluency',
                description:
                    'Language, customs, and everyday life understood from the inside.',
            },
            {
                title: 'Trust',
                description:
                    'People open up to a crew they recognize. That changes what a film can hold.',
            },
            {
                title: 'Professional delivery',
                description:
                    'Clear communication, dependable timelines, and finished work you can use.',
            },
        ],
    },

    featuredWork: {
        eyebrow: 'Selected work',
        title: 'Recent productions',
        description:
            'A small selection of the projects we have produced. Full portfolio on the Our Work page.',
        ctaLabel: 'View all work',
        ctaHref: '/work',
    },

    services: {
        eyebrow: 'What we do',
        title: 'Production services',
        description:
            'From a single shoot day to a full production \u2014 end-to-end video and photography.',
        ctaLabel: 'All services',
        ctaHref: '/services',
    },

    partner: {
        eyebrow: 'Production partner',
        title: 'Working with filmmakers, journalists, and organizations.',
        body:
            'AniLine partners with external production teams who need trusted local support. We handle logistics, access, on-the-ground shooting, and post-production coordination \u2014 so your crew can focus on the story.',
        items: [
            {
                title: 'Filmmakers & documentary crews',
                description:
                    'Local fixer support, location scouting, cultural guidance, and additional camera.',
            },
            {
                title: 'Journalists & researchers',
                description:
                    'Interviews, field shooting, and safe, respectful access to communities.',
            },
            {
                title: 'NGOs & humanitarian organizations',
                description:
                    'Program documentation, campaign films, and impact storytelling.',
            },
            {
                title: 'Universities & creative agencies',
                description:
                    'Field support, co-production, and post-production services.',
            },
        ],
    },

    whoWeWorkWith: {
        eyebrow: 'Who we work with',
        title: 'Clients and collaborators',
        description:
            'We work with a broad range of clients \u2014 from individual families to international teams.',
        groups: [
            { title: 'Organizations', description: 'NGOs, charities, and humanitarian teams.' },
            { title: 'Businesses', description: 'Brands, shops, and growing companies.' },
            { title: 'Schools', description: 'Year-end films, ceremonies, and events.' },
            { title: 'Filmmakers', description: 'Independent and documentary productions.' },
            { title: 'Journalists', description: 'Field reporting and long-form features.' },
            { title: 'Researchers', description: 'Fieldwork and academic documentation.' },
            { title: 'Artists & musicians', description: 'Music videos and creative films.' },
            { title: 'Families & individuals', description: 'Weddings and personal milestones.' },
        ],
    },

    why: {
        eyebrow: 'Why AniLine',
        title: 'What sets our work apart',
        points: [
            {
                title: 'Since 2020',
                description:
                    'Established practice \u2014 not a new studio figuring things out on your project.',
            },
            {
                title: 'Community-based understanding',
                description:
                    'We film within the community we belong to, with the trust that comes from it.',
            },
            {
                title: 'Story-first approach',
                description:
                    'We start with what the story needs and build the production around it.',
            },
            {
                title: 'Dedicated four-member team',
                description:
                    'The people you talk to are the people who shoot, edit, and deliver.',
            },
            {
                title: 'Local production partnership',
                description:
                    'Trusted support for external teams working in the region.',
            },
            {
                title: 'Clear communication',
                description:
                    'Straightforward scoping, realistic timelines, and finished work you can use.',
            },
        ],
    },

    teamPreview: {
        eyebrow: 'The team',
        title: 'The people behind AniLine',
        description:
            'A small team by design \u2014 so every project gets our full attention.',
        ctaLabel: 'Meet the team',
        ctaHref: '/team',
        // Placeholders only. Real names, roles, photos, and bios to be supplied.
        fallbackMembers: [
            { name: 'Team member', role: 'Role to be confirmed', bio: '' },
            { name: 'Team member', role: 'Role to be confirmed', bio: '' },
            { name: 'Team member', role: 'Role to be confirmed', bio: '' },
            { name: 'Team member', role: 'Role to be confirmed', bio: '' },
        ],
    },
    featuredClients: {
        eyebrow: 'Trusted by',
        title: 'Clients & collaborators',
        description:
            'A selection of the organizations, businesses, and families we work with.',
        ctaLabel: 'View all clients',
        ctaHref: '/clients',
    },
};

/* ------------------------------------------------------------------ */
/* About page                                                          */
/* ------------------------------------------------------------------ */

export const ABOUT = {
    hero: {
        eyebrow: 'About AniLine',
        title: 'A small studio with a long view.',
        subheading:
            'AniLine is a Rohingya-led visual production company established in 2020. We work as a compact four-member team \u2014 and we like it that way.',
    },

    story: {
        eyebrow: 'Our story',
        title: 'Started in 2020. Still shooting.',
        body: [
            'AniLine was founded in 2020 by a small group of Rohingya creatives who wanted to build something durable \u2014 a production company, not a project. From the beginning, the goal has been the same: to produce work that is professional, human, and rooted in the community we come from.',
            'Over the years, we\u2019ve produced documentaries, promotional films, wedding coverage, event films, music videos, and photography. Some of that work is for organizations. Some of it is for families. All of it is made with the same care.',
            'We are not a large studio, and we don\u2019t try to pretend to be. What we offer is focus: the people you talk to are the people who shoot, edit, and deliver your project.',
        ],
    },

    approach: {
        eyebrow: 'How we work',
        title: 'Story first. Everything else follows.',
        items: [
            {
                title: 'We listen before we shoot',
                description:
                    'Every project starts with understanding the story, the audience, and the reason it exists.',
            },
            {
                title: 'We plan realistically',
                description:
                    'Clear scopes, honest timelines, and no promises we can\u2019t keep.',
            },
            {
                title: 'We work with context',
                description:
                    'Local knowledge of language, culture, and location \u2014 from the inside.',
            },
            {
                title: 'We deliver finished work',
                description:
                    'Edited, graded, and formatted for the platform it\u2019s meant for.',
            },
        ],
    },

    values: {
        eyebrow: 'What we value',
        title: 'Principles we hold to',
        items: [
            { title: 'Respect', description: 'For the people in front of the camera and behind it.' },
            { title: 'Honesty', description: 'About what we can do, what we can\u2019t, and what it costs.' },
            { title: 'Craft', description: 'Care at every stage \u2014 from the first frame to the final export.' },
            { title: 'Community', description: 'We are part of the community we film. That shapes the work.' },
        ],
    },

    capabilities: {
        eyebrow: 'Capabilities',
        title: 'What we can do end-to-end',
        items: [
            'Documentary video production',
            'Promotional and commercial film',
            'Wedding and event coverage',
            'Music video production',
            'NGO and charity documentation',
            'Photography (event, portrait, documentary)',
            'Video editing and color grading',
            'Post-production and delivery',
        ],
    },
};

/* ------------------------------------------------------------------ */
/* Services page                                                       */
/* ------------------------------------------------------------------ */

export const SERVICES_PAGE = {
    hero: {
        eyebrow: 'Services',
        title: 'Production and digital services, end-to-end.',
        subheading:
            'From a single shoot day to a full production \u2014 and beyond film and photography, we also build digital products like websites and software.',
    },

    // Fallback list used if the `services` collection is empty.
    // These are descriptions, not claims about capabilities beyond what the brief confirms.
    fallbackServices: [
        {
            _id: 's1',
            title: 'Documentary Video Production',
            slug: 'documentary-video-production',
            shortDescription:
                'Long-form and short documentary work, filmed and edited end-to-end.',
            audience: ['Organizations', 'Filmmakers', 'Researchers'],
        },
        {
            _id: 's2',
            title: 'Promotional Video Production',
            slug: 'promotional-video-production',
            shortDescription:
                'Brand, campaign, and awareness films for businesses and organizations.',
            audience: ['Businesses', 'NGOs', 'Schools'],
        },
        {
            _id: 's3',
            title: 'Commercial Video Production',
            slug: 'commercial-video-production',
            shortDescription:
                'Product and service videos built to communicate clearly and look sharp.',
            audience: ['Businesses', 'Brands'],
        },
        {
            _id: 's4',
            title: 'Wedding Films',
            slug: 'wedding-films',
            shortDescription:
                'Cinematic wedding coverage built around the people and the day.',
            audience: ['Families', 'Couples'],
        },
        {
            _id: 's5',
            title: 'School Year-End and Award Ceremony Coverage',
            slug: 'school-events',
            shortDescription:
                'Coverage for graduations, ceremonies, and school milestones.',
            audience: ['Schools', 'Universities'],
        },
        {
            _id: 's6',
            title: 'Music Video Production',
            slug: 'music-video-production',
            shortDescription:
                'Music videos that match the tone, rhythm, and identity of the artist.',
            audience: ['Artists', 'Musicians'],
        },
        {
            _id: 's7',
            title: 'Charity and NGO Video Production',
            slug: 'charity-ngo-video-production',
            shortDescription:
                'Program documentation and campaign films for humanitarian work.',
            audience: ['NGOs', 'Charities', 'Humanitarian orgs'],
        },
        {
            _id: 's8',
            title: 'Photography',
            slug: 'photography',
            shortDescription:
                'Event, portrait, and documentary photography produced with the same care as our films.',
            audience: ['Events', 'Portraits', 'Documentary'],
        },
        {
            _id: 's9',
            title: 'Video Editing',
            slug: 'video-editing',
            shortDescription:
                'Editing for footage you already have \u2014 story, pace, and polish.',
            audience: ['Organizations', 'Creators'],
        },
        {
            _id: 's10',
            title: 'Post-Production',
            slug: 'post-production',
            shortDescription:
                'Color grading, sound polish, and final delivery for external productions.',
            audience: ['Filmmakers', 'Agencies'],
        },
        {
            _id: 's11',
            title: 'Website Design & Development',
            slug: 'website-design-development',
            shortDescription:
                'Business, portfolio, and campaign websites \u2014 designed, built, and handed over ready to use.',
            audience: ['Businesses', 'Organizations', 'Creators'],
        },
        {
            _id: 's12',
            title: 'Software Development',
            slug: 'software-development',
            shortDescription:
                'Custom digital products and internal tools, built around how your work actually runs.',
            audience: ['Businesses', 'NGOs', 'Teams'],
        },
    ],

    process: {
        eyebrow: 'How a project runs',
        title: 'From first call to final delivery',
        steps: [
            { title: 'Conversation', description: 'We talk through the story, scope, and goals.' },
            { title: 'Planning', description: 'We agree on timeline, locations, and deliverables.' },
            { title: 'Production', description: 'We shoot \u2014 with a small, focused crew.' },
            { title: 'Post', description: 'Editing, grading, and revisions until it\u2019s right.' },
            { title: 'Delivery', description: 'Final files in the formats you need.' },
        ],
    },
};

/* ------------------------------------------------------------------ */
/* Team page                                                           */
/* ------------------------------------------------------------------ */

export const TEAM_PAGE = {
    hero: {
        eyebrow: 'The team',
        title: 'Four people. One studio.',
        subheading:
            'AniLine is intentionally small. Every project gets our full attention from start to finish.',
    },

    // Placeholders only. Real names, roles, photos, and bios to be supplied by client.
    fallbackMembers: [
        {
            _id: 't1',
            name: 'Team member',
            role: '',
            bio: 'Biography to be provided.',
            expertise: [],
        },
        {
            _id: 't2',
            name: 'Team member',
            role: '',
            bio: 'Biography to be provided.',
            expertise: [],
        },
        {
            _id: 't3',
            name: 'Team member',
            role: '',
            bio: 'Biography to be provided.',
            expertise: [],
        },
        {
            _id: 't4',
            name: 'Team member',
            role: '',
            bio: 'Biography to be provided.',
            expertise: [],
        },
    ],

    join: {
        eyebrow: 'Work with us',
        title: 'Have a project in mind?',
        description:
            'Whether you\u2019re producing a documentary, planning a wedding, or documenting a program \u2014 we\u2019d like to hear about it.',
    },
};

/* ------------------------------------------------------------------ */
/* Our Work page                                                       */
/* ------------------------------------------------------------------ */

export const WORK_PAGE = {
    hero: {
        eyebrow: 'Our Work',
        title: 'Selected productions.',
        subheading:
            'A growing archive of documentary, promotional, commercial, wedding, event, and creative projects.',
    },
    filter: {
        allLabel: 'All work',
    },
    empty: {
        title: 'No projects yet',
        message: 'We\u2019re publishing new work soon. Check back shortly.',
    },
};

/* ------------------------------------------------------------------ */
/* Photography page                                                    */
/* ------------------------------------------------------------------ */

export const PHOTOGRAPHY_PAGE = {
    hero: {
        eyebrow: 'Photography',
        title: 'Frames from the field.',
        subheading:
            'Event, portrait, documentary, commercial, and creative photography.',
    },
    filter: {
        allLabel: 'All',
    },
    empty: {
        title: 'No photographs yet',
        message: 'New photography is being added. Please check back shortly.',
    },
};

/* ------------------------------------------------------------------ */
/* Contact page                                                        */
/* ------------------------------------------------------------------ */

export const CONTACT_PAGE = {
    hero: {
        eyebrow: 'Contact',
        title: 'Let\u2019s talk.',
        subheading:
            'Whether you\u2019re planning a production, exploring a collaboration, or just have a question \u2014 we\u2019d like to hear from you.',
    },
    // Response expectation is intentionally general — no unapproved SLA.
    note: 'We do our best to reply within a few working days.',
};

/* ------------------------------------------------------------------ */
/* Start a Project page                                                */
/* ------------------------------------------------------------------ */

export const START_PROJECT_PAGE = {
    hero: {
        eyebrow: 'Start a Project',
        title: 'Tell us about your project.',
        subheading:
            'Share a few details and we&apos;ll get back to you to discuss next steps.',
    },
    success: {
        title: 'Thank you \u2014 your message has been received.',
        message:
            'We\u2019ve received your project details and will respond as soon as we can. If you need to add anything, reply directly to the confirmation email address you provided.',
    },
    privacy: {
        note:
            'Your details are stored securely and used only to respond to your inquiry. We do not share them with third parties.',
    },
};

/* ------------------------------------------------------------------ */
/* Clients page                                                        */
/* ------------------------------------------------------------------ */

export const CLIENTS_PAGE = {
    hero: {
        eyebrow: 'Clients',
        title: 'The people and organizations we work with.',
        subheading:
            'A growing list of clients and collaborators across documentary, business, education, events, and community projects.',
    },
    filter: {
        allLabel: 'All clients',
    },
    empty: {
        title: 'Client list coming soon',
        message: 'We\u2019re preparing our client directory. Check back shortly.',
    },
};

/* ------------------------------------------------------------------ */
/* Legal pages                                                         */
/* Two documents that cite each other's section numbers, so both live  */
/* here: a cross-reference is one object access, not a hand-typed      */
/* "section 6" that rots.                                              */
/* ------------------------------------------------------------------ */

export const LEGAL = {
    effectiveDate: '2026-11-08',
    // Bump whenever the wording changes materially — the on-page notice reads from this.
    version: '1.0',
    // Date the site's structure last changed in a way that touched either document.
    platformLastUpdated: '2026-11-08',
    responsePromise: 'We aim to reply to any privacy or legal request within 30 days.',
    privacyHref: '/privacy',
    termsHref: '/terms',
};

export const LEGAL_LINKS = [
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy Policy', href: LEGAL.privacyHref },
    { label: 'Terms of Use', href: LEGAL.termsHref },
];

export function legalContactHref() {
    const { email, whatsapp } = SITE.contact;
    if (email) return `mailto:${email}`;
    if (whatsapp) return `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`;
    return '/contact';
}

export const PRIVACY_PAGE = {
    hero: {
        eyebrow: 'Legal',
        title: 'Privacy Policy',
        subheading:
            'How AniLine collects, uses, and protects the information you share with us \u2014 in plain language, with nothing buried.',
    },
    intro: [
        `This policy explains what happens to your information when you visit ${SITE.name}, contact us, or make a film with us. It is written to be read, not to protect us from you.`,
        'We collect little: what you choose to send us, plus the notes our hosting providers keep so the site stays online. We do not sell information, we do not buy profiles, and we do not run advertising trackers.',
    ],
    summary: {
        title: 'The short version',
        items: [
            { title: 'No advertising trackers', description: 'No ad pixels or third-party analytics scripts on this site.' },
            { title: 'Three cookies, all ours', description: 'A security check, a session for administrators, and one you can dismiss.' },
            { title: 'Forms only, no accounts', description: 'Visitors never create accounts. We store what you type into a form.' },
            { title: 'Your story is yours', description: 'Footage, photos, and footage-derived material stay private unless we agree otherwise in writing.' },
        ],
    },
    sections: [
        {
            id: 'who-we-are',
            title: 'Who we are',
            body: [
                `This site is operated by ${SITE.legalName} ("${SITE.name}", "we", "us"), a video production and photography studio established in ${SITE.founded} and based in ${SITE.location.region}, ${SITE.location.country}. We are the controller for the personal information described in this policy.`,
            ],
            definitions: [
                { term: 'Personal information', description: 'Any information that can reasonably be linked to you \u2014 your name, your email address, or what you write to us.' },
                { term: 'Controller', description: 'The organisation that decides why and how personal information is processed.' },
            ],
        },
        {
            id: 'information-we-collect',
            title: 'Information we collect',
            body: [
                'You can read almost every page without giving us anything. Information reaches us only in the situations below.',
            ],
            items: [
                {
                    title: 'Enquiry and project forms',
                    description: 'When you write to us through /contact or /start-a-project, we receive and store: your name, email address, and project category (all required); optionally your organisation, phone number, preferred shoot date or timeline, location, a description of the project, and any reference links you paste in. Enquiries also carry a status note for our own follow-up.',
                },
                {
                    title: 'Messages you send directly',
                    description: 'Email and WhatsApp messages go through those providers, and we receive what you send us there. Your enquiry is handled the same way as a form submission.',
                },
                {
                    title: 'Technical information kept by our providers',
                    description: 'Our hosting and media providers process your IP address and browser information to deliver pages and media, and keep standard server logs for security and diagnostics. We do not maintain analytics of our own.',
                },
                {
                    title: 'What we deliberately do not collect',
                    description: 'No advertising identifiers, no cross-site tracking, no social-media account linking, no payment or card information through this site, and no sensitive details such as health or religious information \u2014 please do not send these through a form.',
                },
            ],
            note: 'We receive enquiries from adults acting for themselves or for an organisation. We do not knowingly collect information from children, and we do not ask for it.',
        },
        {
            id: 'how-we-use',
            title: 'How we use your information',
            body: [
                'Your information is used for one of a small number of purposes, and each one has a lawful basis under data-protection law:',
            ],
            definitions: [
                { term: 'Respond to your enquiry', description: 'Reading your message, pricing and scoping the work, and replying. Basis: steps taken at your request before entering a contract.' },
                { term: 'Deliver a project', description: 'Coordinating shoot dates, locations, crew, and deliverables. Basis: performance of our contract with you.' },
                { term: 'Keep the site working and secure', description: 'Preventing form abuse, diagnosing faults, and applying updates. Basis: our legitimate interest in a reliable, safe service.' },
                { term: 'Legal and accounting records', description: 'Keeping agreements and records we are required to retain. Basis: compliance with a legal obligation.' },
            ],
            note: 'We do not send marketing email. We may write to you about a project we have made together \u2014 post-delivery revisions, file enquiries, or questions about the work.',
        },
        {
            id: 'cookies',
            title: 'Cookies and local storage',
            body: [
                'This site sets no advertising or analytics cookies. It uses exactly three browser-stored items, all of which come from us:',
            ],
            items: [
                { title: 'A security check', description: 'A temporary cookie used on form pages to protect against forged requests. It expires on its own and holds no information about you.' },
                { title: 'An administrator session', description: 'If a member of our team signs in to the studio admin, a session cookie keeps them signed in for up to seven days. Visitors never receive it.' },
                { title: 'A dismissal flag', description: 'When you dismiss the cookie notice, a small local-storage entry records that \u2014 so we can stop showing it.' },
            ],
            note: 'Because none of these track you, there is no consent banner to click and no preference centre to manage.',
        },
        {
            id: 'sharing',
            title: 'When we share information',
            body: [
                'We do not sell, rent, or trade personal information. Two narrow situations are worth being explicit about, because they are easy to misread:',
            ],
            items: [
                {
                    title: 'Administrators can read enquiries',
                    description: 'Enquiries are visible only to signed-in members of our team. We do not grant outside access to the studio admin.',
                },
                {
                    title: 'Service providers process data on our behalf',
                    description: 'The providers listed below handle information under their own terms and privacy practices. Where payment for a production is arranged through a bank or mobile-money provider, that provider sees the transaction details it needs.',
                },
            ],
        },
        {
            id: 'providers',
            title: 'Service providers',
            body: [
                'A small number of companies keep this site and its enquiries working. None of them are advertising or data-broker services.',
            ],
            items: [
                { title: 'Vercel', description: 'Hosts the website and runs the code. Request logs are kept for security and diagnostics.' },
                { title: 'MongoDB Atlas', description: 'Stores enquiries, plus the public content shown on the site such as projects, photography, clients, and team details.' },
                { title: 'Cloudinary', description: 'Hosts images and video. Media is requested through our own domain, and requests pass through the visitor\u2019s browser to Cloudinary\u2019s content network.' },
                { title: 'WhatsApp (Meta)', description: 'Carries messages if you choose to contact us on WhatsApp, under WhatsApp\u2019s terms.' },
            ],
            note: 'Some of these providers run servers outside your country. By sending us information you understand it may be transferred to and stored in another country with its own data-protection rules.',
        },
        {
            id: 'footage',
            title: 'Footage, photographs, and people in our films',
            body: [
                'Video and photography are the core of our work, and the people in frame matter more than the files. Our practice:',
            ],
            items: [
                { title: 'Access', description: 'Access to raw footage and edited masters is limited to the members of our team working on that project.' },
                { title: 'Consent', description: 'Where a production is of identifiable people, we follow the consent practice agreed with the client for that shoot.' },
                { title: 'Publishing', description: 'We publish a project or someone\u2019s photographs on this site or on our social channels only when the client agrees, or when the material was produced for public use in the first place.' },
                { title: 'Requests', description: 'If a subject asks us to take down published material, write to us. We can remove a specific image or film quickly \u2014 it is often a single database entry.' },
            ],
        },
        {
            id: 'retention',
            title: 'How long we keep information',
            body: [
                'Enquiries are kept for as long as they are useful to us \u2014 typically until our follow-up is complete, and otherwise no longer than three years. Enquiries can be deleted at any time from our admin.',
                'Project records, including footage and deliverables, are kept for as long as our working relationship and any agreed archiving period require. Nothing is kept indefinitely without a reason, and deletions are real: removing a record removes it from the database.',
            ],
        },
        {
            id: 'security',
            title: 'How we protect it',
            body: [
                'Enquiry forms are validated, rate-limited, and protected by a request-forgery check. Our databases and media are hosted by providers that encrypt traffic in transit, and access to our admin is restricted to our team with individual sign-ins.',
                'No system is perfectly secure, but the amount we hold is small \u2014 which is itself a form of protection. If a breach ever puts your information at risk, we will tell you and any relevant authority as the law and the circumstances require.',
            ],
        },
        {
            id: 'your-rights',
            title: 'Your rights',
            body: [
                'Subject to where you live, you may have the right to:',
            ],
            items: [
                { title: 'Know and access', description: 'Ask whether we hold information about you and receive a copy.' },
                { title: 'Correct', description: 'Have inaccurate information corrected.' },
                { title: 'Delete', description: 'Ask us to delete your enquiry or other information we hold about you, where we have no ongoing legal reason to keep it.' },
                { title: 'Restrict or object', description: 'Ask us to stop certain uses, including any use based on our legitimate interests.' },
                { title: 'Complain', description: 'Lodge a complaint with the data-protection authority in your country.' },
            ],
            note: `${LEGAL.responsePromise} To make a request, use the contact details at the end of this page and tell us what you would like us to do.`,
        },
        {
            id: 'changes',
            title: 'Changes to this policy',
            body: [
                `This policy reflects how ${SITE.name} works as of ${LEGAL.platformLastUpdated}. If the site changes in a way that affects it \u2014 a new provider, a new kind of information \u2014 we will update this page and revise the effective date and version shown at the top.`,
            ],
        },
    ],
    contact: {
        title: 'Questions about privacy',
        body: 'For anything in this policy \u2014 access, correction, deletion, a takedown request, or simply a question \u2014 write to us and we will respond.',
    },
};

export const TERMS_PAGE = {
    hero: {
        eyebrow: 'Legal',
        title: 'Terms of Use',
        subheading:
            'The general terms for using this website, and the principles that sit behind the way we work, price, and deliver projects.',
    },
    intro: [
        `These Terms of Use govern your access to ${SITE.name} and its content. By using the site you agree to them. If you do not, please stop using the site.`,
        'They are the baseline for everyone. A production always has its own written agreement on top of them \u2014 signed quotes, scopes, or contracts \u2014 and that agreement wins if it differs from anything here.',
    ],
    summary: {
        title: 'The short version',
        items: [
            { title: 'Look, read, enjoy', description: 'Browse freely. Personal, non-commercial use of the site is welcome.' },
            { title: 'Our work is our work', description: 'Films and photographs are protected. Copying or republishing needs our permission.' },
            { title: 'Agreements win', description: 'Where a signed project agreement says otherwise, the agreement governs.' },
            { title: 'Made in good faith', description: 'We describe things honestly and deliver with care, but we do not promise perfection.' },
        ],
    },
    sections: [
        {
            id: 'who-we-are',
            title: 'About these terms',
            body: [
                `These Terms of Use are published by ${SITE.legalName} ("${SITE.name}", "we", "us"). They may be revised from time to time; the effective date and version at the top of this page show which version you are reading, and the version in force when you use the site is the one that applies.`,
                'We may also change, suspend, or withdraw parts of the site \u2014 a portfolio entry, a service page \u2014 at any time and without notice.',
            ],
        },
        {
            id: 'using-the-site',
            title: 'Using this website',
            body: [
                'The site is provided for information about our studio and our work. You are welcome to read it, share links to it, and use it to get in touch.',
                'When using the site you agree not to:',
            ],
            items: [
                { title: 'Interfere with it', description: 'Attempt to disrupt, overload, or probe the site or its servers, or bypass any access restriction.' },
                { title: 'Submit abuses', description: 'Use the enquiry forms for spam, automated submissions, or content that is illegal, deceptive, or infringes someone else\u2019s rights.' },
                { title: 'Republish the work', description: 'Copy, resell, or republish our films, photographs, or written content without written permission.' },
            ],
            note: 'We may block access or refuse submissions that breach these rules.',
        },
        {
            id: 'portfolio',
            title: 'Our portfolio',
            body: [
                'The films, photographs, client marks, and text on this site are here to show our work. They are not free to reuse.',
            ],
            items: [
                { title: 'Written ownership', description: 'The site, its design, and its content belong to AniLine or to the parties who licensed them to us, and are protected by copyright and related laws.' },
                { title: 'Client trademarks', description: 'Client names and logos appear with permission and remain the property of their owners. Their presence is not an endorsement of any particular claim on our behalf.' },
                { title: 'Embedding', description: 'You may share links to our work and embed our own public social or video posts using the platforms\u2019 native embed tools. Anything beyond that needs our written permission.' },
                { title: 'Permissions', description: 'For press, organisations, or anyone who wants to use our material, write to us \u2014 permissions are usually straightforward to arrange.' },
            ],
        },
        {
            id: 'projects-and-pricing',
            title: 'Projects, quotes, and pricing',
            body: [
                'Nothing on this site is an offer capable of acceptance, and no price shown is a final quotation. Discussions, forms, and WhatsApp messages are a starting point.',
                'A project exists only under a written agreement \u2014 a signed quote, a written scope, a purchase order, or a contract \u2014 that sets out deliverables, price, payment schedule, timeline, and the responsibilities of each side. Until then, we owe nothing and you owe nothing.',
                'Unless a project agreement says otherwise, prices exclude applicable taxes, third-party costs such as permits or licensed music, and expenses such as travel or accommodation.',
            ],
        },
        {
            id: 'responsibilities',
            title: 'Your responsibilities as a client',
            body: [
                'Projects run on both sides being clear. Where a project agreement makes you responsible, please treat it as part of the work:',
            ],
            items: [
                { title: 'Accurate briefs', description: 'Give us accurate information about the project, the audience, and any properties, people, or locations involved.' },
                { title: 'Permissions and access', description: 'Obtain any consents, permits, releases, or property permissions the shoot needs, when the agreement says so.' },
                { title: 'Materials', description: 'Ensure any footage, images, logos, or music you supply may lawfully be used, and clear the necessary rights.' },
                { title: 'Feedback on time', description: 'Respond to review rounds and approve deliverables by the agreed dates, so timelines can hold.' },
            ],
        },
        {
            id: 'rights-and-licences',
            title: 'Ownership and licences in our work',
            body: [
                'Unless a project agreement says otherwise, these are our standard positions. The signed agreement always takes precedence.',
            ],
            items: [
                { title: 'Your input stays yours', description: 'You keep ownership of the materials, information, and logos you supply to us.' },
                { title: 'Deliverables are licensed', description: 'We retain copyright in the films and photographs we produce and grant you a licence to use the final deliverables within the scope agreed for the project.' },
                { title: 'Portfolio use', description: 'We may show a finished project on our site and channels unless the agreement or your written instructions say not to.' },
                { title: 'Raw footage', description: 'Project files and raw footage remain ours unless the agreement includes them.' },
                { title: 'Credit', description: 'Where the agreement asks for a credit, please display it as agreed.' },
            ],
        },
        {
            id: 'third-party',
            title: 'Third-party links and services',
            body: [
                'This site links to external platforms such as Facebook, YouTube, and WhatsApp, and requests media from our hosting providers. We do not control those services, and their terms and privacy practices are their own. A link is not an endorsement.',
            ],
        },
        {
            id: 'availability',
            title: 'Availability',
            body: [
                'We keep the site online and up to date as a studio, not as a 24/7 service. Pages may be unavailable, cached, or incomplete for short periods \u2014 during updates, maintenance, or events outside our control.',
            ],
        },
        {
            id: 'liability',
            title: 'Limitation of liability',
            body: [
                'We prepare the site carefully, but we provide it "as is" and without warranties of any kind, to the fullest extent the law allows. In particular, we cannot promise that it is error-free, uninterrupted, or up to date at every moment.',
                'To the extent the law permits, AniLine is not liable for any indirect, incidental, or consequential loss arising from your use of the site, or for any loss caused by third-party services linked from it.',
                'Nothing in these terms limits liability that cannot be excluded by law.',
            ],
        },
        {
            id: 'privacy',
            title: 'Privacy',
            body: [
                'How we collect and use personal information is described in our Privacy Policy. The forms on this site, what our providers see, and your rights are all explained there.',
            ],
        },
        {
            id: 'general',
            title: 'General',
            body: [
                'If any part of these terms is found unenforceable, the rest continues to apply.',
                `These terms are made under the laws of ${SITE.location.country}, and disputes relating to the site itself will be handled by its courts \u2014 unless a signed project agreement provides for something else.`,
                'For anything about these terms, use the contact details at the end of this page.',
            ],
        },
    ],
    contact: {
        title: 'Questions about these terms',
        body: 'If something here is unclear, or you need permission to use our material, write to us and we will respond.',
    },
};