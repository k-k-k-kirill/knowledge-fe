import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { Wikis } from "./views/Wikis/Wikis";
import { SingleWiki } from "./views/SingleWiki/SingleWiki";
import { SingleSource } from "./views/SingleSource/SIngleSource";
import { Chatbots } from "./views/Chatbots/Chatbots";
import { SingleChatbot } from "./views/SingleChatbot/SingleChatbot";
import { Chat } from "./views/Chat/Chat";
import { Auth } from "./views/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Wikis />
      </ProtectedRoute>
    ),
  },
  {
    path: "/wikis",
    element: (
      <ProtectedRoute>
        <Wikis />
      </ProtectedRoute>
    ),
  },
  {
    path: "/wikis/:wikiId",
    element: (
      <ProtectedRoute>
        <SingleWiki />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sources/:sourceId",
    element: (
      <ProtectedRoute>
        <SingleSource />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chatbots",
    element: (
      <ProtectedRoute>
        <Chatbots />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chatbots/:chatbotId",
    element: (
      <ProtectedRoute>
        <SingleChatbot />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:chatbotId",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat/:chatbotId/conversation/:conversationId",
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);
