import React from "react";
import { Dashboard } from "../../components/layouts/Dashboard";
import { Grid } from "@mui/material";
import { ChatbotsList } from "../../components/Chatbots/ChatbotsList";
import { useParams } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "@tanstack/react-query";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { ChatWindow } from "../../components/Chat/ChatWindow";
import { ConversationsList } from "../../components/Chat/ConversationList";
import { ChatbotWikis } from "../../components/Chatbots/ChatbotWikis";

export const Chatbots = () => {
  const { getAccessTokenSilently } = useAuth0();

  const { chatbotId } = useParams();

  const { data: chatbot } = useQuery({
    queryKey: [`chatbot:${chatbotId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.getById(chatbotId || "");
    },
  });

  return (
    <Dashboard title="Chatbots">
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <ChatbotsList />
        </Grid>
        <Grid sx={{ marginTop: "1rem" }} item xs={7}>
          <ChatWindow />
        </Grid>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
          item
          xs={2}
        >
          <ChatbotWikis data={chatbot?.wikis} onCreate={() => {}} />
          <ConversationsList />
        </Grid>
      </Grid>
    </Dashboard>
  );
};
