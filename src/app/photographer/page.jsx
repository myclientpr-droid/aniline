import RolePage from '@/components/roles/RolePage';
import { ROLES, buildRoleMetadata } from '@/content/roles';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata(buildRoleMetadata(ROLES.photographer));

export default function PhotographerPage() {
  return <RolePage role={ROLES.photographer} />;
}
