'use client';
import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Drawer, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import HotelIcon from '@mui/icons-material/Hotel';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { adminHome, adminHotel, adminLogOut, adminOrder, adminPayment, adminRoom, adminUser } from '@/utils/route/path';

const AdminSidebar = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        window.dispatchEvent(new Event('storage')); // Notify token removal
        router.push('/admin/auth');
    };


    const menuItems = [
        { text: 'Dashboard', icon: <PeopleIcon />, path: adminHome },
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
                        component="div"
                        key={index}
                        onClick={() => router.push(item.path)}
                        sx={{
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f5f5f5' },
                        }}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}

                <ListItem
                    component="div"
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
