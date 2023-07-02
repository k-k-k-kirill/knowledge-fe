import React, { ReactNode, useState } from "react";
import {
  Typography,
  Box,
  TableContainer,
  Table,
  TableCell,
  TableBody,
  Fab,
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
import AddIcon from "@mui/icons-material/Add";
import { ReactComponent as SourcesIcon } from "../../assets/sources.svg";
import { ReactComponent as UrlIcon } from "../../assets/url.svg";
import { ReactComponent as PdfIcon } from "../../assets/pdf.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import moment from "moment";

enum SourceTypes {
  File = "file",
  Url = "url",
}

const sourceIconMap: { [K in SourceTypes]?: ReactNode } = {
  [SourceTypes.Url]: <UrlIcon />,
  [SourceTypes.File]: <PdfIcon />,
};

interface SourcesListProps {
  onEditWikiClick: any;
}

export const SourcesList: React.FC<SourcesListProps> = ({
  onEditWikiClick,
}) => {
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
    <Box>
      {data && data.sources && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <SourcesIcon />
            <Typography sx={{ marginLeft: "0.5rem" }} variant="h6">
              {data.name}
            </Typography>
            <Fab
              size="small"
              onClick={openAddSourceModal}
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                marginLeft: "1.25rem",
              }}
            >
              <AddIcon />
            </Fab>
            <Fab
              size="small"
              onClick={onEditWikiClick}
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                marginLeft: "0.5",
              }}
            >
              <EditIcon />
            </Fab>
          </Box>
          <Box>
            <TableContainer component={Box}>
              <Table>
                <TableBody>
                  {data.sources.map((source: any) => {
                    return (
                      <ClickableTableRow key={source.id}>
                        <TableCell onClick={() => onTableRowClick(source.id)}>
                          <Box
                            sx={{
                              fontSize: "0.875rem",
                              fontWeight: "500",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ marginRight: "0.5rem" }}>
                              {sourceIconMap[source.type as SourceTypes]}
                            </Box>
                            <Box
                              sx={{ lineHeight: 1, marginBottom: "0.25rem" }}
                            >
                              {source.name}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell
                          colSpan={2}
                          onClick={() => onTableRowClick(source.id)}
                          sx={{ textTransform: "capitalize", width: "20%" }}
                        >
                          {source.type}
                        </TableCell>
                        <TableCell onClick={() => onTableRowClick(source.id)}>
                          {moment(source.upload_timestamp).format("YYYY-MM-DD")}
                        </TableCell>
                        {/* <TableCell>
                          <IconButton
                            onClick={() => handleSourceDelete(source.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell> */}
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
    </Box>
  );
};
