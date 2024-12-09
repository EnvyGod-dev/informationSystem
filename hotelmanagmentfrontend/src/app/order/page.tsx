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
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Backdrop,
} from '@mui/material';
import axios from 'axios';

interface Order {
    ID: number;
    UserID: number;
    RoomID: number;
    StartDate: string;
    EndDate: string;
    TotalPrice: string;
    Status: string;
    CreatedAt: string;
}

const Order = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isProcessing, setIsProcessing] = useState(false); // State for loader during processing

    // Fetch orders dynamically
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('userToken');
                const userDetails = JSON.parse(localStorage.getItem('userDetails') || '{}');
                const userId = userDetails.UserID;

                if (!token || !userId) {
                    throw new Error('Authentication required. Please log in.');
                }

                const response = await axios.get<Order[]>(`http://localhost:9000/api/v1/customer/booking/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setOrders(response.data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to load orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId: number) => {
        const confirmDelete = confirm('Are you sure you want to delete this order?');
        if (!confirmDelete) return;

        setLoading(true);

        try {
            const token = localStorage.getItem('userToken');

            if (!token) {
                throw new Error('Authentication required. Please log in.');
            }

            await axios.delete(`http://localhost:9000/api/v1/customer/booking/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders((prev) => prev.filter((order) => order.ID !== orderId));
            alert('Order deleted successfully');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to delete the order.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenPaymentModal = (order: Order) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleClosePaymentModal = () => {
        setSelectedOrder(null);
        setOpenModal(false);
    };

    const handlePayment = async () => {
        if (!selectedOrder) return;

        setIsProcessing(true); // Start the loader

        try {
            const token = localStorage.getItem('userToken');

            if (!token) {
                throw new Error('Authentication required. Please log in.');
            }

            // Simulate a successful payment
            const paymentData = {
                BookingID: selectedOrder.ID,
                Amount: parseFloat(selectedOrder.TotalPrice),
                PaymentDate: new Date().toISOString().split('T')[0], // Correct date format
                Status: 'Successful',
            };

            await axios.post(`http://localhost:9000/api/v1/customer/payment`, paymentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // Update the booking status to "successfully"
            await axios.patch(
                `http://localhost:9000/api/v1/customer/booking`,
                { ID: selectedOrder.ID, Status: 'successfully' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert('Payment and status update successful!');
            setOrders((prev) =>
                prev.map((order) =>
                    order.ID === selectedOrder.ID ? { ...order, Status: 'successfully' } : order
                )
            );
        } catch (err: any) {
            alert(err.response?.data?.message || 'Payment failed.');
        } finally {
            setIsProcessing(false); // Stop the loader
            handleClosePaymentModal();
        }
    };

    if (loading && orders.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Room ID</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Total Price</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.ID}>
                                    <TableCell>{order.ID}</TableCell>
                                    <TableCell>{order.RoomID}</TableCell>
                                    <TableCell>{new Date(order.StartDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(order.EndDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{order.TotalPrice} ₮</TableCell>
                                    <TableCell>{order.Status}</TableCell>
                                    <TableCell>
                                        <Button color="error" onClick={() => handleDelete(order.ID)}>
                                            Delete
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            onClick={() => handleOpenPaymentModal(order)}
                                            sx={{ ml: 2 }}
                                        >
                                            Pay
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Payment Modal */}
            <Dialog open={openModal} onClose={handleClosePaymentModal}>
                <DialogTitle>Confirm Payment</DialogTitle>
                <DialogContent>
                    <Typography variant="h6" gutterBottom>
                        Bank Account: Хаан Банк - Намуунзул
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                        Account Number: 5015451713
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Amount to Pay: {selectedOrder?.TotalPrice} ₮
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePaymentModal}>Cancel</Button>
                    <Button variant="contained" onClick={handlePayment}>
                        Confirm Payment
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Loader during payment */}
            <Backdrop open={isProcessing} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
};

export default Order;
