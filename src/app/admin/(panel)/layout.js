import Sidebar from '@/components/admin/Sidebar';
import TopBar from '@/components/admin/TopBar';
import ToastProvider from '@/components/admin/ToastProvider';
import { getAuthorizedAdminUser } from '@/lib/adminAccess';
import { redirect } from 'next/navigation';

export default async function AdminPanelLayout({ children }) {
    const user = await getAuthorizedAdminUser();
    if (!user) redirect('/admin/login');

    return (
        <div className="min-h-dvh bg-light">
            <div className="flex min-h-dvh">
                <aside className="hidden lg:block w-64 flex-none">
                    <div className="sticky top-0 h-dvh">
                        <Sidebar role={user.role} />
                    </div>
                </aside>

                <div className="flex-1 min-w-0 flex flex-col">
                    <TopBar userEmail={user.email} role={user.role} />
                    <main className="flex-1 p-4 md:p-8">
                        <ToastProvider>{children}</ToastProvider>
                    </main>
                </div>
            </div>
        </div>
    );
}