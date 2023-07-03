import React, { ReactNode } from "react";
import { Fab } from "@mui/material";

interface IconFabProps {
  onClick: () => void;
  sx: any;
  children: ReactNode;
}

export const IconFab: React.FC<IconFabProps> = ({ onClick, sx, children }) => {
  return (
    <Fab
      size="small"
      onClick={onClick}
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        ...sx,
      }}
    >
      {children}
    </Fab>
  );
};
