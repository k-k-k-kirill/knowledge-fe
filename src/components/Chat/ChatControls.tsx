import React from "react";
import { TextField, Button, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

interface ChatControlsProps {
  newMessage: string;
  handleSendMessage: () => Promise<void>;
  handleNewMessageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChatControls: React.FC<ChatControlsProps> = ({
  newMessage,
  handleSendMessage,
  handleNewMessageChange,
}) => {
  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        borderTop: "1px solid grey",
      }}
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage();
      }}
    >
      <TextField
        label="Type your message"
        fullWidth
        variant="outlined"
        value={newMessage}
        onChange={handleNewMessageChange}
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<SendIcon />}
        disabled={!newMessage}
      >
        Send
      </Button>
    </Box>
  );
};
