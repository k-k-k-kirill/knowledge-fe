import React from "react";
import { ListItem, ListItemText } from "@mui/material";
import { StyledMarkdown } from "./StyledMarkdown";

export enum MessageAuthor {
  User = "User",
  Chatbot = "Chatbot",
}

export interface MessageType {
  author: MessageAuthor;
  content: string;
}

interface MessageProps {
  author: MessageAuthor;
  content: string;
}

export const Message: React.FC<MessageProps> = ({ author, content }) => (
  <ListItem>
    <ListItemText
      primary={author}
      secondary={
        author === MessageAuthor.Chatbot ? (
          <StyledMarkdown children={content} />
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
);
