import React from "react";
import { Typography, Box } from "@mui/material";
import { WikisToolbar } from "../../views/Wikis/Wikis.styled";
import { WikiCard } from "./WikiCard";
import { AddButton } from "../AddButton";

interface WikisListProps {
  data: any;
  onCreate: any;
}

export const WikisList: React.FC<WikisListProps> = ({ data, onCreate }) => {
  return (
    <Box>
      <WikisToolbar sx={{ marginBottom: "1.5rem" }}>
        <Typography variant="h4">Wikis</Typography>
        <AddButton onClick={onCreate} />
      </WikisToolbar>

      <Box sx={{ height: "calc(100vh - 132px)", overflowY: "auto" }}>
        {data &&
          data.length > 0 &&
          data.map((wiki: any) => (
            <WikiCard name={wiki.name} id={wiki.id} key={wiki.id} />
          ))}
      </Box>
    </Box>
  );
};
