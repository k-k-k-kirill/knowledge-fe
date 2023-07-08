import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { Wiki } from "../../types";
import { EditChatbotWikisForm } from "./EditChatbotWikisForm";
import { useQuery } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { Chatbots as ChatbotsApi } from "../../api/Chatbots";

interface EditChatbotWikisModalProps {
  open: boolean;
  handleClose: () => void;
  initialWikis: Wiki[];
  chatbotId: string;
  wikiOptions: Wiki[];
}

export const EditChatbotWikisModal: React.FC<EditChatbotWikisModalProps> = ({
  open,
  handleClose,
  initialWikis,
  chatbotId,
  wikiOptions,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const { data: chatbot } = useQuery({
    queryKey: [`chatbot:${chatbotId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      return chatbotsApi.getById(chatbotId || "");
    },
  });

  return (
    <BaseModal title={chatbot?.name} handleClose={handleClose} open={open}>
      <EditChatbotWikisForm
        chatbotId={chatbotId}
        initialWikis={initialWikis}
        wikiOptions={wikiOptions}
        onCancel={handleClose}
      />
    </BaseModal>
  );
};
