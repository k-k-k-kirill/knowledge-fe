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

interface ChatbotCardProps {
  name: string;
  id: string;
}

export const ChatbotCard: React.FC<ChatbotCardProps> = ({ name, id }) => {
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
    <Box sx={{ marginBottom: "1rem" }}>
      <Paper
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        elevation={1}
        variant="outlined"
      >
        <NavLink to={`/chatbots/${id}`}>
          <Typography variant="h6">{name}</Typography>
        </NavLink>
        <IconButton onClick={handleChatbotDelete}>
          <Delete />
        </IconButton>
      </Paper>
    </Box>
  );
};
