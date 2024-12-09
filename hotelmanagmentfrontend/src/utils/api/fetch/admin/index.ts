import { UserList } from '@/utils/route/url';
import axios from 'axios';

interface Admin {
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

export const AdminList = async (): Promise<Admin[]> => {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('No token found. Please log in.');
        }

        const response = await axios.get<Admin[]>(`${UserList}/admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200 && Array.isArray(response.data)) {
            return response.data.map(admin => ({
                ID: admin.ID,
                FirstName: admin.FirstName || '',
                LastName: admin.LastName || '',
                Email: admin.Email || '',
                IsAdmin: admin.IsAdmin || false,
                IsUser: admin.IsUser || false,
                IsReception: admin.IsReception || false,
                IsFinance: admin.IsFinance || false,
                IsHouseKeeper: admin.IsHouseKeeper || false,
                CreatedAt: admin.CreatedAt || '',
            }));
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error fetching admins:', error);
        throw new Error('Failed to fetch admins');
    }
};
