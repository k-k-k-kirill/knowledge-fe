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
import { Wikis as WikisApi } from "../../api/Wikis";
import { InforCard } from "../../components/InfoCard";

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

  const { data: wikis } = useQuery({
    queryKey: ["wikis"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.getAll();
    },
  });

  const { data: chatbots } = useQuery({
    queryKey: ["chatbots"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.getAll();
    },
  });

  return (
    <Dashboard title="Chatbots">
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <ChatbotsList />
        </Grid>
        {chatbotId ? (
          <>
            {" "}
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
              <ChatbotWikis
                chatbotId={chatbot?.id}
                data={chatbot?.wikis}
                allWikis={wikis}
                onCreate={() => {}}
              />
              <ConversationsList />
            </Grid>
          </>
        ) : (
          <Grid item xs={9}>
            <InforCard
              title={
                chatbots.length > 0
                  ? "Select a chatbot"
                  : "Add your first chatbot"
              }
              content={
                chatbots.length > 0
                  ? "Select a chatbot you want to talk to. You can add and remove wikis to to it on the fly."
                  : "Chatbot will answer your questions about the documents that you added to wikis. Chatbot can work with multiple wikis at the same time."
              }
            />
          </Grid>
        )}
      </Grid>
    </Dashboard>
  );
};
