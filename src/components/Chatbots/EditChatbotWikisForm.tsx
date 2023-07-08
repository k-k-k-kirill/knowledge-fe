import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Box, Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

import { Chatbots as ChatbotsApi } from "../../api/Chatbots";
import { Wiki } from "../../types";
import { WikiInput } from "../Wikis/WikiInput";

interface EditChatbotWikisFormProps {
  onCancel: () => void;
  chatbotId: string;
  initialWikis: Wiki[];
}

interface EditChatbotWikisParams {
  wikiIds: string[];
}

const EditChatbotWikisSchema = Yup.object().shape({
  wikis: Yup.array().min(1, "At least one wiki must be selected"),
});

export const EditChatbotWikisForm: React.FC<EditChatbotWikisFormProps> = ({
  onCancel,
  chatbotId,
  initialWikis,
}) => {
  const { getAccessTokenSilently } = useAuth0();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ wikiIds }: EditChatbotWikisParams) => {
      const token = await getAccessTokenSilently();
      const chatbotsApi = new ChatbotsApi(token);
      await chatbotsApi.updateWikisForChatbot(chatbotId, wikiIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chatbots"] });
      queryClient.invalidateQueries({ queryKey: [`chatbot:${chatbotId}`] });
      navigate(`/chatbots/${chatbotId}`);
      onCancel();
    },
    onError: () => onCancel(),
  });

  return (
    <Formik
      validationSchema={EditChatbotWikisSchema}
      initialValues={{ wikis: initialWikis || [] }}
      onSubmit={(values) => {
        mutation.mutate({
          wikiIds: values.wikis.map((wiki: Wiki) => wiki.id),
        });
        onCancel();
      }}
    >
      {({ errors }) => (
        <Form>
          <WikiInput wikis={initialWikis} />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              sx={{ marginRight: "1rem" }}
              onClick={onCancel}
              variant="text"
            >
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              Update Wikis
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
