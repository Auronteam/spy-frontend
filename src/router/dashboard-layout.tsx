import { Outlet } from 'react-router-dom';
import { TopNav } from '@/components/nav';

export const DashboardLayout = () => (
    <>
        <TopNav />
        <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-7">
            <Outlet />
        </main>
    </>
);
