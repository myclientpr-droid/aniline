import RolePage from '@/components/roles/RolePage';
import { ROLES, buildRoleMetadata } from '@/content/roles';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata(buildRoleMetadata(ROLES['media-team']));

export default function MediaTeamPage() {
  return <RolePage role={ROLES['media-team']} />;
}
