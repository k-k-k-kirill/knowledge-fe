import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Chat extends BaseApi {
  constructor(token: string) {
    super(api, "chat", token);
  }

  getResponse = (
    text: string,
    chatbotId: string,
    conversationId: string | undefined | null
  ) => {
    const url = `${this.axiosInstance.defaults.baseURL}/${
      this.module
    }/stream?text=${encodeURIComponent(text)}&chatbotId=${encodeURIComponent(
      chatbotId
    )}&conversationId=${conversationId}`;
    const eventSource = new EventSource(url);

    return eventSource;
  };
}
