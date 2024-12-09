import { BookingBaseUrl } from "@/utils/route/url";
import axios from "axios";

interface Booking {
    ID: number;
    UserID: number;
    RoomID: number;
    StartDate: string;
    EndDate: string;
    TotalPrice: number;
    Status: string;
    Created_At: string;
}

export const GetOrders = async (): Promise<Booking[]> => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const resp = await axios.get<Booking[]>(`${BookingBaseUrl}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Fetched Booking:', resp.data);
        return resp.data;
    } catch (error: any) {
        console.error('Error fetching orders:', error.message || error.response?.data?.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
};
