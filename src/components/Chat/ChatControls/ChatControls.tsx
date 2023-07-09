import React from "react";
import { Box, IconButton } from "@mui/material";
import { ChatInput } from "./ChatControls.styles";
import { ReactComponent as SendIcon } from "../../../assets/send.svg";

interface ChatControlsProps {
  newMessage: string;
  handleSendMessage: () => Promise<void>;
  handleNewMessageChange: (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

export const ChatControls: React.FC<ChatControlsProps> = ({
  newMessage,
  handleSendMessage,
  handleNewMessageChange,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
    >
      <ChatInput
        placeholder="Type your message"
        value={newMessage}
        onChange={handleNewMessageChange}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        type="submit"
        color="primary"
        disabled={!newMessage}
        sx={{ borderRadius: "50%", backgroundColor: "#FF9454" }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
};
