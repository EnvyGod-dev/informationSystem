import { UserList } from '@/utils/route/url';
import axios from 'axios';

interface User {
    ID: number;
    FirstName: string;
    LastName: string;
    Email: string;
    IsAdmin: boolean;
    IsUser: boolean;
    IsReception: boolean;
    IsFinance: boolean;
    IsHouseKeeper: boolean;
    CreatedAt: string;
}

export const GetListUser = async (): Promise<User[]> => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await axios.get<User[]>(UserList, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 && Array.isArray(response.data)) {
            return response.data.map(user => ({
                ID: user.ID,
                FirstName: user.FirstName || '',
                LastName: user.LastName || '',
                Email: user.Email || '',
                IsAdmin: user.IsAdmin || false,
                IsUser: user.IsUser || false,
                IsReception: user.IsReception || false,
                IsFinance: user.IsFinance || false,
                IsHouseKeeper: user.IsHouseKeeper || false,
                CreatedAt: user.CreatedAt || '',
            }));
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Failed to fetch users');
    }
};
