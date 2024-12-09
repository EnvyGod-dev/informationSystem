'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Button,
  Grid,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import axios from 'axios';

// Define the type for your room details
interface RoomDetails {
  Roomid: number;
  RoomType: string;
  Price: string;
  IsAvailable: boolean;
  RoomImg: string; // Base64 image
  Hotelname: string;
  Hoteladdress: string;
  HotelImg: string; // Base64 image
}

const RoomId = () => {
  const params = useParams();
  const { id } = params;
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get<RoomDetails[]>(
          `http://localhost:9000/api/v1/customer/rooms/hotel/${id}`
        );
        setRoomDetails(response.data[0]); // Assuming the response is an array and we need the first element
      } catch (error) {
        console.error('Error fetching room details:', error);
        alert('Өрөөний дэлгэрэнгүй мэдээллийг ачааллахад алдаа гарлаа.');
        router.push('/room');
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!roomDetails) {
    return (
      <Typography variant="h5" align="center" sx={{ mt: 5 }}>
        Өрөөний мэдээлэл олдсонгүй
      </Typography>
    );
  }

  const handleBookRoom = async () => {
    const token = localStorage.getItem('userToken');
    const user = localStorage.getItem('userDetails');

    if (!token) {
      alert('Та эхлээд нэвтэрнэ үү.');
      router.push('/auth/login');
      return;
    }

    if (!user) {
      alert('Хэрэглэгчийн мэдээлэл олдсонгүй.');
      return;
    }

    const { UserID } = JSON.parse(user);

    try {
      const bookingRequest = {
        UserID, // Dynamic UserID
        RoomID: roomDetails.Roomid,
        StartDate: new Date().toISOString(),
        EndDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        TotalPrice: parseFloat(roomDetails.Price),
        Status: 'Pending',
      };

      const response = await axios.post(
        `http://localhost:9000/api/v1/customer/booking`,
        bookingRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Өрөө амжилттай захиалагдлаа!');
      console.log('Booking response:', response.data);
    } catch (error) {
      console.error('Error booking room:', error);
      alert('Өрөөний захиалга хийхэд алдаа гарлаа.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        {/* Main Hotel Image */}
        <CardMedia
          component="img"
          height="400"
          image={roomDetails.HotelImg} // Directly use the base64 image
          alt={roomDetails.RoomType}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent>
          {/* Room Details */}
          <Typography variant="h4" gutterBottom>
            {roomDetails.RoomType}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Зочид Буудал: {roomDetails.Hotelname}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Хаяг: {roomDetails.Hoteladdress}
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            Үнийн дүн: {roomDetails.Price} ₮
          </Typography>
        </CardContent>
      </Card>

      {/* Room Images Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Өрөөний зурагнууд
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={roomDetails.RoomImg} // Directly use the base64 image
                alt="Room Image"
                sx={{ objectFit: 'cover' }}
              />
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Book Now Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleBookRoom}
        >
          Захиалах
        </Button>
      </Box>
    </Box>
  );
};

export default RoomId;
