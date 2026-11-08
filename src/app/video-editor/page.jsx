import RolePage from '@/components/roles/RolePage';
import { ROLES, buildRoleMetadata } from '@/content/roles';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata(buildRoleMetadata(ROLES['video-editor']));

export default function VideoEditorPage() {
  return <RolePage role={ROLES['video-editor']} />;
}
