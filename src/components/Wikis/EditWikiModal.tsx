import React from "react";
import { BaseModal } from "../BaseModal/BaseModal";
import { EditWikiForm } from "./EditWikiForm";

interface CreateWikiModalProps {
  wikiId: string;
  initialName: string;
  open: boolean;
  handleClose: () => void;
}

export const EditWikiModal: React.FC<CreateWikiModalProps> = ({
  wikiId,
  initialName,
  open,
  handleClose,
}) => {
  return (
    <BaseModal title="Add new wiki" handleClose={handleClose} open={open}>
      <EditWikiForm
        wikiId={wikiId}
        initialName={initialName}
        onCancel={handleClose}
      />
    </BaseModal>
  );
};
