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
    Grid,
    Link,
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
    const router = useRouter();

    const handleCloseModal = () => {
        setModalOpen(false);
        if (modalMessage === 'Амжилттай нэвтэрлээ...') {
            router.push('/'); // Redirect after successful login
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!username || !password) {
            setModalMessage('Please fill out all fields.');
            setModalOpen(true);
            return;
        }

        try {
            await loginUser({
                Identifier: username,
                Password: password,
            });

            // Show success modal
            setModalMessage('Амжилттай нэвтэрлээ...');
            setModalOpen(true);
        } catch (err: any) {
            // Show error modal
            setModalMessage('User-ээс өөр эрхтэй хүмүүс нэвтэрхийг хориглоно.');
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
                    >
                        Log in
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link
                                onClick={() => router.push('/auth/signup')}
                                variant="body2"
                                sx={{ cursor: 'pointer' }}
                            >
                                Don't have an account? Sign up
                            </Link>
                        </Grid>
                    </Grid>
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
