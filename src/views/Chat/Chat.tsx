import React, { useState, useEffect, useRef } from "react";
import { Button, List, Grid, Toolbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import { ConversationsList } from "../../components/Chat/ConversationList";
import { useNavigate } from "react-router-dom";
import { ChatControls } from "../../components/Chat/ChatControls";
import { useAuth0 } from "@auth0/auth0-react";
import { io, Socket } from "socket.io-client";
import { TextSection } from "../../types";

interface CreateConversationParams {
  chatbotId: string;
  messages: MessageType[];
}

interface PostMessageParams {
  conversationId: string;
  messageData: MessageType;
  textSections?: TextSection[];
}

export const Chat = () => {
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

  const { data: conversations } = useQuery({
    queryKey: [`conversations:${chatbotId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const conversationsApi = new ConversationsApi(token);
      return conversationsApi.getAllConversations(chatbotId || "");
    },
  });

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
    event: React.ChangeEvent<HTMLInputElement>
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

  const handleConversationSelect = (conversationId: string) => {
    navigate(`/chat/${chatbotId}/conversation/${conversationId}`);
  };

  const handleNewConversation = () => {
    setMessages([
      {
        author: MessageAuthor.Chatbot,
        content: "Hello! How can I assist you today?",
      },
    ]);

    navigate(`/chat/${chatbotId}`);
  };

  return (
    <>
      <Toolbar>
        <Button
          onClick={() => navigate(`/chatbots/${chatbotId}`)}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back to chatbot
        </Button>
      </Toolbar>
      <Grid container spacing={2} sx={{ height: "calc(100vh - 60px)" }}>
        <Grid item xs={2}>
          {conversations && conversations.length > 0 && (
            <ConversationsList
              activeConversationId={conversationId}
              conversations={conversations}
              onSelectConversation={handleConversationSelect}
              onNewConversation={handleNewConversation}
            />
          )}
        </Grid>
        <Grid item xs={10} sx={{ display: "flex", flexDirection: "column" }}>
          <List
            sx={{
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
        </Grid>
      </Grid>
    </>
  );
};
