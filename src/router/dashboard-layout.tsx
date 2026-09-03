import { Outlet } from 'react-router-dom';
import { TopNav } from '@/components/nav';

export const DashboardLayout = () => (
    <>
        <TopNav />
        <main className="p-4">
            <Outlet />
        </main>
    </>
);
