'use client';
import React, { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    CircularProgress,
} from '@mui/material';
import { CreateHotel } from '@/utils/api/post/hotel';

const AdminHotel = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        Address: '',
        City: '',
        Rating: '',
    });

    const handleOpenModal = () => {
        setFormData({ Name: '', Address: '', City: '', Rating: '' });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.Name || !formData.Address || !formData.City || !formData.Rating) {
            alert('All fields are required');
            return;
        }

        setLoading(true);

        try {
            await CreateHotel({
                Name: formData.Name,
                Address: formData.Address,
                City: formData.City,
                Rating: parseFloat(formData.Rating), // Convert Rating to number
            });

            alert('Hotel added successfully');
            setHotels((prev) => [
                ...prev,
                { id: prev.length + 1, ...formData },
            ]); // Update local list
            setOpenModal(false);
        } catch (error: any) {
            console.error('Error adding hotel:', error.message || 'Unknown error');
            alert('Failed to add hotel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Hotel Management
            </Typography>

            {/* Add Hotel Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" onClick={handleOpenModal}>
                    Add Hotel
                </Button>
            </Box>

            {/* Loading State */}
            {loading ? (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '50vh',
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                // Hotel Table
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Hotel Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Rating</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <TableRow key={hotel.id}>
                                        <TableCell>{hotel.id}</TableCell>
                                        <TableCell>{hotel.Name}</TableCell>
                                        <TableCell>{hotel.Address}</TableCell>
                                        <TableCell>{hotel.City}</TableCell>
                                        <TableCell>{hotel.Rating}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No hotels found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Add New Hotel</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Hotel Name"
                        name="Name"
                        fullWidth
                        value={formData.Name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Address"
                        name="Address"
                        fullWidth
                        value={formData.Address}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        name="City"
                        fullWidth
                        value={formData.City}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Rating"
                        name="Rating"
                        fullWidth
                        type="number"
                        value={formData.Rating}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminHotel;
