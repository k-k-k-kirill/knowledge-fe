import { MessageType } from "../components/Chat/Message/Message";
import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Conversations extends BaseApi {
  constructor(token: string) {
    super(api, "conversations", token);
  }

  create = async (chatbotId: string, messages: MessageType[] = []) => {
    const response = await this.post("/", {
      chatbotId,
      messages,
    });

    return response;
  };

  getAllConversations = async (chatbotId: string) => {
    const response = await this.get("/", {
      params: { chatbotId },
    });

    return response;
  };
}
