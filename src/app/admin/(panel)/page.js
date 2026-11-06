import Link from 'next/link';
import StatCard from '@/components/admin/StatCard';
import EmptyState from '@/components/ui/EmptyState';
import { countProjects } from '@/lib/data/projects';
import { countServices } from '@/lib/data/services';
import { countTeamMembers } from '@/lib/data/team';
import { countClients } from '@/lib/data/clients';
import { countPhotos } from '@/lib/data/photos';
import { countInquiries, listRecentInquiries } from '@/lib/data/inquiries';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';
import { redirect } from 'next/navigation';

async function safe(promise, fallback) {
    try {
        return await promise;
    } catch {
        return fallback;
    }
}

export default async function AdminDashboardPage() {
    const owner = await getAuthorizedAdminUser();
    if (!owner) redirect('/admin/login');
    if (owner.role !== 'owner') redirect('/admin/projects');

    const [projects, services, team, clients, photos, inquiries, recent] =
        await Promise.all([
            safe(countProjects(), { total: 0, published: 0, drafts: 0 }),
            safe(countServices(), { total: 0, published: 0, drafts: 0 }),
            safe(countTeamMembers(), { total: 0, published: 0, drafts: 0 }),
            safe(countClients(), { total: 0, published: 0, drafts: 0 }),
            safe(countPhotos(), { total: 0, published: 0, drafts: 0 }),
            safe(countInquiries(), { total: 0, new: 0, reviewed: 0, archived: 0 }),
            safe(listRecentInquiries(5), []),
        ]);

    const greeting = owner?.name ? `, ${owner.name}` : '';

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-navy text-2xl md:text-3xl">Welcome back{greeting}.</h1>
                <p className="text-slate mt-2">
                    Manage projects, services, team, clients, photography, and inquiries.
                </p>
            </div>

            {/* Stat grid */}
            <section aria-labelledby="content-heading">
                <h2 id="content-heading" className="sr-only">
                    Content overview
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <StatCard
                        label="Projects"
                        value={projects.total}
                        sublabel={`${projects.published} published \u00b7 ${projects.drafts} draft`}
                        href="/admin/projects"
                    />
                    <StatCard
                        label="Services"
                        value={services.total}
                        sublabel={`${services.published} published \u00b7 ${services.drafts} draft`}
                        href="/admin/services"
                    />
                    <StatCard
                        label="Team"
                        value={team.total}
                        sublabel={`${team.published} published \u00b7 ${team.drafts} draft`}
                        href="/admin/team"
                    />
                    <StatCard
                        label="Clients"
                        value={clients.total}
                        sublabel={`${clients.published} published \u00b7 ${clients.drafts} draft`}
                        href="/admin/clients"
                    />
                    <StatCard
                        label="Photography"
                        value={photos.total}
                        sublabel={`${photos.published} published \u00b7 ${photos.drafts} draft`}
                        href="/admin/photos"
                    />
                </div>
            </section>

            {/* Inquiries */}
            <section aria-labelledby="inquiries-heading">
                <div className="flex items-end justify-between gap-4 flex-wrap">
                    <div>
                        <h2 id="inquiries-heading" className="text-navy text-lg">
                            Inquiries
                        </h2>
                        <p className="text-slate text-sm mt-1">
                            {inquiries.total} total &middot;{' '}
                            <span className={inquiries.new > 0 ? 'text-orange font-semibold' : ''}>
                                {inquiries.new} new
                            </span>
                        </p>
                    </div>
                    <Link
                        href="/admin/inquiries"
                        className="text-sm font-semibold text-navy hover:text-orange transition-colors"
                    >
                        View all &rarr;
                    </Link>
                </div>

                <div className="mt-4 rounded-lg border border-navy/10 bg-white overflow-hidden">
                    {recent.length === 0 ? (
                        <EmptyState
                            title="No inquiries yet"
                            message="New inquiries submitted from the public site will appear here."
                        />
                    ) : (
                        <ul className="divide-y divide-navy/10">
                            {recent.map((inq) => (
                                <li key={String(inq._id)} className="p-5 flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <p className="text-navy font-medium truncate">
                                            {inq.name}
                                            {inq.organization ? ` \u00b7 ${inq.organization}` : ''}
                                        </p>
                                        <p className="text-slate text-xs mt-1 truncate">
                                            {inq.email} {inq.phone ? `\u00b7 ${inq.phone}` : ''}
                                        </p>
                                        <p className="text-slate text-sm mt-2 line-clamp-2">
                                            {inq.description}
                                        </p>
                                    </div>
                                    <div className="flex-none text-right">
                                        <p className="text-orange text-xs font-semibold uppercase tracking-wider">
                                            {inq.projectCategory}
                                        </p>
                                        <p className="text-slate text-xs mt-1">
                                            {formatDate(inq.createdAt)}
                                        </p>
                                        {inq.status === 'new' && (
                                            <span className="inline-block mt-2 text-xs font-semibold text-orange">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>
        </div>
    );
}

function formatDate(date) {
    if (!date) return '';
    try {
        return new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(date));
    } catch {
        return '';
    }
}