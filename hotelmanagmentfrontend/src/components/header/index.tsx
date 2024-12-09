'use client';
import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    InputBase,
    IconButton,
} from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
    const router = useRouter();
    const pathname = usePathname(); // Get the current path
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if the user is logged in and token is valid
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = localStorage.getItem('userToken');
            const tokenExpiry = localStorage.getItem('tokenExpiry');
            const currentTime = new Date().getTime();

            if (token && tokenExpiry && currentTime < Number(tokenExpiry)) {
                setIsLoggedIn(true);
            } else {
                // If token is invalid or expired, clear storage and set logged out state
                localStorage.removeItem('userToken');
                localStorage.removeItem('tokenExpiry');
                setIsLoggedIn(false);
            }
        };

        checkAuthStatus();

        // Listen to local storage changes (e.g., logout from other tabs)
        const handleStorageChange = () => {
            checkAuthStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tokenExpiry');
        setIsLoggedIn(false);
        router.push('/auth/login');
    };

    const navigationLinks = [
        { label: 'Эхлэл', path: '/' },
        { label: 'Зочид Буудал', path: '/hotel' },
        { label: 'Өрөөний захиалга', path: '/room' },
        { label: 'Миний захиалга', path: '/order' },
    ];

    return (
        <AppBar
            position="static"
            sx={{
                bgcolor: 'white',
                color: 'black',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                borderBottom: '1px solid #e0e0e0',
                padding: '0 16px',
            }}
        >
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Logo */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }}
                    onClick={() => router.push('/')}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            fontSize: '20px',
                        }}
                    >
                        Hotel Management
                    </Typography>
                </Box>

                {/* Navigation Links */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '24px',
                        flexGrow: 1,
                        justifyContent: 'center',
                    }}
                >
                    {navigationLinks.map((link) => (
                        <Typography
                            key={link.path}
                            variant="body1"
                            sx={{
                                cursor: 'pointer',
                                fontWeight: 500,
                                color: pathname === link.path ? 'blue' : 'black', // Highlight active link
                                textDecoration: pathname === link.path ? 'underline' : 'none', // Add underline to active link
                            }}
                            onClick={() => router.push(link.path)}
                        >
                            {link.label}
                        </Typography>
                    ))}
                </Box>

                {/* Search Bar */}
                <Box
                    sx={{
                        flexGrow: 0,
                        bgcolor: '#f9f9f9',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 0.5,
                        width: '300px',
                        maxWidth: '100%',
                    }}
                >
                    <IconButton sx={{ p: 0 }}>
                        <SearchIcon />
                    </IconButton>
                    <InputBase
                        placeholder="Хайх"
                        sx={{
                            ml: 1,
                            flex: 1,
                            fontSize: '14px',
                        }}
                    />
                </Box>

                {/* Login/Logout Button */}
                {isLoggedIn ? (
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        sx={{
                            ml: 3,
                            fontWeight: 500,
                            textTransform: 'capitalize',
                            fontSize: '16px',
                        }}
                    >
                        Гарах
                    </Button>
                ) : (
                    <Button
                        color="inherit"
                        onClick={() => router.push('/auth/login')}
                        sx={{
                            ml: 3,
                            fontWeight: 500,
                            textTransform: 'capitalize',
                            fontSize: '16px',
                        }}
                    >
                        Нэвтрэх
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;
