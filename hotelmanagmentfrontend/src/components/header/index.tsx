'use client';
import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    InputBase,
    IconButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';

const Header = () => {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push('/auth/login');
    };

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
                        Hotel Managment
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
                    <Typography
                        variant="body1"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                        onClick={() => router.push('/')}
                    >
                        Эхлэл
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                        onClick={() => router.push('/hotel')}
                    >
                        Зочид Буудал
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                        onClick={() => router.push('/booking')}
                    >
                        Өрөөний захиалга
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 500,
                        }}
                        onClick={() => router.push('/orders')}
                    >
                        Миний захиалга
                    </Typography>
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

                {/* Login Button */}
                <Button
                    color="inherit"
                    onClick={handleLoginClick}
                    sx={{
                        ml: 3,
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        fontSize: '16px',
                    }}
                >
                    Нэвтрэх
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
