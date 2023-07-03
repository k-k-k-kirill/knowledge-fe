import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { CreateWikiAndSourcesForm } from "./CreateWikiForm";

interface CreateWikiModalProps {
  open: boolean;
  handleClose: () => void;
}

export const CreateWikiModal: React.FC<CreateWikiModalProps> = ({
  open,
  handleClose,
}) => {
  return (
    <BaseModal title="New wiki" handleClose={handleClose} open={open}>
      <CreateWikiAndSourcesForm onCancel={handleClose} />
    </BaseModal>
  );
};
