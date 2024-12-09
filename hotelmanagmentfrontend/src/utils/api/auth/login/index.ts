import { UserBaseUrl } from "@/utils/route/url";
import axios from 'axios';

interface LoginResponse {
    Token: string;
    Id: number;
    LastName: string;
    FirstName: string;
    UserName: string;
    Email: string;
    IsAdmin: boolean;
    IsUser: boolean;
    IsReception: boolean;
    IsFinance: boolean;
    CreatedAt: string;
}

export const loginUser = async (userData: { Identifier: string; Password: string }): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${UserBaseUrl}/login`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200 && response.data) {
            const { IsUser } = response.data;

            if (IsUser) {
                console.log('Login successful. User is valid.');
                return response.data;
            } else {
                throw new Error('This account does not have user permissions.');
            }
        } else {
            throw new Error('Failed to login: Invalid response from server.');
        }
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to login.');
    }
};


export const adminUser = async (userData: { Identifier: string; Password: string }): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${UserBaseUrl}/login`, userData, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200 && response.data) {
            const { IsAdmin } = response.data;

            if (IsAdmin) {
                console.log("Login successful. Admin is valid.");
                return response.data; // Return data if IsAdmin is true
            } else {
                throw new Error("This account does not have admin permissions.");
            }
        } else {
            throw new Error("Failed to login: Invalid response from server.");
        }
    } catch (error: any) {
        // Throw specific error message from the server or a default error
        throw new Error(error.response?.data?.message || "Failed to login.");
    }
};