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
import { io, Socket } from "socket.io-client";
import { TextSection } from "../../types";
import { ReactComponent as ChatbotFilledIcon } from "../../assets/chatbot-filled.svg";
import { ReactComponent as RemoveIcon } from "../../assets/remove.svg";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { IconFab } from "../IconFab";

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

  const [messages, setMessages] = useState<MessageType[]>([
    {
      author: MessageAuthor.Chatbot,
      content: "Hello! How can I assist you today?",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const socket = useRef<Socket | null>(null);
  const messagesRef = useRef(messages);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    getAccessTokenSilently().then((token) => {
      socket.current = io(
        process.env.REACT_APP_BACKEND_URL
          ? `${process.env.REACT_APP_BACKEND_URL}/chat`
          : "http://localhost:8080/chat",
        {
          extraHeaders: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket.current.on("response_sections", (sections) => {
        const lastMessage = messagesRef.current[messagesRef.current.length - 1];

        if (
          lastMessage &&
          lastMessage.author === MessageAuthor.Chatbot &&
          conversationIdRef.current
        ) {
          postMessageMutation.mutate({
            conversationId: conversationIdRef.current || "",
            messageData: lastMessage,
            textSections: sections,
          });
        }

        if (socket.current) {
          socket.current.disconnect();
        }
      });

      socket.current.on("response", (data) => {
        if (data === "[DONE]") {
          return;
        } else {
          const content = data.choices[0].delta?.content;

          if (content) {
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages];

              const lastMessage = newMessages[newMessages.length - 1];

              if (lastMessage?.author === MessageAuthor.Chatbot) {
                const lastContent = lastMessage.content;
                const appendedContent = content;
                if (!lastContent.endsWith(appendedContent)) {
                  const updatedLastMessage = {
                    ...lastMessage,
                    content: `${lastContent}${appendedContent}`,
                  };
                  newMessages[newMessages.length - 1] = updatedLastMessage;
                }
              } else {
                const botMessage = {
                  author: MessageAuthor.Chatbot,
                  content: content,
                };
                newMessages.push(botMessage);
              }

              return newMessages;
            });
          }
        }
      });

      return () => {
        if (socket.current) {
          socket.current.off("response");
          socket.current.disconnect();
        }
      };
    });
  }, [getAccessTokenSilently]);

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

    if (socket.current) {
      socket.current.connect();
    }

    const chatApi = new ChatApi(token, socket.current);
    chatApi.sendMessage(
      newMessage,
      chatbotId || "",
      conversationId || createdConversationId
    );
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
          height: "calc(100vh - 3rem)",
          backgroundColor: "#FFFFFF",
          borderRadius: "28px",
          padding: "1rem",
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
