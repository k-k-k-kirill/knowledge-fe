import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { Wiki } from "../../types";
import { EditChatbotWikisForm } from "./EditChatbotWikisForm";

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
  return (
    <BaseModal title="Add new chatbot" handleClose={handleClose} open={open}>
      <EditChatbotWikisForm
        chatbotId={chatbotId}
        initialWikis={initialWikis}
        wikiOptions={wikiOptions}
        onCancel={handleClose}
      />
    </BaseModal>
  );
};
