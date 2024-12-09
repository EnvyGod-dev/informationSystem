"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid, CircularProgress, Button } from "@mui/material";
import { GetHotels, GetHotelRatings, Hotels, HotelRating } from "@/utils/api/hotels";
import { useRouter } from "next/navigation";

const Hotel = () => {
    const [hotels, setHotels] = useState<Hotels[]>([]);
    const [ratings, setRatings] = useState<HotelRating[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hotelData = await GetHotels();
                const ratingData = await GetHotelRatings();
                setHotels(hotelData);
                setRatings(ratingData);
            } catch (error) {
                console.error("Error fetching hotel data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    const handleViewDetails = (id: number) => {
        router.push(`/room/${id}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Hotels
            </Typography>
            <Grid container spacing={3}>
                {hotels.map((hotel) => (
                    <Grid item xs={12} sm={6} md={4} key={hotel.ID}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={hotel.HotelImg}
                                alt={hotel.Name}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6">{hotel.Name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {hotel.Address}, {hotel.City}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    Rating: {hotel.Rating}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleViewDetails(hotel.ID)}
                                    sx={{ mt: 2 }}
                                >
                                    Дэлгэрэнгүй
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
                Hotel Ratings
            </Typography>
            <Grid container spacing={3}>
                {ratings.map((rating) => (
                    <Grid item xs={12} sm={6} md={4} key={rating.ID}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="200"
                                image={rating.HotelImg}
                                alt={rating.Name}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent>
                                <Typography variant="h6">{rating.Name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {rating.Address}, {rating.City}
                                </Typography>
                                <Typography variant="body2" color="primary">
                                    Rating: {rating.Rating}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleViewDetails(rating.ID)}
                                    sx={{ mt: 2 }}
                                >
                                    Дэлгэрэнгүй
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Hotel;
