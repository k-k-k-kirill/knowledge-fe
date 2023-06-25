import React, { useState } from "react";
import { ListItem, ListItemText, Chip, Box, Paper } from "@mui/material";
import { StyledMarkdown } from "./StyledMarkdown";
import { TextSection } from "../../../types";

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
  const [activeSection, setActiveSection] = useState<any>(null);

  const toggleActiveSection = (section: TextSection) => {
    if (activeSection && activeSection.id === section.id) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <>
      <ListItem>
        <ListItemText
          primary={author}
          secondary={
            author === MessageAuthor.Chatbot ? (
              <>
                <Box sx={{ marginTop: "0.5rem" }}>
                  {textSections?.map((section) => (
                    <Chip
                      variant={
                        activeSection?.id === section.id ? "filled" : "outlined"
                      }
                      sx={{ marginBottom: "0.25rem", marginRight: "0.25rem" }}
                      onClick={() => toggleActiveSection(section)}
                      key={section.id}
                      label={section.sources.name}
                    />
                  ))}
                  {activeSection && (
                    <Paper sx={{ padding: "1rem", marginTop: "0.75rem" }}>
                      {activeSection.text}
                    </Paper>
                  )}
                </Box>
                <StyledMarkdown children={content} />
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
    </>
  );
};
