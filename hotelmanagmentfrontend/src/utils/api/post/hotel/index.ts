import axios from 'axios';
import { HotelBaseUrl } from '@/utils/route/url';

interface HotelData {
    Name: string;
    Address: string;
    City: string;
    Rating: number;
    HotelImg: string;
}

export const CreateHotel = async (HotelData: HotelData): Promise<void> => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const response = await axios.post(`${HotelBaseUrl}`, HotelData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 201) {
            console.log('Hotel created successfully:', response.data);
        } else {
            throw new Error('Failed to create hotel: Unexpected response');
        }
    } catch (error: any) {
        console.error('Error creating hotel:', error.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to create hotel');
    }
};