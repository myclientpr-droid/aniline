import {
    LayoutDashboard,
    FolderKanban,
    Sparkles,
    Users,
    Building2,
    Camera,
    Clapperboard,
    Inbox,
    Settings,
} from 'lucide-react';

export const ADMIN_NAV = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true, roles: ['owner'] },
    { label: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { label: 'Services', href: '/admin/services', icon: Sparkles },
    { label: 'Team', href: '/admin/team', icon: Users },
    { label: 'Clients', href: '/admin/clients', icon: Building2 },
    { label: 'Videography', href: '/admin/videos', icon: Clapperboard },
    { label: 'Photography', href: '/admin/photos', icon: Camera },
    { label: 'Inquiries', href: '/admin/inquiries', icon: Inbox, roles: ['owner'] },
    { label: 'Settings', href: '/admin/settings', icon: Settings, roles: ['owner'] },
];