import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Chat extends BaseApi {
  constructor(token: string, socket: any) {
    super(api, "chat", token);
    this.socket = socket;
  }

  sendMessage = (
    text: string,
    chatbotId: string,
    conversationId: string | undefined | null
  ) => {
    this.socket.emit("chat", {
      text,
      chatbotId,
      conversationId,
    });
  };
}
