/**
 * Studio notes: practical writing for the people who commission, crew and publish documentary
 * work. Held in the repo rather than the database because each article is edited deliberately,
 * dated, and never scheduled — and because static routes build ahead of time.
 *
 * Every claim here is either about how AniLine works or general practice; nothing invents a
 * quotation, a statistic, or a named source.
 */

export const ARTICLES_UPDATED = '2026-11-08';

const AUTHOR = { name: 'AniLine Production' };

/** @type {object[]} */
export const ARTICLES = [
  {
    slug: 'filming-in-coxs-bazar-field-guide-for-international-crews',
    title: 'Filming in Cox\u2019s Bazar: A Field Guide for International Crews',
    seoTitle: 'Filming in Cox\u2019s Bazar: Field Guide for International Crews',
    description:
      'What visiting documentary crews should plan before filming in Cox’s Bazar — access, permits, travel days, heat, language, consent and a realistic schedule for the Rohingya response.',
    excerpt:
      'Access, heat, travel days and language: the practical planning that decides whether a field shoot in Cox’s Bazar works.',
    datePublished: '2026-11-08',
    dateModified: '2026-11-08',
    section: 'Field production',
    tags: ['Cox’s Bazar', 'Rohingya response', 'documentary production', 'field shooting'],
    hero: null,
    sections: [
      {
        heading: 'Plan access before you book flights',
        paragraphs: [
          'Most production problems in Cox’s Bazar are not camera problems. They are access problems discovered too late to fix. Programs, sites and communities each have their own gatekeepers — organizations, site management, community representatives — and each may take days or weeks to respond.',
          'Start the access conversation when the shoot is still a date range, not a shot list. Tell each contact what you want to film, who will be on camera, how the material will be used, and when you need a decision. An answer that arrives after you have flown in is worth nothing.',
        ],
      },
      {
        heading: 'Treat travel days as production days',
        paragraphs: [
          'The distance on a map from the airport to a site is misleading. Vehicle travel, checkpoints and the walk from the road to a house all consume the day. A schedule that books two locations in one morning will usually deliver one.',
          'Build in a buffer day at the start for briefing and equipment checks, and a buffer at the end for re-shoots and wrap. Crews that skip both tend to return with coverage that looks hurried because it was.',
        ],
      },
      {
        heading: 'Shoot for the heat and the light',
        paragraphs: [
          'Heat and humidity affect people, batteries and lenses more than any creative decision you make. Schedule interviews for the hours when people are fresh, not when the sun is at its worst, and give the crew real breaks.',
          'The usable light windows are short and predictable. Plan exteriors for the morning or late afternoon and keep a simple, self-contained interview setup for interiors, where most of the story usually lives.',
        ],
      },
      {
        heading: 'Work through language, not around it',
        paragraphs: [
          'Interviews conducted in English lose nuance and often lose the people who matter most. Work with a translator who can interpret in the moment and who understands that a good interview is not a word-for-word transfer.',
          'Record interpreter speech as carefully as the interview itself, keep timings, and ask for translation notes for the edit. Your editor will thank you, and so will your audience.',
        ],
      },
      {
        heading: 'Agree consent before the lens opens',
        paragraphs: [
          'People in this region have been filmed often, and not always well. Agree with the person in front of the camera — in their language — what will be filmed, where it will appear, and that they can stop or withdraw.',
          'A consent process agreed with the commissioning organization in advance should be repeated on site, not assumed from a form. If the material will be used for fundraising, say so clearly at the time.',
        ],
      },
      {
        heading: 'A schedule that can actually be shot',
        paragraphs: [
          'A realistic first visit covers one community and one or two interview subjects per day, with b-roll gathered in between. Add translation and travel, and the week is full. Multi-location weeks need a second camera and often a second crew.',
          'If your story needs more, it almost always needs more days rather than longer days. Fatigue shows on screen.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Do I need a permit to film in Cox’s Bazar?',
        a: 'Access requirements depend on the organization and site. Some programs require prior written permission, and formal permits or clearances are typically the commissioning production’s responsibility. AniLine advises on what to ask and coordinates with community contacts, but cannot obtain permits on your behalf.',
      },
      {
        q: 'How many days should a first documentary visit plan for?',
        a: 'For a short documentary or campaign film with one community and several interview subjects, plan a week on the ground including travel, with a buffer day at each end. More locations or more subjects need more days, not longer ones.',
      },
      {
        q: 'What languages are used on set?',
        a: 'English, Bangla and Rohingya are all in play. Interviews are best conducted in the speaker’s own language with interpretation, and translation notes are prepared for the edit.',
      },
      {
        q: 'Can I bring my own crew and use AniLine only for local support?',
        a: 'Yes. A visiting crew can add AniLine as camera operator, fixer or field producer, or use us for post-production on footage they shot themselves.',
      },
    ],
    relatedServices: ['documentary-video-production', 'charity-ngo-video-production'],
    related: ['what-ngos-should-ask-before-commissioning-a-documentary'],
  },
  {
    slug: 'what-ngos-should-ask-before-commissioning-a-documentary',
    title: 'What NGOs Should Ask Before Commissioning a Documentary',
    seoTitle: 'What NGOs Should Ask Before Commissioning a Documentary',
    description:
      'A practical checklist for NGOs and humanitarian organizations commissioning a documentary or campaign film — purpose, audience, consent, access, deliverables and evaluating the edit.',
    excerpt:
      'The questions that separate a documentary that gets used from one that sits in a shared drive — asked before the budget is approved.',
    datePublished: '2026-11-08',
    dateModified: '2026-11-08',
    section: 'Commissioning',
    tags: ['NGO video', 'documentary production', 'campaign film', 'commissioning'],
    hero: null,
    sections: [
      {
        heading: 'Start with what the film must do',
        paragraphs: [
          'Most briefs describe what the film should contain. Far fewer describe what it must achieve. Those are different documents, and only the second one helps a production team make decisions when the schedule inevitably changes.',
          'Write down the single change you want in the audience: a donation, a policy conversation, a share, a shift in how a community is seen. If two audiences want two different outcomes, that is usually two films.',
        ],
      },
      {
        heading: 'Name the audience and the channel',
        paragraphs: [
          'A film for a donor report is not the same film as a film for a public social campaign, even if both tell the same story. Length, language, subtitles and pace all follow from where the finished piece will live.',
          'Commission with a primary channel in mind, and ask for cut-downs of that piece for secondary channels. Shooting for a three-minute web film and delivering a thirty-second social cut from the same footage is routine; shooting for both at once without a plan is not.',
        ],
      },
      {
        heading: 'Be explicit about consent',
        paragraphs: [
          'Consent is not a form at the end of a shoot. It is a process you and the production team agree before the first day: who will be asked, in which language, what they will be told, and how they can withdraw.',
          'Organizations working with vulnerable groups often have their own safeguarding policy. Put it in the brief. A production team that has not read it before arriving will either improvise on the day or be blocked by it.',
        ],
      },
      {
        heading: 'Own the access conversation',
        paragraphs: [
          'The organization usually has the relationships and the mandate to arrange access; the production team has the schedule. Agree who approaches each site, how far in advance, and who is on call on shoot days when a site changes its mind.',
          'Where access requires travel approvals or official permission, start early — and accept that a delayed shoot is cheaper than a rushed one.',
        ],
      },
      {
        heading: 'Write deliverables as files, not adjectives',
        paragraphs: [
          '“A high-quality documentary” is not a deliverable. A running time, the language and subtitle tracks, aspect ratios, the number of social cut-downs, stills, and the formats required by each platform are the deliverables.',
          'Add who receives the raw footage and project files, and under what terms. This is the clause most often argued about at the end of a project, so settle it at the beginning.',
        ],
      },
      {
        heading: 'Review with timecodes, not impressions',
        paragraphs: [
          'When the first cut arrives, feedback such as “make it more emotional” gives an editor no path forward. Comments tied to timecodes — “at 02:14 this scene undercuts the point; can the next interview answer it?” — do.',
          'Agree how many review rounds are included, who has final approval inside the organization, and which comments win when departments disagree. One approver saves weeks.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How much does a documentary cost?',
        a: 'There is no single price: days of filming, locations, crew size and post-production determine the budget. Ask for a quote built from those variables so the scope can be adjusted rather than guessed at.',
      },
      {
        q: 'How long does a documentary take to make?',
        a: 'A short documentary or campaign film is usually measured in months from brief to delivery, with the edit often the longest phase. A written schedule is the only reliable answer.',
      },
      {
        q: 'Do we get the raw footage?',
        a: 'Only when the written agreement includes it. Otherwise you receive the edited deliverables under an agreed licence, while project files and raw footage stay with the production team.',
      },
      {
        q: 'Can the film be used on social media as well as in reports?',
        a: 'Yes, if the brief says so from the start. Ask for cut-downs and vertical versions as named deliverables so the same shoot covers both uses.',
      },
    ],
    relatedServices: [
      'charity-ngo-video-production',
      'documentary-video-production',
      'video-editing',
    ],
    related: ['community-led-production-ethics-of-representing-rohingya-stories'],
  },
  {
    slug: 'community-led-production-ethics-of-representing-rohingya-stories',
    title: 'Community-Led Production: The Ethics of Representing Rohingya Stories',
    seoTitle: 'Community-Led Production: Ethics of Representing Rohingya Stories',
    description:
      'What community-led production means in practice when filming Rohingya stories — who directs, who is credited, how consent works, and why a local crew changes the film.',
    excerpt:
      'Who holds the camera matters — but so do who holds the interview, the edit and the credit. What community-led production means for Rohingya stories.',
    datePublished: '2026-11-08',
    dateModified: '2026-11-08',
    section: 'Ethics',
    tags: ['Rohingya', 'community-led production', 'documentary ethics', 'representation'],
    hero: null,
    sections: [
      {
        heading: 'What “community-led” actually means',
        paragraphs: [
          'Community-led is not a label you add to a production that hired one local crew member. It describes who makes the decisions: whose framing survives the edit, who speaks for the story, and who is visible in the credits.',
          'AniLine is a Rohingya-led studio. We write from inside that experience, while being honest that representation is never a single voice — the community is as varied as any other, and no studio speaks for all of it.',
        ],
      },
      {
        heading: 'Access is not consent',
        paragraphs: [
          'Permission from an organization is not permission from the person being filmed. A site may be open to a crew while the people living there are not. Treat those as separate questions with separate answers.',
          'Ask the person in front of the lens in their own language, explain where the material will be published, and leave them a way to change their mind. When someone is used to being filmed, that does not make the filming easier; it makes it more important.',
        ],
      },
      {
        heading: 'Let people be more than a cause',
        paragraphs: [
          'Stories about displacement often ask the people in them to be symbols: suffering, resilience, gratitude. Symbols are easy to share and hard to return to. People are more complicated than that, and the film should be too.',
          'Practically, that means interviews are not only about hardship, scenes include the ordinary business of life, and edits do not leave a single tone in the room. Ask yourself: if this person watched the cut, would they recognise themselves as a whole person?',
        ],
      },
      {
        heading: 'Who edits, credits and earns',
        paragraphs: [
          'Local involvement that stops at carrying gear is not community-led. Decide early who edits, who is credited, and whether local crew are paid at the rate of their contribution rather than the rate of their passport.',
          'Where an external director is in charge, that can still be a good film. It should just be described honestly, with the local team’s role stated clearly rather than absorbed into “the crew”.',
        ],
      },
      {
        heading: 'Plan for what happens after the film',
        paragraphs: [
          'People filmed today may be living with the consequences of the film for years. Agree with them and with the commissioning organization how the film will be distributed, whether it can be reused in future campaigns, and how they can reach the team if they want something changed.',
          'A takedown request should be answerable quickly. In our own practice, publishing a project on this site only happens with the client’s agreement — and removing specific material is usually a single database entry.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Should Rohingya stories only be filmed by Rohingya crews?',
        a: 'No single rule covers every project. What matters is who makes the decisions, whether consent is real, whether people are portrayed as whole people, and whether local contribution is credited and paid fairly.',
      },
      {
        q: 'How should consent be handled with people who cannot write?',
        a: 'Consent does not require a signature. It requires understanding: an explanation in the person’s own language, time to ask questions, and a way to withdraw. Write down when and how that explanation was given so the organization can answer for it later.',
      },
      {
        q: 'How can we make sure a film is used ethically after delivery?',
        a: 'Agree distribution terms with the people filmed and with the commissioning organization in the brief, and keep a route for them to reach the production team if they want the material changed or removed.',
      },
      {
        q: 'Can AniLine co-produce with an international production?',
        a: 'Yes. We take part as local crew, field producers, camera operators and editors. Co-productions are scoped with the roles, credits and rights agreed in writing before shooting.',
      },
    ],
    relatedServices: [
      'documentary-video-production',
      'photography',
      'charity-ngo-video-production',
    ],
    related: ['filming-in-coxs-bazar-field-guide-for-international-crews'],
  },
].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

/** @param {string} slug */
export function getArticle(slug) {
  return ARTICLES.find((a) => a.slug === slug) || null;
}

export function listArticles() {
  return ARTICLES;
}

export function articleAuthor() {
  return AUTHOR;
}

/** @param {object} article */
export function buildArticleMetadata(article) {
  return {
    title: `${article.seoTitle} | AniLine Journal`,
    description: article.description,
    path: `/journal/${article.slug}`,
    ogType: 'article',
    article: {
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [AUTHOR.name],
      section: article.section,
      tags: article.tags,
    },
  };
}
