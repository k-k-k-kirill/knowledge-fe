import React, { useState } from "react";
import { Typography, Box } from "@mui/material";
import { WikiCard } from "../Wikis/WikiCard";
import AddIcon from "@mui/icons-material/Add";
import { ReactComponent as WikisIcon } from "../../assets/wikis.svg";
import { EditChatbotWikisModal } from "./EditChatbotWikisModal";
import { Wiki } from "../../types";

interface ChatbotWikisProps {
  data: Wiki[];
  onCreate: any;
  chatbotId: string;
  allWikis: Wiki[];
}

export const ChatbotWikis: React.FC<ChatbotWikisProps> = ({
  data,
  onCreate,
  chatbotId,
  allWikis,
}) => {
  const [isEditChatbotWikisOpen, setEditChatbotWikisOpen] =
    useState<boolean>(false);

  return (
    <Box sx={{ marginTop: "1rem" }}>
      <Box
        sx={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}
      >
        <WikisIcon style={{ marginRight: "0.5rem" }} />
        <Typography variant="h5">Wikis</Typography>
      </Box>

      <Box
        onClick={onCreate}
        sx={{
          mb: 1,
          cursor: "pointer",
          color: "#272727",
          backgroundColor: "#FFFFFF",
          "&:hover": {
            transition: "all 0.2s ease-in-out",
            backgroundColor: "rgba(63, 81, 181, 0.2)",
          },
          borderRadius: "50px",
          padding: "10px 12px",
        }}
      >
        <Box
          onClick={() => setEditChatbotWikisOpen(true)}
          component="div"
          display="flex"
          alignItems="center"
        >
          <Box
            sx={{
              backgroundColor: "#F5F5F5",
              borderRadius: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              marginRight: "0.5rem",
              position: "sticky",
            }}
          >
            <AddIcon fontSize="small" />
          </Box>
          <Typography
            sx={{ color: "#272727", fontSize: "1rem", fontWeight: 500 }}
            component="div"
            variant="body2"
            noWrap
            color="primary"
          >
            Add wiki
          </Typography>
        </Box>
      </Box>

      {data &&
        data.length > 0 &&
        data.map((wiki: any) => (
          <WikiCard name={wiki.name} id={wiki.id} key={wiki.id} />
        ))}

      <EditChatbotWikisModal
        initialWikis={data}
        wikiOptions={allWikis}
        chatbotId={chatbotId}
        open={isEditChatbotWikisOpen}
        handleClose={() => setEditChatbotWikisOpen(false)}
      />
    </Box>
  );
};
