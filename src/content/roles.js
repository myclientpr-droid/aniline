/**
 * Landing pages for the people a buyer actually searches for: a videographer, a camera operator,
 * an editor, a photographer, or a whole field team.
 *
 * Copy is held in the repo, not the database, because these pages are written once and revised
 * deliberately — and because each one must answer a different query. They share a template and
 * nothing else: different audience, different deliverables, different approach, different FAQs.
 * No city in the title or h1; location lives in the body for readers who need it.
 */

export const ROLES_UPDATED = '2026-11-08';

/** Wording used by the "Hire us as…" links in the footer, services page and partner section. */
export const ROLE_LINKS = [
  { slug: 'videographer', label: 'Videographer' },
  { slug: 'cameraman', label: 'Cameraman' },
  { slug: 'video-editor', label: 'Video Editor' },
  { slug: 'photographer', label: 'Photographer' },
  { slug: 'media-team', label: 'Media Team' },
];

export const ROLES = {
  videographer: {
    slug: 'videographer',
    eyebrow: 'Videographer',
    h1: 'Videographer for Documentary and NGO Projects',
    seoTitle: 'Videographer for Documentary & NGO Projects',
    serviceName: 'Videography',
    description:
      'A videographer who comes to your project, shoots to a brief, and delivers finished films — documentaries, campaign videos and program stories filmed by a Rohingya-led studio.',
    intro: [
      'When a production needs a videographer rather than an outside crew, we travel to the story. AniLine films documentary, humanitarian and campaign work for organizations and independent producers who want someone on the ground who already understands the people and places in frame.',
      'We shoot the whole arc: interviews, observational scenes, b-roll, drone or second-camera support when the story asks for it. Every day of filming is planned against your edit, so coverage is not left to luck in the timeline.',
    ],
    forWhom: [
      {
        title: 'Organizations without a media team',
        description:
          'You have a program worth filming and a distribution plan, but no camera operator of your own.',
      },
      {
        title: 'Independent documentary producers',
        description:
          'You have a story and a schedule; you want a local videographer who can carry the look from the first interview to the final scene.',
      },
      {
        title: 'Agencies briefing from abroad',
        description:
          'You are directing remotely and need footage that arrives organised, logged and ready to cut.',
      },
    ],
    deliverables: [
      'Filmed interviews with clean, separate audio',
      'Observational and b-roll coverage per the shot list',
      'B-roll logs and clip notes for your editor',
      'A first-cut sequence or fully edited film, depending on the brief',
      'Footage and masters handed over with usage agreed in writing',
    ],
    approach: [
      {
        title: 'Pre-production on paper',
        description:
          'We read the brief, interview people expected to appear, and draft a shooting plan with locations and light windows.',
      },
      {
        title: 'Shoot days built around the edit',
        description:
          'Each scene is shot with the sequence it belongs to in mind, not as isolated clips.',
      },
      {
        title: 'Review against the story',
        description:
          'We screen through the footage and, if scoped, cut a sequence so you can judge the story before post moves on.',
      },
      {
        title: 'Deliver what you asked for',
        description:
          'Files, formats and filenames agreed at the start, with every clip where you expect to find it.',
      },
    ],
    relatedServices: [
      'documentary-video-production',
      'charity-ngo-video-production',
      'promotional-video-production',
    ],
    workCategories: ['Documentary', 'NGO and Charity'],
    faqs: [
      {
        q: 'Can you travel outside Bangladesh for a shoot?',
        a: 'Yes. AniLine is based in Cox’s Bazar, Bangladesh, and takes assignments internationally. Travel, visas and accommodation are scoped per production, and we ask for those details early so the schedule holds.',
      },
      {
        q: 'Do you work alone or bring a crew?',
        a: 'Both. A single videographer can cover interviews and observational scenes well. Productions with re-enactments, multiple locations per day or live events need a larger crew, and we will say so in the quote.',
      },
      {
        q: 'Will the footage be in English?',
        a: 'Interviews can be conducted in English, Bangla or Rohingya. We provide translation notes for interviews we recorded in a language your editor does not speak.',
      },
      {
        q: 'What camera and audio do you use?',
        a: 'Digital mirrorless bodies, prime and zoom lenses, lavalier and shotgun microphones. Exact kit is confirmed in the production plan once we know the locations and lighting.',
      },
      {
        q: 'Can we keep the raw footage?',
        a: 'Raw footage is handed over only when the written agreement includes it. Otherwise the edited deliverable is licensed to you and project files stay with us, as set out in our Terms of Use.',
      },
    ],
    relatedServicesLabel: 'Documentary, NGO and campaign film production. See our services',
    updated: ROLES_UPDATED,
  },

  cameraman: {
    slug: 'cameraman',
    eyebrow: 'Camera crew',
    h1: 'Cameraman and Local Camera Crew for International Productions',
    seoTitle: 'Cameraman & Local Camera Crew for International Productions',
    serviceName: 'Camera operation and local crew',
    description:
      'Camera operators, second camera and ground crew for productions filming in Bangladesh and the Rohingya response — gear, access and logistics handled by a crew that lives there.',
    intro: [
      'International crews arriving in Cox’s Bazar usually bring the director and the story. What they need on arrival is a camera operator who knows the light, the roads and the faces — and who can keep rolling when the plan changes at the gate.',
      'AniLine operates as camera operator, second-unit crew or full local department for visiting productions. We handle the practical layer: location access, permits guidance, transport, translation on set, and footage organised the way your DIT expects.',
    ],
    forWhom: [
      {
        title: 'Documentary directors travelling in',
        description:
          'You need a reliable operator for the days you are on the ground, and someone to carry continuity between visits.',
      },
      {
        title: 'Humanitarian and news crews',
        description:
          'Fixed windows, changing access: you need a crew that can move fast and still bring back broadcast-ready coverage.',
      },
      {
        title: 'Regional production companies',
        description:
          'You are coordinating several shoots across the region and want a Bangladesh crew unit you can brief once and trust again.',
      },
    ],
    deliverables: [
      'Camera operation to your shot brief or DIT workflow',
      'Second camera and support crew when the schedule needs it',
      'Set translation and coordination with interviewees',
      'Footage organised, backed up and named before departure',
      'B-roll that matches your existing production style',
    ],
    approach: [
      {
        title: 'Brief before arrival',
        description:
          'We take your shot list and access notes in advance and flag what the locations will or will not allow.',
      },
      {
        title: 'Reconnaissance on the ground',
        description:
          'Locations are checked ahead of the shoot day for light, sound and safe movement.',
      },
      {
        title: 'Operate to your language',
        description:
          'Frame sizes, coverage rules and file naming follow the production’s own conventions, not ours.',
      },
      {
        title: 'Wrap with the files in order',
        description:
          'Footage is copied, verified and handed over — or uploaded — before the crew leaves.',
      },
    ],
    relatedServices: ['documentary-video-production', 'post-production', 'video-editing'],
    workCategories: ['Documentary', 'NGO and Charity', 'Creative Production'],
    faqs: [
      {
        q: 'Do you supply your own camera and sound gear?',
        a: 'Yes. We shoot on digital mirrorless bodies with prime and zoom lenses, plus lavalier and shotgun audio. If your production specifies other kit, we agree the source and the cost in the production plan.',
      },
      {
        q: 'Can you help with permits and camp access?',
        a: 'We can advise on what a location requires and who to speak to, and we coordinate access through the community contacts we work with. Formal permits are the production’s responsibility and must be arranged in advance.',
      },
      {
        q: 'Do you work as a fixer as well as an operator?',
        a: 'Yes, within limits. We handle local transport, translation and coordination on set. We do not handle security or armed-risk advice; that comes from your own team.',
      },
      {
        q: 'How do you handle footage security?',
        a: 'Footage is copied to two separate drives and verified before wrap. If a production wants encrypted storage or off-site upload, we arrange it in advance.',
      },
      {
        q: 'What languages can the crew work in?',
        a: 'English, Bangla and Rohingya. We can interpret interviews on the day and provide transcripts or translation notes for your edit.',
      },
    ],
    relatedServicesLabel: 'Documentary and field production services we shoot for',
    updated: ROLES_UPDATED,
  },

  'video-editor': {
    slug: 'video-editor',
    eyebrow: 'Editing',
    h1: 'Video Editor for Documentary and Campaign Footage',
    seoTitle: 'Video Editor for Documentary & Campaign Footage',
    serviceName: 'Video editing and post-production',
    description:
      'Editing and finishing for footage you have already shot — story assembly, pacing, colour, sound and subtitles delivered for broadcast, web or campaign use.',
    intro: [
      'Some projects do not need a camera, they need an editor. You have the interviews, the scenes, maybe the b-roll from another crew — and a deadline with a video to show for it.',
      'AniLine edits documentary, NGO and campaign footage for organizations and producers. We work from your selects or from raw media, assemble the story, and carry it through colour and sound to the formats you will actually publish.',
    ],
    forWhom: [
      {
        title: 'Organizations with footage in hand',
        description:
          'The filming happened months ago and the media is sitting on a hard drive waiting for someone to make sense of it.',
      },
      {
        title: 'Producers finishing a cut',
        description:
          'You have a rough assembly and need a documentary editor to find the structure and pace.',
      },
      {
        title: 'Teams without post capacity',
        description:
          'You produce content regularly and need a reliable editor for each cycle rather than one heroic scramble.',
      },
    ],
    deliverables: [
      'Story assembly from raw footage or selects',
      'Interview transcript-driven edit and subtitle pass',
      'Colour correction and light grading',
      'Sound clean-up, music bed and mix',
      'Delivery in formats agreed for broadcast, web and social',
    ],
    approach: [
      {
        title: 'Read the footage before cutting it',
        description:
          'Interviews are transcribed and reviewed so the first assembly follows what people actually said.',
      },
      {
        title: 'Structure first, polish later',
        description:
          'We build the story arc before any colour or effects, so revisions hit the edit and not the polish.',
      },
      {
        title: 'Subtitles as a deliverable',
        description:
          'English subtitles are cut with the edit, not bolted on at the end, so timing survives every revision.',
      },
      {
        title: 'Round-tripped for review',
        description:
          'Review cuts are shared with clip-accurate timecodes so feedback lands on the frame it is about.',
      },
    ],
    relatedServices: ['video-editing', 'post-production', 'documentary-video-production'],
    workCategories: ['Video Editing', 'Post-Production'],
    faqs: [
      {
        q: 'Which software do you edit in?',
        a: 'We cut in professional non-linear editors and work with common camera and phone formats. Final project files stay with us unless the agreement says otherwise, and deliverables can be handed over as ProRes, H.264 or platform-specific exports.',
      },
      {
        q: 'Can you edit footage shot by someone else?',
        a: 'Yes. Most of our editing work comes from footage shot by other crews. We ask for consistent clips, any interview notes, and access to the media so nothing gets transcoded badly on the way.',
      },
      {
        q: 'How much footage can you handle?',
        a: 'A campaign film from a day of interviews is routine. Large documentary archives are scoped per project with a viewing period before the edit starts.',
      },
      {
        q: 'Do you include subtitles and translations?',
        a: 'Yes. English subtitles are part of the standard edit. Bangla and Rohingya content is translated and verified with the speaker when possible.',
      },
      {
        q: 'How long does an edit take?',
        a: 'A short campaign film is typically measured in weeks, a long-form documentary in months. The timeline is fixed in writing before editing begins.',
      },
    ],
    relatedServicesLabel: 'Editing and post-production services',
    updated: ROLES_UPDATED,
  },

  photographer: {
    slug: 'photographer',
    eyebrow: 'Photography',
    h1: 'Photographer for Documentary, Event and Field Work',
    seoTitle: 'Photographer for Documentary, Event & Field Work',
    serviceName: 'Photography',
    description:
      'Documentary, event, portrait and program photography — delivered as stills alone or as a set with moving coverage, shot by a studio that knows the community it photographs.',
    intro: [
      'A photograph is often the first thing an audience sees of a program, a campaign or a family. We photograph with the same care we give a film: people in frame treated with respect, images edited and delivered ready to publish.',
      'AniLine covers documentary and field photography, events and ceremonies, portraits, and campaign stills. Where a project needs both, the photographer travels with the film crew and the images share a single look.',
    ],
    forWhom: [
      {
        title: 'Organizations documenting programs',
        description:
          'You need stills for reports, fundraising and the web that show real work and real people.',
      },
      {
        title: 'Schools and institutions',
        description:
          'Ceremonies, graduations and events photographed for archives and announcements.',
      },
      {
        title: 'Families and individuals',
        description: 'Weddings, portraits and milestones photographed with a documentary eye.',
      },
    ],
    deliverables: [
      'A curated, edited selection rather than every frame',
      'Colour-corrected, print- and web-ready files',
      'Organized folders by location or scene',
      'Double delivery when the shoot runs alongside a film',
      'Usage terms agreed in writing before the shoot',
    ],
    approach: [
      {
        title: 'Talk about the use',
        description:
          'Report, poster or album — the destination shapes which moments we chase and how the set is edited.',
      },
      {
        title: 'Work quietly in the scene',
        description:
          'We photograph without directing the moment where the story needs it to stay real.',
      },
      {
        title: 'Edit for the set',
        description:
          'Images are selected and sequenced so they tell something together, not just individually.',
      },
      {
        title: 'Deliver at size',
        description:
          'Files sized for print and screen, labelled, so your designer is not resizing everything.',
      },
    ],
    relatedServices: ['photography', 'charity-ngo-video-production', 'wedding-films'],
    workCategories: ['Photography', 'Documentary', 'Wedding'],
    faqs: [
      {
        q: 'Can we book a photographer and a videographer together?',
        a: 'Yes. For weddings, NGO events and coverage where the two are scoped together, the photographer works alongside our film crew and the stills and film share a consistent look.',
      },
      {
        q: 'How many photographs will we receive?',
        a: 'Deliverables are agreed as an edited set per shoot, typically in the dozens for an event and larger for field documentation. We send the best images, not every frame.',
      },
      {
        q: 'Do you photograph in refugee camps?',
        a: 'We photograph community programs in and around the camps when access is arranged with the relevant organizations. Consent from the people photographed is handled case by case and in line with the client’s practice.',
      },
      {
        q: 'What are the files delivered in?',
        a: 'High-resolution JPEG files for web, print and handover, with a lossless master format when the project specifies it.',
      },
      {
        q: 'Can you cover a wedding outside Cox’s Bazar?',
        a: 'Yes. We travel for weddings and events, and travel costs are quoted with the coverage rather than buried at the end.',
      },
    ],
    relatedServicesLabel: 'Photography and event coverage services',
    updated: ROLES_UPDATED,
  },

  'media-team': {
    slug: 'media-team',
    eyebrow: 'Media team',
    h1: 'Media Team for Multi-Day Field Coverage',
    seoTitle: 'Media Team for Multi-Day Field Coverage',
    serviceName: 'Embedded media team and field coverage',
    description:
      'An embedded media team for multi-day field visits, evaluations and events — interviews, b-roll, stills, transcripts and a finished package sized for your channels.',
    intro: [
      'A field visit or evaluation can produce weeks of raw material and nothing published, because nobody was set up to carry it from the field to the report. A media team fixes that: one crew that shoots, photographs, records, transcribes and edits as a single pipeline.',
      'AniLine works as that team for organizations and institutions — on site for consecutive days, filming interviews and scenes, collecting stills and audio, and returning with a package organized around where the material will be used, not just what was captured.',
    ],
    forWhom: [
      {
        title: 'NGOs and donor-funded programs',
        description:
          'Evaluation visits, project launches and ongoing program documentation across several sites.',
      },
      {
        title: 'Institutions and universities',
        description:
          'Field studies, conferences and research dissemination that need visual material alongside the write-up.',
      },
      {
        title: 'Organizations running events',
        description:
          'Multi-day events covered with interviews, coverage and same-week social edits.',
      },
    ],
    deliverables: [
      'Interview footage with clean audio and transcripts',
      'Stills alongside moving coverage, from one team',
      'A b-roll library logged and labelled for future use',
      'A short film and cut-downs for social and web',
      'Usage-cleared package, with consent practice agreed with your team',
    ],
    approach: [
      {
        title: 'One plan across the visit',
        description:
          'A schedule that covers interviews, locations and events without the crew chasing the itinery day by day.',
      },
      {
        title: 'Shared consent process',
        description:
          'Consent is agreed with the client before filming and confirmed on site, so people understand how their image is used.',
      },
      {
        title: 'Field-to-desk pipeline',
        description:
          'Media is organized, backed up and named as it is captured, so editors start on the day the visit ends.',
      },
      {
        title: 'One package, several uses',
        description:
          'Film, stills and social cut-downs land together, ready for the report as well as the campaign page.',
      },
    ],
    relatedServices: ['charity-ngo-video-production', 'photography', 'post-production'],
    workCategories: ['NGO and Charity', 'Documentary', 'Events'],
    faqs: [
      {
        q: 'How many people are in a media team?',
        a: 'A typical field visit runs with a videographer-editor pair, with a photographer joining for coverage-heavy events. The exact number is set by the days, locations and outputs in the brief.',
      },
      {
        q: 'Can the team work with our own communications staff?',
        a: 'Yes. We can work alongside your team, train them on capture for future visits, or take the field work entirely so your staff can focus on interviews and coordination.',
      },
      {
        q: 'How quickly can you deliver after a visit?',
        a: 'A short social cut can be delivered during the visit. A full package — film, stills and cut-downs — is typically measured in weeks after wrap, agreed in the brief.',
      },
      {
        q: 'Do you cover events outside your base?',
        a: 'Yes. We cover multi-day events, launches and ceremonies anywhere the project takes us, with travel and accommodation quoted separately.',
      },
      {
        q: 'How is consent for interviews handled?',
        a: 'We agree a consent process with you before filming and confirm it on site. Participants are told what will be filmed, where it will be used, and that they can withdraw — in a language they speak.',
      },
    ],
    relatedServicesLabel: 'NGO, charity and event production services',
    updated: ROLES_UPDATED,
  },
};

/** @param {string} slug */
export function getRole(slug) {
  return ROLES[slug] || null;
}

export function listRoles() {
  return Object.values(ROLES);
}

/** @param {object} role */
export function buildRoleMetadata(role) {
  return {
    title: `${role.seoTitle} | AniLine`,
    description: role.description,
    path: `/${role.slug}`,
  };
}
