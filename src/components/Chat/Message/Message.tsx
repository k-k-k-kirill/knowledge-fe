import React from "react";
import { ListItem, ListItemText, Box } from "@mui/material";
import { StyledMarkdown } from "./StyledMarkdown";
import { TextSection } from "../../../types";
import { MessageSources } from "./MessageSources/MessageSources";
import { MessageContainer } from "./Message.styled";

export enum MessageAuthor {
  User = "User",
  Chatbot = "Chatbot",
}

export interface MessageType {
  author: MessageAuthor;
  content: string;
  text_sections?: TextSection[];
}

interface MessageProps {
  author: MessageAuthor;
  content: string;
  textSections?: TextSection[];
}

export const Message: React.FC<MessageProps> = ({
  author,
  content,
  textSections,
}) => {
  return (
    <MessageContainer>
      <ListItem
        sx={{
          paddingBottom: "1rem",
          paddingTop: "1rem",
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        }}
      >
        <ListItemText
          primary={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0.5rem",
                  width: "40px",
                  height: "40px",
                  lineHeight: 1,
                  borderRadius: "100%",
                  color: "#FFFFFF",
                  backgroundColor:
                    author === MessageAuthor.Chatbot ? "#FF9454" : "#B990BC",
                }}
              >
                {author === MessageAuthor.Chatbot ? "C" : "Y"}
              </Box>
              <Box sx={{ fontSize: "1rem", fontWeight: "500" }}>
                {author === MessageAuthor.User ? "You" : MessageAuthor.Chatbot}
              </Box>
            </Box>
          }
          secondary={
            author === MessageAuthor.Chatbot ? (
              <>
                <StyledMarkdown children={content} />
                <MessageSources textSections={textSections} />
              </>
            ) : (
              <span
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >
                {content}
              </span>
            )
          }
        />
      </ListItem>
    </MessageContainer>
  );
};
