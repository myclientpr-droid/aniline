export const SITE = {
    name: 'AniLine',
    legalName: 'AniLine Production',
    tagline: 'Crafting Stories One Frame at a Time',
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
        whatsapp: '',
        address: '',
    },
    social: {
        facebook: '',
        instagram: '',
        youtube: '',
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