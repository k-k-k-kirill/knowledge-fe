import React from "react";
import { ChatLoader, ChatLoaderContainer } from "../ChatLoader.styled";

export const ChatSpinner = () => {
  return (
    <ChatLoaderContainer>
      <ChatLoader>
        <div></div>
        <div></div>
        <div></div>
      </ChatLoader>
    </ChatLoaderContainer>
  );
};
