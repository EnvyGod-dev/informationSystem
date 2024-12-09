import { UserBaseUrl } from '@/utils/route/url';
import axios from 'axios';


export const registerUser = async (userData: {
    FirstName: string;
    LastName: string;
    UserName: string;
    Email: string;
    Password: string;
    IsAdmin: boolean;
    IsUser: boolean;
    IsReception: boolean;
    IsFinance: boolean;
}) => {
    try {
        const response = await axios.post(`${UserBaseUrl}/register`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status == 200 && response.data) {
            console.log(`working this service`)
            return response.data;
        } else {
            console.log(`cannot connect this service`)
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to register user');
    }
};
