import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { ChatbotCard } from "../../components/Chatbots/ChatbotCard";
import { Typography } from "@mui/material";
import { CreateChatbotModal } from "../../components/Chatbots/CreateChatbotModal";
import { ChatbotsToolbar } from "../../views/Chatbots/Chatbots.styled";
import { Chatbot } from "../../types";
import { useAuth0 } from "@auth0/auth0-react";
import { AddButton } from "../AddButton";

export const ChatbotsList: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: ["chatbots"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.getAll();
    },
  });

  const handleCreateChatbotClick = () => setIsCreateModalOpen(true);

  return (
    <>
      <ChatbotsToolbar>
        <Typography sx={{ marginRight: "0.5rem" }} variant="h4">
          Chatbots
        </Typography>
        <AddButton onClick={handleCreateChatbotClick} />
      </ChatbotsToolbar>

      {data &&
        data.length > 0 &&
        data.map((chatbot: Chatbot) => (
          <ChatbotCard name={chatbot.name} id={chatbot.id} key={chatbot.id} />
        ))}

      <CreateChatbotModal
        open={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
};
