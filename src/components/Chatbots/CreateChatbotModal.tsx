import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { CreateChatbotForm } from "./CreateChatbotForm";

interface CreateChatbotModalProps {
  open: boolean;
  handleClose: () => void;
}

export const CreateChatbotModal: React.FC<CreateChatbotModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <BaseModal title="Add new chatbot" handleClose={handleClose} open={open}>
      <CreateChatbotForm onCancel={handleClose} />
    </BaseModal>
  );
};
