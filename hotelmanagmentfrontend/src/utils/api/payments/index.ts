import { PaymentBaseUrl } from "@/utils/route/url";
import axios from "axios";

interface Payment {
    ID: number;
    BookingID: number;
    Amount: number;
    PaymentDate: string;
    Status: string;
}

interface UpdatePayment {
    ID: number;
    Status: string;
}

export const GetPayments = async(): Promise<Payment[]> => {
    try {
        const token = localStorage.getItem('adminToken')
        if(!token) {
            throw new Error('Authorization token is missing')
        }

        const response = await axios.get<Payment[]>(`${PaymentBaseUrl}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        })

        console.log(`fetched payment`, response.data)
        return response.data

    } catch(error: any){
        console.error("error fetching payment", error.message || error.response?.data?.message || 'Unkown error')
        throw new Error(error.response?.data?.message || 'Failed to fetch rooms')
    }
}

export const UpdatePayment = async (updateData: UpdatePayment): Promise<void> => {
    try {
        if (!updateData.ID || updateData.ID <= 0) {
            throw new Error('Invalid Payment ID');
        }
        if (!updateData.Status) {
            throw new Error('Invalid Status. Status cannot be empty.');
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const response = await axios.patch(
            `${PaymentBaseUrl}/status`,
            { Status: updateData.Status },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status === 200) {
            console.log('Payment updated successfully:', response.data);
        } else {
            throw new Error('Failed to update payment: Unexpected response');
        }
    } catch (error: any) {
        console.error('Error updating payment:', error.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to update payment');
    }
};

export const DeletePayment = async (Id: number): Promise<void> => {
    try {
        if (!Id || Id <= 0) {
            throw new Error('Invalid Payment ID');
        }

        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const response = await axios.delete(`${PaymentBaseUrl}/delete/${Id}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            console.log('Payment deleted successfully:', response.data);
        } else {
            throw new Error('Failed to delete payment: Unexpected response');
        }
    } catch (error: any) {
        console.error('Error deleting payment:', error.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to delete payment');
    }
};
