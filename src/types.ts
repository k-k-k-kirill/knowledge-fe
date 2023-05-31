export interface Wiki {
  id: string;
  name: string;
}

export interface Chatbot {
  id: string;
  name: string;
  wikis: Wiki[];
}
