'use client';
import React, { useState, useEffect } from 'react';
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
import { GetListHotel } from '@/utils/api/fetch/hotel';
import { DeleteHotelByID, UpdateHotelName } from '@/utils/api/hotels'; // Add appropriate API endpoints

const AdminHotel = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingHotel, setEditingHotel] = useState<any>(null);
    const [formData, setFormData] = useState({
        Name: '',
        Address: '',
        City: '',
        Rating: '',
        HotelImg: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            try {
                const hotelList = await GetListHotel();
                setHotels(hotelList);
            } catch (error: any) {
                console.error('Error fetching hotels:', error.message);
                alert('Failed to load hotels');
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    const handleOpenModal = (hotel?: any) => {
        if (hotel) {
            setEditingHotel(hotel);
            setFormData({
                Name: hotel.Name,
                Address: hotel.Address,
                City: hotel.City,
                Rating: hotel.Rating.toString(),
                HotelImg: hotel.HotelImg,
            });
            setImagePreview(hotel.HotelImg);
        } else {
            setEditingHotel(null);
            setFormData({ Name: '', Address: '', City: '', Rating: '', HotelImg: '' });
            setImagePreview(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingHotel(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                setFormData((prev) => ({ ...prev, HotelImg: base64 }));
                setImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!formData.Name || !formData.Address || !formData.City || !formData.Rating || !formData.HotelImg) {
            alert('All fields and image are required');
            return;
        }

        setLoading(true);

        try {
            if (editingHotel) {
                // Update existing hotel
                await UpdateHotelName(editingHotel.ID, {
                    Name: formData.Name,
                });
                setHotels((prev) =>
                    prev.map((hotel) =>
                        hotel.ID === editingHotel.ID
                            ? { ...hotel, ...formData, Rating: parseFloat(formData.Rating) }
                            : hotel
                    )
                );
                alert('Hotel updated successfully');
            } else {
                // Add new hotel
                await CreateHotel({
                    Name: formData.Name,
                    Address: formData.Address,
                    City: formData.City,
                    Rating: parseFloat(formData.Rating),
                    HotelImg: formData.HotelImg,
                });
                setHotels((prev) => [...prev, { ID: prev.length + 1, ...formData }]);
                alert('Hotel added successfully');
            }
            setOpenModal(false);
        } catch (error: any) {
            console.error('Error saving hotel:', error.message || 'Unknown error');
            alert('Failed to save hotel');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = confirm('Are you sure you want to delete this hotel?');
        if (!confirmDelete) return;

        setLoading(true);

        try {
            await DeleteHotelByID(id); // Delete the hotel via API
            setHotels((prev) => prev.filter((hotel) => hotel.ID !== id)); // Remove from local state
            alert('Hotel deleted successfully');
        } catch (error: any) {
            console.error('Error deleting hotel:', error.message || 'Unknown error');
            alert('Failed to delete hotel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Hotel Management
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" onClick={() => handleOpenModal()}>
                    Add Hotel
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Hotel Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {hotels.length > 0 ? (
                                hotels.map((hotel) => (
                                    <TableRow key={hotel.ID}>
                                        <TableCell>{hotel.ID}</TableCell>
                                        <TableCell>{hotel.Name}</TableCell>
                                        <TableCell>{hotel.Address}</TableCell>
                                        <TableCell>{hotel.City}</TableCell>
                                        <TableCell>{hotel.Rating}</TableCell>
                                        <TableCell>
                                            <img src={hotel.HotelImg} alt={hotel.Name} style={{ width: '100px' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleOpenModal(hotel)}>Edit</Button>
                                            <Button onClick={() => handleDelete(hotel.ID)} color="error">
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No hotels found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</DialogTitle>
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
                    <Button variant="contained" component="label" sx={{ mt: 2 }}>
                        Upload Image
                        <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                    </Button>
                    {imagePreview && (
                        <Box sx={{ mt: 2 }}>
                            <img src={imagePreview} alt="Preview" style={{ width: '100%' }} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingHotel ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminHotel;
