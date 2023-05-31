import React, { useState } from "react";
import { Dashboard } from "../../components/layouts/Dashboard";
import { useQuery } from "@tanstack/react-query";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { ChatbotCard } from "../../components/Chatbots/ChatbotCard";
import { Button } from "@mui/material";
import { CreateChatbotModal } from "../../components/Chatbots/CreateChatbotModal";
import { ChatbotsToolbar } from "./Chatbots.styled";
import { Chatbot } from "../../types";
import { useAuth0 } from "@auth0/auth0-react";

export const Chatbots = () => {
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
    <Dashboard title="Chatbots">
      <ChatbotsToolbar>
        <Button variant="contained" onClick={handleCreateChatbotClick}>
          Add Chatbot
        </Button>
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
    </Dashboard>
  );
};
