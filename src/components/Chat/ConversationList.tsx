import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface ConversationsListProps {
  conversations: any[];
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  activeConversationId?: string;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  onSelectConversation,
  onNewConversation,
  activeConversationId,
}) => (
  <List
    sx={{
      overflowY: "auto",
      height: "calc(100vh - 60px)",
      paddingRight: "0.5rem",
    }}
  >
    <Paper
      component={ListItem}
      elevation={1}
      onClick={onNewConversation}
      sx={{
        mb: 1,
        cursor: "pointer",
        backgroundColor: "rgba(63, 81, 181, 0.1)",
        "&:hover": {
          backgroundColor: "rgba(63, 81, 181, 0.2)",
        },
      }}
    >
      <ListItemText
        primary={
          <Box component="div" display="flex" alignItems="center">
            <AddIcon
              sx={{ marginRight: "0.5rem" }}
              fontSize="small"
              color="primary"
            />{" "}
            {/* Set color to primary */}
            <Typography component="div" variant="body2" noWrap color="primary">
              {/* Set color to primary */}
              New chat
            </Typography>
          </Box>
        }
      />
    </Paper>
    {conversations.map((conversation) => (
      <Paper
        component={ListItem}
        elevation={1}
        key={conversation.id}
        onClick={() => onSelectConversation(conversation.id)}
        sx={{
          mb: 1,
          cursor: "pointer",
          backgroundColor:
            conversation.id === activeConversationId
              ? "rgba(0, 0, 0, 0.04)"
              : "transparent",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <ListItemText
          primary={
            <Typography component="div" variant="body2" noWrap>
              {conversation.messages[1]?.content || ""}
            </Typography>
          }
        />
      </Paper>
    ))}
  </List>
);
