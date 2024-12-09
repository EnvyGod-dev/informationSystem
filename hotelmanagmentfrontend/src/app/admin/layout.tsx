'use client';
import React, { useEffect, useState } from 'react';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import AdminSidebar from '@/components/adminSidebar';
import useAdminAuth from '@/utils/hooks/useAdminAuth';
import { usePathname, useRouter } from 'next/navigation';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname(); // Одоогийн замыг авах
    const isAuthenticated = useAdminAuth(); // Admin эрхийг шалгах
    const [loading, setLoading] = useState(true); // Ачааллаж байгаа эсэхийг хадгалах

    useEffect(() => {
        // Хэрэглэгчийн эрхийг шалгаж, шаардлагатай бол /admin/auth руу шилжүүлэх
        if (!isAuthenticated && pathname !== '/admin/auth') {
            router.push('/admin/auth'); // Хэрэглэгч нэвтрээгүй бол login хуудас руу шилжүүлнэ
        } else {
            setLoading(false); // Нэвтэрсэн тохиолдолд ачаалал дуусна
        }
    }, [isAuthenticated, pathname, router]);

    // Ачаалал дуусаагүй үед spinner (дугуй ачааллын дүрс) харуулна
    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh', // Цонхны өндрийн хэмжээгээр төвд байрлана
                }}
            >
                <CircularProgress /> {/* Spinner дүрс */}
            </Box>
        );
    }

    // '/admin/auth' зам дээр Sidebar-ийг харуулахгүй
    if (pathname === '/admin/auth') {
        return (
            <Box>
                <CssBaseline />
                <Box component="main" sx={{ p: 3 }}>
                    {children} {/* Тухайн хуудасны контент */}
                </Box>
            </Box>
        );
    }

    // Бусад admin зам дээр Sidebar-тэй layout
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AdminSidebar /> {/* Sidebar (цэс) нэмэх */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children} {/* Тухайн хуудасны контент */}
            </Box>
        </Box>
    );
};

export default AdminLayout;
