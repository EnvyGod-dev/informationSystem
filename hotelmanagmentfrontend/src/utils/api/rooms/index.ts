import axios from 'axios';
import { RoomBaseUrl } from '@/utils/route/url'; 

interface CreateRoom {
    HotelId: number;
    RoomType: string;
    Price: number;
    IsAvailable: boolean;
    RoomImg: string;
}


interface Room {
    ID: number;
    HotelId: number;
    RoomType: string;
    Price: number;
    IsAvailable: boolean;
    RoomImg: string;
    Created_At: string;
}

interface UpdateRoom {
    id: number
    price: number
}

export const CreateRoom = async (CreateRoom: CreateRoom): Promise<void> => {
    try {
        const token = localStorage.getItem('adminToken'); 
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        const response = await axios.post(`${RoomBaseUrl}`, CreateRoom, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, 
            },
        });

        if (response.status === 201) {
            console.log('Room created successfully:', response.data);
        } else {
            throw new Error('Failed to create room: Unexpected response');
        }
    } catch (error: any) {
        console.error('Error creating room:', error.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to create room');
    }
};

export const GetListRoom = async ():Promise<Room[]>=> {
    try {
        const token = localStorage.getItem('adminToken')
        if(!token) {
            throw new Error('Authoraztion token is missing')
        }

        const response = await axios.get<Room[]>(`${RoomBaseUrl}`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 && response.data) {
            console.log('Room list fetched successfully:', response.data);
            return response.data;
        } else {
            throw new Error('Failed to fetch rooms: Unexpected response');
        }
    } catch (error: any) {
        console.error('Error fetching rooms:', error.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to fetch rooms');
    }
    }

export const UpdateRoomByID = async (updateData: UpdateRoom): Promise<void> => {
    try {
        if (!updateData.id || updateData.id <= 0) {
            throw new Error('Invalid Room ID');
        }
        if (!updateData.price || updateData.price < 0) {
            throw new Error('Invalid Price. It must be a positive number.');
        }

        const token = localStorage.getItem('adminToken'); // Retrieve the admin token from localStorage
        if (!token) {
            throw new Error('Authorization token is missing');
        }

        // Send API request to update room by ID
        const response = await axios.patch(
            `${RoomBaseUrl}/price`,
            { Price: updateData.price },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, 
                },
            }
        );

        if (response.status === 200) {
            console.log('Room updated successfully:', response.data);
        } else {
            throw new Error('Failed to update room: Unexpected response');
        }
    } catch (error: any) {
        console.error('Error updating room:', error.message || 'Unknown error');
        throw new Error(error.response?.data?.message || 'Failed to update room');
    }
};
