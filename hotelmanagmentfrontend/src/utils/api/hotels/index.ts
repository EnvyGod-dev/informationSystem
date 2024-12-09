import { HotelBaseUrl } from "@/utils/route/url";
import axios from "axios";


// Update hotel rating by ID
export const UpdateHotelRating = async (id: number, rating: number): Promise<void> => {
    try {
        const response = await axios.patch(`${HotelBaseUrl}/rating`, null, {
            params: { id, rating },
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            console.log("Hotel rating updated successfully");
        } else {
            throw new Error("Failed to update rating: Unexpected response");
        }
    } catch (error: any) {
        console.error("Error updating hotel rating:", error.message);
        throw new Error(error.response?.data?.message || "Failed to update hotel rating");
    }
};

export const UpdateHotelName = async (id: number, name: { Name: string }): Promise<void> => {
    try {
        const response = await axios.patch(`${HotelBaseUrl}/name`, { id, ...name }, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            console.log("Hotel name updated successfully");
        } else {
            throw new Error("Failed to update name: Unexpected response");
        }
    } catch (error: any) {
        console.error("Error updating hotel name:", error.message);
        throw new Error(error.response?.data?.message || "Failed to update hotel name");
    }
};


// Update hotel address by ID
export const UpdateHotelAddress = async (id: number, address: string): Promise<void> => {
    try {
        const response = await axios.patch(`${HotelBaseUrl}/address`, null, {
            params: { id, address },
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            console.log("Hotel address updated successfully");
        } else {
            throw new Error("Failed to update address: Unexpected response");
        }
    } catch (error: any) {
        console.error("Error updating hotel address:", error.message);
        throw new Error(error.response?.data?.message || "Failed to update hotel address");
    }
};

// Delete hotel by ID
export const DeleteHotelByID = async (id: number): Promise<void> => {
    try {
        const response = await axios.delete(`${HotelBaseUrl}/delete/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            console.log("Hotel deleted successfully");
        } else {
            throw new Error("Failed to delete hotel: Unexpected response");
        }
    } catch (error: any) {
        console.error("Error deleting hotel:", error.message);
        throw new Error(error.response?.data?.message || "Failed to delete hotel");
    }
};
