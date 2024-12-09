'use client';
import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import AdminSidebar from '@/components/adminSidebar';
import useAdminAuth from '@/utils/hooks/useAdminAuth';
import { usePathname, useRouter } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    const isAuthenticated = useAdminAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check authentication and redirect if needed
        if (!isAuthenticated && pathname !== '/admin/auth') {
            router.push('/admin/auth');
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, pathname, router]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    // Exclude Sidebar for `/admin/auth` route
    if (pathname === '/admin/auth') {
        return (
            <Box>
                <CssBaseline />
                <Box component="main" sx={{ p: 3 }}>
                    {children}
                </Box>
            </Box>
        );
    }

    // Layout with Sidebar for other admin routes
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AdminSidebar />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

export default AdminLayout;
