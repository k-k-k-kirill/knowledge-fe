import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ReactComponent as ChatbotIcon } from "../../assets/cahtbots.svg";

interface ChatbotCardProps {
  name: string;
  id: string;
}

export const ChatbotCard: React.FC<ChatbotCardProps> = ({ name, id }) => {
  const location = useLocation();

  return (
    <NavLink to={`/chatbots/${id}`}>
      <Box
        sx={{
          marginBottom: "1rem",
          display: "flex",
          backgroundColor: location.pathname.includes(id)
            ? "#FFFFFF"
            : "transparent",
          borderRadius: "60px",
          padding: "8px",
          alignItems: "center",
          ":hover": {
            transition: "all 0.2s ease-in-out",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            borderRadius: "100%",
            backgroundColor: location.pathname.includes(id)
              ? "#F5F5F5"
              : "transparent",
            marginRight: "0.5rem",
            ":hover": {
              transition: "all 0.2s ease-in-out",
              backgroundColor: "#F5F5F5",
            },
          }}
        >
          <ChatbotIcon />
        </Box>
        <Typography variant="h6">{name}</Typography>
      </Box>
    </NavLink>
  );
};
