import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Sources extends BaseApi {
  constructor(token: string) {
    super(api, "sources", token);
  }

  getById = (wikiId: string) => {
    return this.get(`/${wikiId}`);
  };

  deleteById = (sourceId: string): Promise<void> => {
    return this.delete(`/${sourceId}`);
  };
}
