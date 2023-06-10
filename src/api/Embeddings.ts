import { BaseApi } from "./BaseApi";
import { api } from "./axios";

export class Embeddings extends BaseApi {
  constructor(token: string) {
    super(api, "embeddings", token);
  }

  uploadFiles(files: File[], wikiId: string) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    return this.post(`/upload/${wikiId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  addUrl(url: string, wikiId: string) {
    return this.post(`/url/${wikiId}`, { url });
  }

  addPlainText(text: string, wikiId: string) {
    return this.post(`/text/${wikiId}`, { text });
  }
}
