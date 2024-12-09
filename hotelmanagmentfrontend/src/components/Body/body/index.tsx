'use client';

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const Body = () => {
  const router = useRouter(); 

  const handleSearchRooms = () => {
    router.push("/room"); // '/rooms' хуудас руу чиглүүлнэ
  };

  const handleSearchHotels = () => {
    router.push("/hotel"); // '/hotel' хуудас руу чиглүүлнэ
  };

  return (
    <>
      <Box
        sx={{
          textAlign: "center",
          padding: "50px",
          backgroundImage: `url('/background.jpg')`, 
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          color: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px", // Товчнуудын хоорондын зай
        }}
      >
        <Typography variant="h3" gutterBottom>
          Тавтай морилно уу
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "20px" }}>
          Манай зочид буудлын захиалгын системд тавтай морилно уу. Та өөрт тохирсон өрөө, зочид буудлыг хайх боломжтой.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: "10px 20px", fontSize: "16px", width: "200px" }}
          onClick={handleSearchRooms} // Rooms руу чиглүүлэх
        >
          Өрөө хайх
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{ padding: "10px 20px", fontSize: "16px", width: "200px" }}
          onClick={handleSearchHotels} // Hotels руу чиглүүлэх
        >
          Зочид буудал хайх
        </Button>
      </Box>
    </>
  );
};

export default Body;
