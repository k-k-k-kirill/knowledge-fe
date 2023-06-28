import React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Wikis as WikisApi } from "../../api/Wikis";
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { ReactComponent as WikiIcon } from "../../assets/wikis.svg";
import { useLocation } from "react-router-dom";

interface WikiCardProps {
  name: string;
  id: string;
}

export const WikiCard: React.FC<WikiCardProps> = ({ name, id }) => {
  const location = useLocation();

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
    <NavLink to={`/wikis/${id}`}>
      <Box
        sx={{
          marginBottom: "1rem",
          display: "flex",
          backgroundColor: location.pathname.includes(id)
            ? "#FFFFFF"
            : "transparent",
          borderRadius: "60px",
          padding: "8px",
          alignItems: "center",
          ":hover": {
            transition: "all 0.2s ease-in-out",
            backgroundColor: "#FFFFFF",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            borderRadius: "100%",
            backgroundColor: location.pathname.includes(id)
              ? "#F5F5F5"
              : "transparent",
            marginRight: "0.5rem",
            ":hover": {
              transition: "all 0.2s ease-in-out",
              backgroundColor: "#F5F5F5",
            },
          }}
        >
          <WikiIcon />
        </Box>
        <Typography variant="h6">{name}</Typography>
      </Box>
    </NavLink>
  );
};
