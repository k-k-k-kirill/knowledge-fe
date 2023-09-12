import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Chat extends BaseApi {
  constructor(token: string, socket: any) {
    super(api, "chat", token);
    this.socket = socket;
  }

  sendMessage = async (
    text: string,
    chatbotId: string,
    conversationId: string | undefined | null
  ) => {
    const response = await this.post(`/`, {
      text,
      chatbotId,
      conversationId,
    });

    return response;
  };
}
