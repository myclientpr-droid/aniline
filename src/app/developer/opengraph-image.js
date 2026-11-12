import { ogContentType, ogSize } from '@/lib/og';
import { developerCard } from '@/lib/ogCards';
import { DEVELOPER_PAGE } from '@/lib/site';

// Bespoke rather than the shared `ogAlt`: this card shows a person, not the studio, and Next emits
// this export as the page's `og:image:alt`.
export const alt = `${DEVELOPER_PAGE.person.name} \u2014 ${DEVELOPER_PAGE.person.jobTitle}`;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return developerCard(DEVELOPER_PAGE.person);
}
