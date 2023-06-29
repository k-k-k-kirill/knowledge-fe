import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useLocation } from "react-router-dom";
import { ReactComponent as ChatbotIcon } from "../../assets/cahtbots.svg";

interface ChatbotCardProps {
  name: string;
  id: string;
}

export const ChatbotCard: React.FC<ChatbotCardProps> = ({ name, id }) => {
  const location = useLocation();
  const { getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (chatbotId: string) => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.deleteById(chatbotId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbots"] });
    },
  });

  const handleChatbotDelete = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevents triggering the NavLink
    mutation.mutate(id);
  };

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
