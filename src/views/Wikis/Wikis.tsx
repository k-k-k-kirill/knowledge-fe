import React, { useState } from "react";
import { Dashboard } from "../../components/layouts/Dashboard";
import { useQuery } from "@tanstack/react-query";
import { Wikis as WikisApi } from "../../api/Wikis";
import { WikiCard } from "../../components/Wikis/WikiCard";
import { Button } from "@mui/material";
import { CreateWikiModal } from "../../components/Wikis/CreateWikiModal";
import { WikisToolbar } from "./Wikis.styled";
import { useAuth0 } from "@auth0/auth0-react";

export const Wikis = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

  const { data } = useQuery({
    queryKey: ["wikis"],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.getAll();
    },
  });

  const handleCreateWikiClick = () => setIsCreateModalOpen(true);

  return (
    <Dashboard title="Wikis">
      <WikisToolbar>
        <Button variant="contained" onClick={handleCreateWikiClick}>
          Add wiki
        </Button>
      </WikisToolbar>

      {data &&
        data.length > 0 &&
        data.map((wiki: any) => (
          <WikiCard name={wiki.name} id={wiki.id} key={wiki.id} />
        ))}
      <CreateWikiModal
        open={isCreateModalOpen}
        handleClose={() => setIsCreateModalOpen(false)}
      />
    </Dashboard>
  );
};
