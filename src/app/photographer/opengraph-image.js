import { ogAlt, ogContentType, ogSize } from '@/lib/og';
import { roleCard } from '@/lib/ogCards';
import { ROLES } from '@/content/roles';

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return roleCard(ROLES.photographer);
}
