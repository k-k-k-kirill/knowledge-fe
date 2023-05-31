import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Wikis as WikisApi } from "../../api/Wikis";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

interface WikiCardProps {
  name: string;
  id: string;
}

export const WikiCard: React.FC<WikiCardProps> = ({ name, id }) => {
  const { getAccessTokenSilently } = useAuth0();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (wikiId: string) => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.deleteById(wikiId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wikis"] });
    },
  });

  const handleWikiDelete = (event: React.MouseEvent) => {
    event.preventDefault(); // Prevents triggering the NavLink
    mutation.mutate(id);
  };

  return (
    <Box sx={{ marginBottom: "1rem" }}>
      <Paper
        style={{
          padding: "2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        elevation={1}
        variant="outlined"
      >
        <NavLink to={`/wikis/${id}`}>
          <Typography variant="h6">{name}</Typography>
        </NavLink>
        <IconButton onClick={handleWikiDelete}>
          <Delete />
        </IconButton>
      </Paper>
    </Box>
  );
};
