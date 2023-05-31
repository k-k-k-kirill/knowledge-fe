import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { CreateSourceForm } from "./CreateSourceForm";

interface CreateSourceModalProps {
  open: boolean;
  handleClose: () => void;
}

export const CreateSourceModal: React.FC<CreateSourceModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <BaseModal
      title="Add new source to wiki"
      handleClose={handleClose}
      open={open}
    >
      <CreateSourceForm onCancel={handleClose} />
    </BaseModal>
  );
};
