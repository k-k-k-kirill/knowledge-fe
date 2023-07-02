import React, { useState } from "react";
import { Dashboard } from "../../components/layouts/Dashboard";
import { useQuery } from "@tanstack/react-query";
import { Wikis as WikisApi } from "../../api/Wikis";
import { Grid, Box } from "@mui/material";
import { CreateWikiModal } from "../../components/Wikis/CreateWikiModal";
import { useAuth0 } from "@auth0/auth0-react";
import { WikisList } from "../../components/Wikis/WikisList";
import { SourcesList } from "../../components/Sources/SourcesList";
import { EditWikiModal } from "../../components/Wikis/EditWikiModal";
import { useParams } from "react-router-dom";

export const Wikis = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditWikiModalOpen, setEditWikiModalOpen] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

  const { data } = useQuery({
    queryKey: ["wikis"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.getAll();
    },
  });

  const { wikiId } = useParams();

  const { data: activeWiki } = useQuery({
    queryKey: [`wiki:${wikiId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.getById(wikiId || "");
    },
  });

  const handleCreateWikiClick = () => setIsCreateModalOpen(true);

  return (
    <Dashboard title="Wikis">
      <Grid container spacing={4}>
        <Grid item xs={3}>
          <WikisList data={data} onCreate={handleCreateWikiClick} />
        </Grid>
        <Grid item xs={8}>
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              height: "calc(100vh - 3rem)",
              borderRadius: "28px",
              padding: "1.5rem",
            }}
          >
            <SourcesList onEditWikiClick={() => setEditWikiModalOpen(true)} />
          </Box>
        </Grid>
      </Grid>

      {activeWiki && (
        <EditWikiModal
          open={isEditWikiModalOpen}
          wikiId={activeWiki?.id}
          initialName={activeWiki?.name}
          handleClose={() => setEditWikiModalOpen(false)}
        />
      )}

      <CreateWikiModal
        open={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
      />
    </Dashboard>
  );
};
