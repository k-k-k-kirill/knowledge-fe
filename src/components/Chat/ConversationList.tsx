import React from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useQuery } from "@tanstack/react-query";
import { Conversations as ConversationsApi } from "../../api/Conversations";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useNavigate } from "react-router-dom";
import { ReactComponent as HistoryIcon } from "../../assets/history.svg";

interface ConversationsListProps {}

export const ConversationsList: React.FC<ConversationsListProps> = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { chatbotId, conversationId } = useParams();
  const navigate = useNavigate();

  const { data: conversations } = useQuery({
    queryKey: [`conversations:${chatbotId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const conversationsApi = new ConversationsApi(token);
      return conversationsApi.getAllConversations(chatbotId || "");
    },
  });

  const onSelectConversation = (conversationId: string) => {
    navigate(`/chat/${chatbotId}/conversation/${conversationId}`);
  };

  const onNewConversation = () => {
    navigate(`/chat/${chatbotId}`);
  };

  return (
    <Box
      sx={{
        maxHeight: "500px",
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "#F5F5F5",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}
        >
          <HistoryIcon style={{ marginRight: "0.5rem" }} />
          <Typography variant="h5">History</Typography>
        </Box>

        <Box
          component={ListItem}
          onClick={onNewConversation}
          sx={{
            mb: 1,
            cursor: "pointer",
            color: "#272727",
            backgroundColor: "#FFFFFF",
            "&:hover": {
              transition: "all 0.2s ease-in-out",
              backgroundColor: "rgba(63, 81, 181, 0.2)",
            },
            borderRadius: "50px",
            padding: "10px 12px",
          }}
        >
          <Box component="div" display="flex" alignItems="center">
            <Box
              sx={{
                backgroundColor: "#F5F5F5",
                borderRadius: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                marginRight: "0.5rem",
                position: "sticky",
              }}
            >
              <AddIcon fontSize="small" />
            </Box>
            <Typography
              sx={{ color: "#272727", fontSize: "1rem", fontWeight: 500 }}
              component="div"
              variant="body2"
              noWrap
              color="primary"
            >
              New chat
            </Typography>
          </Box>
        </Box>
      </Box>

      <List
        sx={{
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
      >
        {conversations &&
          conversations.map((conversation: any) => (
            <ListItemText
              sx={{
                marginTop: "1.125rem",
                ":hover": {
                  cursor: "pointer",
                },
              }}
              onClick={() => onSelectConversation(conversation.id)}
              primary={
                <Typography
                  sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                  component="div"
                  variant="body2"
                  noWrap
                >
                  {conversation.messages[1]?.content || ""}
                </Typography>
              }
            />
          ))}
      </List>
    </Box>
  );
};
