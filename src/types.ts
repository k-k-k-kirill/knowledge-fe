export interface Wiki {
  id: string;
  name: string;
}

export interface Chatbot {
  id: string;
  name: string;
  wikis: Wiki[];
}

export interface Source {
  id: string;
  name: string;
}

export interface TextSection {
  id: string;
  text: string;
  sources: Source;
}
