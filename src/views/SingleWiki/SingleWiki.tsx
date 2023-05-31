import React, { useState } from "react";
import { Dashboard } from "../../components/layouts/Dashboard";
import {
  Typography,
  Box,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Wikis as WikisApi } from "../../api/Wikis";
import { useNavigate } from "react-router-dom";
import { ClickableTableRow } from "../../components/ClickableTableRow/ClickableTableRow";
import { CreateSourceModal } from "../../components/Sources/CreateSourceModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { Sources as SourcesApi } from "../../api/Sources";
import { useAuth0 } from "@auth0/auth0-react";

interface SingleWikiProps {}

export const SingleWiki: React.FC<SingleWikiProps> = () => {
  const [showAddSourceModal, setShowAddSourceModal] = useState<boolean>(false);
  const { getAccessTokenSilently } = useAuth0();

  const { wikiId } = useParams();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [`wiki:${wikiId}`],
    queryFn: async () => {
      const token = await getAccessTokenSilently();
      const wikisApi = new WikisApi(token);
      return wikisApi.getById(wikiId || "");
    },
  });

  const deleteSourceMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      const token = await getAccessTokenSilently();
      const sourcesApi = new SourcesApi(token);
      return sourcesApi.deleteById(sourceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`wiki:${wikiId}`]);
    },
  });

  const navigate = useNavigate();

  const onTableRowClick = (sourceId: string) => {
    navigate(`/sources/${sourceId}`);
  };

  const openAddSourceModal = () => setShowAddSourceModal(true);
  const closeAddSourceModal = () => setShowAddSourceModal(false);

  const handleSourceDelete = (sourceId: string) => {
    deleteSourceMutation.mutate(sourceId);
  };

  return (
    <>
      {data && (
        <Dashboard title={data.name}>
          {data.sources && (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "2rem",
                }}
              >
                <Typography variant="h6">Sources</Typography>
                <Button variant="contained" onClick={openAddSourceModal}>
                  Add source
                </Button>
              </Box>
              <Box>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Upload date</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.sources.map((source: any) => {
                        return (
                          <ClickableTableRow key={source.id}>
                            <TableCell
                              onClick={() => onTableRowClick(source.id)}
                            >
                              {source.name}
                            </TableCell>
                            <TableCell
                              onClick={() => onTableRowClick(source.id)}
                              sx={{ textTransform: "capitalize" }}
                            >
                              {source.type}
                            </TableCell>
                            <TableCell
                              onClick={() => onTableRowClick(source.id)}
                            >
                              {source.upload_timestamp}
                            </TableCell>
                            <TableCell>
                              <IconButton
                                onClick={() => handleSourceDelete(source.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </ClickableTableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              <CreateSourceModal
                open={showAddSourceModal}
                handleClose={closeAddSourceModal}
              />
            </>
          )}
        </Dashboard>
      )}
    </>
  );
};
