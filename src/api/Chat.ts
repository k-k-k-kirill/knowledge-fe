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

    const eventSource = new EventSource(url, { withCredentials: true });

    document.cookie = `token=${encodeURIComponent(this.token)}; ${
      window.location.origin.includes("chatpoint")
        ? "Domain=.chatpoint.com;"
        : ""
    } Path=/; SameSite=None; Secure`;

    return eventSource;
  };
}
