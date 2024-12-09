'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress, Grid, Paper } from '@mui/material';
import { GetListUser } from '@/utils/api/fetch/user';
import { AdminList } from '@/utils/api/fetch/admin';

interface User {
    ID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    IsUser: boolean;
    CreatedAt: string;
}

interface Admin {
    ID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    IsAdmin: boolean;
    CreatedAt: string;
}

const AdminDashboard = () => {
    const [userList, setUserList] = useState<User[]>([]);
    const [adminList, setAdminList] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [users, admins] = await Promise.all([GetListUser(), AdminList()]);
                setUserList(users);
                setAdminList(admins);
                setLoading(false);
            } catch (err: any) {
                console.error('Error fetching data:', err.message);
                setError('Failed to load data.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    if (error) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                }}
            >
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Admin Dashboard
            </Typography>

            <Grid container spacing={2}>
                {/* User List */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            User List
                        </Typography>
                        {userList.length > 0 ? (
                            userList.map((user) => (
                                <Typography key={user.ID}>
                                    {user.FirstName} {user.LastName} - {user.Email}
                                </Typography>
                            ))
                        ) : (
                            <Typography>No users found.</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Admin List */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Admin List
                        </Typography>
                        {adminList.length > 0 ? (
                            adminList.map((admin) => (
                                <Typography key={admin.ID}>
                                    {admin.FirstName} {admin.LastName} - {admin.Email}
                                </Typography>
                            ))
                        ) : (
                            <Typography>No admins found.</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboard;
