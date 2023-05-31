import React from "react";
import { Dashboard } from "../../components/layouts/Dashboard";
import { Typography, Box, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { WikiCard } from "../../components/Wikis/WikiCard";
import { useNavigate } from "react-router-dom";
import { Wiki } from "../../types";
import { useAuth0 } from "@auth0/auth0-react";

interface SingleChatbotProps {}

export const SingleChatbot: React.FC<SingleChatbotProps> = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const { chatbotId } = useParams();

  const { data } = useQuery({
    queryKey: [`chatbot:${chatbotId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.getById(chatbotId || "");
    },
  });

  return (
    <>
      {data && (
        <Dashboard title={data.name}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate(`/chat/${chatbotId}`)}
            >
              Talk to bot
            </Button>
          </Box>
          <Box sx={{ marginBottom: "2rem" }}>
            <Typography variant="h6">Chatbot Wikis</Typography>
          </Box>
          <Box>
            {data.wikis?.map((wiki: Wiki) => {
              return <WikiCard name={wiki.name} id={wiki.id} key={wiki.id} />;
            })}
          </Box>
        </Dashboard>
      )}
    </>
  );
};
