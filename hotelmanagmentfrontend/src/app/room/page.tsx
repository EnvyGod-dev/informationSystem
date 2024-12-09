'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { GetListRoom } from '@/utils/api/rooms';
import { useRouter } from 'next/navigation';

const Room = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check userToken validity and redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/auth/login');
    } else {
      const tokenExpiry = localStorage.getItem('tokenExpiry');
      if (tokenExpiry && new Date().getTime() > Number(tokenExpiry)) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('tokenExpiry');
        router.push('/auth/login');
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const roomList = await GetListRoom();
        setRooms(roomList || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('Өрөөнүүдийг ачааллахад алдаа гарлаа');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

const handleBookRoom = (Hotelid: number) => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    router.push('/auth/login');
  } else {
    router.push(`/room/${Hotelid}`); // Navigate to the detailed room page
  }
};


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Өрөөний жагсаалт
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} key={room.ID}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={room.RoomImg || '/placeholder.jpg'} // Default image if not available
                    alt={room.RoomType}
                  />
                  <CardContent>
                    <Typography variant="h6">{room.RoomType}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Зочид Буудал ID: {room.HotelId}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {room.Price} ₮
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" variant="contained" color="primary" onClick={() => handleBookRoom(room.ID)}>
                      Захиалах
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography sx={{ textAlign: 'center', width: '100%' }} variant="body1">
              Өрөө олдсонгүй
            </Typography>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default Room;
