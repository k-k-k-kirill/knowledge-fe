import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Wikis extends BaseApi {
  constructor(token: string) {
    super(api, "wikis", token);
  }

  getAll = () => {
    return this.get("/");
  };

  create = (name: string) => {
    return this.post("/", {
      name,
    });
  };

  update = (wikiId: string, data: any) => {
    return this.put(`/${wikiId}`, data);
  };

  deleteById = (wikiId: string): Promise<void> => {
    return this.delete(`/${wikiId}`);
  };

  getById = (wikiId: string) => {
    return this.get(`/${wikiId}`);
  };
}
