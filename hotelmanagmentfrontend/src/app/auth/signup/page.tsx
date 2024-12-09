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
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useRouter } from 'next/navigation';
import { registerUser } from '../../../utils/api/auth/signup';

const Signup = () => {
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        UserName: '',
        Email: '',
        Password: '',
        ConfirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.FirstName || !formData.LastName || !formData.Email || !formData.Password || !formData.ConfirmPassword) {
            setError('Please fill out all fields.');
            setSuccess('');
            return;
        }

        if (formData.Password !== formData.ConfirmPassword) {
            setError('Passwords do not match.');
            setSuccess('');
            return;
        }

        // Add IsUser: true to the payload
        const payload = {
            ...formData,
            IsUser: true, // Ensure the user role is set to true
            IsAdmin: false,
            IsReception: false,
            IsFinance: false,
        };

        try {
            await registerUser(payload); // Call the API
            setSuccess('Registration successful! Redirecting to login...');
            setError('');
            setTimeout(() => router.push('/auth/login'), 2000); // Redirect to login page after success
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration.');
            setSuccess('');
        }
    };

    return (
        <Container component="main" maxWidth="sm">
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
                    Бүртгүүлэх
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="FirstName"
                                required
                                fullWidth
                                id="FirstName"
                                label="Овог"
                                autoFocus
                                value={formData.FirstName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="LastName"
                                required
                                fullWidth
                                id="LastName"
                                label="Нэр"
                                value={formData.LastName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="UserName"
                                required
                                fullWidth
                                id="UserName"
                                label="Хэрэглэгчийн нэр"
                                value={formData.UserName}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="Email"
                                required
                                fullWidth
                                id="Email"
                                label="И-Мэйл хаяг"
                                type="email"
                                value={formData.Email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="Password"
                                required
                                fullWidth
                                type="password"
                                id="Password"
                                label="Нууц үг"
                                value={formData.Password}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="ConfirmPassword"
                                required
                                fullWidth
                                type="password"
                                id="ConfirmPassword"
                                label="Нууц үгээ давтан оруулна уу"
                                value={formData.ConfirmPassword}
                                onChange={handleChange}
                            />
                        </Grid>
                        {error && (
                            <Grid item xs={12}>
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            </Grid>
                        )}
                        {success && (
                            <Grid item xs={12}>
                                <Typography color="success.main" sx={{ mt: 1 }}>
                                    {success}
                                </Typography>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 1 }}
                            >
                                Бүртгүүлэх
                            </Button>
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center', mt: 1 }}>
                            <Link
                                onClick={() => router.push('/auth/login')}
                                variant="body2"
                                sx={{ cursor: 'pointer' }}
                            >
                                Хэрэв бүртгэлтэй бол нэвтрэх
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Signup;
