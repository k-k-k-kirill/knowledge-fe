import { MessageType } from "../components/Chat/Message/Message";
import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Messages extends BaseApi {
  constructor(token: string) {
    super(api, "messages", token);
  }

  postMessage = async (
    conversationId: string,
    messageData: MessageType,
    textSections?: any
  ) => {
    const response = await this.post(`/${conversationId}`, {
      messageData,
      textSections,
    });
    return response.data;
  };

  getMessagesForConversation = async (conversationId: string) => {
    const response = await this.get(`/${conversationId}`);

    return response;
  };
}
