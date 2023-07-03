import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { CreateSourceForm } from "./CreateSourceForm";

interface CreateSourceModalProps {
  wikiName: string;
  open: boolean;
  handleClose: () => void;
}

export const CreateSourceModal: React.FC<CreateSourceModalProps> = ({
  wikiName,
  open,
  handleClose,
}) => {
  return (
    <BaseModal title={wikiName} handleClose={handleClose} open={open}>
      <CreateSourceForm onCancel={handleClose} />
    </BaseModal>
  );
};
