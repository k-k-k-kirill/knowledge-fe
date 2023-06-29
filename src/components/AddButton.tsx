import React from "react";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface AddButtonProps {
  onClick: any;
}

export const AddButton: React.FC<AddButtonProps> = ({ onClick }) => {
  return (
    <Fab color="primary" size="small" aria-label="add" onClick={onClick}>
      <AddIcon />
    </Fab>
  );
};
