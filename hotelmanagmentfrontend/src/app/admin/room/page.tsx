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
import { CreateRoom, GetListRoom, UpdateRoomByID } from '@/utils/api/rooms';

const AdminRoom = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<any>(null);
    const [formData, setFormData] = useState({
        HotelId: '',
        RoomType: '',
        Price: '',
        IsAvailable: 'true',
        RoomImg: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const roomList = await GetListRoom();
                setRooms(roomList || []); // Ensure roomList is an array
            } catch (error) {
                console.error('Error fetching rooms:', error);
                alert('Failed to load rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const handleOpenModal = (room?: any) => {
        if (room) {
            setEditingRoom(room);
            setFormData({
                HotelId: room.HotelId.toString(),
                RoomType: room.RoomType,
                Price: room.Price.toString(),
                IsAvailable: room.IsAvailable ? 'true' : 'false',
                RoomImg: room.RoomImg,
            });
            setImagePreview(room.RoomImg);
        } else {
            setEditingRoom(null);
            setFormData({ HotelId: '', RoomType: '', Price: '', IsAvailable: 'true', RoomImg: '' });
            setImagePreview(null);
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingRoom(null);
    };

    const handleSubmit = async () => {
        if (!formData.HotelId || !formData.RoomType || !formData.Price || !formData.RoomImg) {
            alert('All fields and image are required');
            return;
        }

        setLoading(true);

        try {
            if (editingRoom) {
                await UpdateRoomByID({
                    id: editingRoom.ID,
                    price: parseFloat(formData.Price),
                });
                setRooms((prev) =>
                    prev.map((room) =>
                        room.ID === editingRoom.ID
                            ? { ...room, ...formData, Price: parseFloat(formData.Price), IsAvailable: formData.IsAvailable === 'true' }
                            : room
                    )
                );
                alert('Room updated successfully');
            } else {
                await CreateRoom({
                    HotelId: parseInt(formData.HotelId),
                    RoomType: formData.RoomType,
                    Price: parseFloat(formData.Price),
                    IsAvailable: formData.IsAvailable === 'true',
                    RoomImg: formData.RoomImg,
                });
                const newRoom = {
                    ID: rooms.length + 1,
                    ...formData,
                    Price: parseFloat(formData.Price),
                    IsAvailable: formData.IsAvailable === 'true',
                };
                setRooms((prev) => [...prev, newRoom]);
                alert('Room added successfully');
            }
            setOpenModal(false);
        } catch (error: any) {
            console.error('Error saving room:', error.message || 'Unknown error');
            alert('Failed to save room');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                setFormData((prev) => ({ ...prev, RoomImg: base64 }));
                setImagePreview(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Room Management
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button variant="contained" onClick={() => handleOpenModal()}>
                    Add Room
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
                                <TableCell>Hotel ID</TableCell>
                                <TableCell>Room Type</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Available</TableCell>
                                <TableCell>Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rooms.length > 0 ? (
                                rooms.map((room, index) => (
                                    <TableRow key={room.Roomid || index}>
                                        <TableCell>{room.Roomid}</TableCell>
                                        <TableCell>{room.Hotelid}</TableCell>
                                        <TableCell>{room.RoomType}</TableCell>
                                        <TableCell>{room.Price}</TableCell>
                                        <TableCell>{room.IsAvailable ? 'Yes' : 'No'}</TableCell>
                                        <TableCell>
                                            {room.RoomImg && (
                                                <img
                                                    src={room.RoomImg}
                                                    alt={room.RoomType}
                                                    style={{ width: '100px', height: 'auto' }}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        No rooms found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Hotel ID"
                        name="HotelId"
                        fullWidth
                        value={formData.HotelId}
                        onChange={(e) => setFormData({ ...formData, HotelId: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Room Type"
                        name="RoomType"
                        fullWidth
                        value={formData.RoomType}
                        onChange={(e) => setFormData({ ...formData, RoomType: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        name="Price"
                        fullWidth
                        type="number"
                        value={formData.Price}
                        onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Available"
                        name="IsAvailable"
                        fullWidth
                        value={formData.IsAvailable}
                        onChange={(e) => setFormData({ ...formData, IsAvailable: e.target.value })}
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
                        {editingRoom ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminRoom;
