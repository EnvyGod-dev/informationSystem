import axios from 'axios';
import { HotelBaseUrl } from '@/utils/route/url';

interface Hotel {
    ID: number;
    Name: string;
    Address: string;
    City: string;
    Rating: number;
    HotelImg: string;
    Created_At: string;
}

export const GetListHotel = async (): Promise<Hotel[]> => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const response = await axios.get<Hotel[]>(`${HotelBaseUrl}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            return response.data; // Map the data directly
        } else {
            throw new Error('Failed to fetch hotels: Unexpected response');
        }
    } catch (error: any) {
        console.error('Error fetching hotels:', error.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to fetch hotels');
    }
};
