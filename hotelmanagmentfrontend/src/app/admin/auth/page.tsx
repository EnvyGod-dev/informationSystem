'use client';
import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    CssBaseline,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation';
import { adminUser } from '../../../utils/api/auth/login';
import { adminDashboard } from '@/utils/route/path';

const TOKEN_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        const expiry = localStorage.getItem('adminTokenExpiry');
        const now = new Date().getTime();

        if (token && expiry && now < Number(expiry)) {
            router.push(adminDashboard); // Redirect to the dashboard if token is valid
        } else {
            // Clear expired token
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminTokenExpiry');
        }
    }, [router]);

    const handleCloseModal = () => {
        setModalOpen(false);
        if (modalMessage.includes('Амжилттай')) {
            setTimeout(() => router.push(adminDashboard), 500);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!username.trim() || !password.trim()) {
            setModalMessage('Бүх талбаруудыг бөглөнө үү.');
            setModalOpen(true);
            return;
        }

        try {
            const response = await adminUser({
                Identifier: username,
                Password: password,
            });

            console.log('Admin Login Response:', response); // Debug response
            if (!response.Token) {
                throw new Error('Token not returned');
            }

            // Save token and expiry time
            const expiryTime = new Date().getTime() + TOKEN_EXPIRY_TIME;
            localStorage.setItem('adminToken', response.Token);
            localStorage.setItem('adminTokenExpiry', expiryTime.toString());
            window.dispatchEvent(new Event('storage')); // Notify other tabs or components of token change

            setModalMessage('Амжилттай нэвтэрлээ...');
            setModalOpen(true);
        } catch (err: any) {
            console.error('Login Error:', err.message); // Log the error
            setModalMessage(err.message || 'Failed to login.');
            setModalOpen(true);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Admin Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Хэрэглэгчийн нэр"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Нууц үг"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Нэвтрэх
                    </Button>
                </Box>
            </Box>

            {/* Modal for feedback */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {modalMessage.includes('Амжилттай') ? 'Success' : 'Error'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {modalMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminLogin;
