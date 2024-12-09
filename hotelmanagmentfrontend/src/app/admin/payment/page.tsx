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
import { GetPayments, UpdatePayment, DeletePayment } from '@/utils/api/payments';

const AdminPayment = () => {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingPayment, setEditingPayment] = useState<any>(null);
    const [formData, setFormData] = useState({
        CustomerName: '',
        Amount: '',
        PaymentDate: '',
        Status: '',
    });

    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const paymentList = await GetPayments();
                setPayments(paymentList || []);
            } catch (error: unknown) {
                const errorMessage = (error as any).message || 'Failed to load payments';
                console.error('Error fetching payments:', errorMessage);
                alert(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const handleOpenModal = (payment?: any) => {
        if (payment) {
            setEditingPayment(payment);
            setFormData({
                CustomerName: payment.CustomerName || '',
                Amount: payment.Amount || '',
                PaymentDate: payment.PaymentDate || '',
                Status: payment.Status || '',
            });
        } else {
            setEditingPayment(null);
            setFormData({ CustomerName: '', Amount: '', PaymentDate: '', Status: '' });
        }
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditingPayment(null);
    };

    const handleSubmit = async () => {
        if (!formData.CustomerName || !formData.Amount || !formData.PaymentDate || !formData.Status) {
            alert('All fields are required');
            return;
        }

        setLoading(true);

        try {
            if (editingPayment) {
                await UpdatePayment({ ID: editingPayment.ID, Status: formData.Status });
                setPayments((prev) =>
                    prev.map((payment) =>
                        payment.ID === editingPayment.ID ? { ...payment, ...formData } : payment
                    )
                );
                alert('Payment updated successfully');
            }
            setOpenModal(false);
        } catch (error: unknown) {
            const errorMessage = (error as any).message || 'Failed to update payment';
            console.error('Error updating payment:', errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (paymentId: number) => {
        const confirmDelete = confirm('Are you sure you want to delete this payment?');
        if (!confirmDelete) return;

        setLoading(true);

        try {
            await DeletePayment(paymentId);
            setPayments((prev) => prev.filter((payment) => payment.ID !== paymentId));
            alert('Payment deleted successfully');
        } catch (error: unknown) {
            const errorMessage = (error as any).message || 'Failed to delete payment';
            console.error('Error deleting payment:', errorMessage);
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Payment Management
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Payment ID</TableCell>
                                <TableCell>Customer Name</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payment Date</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.length > 0 ? (
                                payments.map((payment) => (
                                    <TableRow key={payment.ID}>
                                        <TableCell>{payment.ID}</TableCell>
                                        <TableCell>{payment.CustomerName || 'N/A'}</TableCell>
                                        <TableCell>{payment.Amount || 'N/A'}</TableCell>
                                        <TableCell>{payment.PaymentDate || 'N/A'}</TableCell>
                                        <TableCell>{payment.Status || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleOpenModal(payment)}>Edit</Button>
                                            <Button color="error" onClick={() => handleDelete(payment.ID)}>
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No payments found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>{editingPayment ? 'Edit Payment' : 'Add Payment'}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Customer Name"
                        name="CustomerName"
                        fullWidth
                        value={formData.CustomerName}
                        onChange={(e) => setFormData({ ...formData, CustomerName: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Amount"
                        name="Amount"
                        fullWidth
                        value={formData.Amount}
                        onChange={(e) => setFormData({ ...formData, Amount: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Payment Date"
                        name="PaymentDate"
                        type="date"
                        fullWidth
                        value={formData.PaymentDate}
                        onChange={(e) => setFormData({ ...formData, PaymentDate: e.target.value })}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="dense"
                        label="Status"
                        name="Status"
                        fullWidth
                        value={formData.Status}
                        onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>
                        {editingPayment ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminPayment;
