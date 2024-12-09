'use client';

import React, { useState } from 'react';
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
import { loginUser } from '../../../utils/api/auth/login';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const router = useRouter();

    const handleCloseModal = () => {
        setModalOpen(false);
        if (modalMessage.includes('Амжилттай')) {
            router.push('/'); // Redirect after successful login
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (loading) return; // Prevent multiple submissions

        if (!username.trim() || !password.trim()) {
            setModalMessage('Бүх талбаруудыг бөглөнө үү.');
            setModalOpen(true);
            return;
        }

        setLoading(true);

        try {
            const response = await loginUser({
                Identifier: username,
                Password: password,
            });

            // Set token and expiration in localStorage
            const token = response.Token;
            if (token) {
                const expiry = new Date().getTime() + 30 * 60 * 1000; // 30 minutes from now
                localStorage.setItem('userToken', token);
                localStorage.setItem('tokenExpiry', expiry.toString());

                // Save user details
                localStorage.setItem(
                    'userDetails',
                    JSON.stringify({ UserID: response.Id, Username: response.UserName })
                );

                setModalMessage('Амжилттай нэвтэрлээ...');
                setModalOpen(true);
            } else {
                throw new Error('Token not provided in response.');
            }
        } catch (err: any) {
            setModalMessage(err.response?.data?.message || 'Хэрэглэгчийн мэдээлэл эсвэл нууц үг буруу байна.');
            setModalOpen(true);
        } finally {
            setLoading(false);
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
                    Log in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
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
                        label="Password"
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
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Log in'}
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

export default Login;
