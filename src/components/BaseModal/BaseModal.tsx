import React from "react";
import { Modal, Box, Typography } from "@mui/material";
import { BaseModalContainer, BaseModalHeader } from "./BaseModal.styled";

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const BaseModal: React.FC<ModalProps> = ({
  open,
  handleClose,
  title,
  children,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <BaseModalContainer>
        <BaseModalHeader>
          <Typography variant="h5">{title}</Typography>
        </BaseModalHeader>

        <Box>{children}</Box>
      </BaseModalContainer>
    </Modal>
  );
};
