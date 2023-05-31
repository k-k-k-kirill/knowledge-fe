import React from "react";
import { Dashboard } from "../../components/layouts/Dashboard";
import { Sources as SourcesApi } from "../../api/Sources";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Typography, Box, Paper } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

interface SingleSourceProps {}

export const SingleSource: React.FC<SingleSourceProps> = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { sourceId } = useParams();

  const { data } = useQuery({
    queryKey: [`source:${sourceId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const sourcesApi = new SourcesApi(token);
      return sourcesApi.getById(sourceId || "");
    },
  });

  return (
    <>
      {data && (
        <Dashboard title={data.name}>
          {data.text_sections && (
            <>
              <Typography sx={{ marginBottom: "1rem" }} variant="h5">
                Text sections
              </Typography>
              <Box>
                {data.text_sections.map((section: any) => {
                  return (
                    <Paper sx={{ padding: "1rem", marginBottom: "1rem" }}>
                      ...{section.text}...
                    </Paper>
                  );
                })}
              </Box>
            </>
          )}
        </Dashboard>
      )}
    </>
  );
};
