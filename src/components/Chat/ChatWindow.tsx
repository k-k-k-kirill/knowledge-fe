import React, { useState, useEffect, useRef } from "react";
import { List, Box, Typography } from "@mui/material";
import { Chat as ChatApi } from "../../api/Chat";
import {
  MessageAuthor,
  Message,
  MessageType,
} from "../../components/Chat/Message/Message";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Conversations as ConversationsApi } from "../../api/Conversations";
import { Messages as MessagesApi } from "../../api/Messages";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ChatControls } from "./ChatControls/ChatControls";
import { useAuth0 } from "@auth0/auth0-react";
import { TextSection } from "../../types";
import { ReactComponent as ChatbotFilledIcon } from "../../assets/chatbot-filled.svg";
import { ReactComponent as RemoveIcon } from "../../assets/remove.svg";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { IconFab } from "../IconFab";
import { ChatSpinner } from "./ChatSpinner/ChatSpinner";

interface CreateConversationParams {
  chatbotId: string;
  messages: MessageType[];
}

interface PostMessageParams {
  conversationId: string;
  messageData: MessageType;
  textSections?: TextSection[];
}

export const ChatWindow = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { chatbotId, conversationId } = useParams();
  const conversationIdRef = useRef(conversationId);

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [isBotResponding, setIsBotResponding] = useState<boolean>(false);

  const [messages, setMessages] = useState<MessageType[]>([
    {
      author: MessageAuthor.Chatbot,
      content: "Hello! How can I assist you today?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const messagesRef = useRef(messages);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    conversationIdRef.current = conversationId;

    if (!conversationId) {
      setMessages([
        {
          author: MessageAuthor.Chatbot,
          content: "Hello! How can I assist you today?",
        },
      ]);
    }
  }, [conversationId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const { data: conversationMessages } = useQuery({
    queryKey: [`messages:${conversationId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const messagesApi = new MessagesApi(token);
      return messagesApi.getMessagesForConversation(conversationId || "");
    },
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (conversationMessages) {
      setMessages(conversationMessages);
    }
  }, [conversationMessages]);

  const createConversationMutation = useMutation({
    mutationFn: async ({ chatbotId, messages }: CreateConversationParams) => {
      const token = await getAccessTokenSilently();
      const conversationsApi = new ConversationsApi(token);
      return conversationsApi.create(chatbotId, messages);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`conversations:${chatbotId}`],
      });
    },
  });

  const postMessageMutation = useMutation({
    mutationFn: async ({
      conversationId,
      messageData,
      textSections,
    }: PostMessageParams) => {
      const token = await getAccessTokenSilently();
      const messagesApi = new MessagesApi(token);
      return messagesApi.postMessage(conversationId, messageData, textSections);
    },
    onSuccess: () =>
      queryClient.invalidateQueries([`messages:${conversationId}`]),
  });

  const handleNewMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewMessage(event.target.value);
  };

  const createNewConversation = async (message: MessageType) => {
    const initialMessages = [...messages, message];
    const createdConversationId = await createConversationMutation.mutateAsync({
      chatbotId: chatbotId || "",
      messages: initialMessages,
    });

    navigate(`/chat/${chatbotId}/conversation/${createdConversationId}`);
    setMessages(initialMessages);
    return createdConversationId;
  };

  const postMessage = async (message: MessageType) => {
    await postMessageMutation.mutateAsync({
      conversationId: conversationIdRef.current || "",
      messageData: message,
    });
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = async () => {
    const userMessage = { author: MessageAuthor.User, content: newMessage };
    setNewMessage("");
    let createdConversationId = "";

    const token = await getAccessTokenSilently();

    if (!conversationIdRef.current) {
      createdConversationId = await createNewConversation(userMessage);
    } else {
      await postMessage(userMessage);
    }

    const chatApi = new ChatApi(token, null);

    setIsBotResponding(true);

    const botResponse = await chatApi.sendMessage(
      newMessage,
      chatbotId || "",
      conversationId || createdConversationId
    );

    if (botResponse && botResponse.content) {
      setIsBotResponding(false);

      await postMessage({
        author: MessageAuthor.Chatbot,
        content: botResponse.content,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { author: MessageAuthor.Chatbot, content: botResponse.content },
      ]);
    }
  };

  const { data: chatbot } = useQuery({
    queryKey: [`chatbot:${chatbotId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.getById(chatbotId || "");
    },
  });

  const deleteChatbotMutation = useMutation({
    mutationFn: async (chatbotId: string) => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.deleteById(chatbotId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbots"] });
      navigate("/chatbots/");
    },
  });

  const handleChatbotDelete = () => {
    deleteChatbotMutation.mutate(chatbotId || "");
  };

  return (
    <Box sx={{ position: "relative" }}>
      {chatbot && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            zIndex: 1,
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderRadius: "28px",
            padding: "2rem",
            backgroundColor: "#ffffff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ChatbotFilledIcon style={{ marginRight: "0.5rem" }} />
            <Typography variant="h6">{chatbot?.name}</Typography>
          </Box>
          <Box>
            <IconFab onClick={() => handleChatbotDelete()}>
              <RemoveIcon />
            </IconFab>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          height: "calc(100vh - 4rem)",
          backgroundColor: "#FFFFFF",
          borderRadius: "28px",
          padding: "2rem",
        }}
      >
        <List
          sx={{
            marginTop: "2rem",
            flexGrow: 1,
            overflow: "auto",
            maxHeight: "calc(100vh - 162px)",
          }}
        >
          {messages.map((message, index) => (
            <Message
              key={index}
              author={message.author}
              content={message.content}
              textSections={message.text_sections}
            />
          ))}

          {isBotResponding && <ChatSpinner />}

          <div ref={messagesEndRef} />
        </List>
        <ChatControls
          newMessage={newMessage}
          handleSendMessage={handleSendMessage}
          handleNewMessageChange={handleNewMessageChange}
        />
      </Box>
    </Box>
  );
};
