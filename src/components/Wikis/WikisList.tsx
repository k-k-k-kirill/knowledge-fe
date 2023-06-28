import React from "react";
import { Typography, Fab } from "@mui/material";
import { WikisToolbar } from "../../views/Wikis/Wikis.styled";
import AddIcon from "@mui/icons-material/Add";
import { WikiCard } from "./WikiCard";

interface WikisListProps {
  data: any;
  onCreate: any;
}

export const WikisList: React.FC<WikisListProps> = ({ data, onCreate }) => {
  return (
    <>
      <WikisToolbar sx={{ marginBottom: "1.5rem" }}>
        <Typography variant="h4">Wikis</Typography>
        <Fab color="primary" size="small" aria-label="add" onClick={onCreate}>
          <AddIcon />
        </Fab>
      </WikisToolbar>

      {data &&
        data.length > 0 &&
        data.map((wiki: any) => (
          <WikiCard name={wiki.name} id={wiki.id} key={wiki.id} />
        ))}
    </>
  );
};
