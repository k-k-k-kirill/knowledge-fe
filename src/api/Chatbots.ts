import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Chatbots extends BaseApi {
  constructor(token: string) {
    super(api, "chatbots", token);
  }

  getAll = () => {
    return this.get("/");
  };

  create = (name: string, wikiIds: string[]) => {
    return this.post("/", {
      name,
      wikiIds,
    });
  };

  deleteById = (chatbotId: string): Promise<void> => {
    return this.delete(`/${chatbotId}`);
  };

  getById = (chatbotId: string) => {
    return this.get(`/${chatbotId}`);
  };

  updateWikisForChatbot = (chatbotId: string, wikiIds: string[]) => {
    return this.put(`/${chatbotId}/wikis`, wikiIds);
  };
}
