import RolePage from '@/components/roles/RolePage';
import { ROLES, buildRoleMetadata } from '@/content/roles';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata(buildRoleMetadata(ROLES.cameraman));

export default function CameramanPage() {
  return <RolePage role={ROLES.cameraman} />;
}
