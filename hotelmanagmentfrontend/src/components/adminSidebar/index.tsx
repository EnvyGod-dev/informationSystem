'use client';
import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Drawer, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter, usePathname } from 'next/navigation';
import { adminDashboard, adminHotel, adminOrder, adminPayment, adminRoom, adminUser } from '@/utils/route/path';

const AdminSidebar = () => {
    const router = useRouter();
    const pathname = usePathname(); // Get current route

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.dispatchEvent(new Event('storage')); // Notify token removal
        router.push('/admin/auth');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <PeopleIcon />, path: adminDashboard },
        { text: 'Хэрэглэгчийн бүртгэл', icon: <PeopleIcon />, path: adminUser },
        { text: 'Зочид буудал', icon: <HotelIcon />, path: adminHotel },
        { text: 'Өрөө', icon: <RoomServiceIcon />, path: adminRoom },
        { text: 'Захиалга', icon: <ReceiptIcon />, path: adminOrder },
        { text: 'Төлбөр', icon: <PaymentIcon />, path: adminPayment },
    ];

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'bold' }}>
                    Admin Panel
                </Typography>
            </Box>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem
                        key={index}
                        onClick={() => router.push(item.path)}
                        sx={{
                            cursor: 'pointer',
                            backgroundColor: pathname === item.path ? '#e0f7fa' : 'transparent', // Highlight active item
                            '&:hover': { backgroundColor: '#f5f5f5' },
                            transition: 'background-color 0.3s', // Smooth transition
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: pathname === item.path ? '#00796b' : 'inherit', // Change icon color
                                transition: 'color 0.3s', // Smooth transition
                            }}
                        >
                            {item.icon}
                        </ListItemIcon>
                        <ListItemText
                            primary={item.text}
                            sx={{
                                color: pathname === item.path ? '#00796b' : 'inherit', // Change text color
                                transition: 'color 0.3s', // Smooth transition
                            }}
                        />
                    </ListItem>
                ))}

                <ListItem
                    onClick={handleLogout}
                    sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#f5f5f5' },
                        mt: 2,
                    }}
                >
                    <ListItemIcon>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Гарах" />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default AdminSidebar;
